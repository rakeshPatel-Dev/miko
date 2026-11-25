import type { Bookmark, BookmarkCreateInput, BookmarkUpdateInput } from '../types/bookmark'
import { matchesQuery, tokenize } from './search'

const LEGACY_STORAGE_KEY = 'miko_bookmarks'
const DATABASE_NAME = 'miko'
const DATABASE_VERSION = 1
const BOOKMARK_STORE = 'bookmarks'
const META_STORE = 'meta'
const MIGRATION_KEY = 'legacy-bookmarks-v1'

type LegacyBookmark = Partial<Bookmark> & {
  description?: unknown
  tags?: unknown
}

type MigrationMeta = {
  key: string
  version: number
  legacyRemoved: boolean
  count: number
}

export type BookmarkPage = {
  bookmarks: Bookmark[]
  total: number
  hasMore: boolean
}

let databasePromise: Promise<IDBDatabase> | undefined
let migrationPromise: Promise<void> | undefined

export function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function isValidBookmarkUrl(url: unknown): url is string {
  if (typeof url !== 'string' || !url.trim()) return false
  try {
    const protocol = new URL(url).protocol
    return protocol === 'http:' || protocol === 'https:'
  } catch {
    return false
  }
}

function openDatabase(): Promise<IDBDatabase> {
  if (databasePromise) return databasePromise

  const promise = new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not available in this extension context'))
      return
    }

    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      const transaction = request.transaction
      if (!transaction) {
        reject(new Error('Could not create the Miko database transaction'))
        return
      }

      const bookmarks = db.objectStoreNames.contains(BOOKMARK_STORE)
        ? transaction.objectStore(BOOKMARK_STORE)
        : db.createObjectStore(BOOKMARK_STORE, { keyPath: 'id' })

      if (!bookmarks.indexNames.contains('url')) bookmarks.createIndex('url', 'url')
      if (!bookmarks.indexNames.contains('createdAt')) {
        bookmarks.createIndex('createdAt', 'createdAt')
      }
      if (!bookmarks.indexNames.contains('domain')) bookmarks.createIndex('domain', 'domain')

      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE, { keyPath: 'key' })
      }
    }

    request.onsuccess = () => {
      const database = request.result
      database.onversionchange = () => database.close()
      resolve(database)
    }
    request.onerror = () => reject(request.error ?? new Error('Could not open the Miko database'))
    request.onblocked = () => reject(new Error('The Miko database is blocked by another tab'))
  }).catch((error): never => {
    databasePromise = undefined
    throw error
  })

  databasePromise = promise
  return promise
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'))
  })
}

function transactionComplete(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () =>
      reject(transaction.error ?? new Error('IndexedDB transaction failed'))
    transaction.onabort = () =>
      reject(transaction.error ?? new Error('IndexedDB transaction aborted'))
  })
}

async function readMigrationMeta(database: IDBDatabase): Promise<MigrationMeta | undefined> {
  const transaction = database.transaction(META_STORE, 'readonly')
  return (await requestResult(transaction.objectStore(META_STORE).get(MIGRATION_KEY))) as
    | MigrationMeta
    | undefined
}

function normalizeLegacyBookmarks(stored: unknown[]): Bookmark[] {
  const ids = new Set<string>()
  const bookmarks: Bookmark[] = []

  for (const value of stored) {
    if (!value || typeof value !== 'object') continue
    const legacy = value as LegacyBookmark
    if (typeof legacy.url !== 'string' || !legacy.url.trim()) continue

    let id = typeof legacy.id === 'string' && legacy.id.trim() ? legacy.id : crypto.randomUUID()
    while (ids.has(id)) id = crypto.randomUUID()
    ids.add(id)

    const createdAt =
      typeof legacy.createdAt === 'number' && Number.isFinite(legacy.createdAt)
        ? legacy.createdAt
        : Date.now()
    const updatedAt =
      typeof legacy.updatedAt === 'number' && Number.isFinite(legacy.updatedAt)
        ? legacy.updatedAt
        : createdAt
    const bookmark: Bookmark = {
      id,
      url: legacy.url,
      domain:
        typeof legacy.domain === 'string' && legacy.domain.trim()
          ? legacy.domain
          : getDomain(legacy.url),
      title: typeof legacy.title === 'string' && legacy.title.trim() ? legacy.title : legacy.url,
      createdAt,
      updatedAt,
    }

    if (typeof legacy.favicon === 'string' && legacy.favicon) bookmark.favicon = legacy.favicon
    bookmarks.push(bookmark)
  }

  return bookmarks
}

async function removeLegacyStorage(database: IDBDatabase, meta: MigrationMeta) {
  let legacyRemoved = meta.legacyRemoved
  if (!legacyRemoved) {
    try {
      await chrome.storage.local.remove(LEGACY_STORAGE_KEY)
      legacyRemoved = true
    } catch (error) {
      console.warn('[Miko] IndexedDB migration completed, but legacy storage was kept:', error)
    }
  }

  if (legacyRemoved === meta.legacyRemoved) return

  const transaction = database.transaction(META_STORE, 'readwrite')
  transaction.objectStore(META_STORE).put({ ...meta, legacyRemoved })
  await transactionComplete(transaction)
}

async function verifyMigratedBookmarks(
  database: IDBDatabase,
  bookmarks: Bookmark[],
): Promise<boolean> {
  const transaction = database.transaction(BOOKMARK_STORE, 'readonly')
  const keys = (await requestResult(
    transaction.objectStore(BOOKMARK_STORE).getAllKeys(),
  )) as string[]
  const importedIds = new Set(keys)
  return bookmarks.every((bookmark) => importedIds.has(bookmark.id))
}

async function migrateLegacyBookmarks(): Promise<void> {
  const database = await openDatabase()
  const existingMeta = await readMigrationMeta(database)

  if (existingMeta?.version === DATABASE_VERSION) {
    await removeLegacyStorage(database, existingMeta)
    return
  }

  const result = await chrome.storage.local.get(LEGACY_STORAGE_KEY)
  const stored = Array.isArray(result[LEGACY_STORAGE_KEY]) ? result[LEGACY_STORAGE_KEY] : []
  const bookmarks = normalizeLegacyBookmarks(stored)

  const transaction = database.transaction([BOOKMARK_STORE, META_STORE], 'readwrite')
  const bookmarkStore = transaction.objectStore(BOOKMARK_STORE)
  for (const bookmark of bookmarks) bookmarkStore.put(bookmark)
  transaction.objectStore(META_STORE).put({
    key: MIGRATION_KEY,
    version: DATABASE_VERSION,
    legacyRemoved: false,
    count: bookmarks.length,
  } satisfies MigrationMeta)
  await transactionComplete(transaction)

  if (!(await verifyMigratedBookmarks(database, bookmarks))) {
    throw new Error('Miko could not verify all bookmarks after migration')
  }

  await removeLegacyStorage(database, {
    key: MIGRATION_KEY,
    version: DATABASE_VERSION,
    legacyRemoved: false,
    count: bookmarks.length,
  })
}

async function ensureMigrated(): Promise<void> {
  if (!migrationPromise) {
    migrationPromise = migrateLegacyBookmarks().catch((error) => {
      migrationPromise = undefined
      throw error
    })
  }

  return migrationPromise
}

export async function getAllBookmarks(): Promise<Bookmark[]> {
  await ensureMigrated()
  const database = await openDatabase()
  const transaction = database.transaction(BOOKMARK_STORE, 'readonly')
  const bookmarks = (await requestResult(
    transaction.objectStore(BOOKMARK_STORE).getAll(),
  )) as Bookmark[]
  return bookmarks.sort((a, b) => b.createdAt - a.createdAt)
}

export async function queryBookmarks(query = '', limit = 20, offset = 0): Promise<BookmarkPage> {
  await ensureMigrated()
  const database = await openDatabase()
  const tokens = tokenize(query)
  const pageSize = Math.max(1, Math.min(limit, 100))
  const start = Math.max(0, offset)

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(BOOKMARK_STORE, 'readonly')
    const store = transaction.objectStore(BOOKMARK_STORE)
    const cursorRequest = store.index('createdAt').openCursor(null, 'prev')
    const countRequest = store.count()
    const bookmarks: Bookmark[] = []
    let total = 0
    let skipped = 0
    let hasMore = false
    let failed = false

    const fail = (error: unknown) => {
      if (failed) return
      failed = true
      reject(error instanceof Error ? error : new Error('IndexedDB query failed'))
    }

    countRequest.onsuccess = () => {
      total = countRequest.result
    }
    countRequest.onerror = () => fail(countRequest.error)
    cursorRequest.onsuccess = () => {
      const cursor = cursorRequest.result
      if (!cursor) return

      const bookmark = cursor.value as Bookmark
      if (tokens.length > 0 && !matchesQuery(bookmark, tokens)) {
        cursor.continue()
        return
      }
      if (skipped < start) {
        skipped += 1
        cursor.continue()
        return
      }
      if (bookmarks.length >= pageSize) {
        hasMore = true
        return
      }

      bookmarks.push(bookmark)
      cursor.continue()
    }
    cursorRequest.onerror = () => fail(cursorRequest.error)
    transaction.onerror = () => fail(transaction.error)
    transaction.onabort = () => fail(transaction.error ?? new Error('IndexedDB query aborted'))
    transaction.oncomplete = () => {
      if (!failed) resolve({ bookmarks, total, hasMore })
    }
  })
}

export async function findBookmarkByUrl(url: string): Promise<Bookmark | undefined> {
  await ensureMigrated()
  const database = await openDatabase()
  const transaction = database.transaction(BOOKMARK_STORE, 'readonly')
  const bookmark = await requestResult(
    transaction.objectStore(BOOKMARK_STORE).index('url').get(url),
  )
  return bookmark as Bookmark | undefined
}

export async function addBookmark(input: BookmarkCreateInput): Promise<Bookmark> {
  if (!isValidBookmarkUrl(input.url)) throw new Error('Invalid bookmark URL')
  await ensureMigrated()

  const now = Date.now()
  const bookmark: Bookmark = {
    id: crypto.randomUUID(),
    url: input.url,
    domain: input.domain || getDomain(input.url),
    title: input.title || input.url,
    favicon: input.favicon,
    createdAt: now,
    updatedAt: now,
  }
  const database = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(BOOKMARK_STORE, 'readwrite')
    const store = transaction.objectStore(BOOKMARK_STORE)
    let result: Bookmark | undefined

    const existingRequest = store.index('url').get(input.url)
    existingRequest.onsuccess = () => {
      result = (existingRequest.result as Bookmark | undefined) ?? bookmark
      if (!existingRequest.result) {
        const addRequest = store.add(bookmark)
        addRequest.onerror = () => reject(addRequest.error ?? new Error('Could not add bookmark'))
      }
    }
    existingRequest.onerror = () =>
      reject(existingRequest.error ?? new Error('Could not check bookmark'))
    transaction.onerror = () => reject(transaction.error ?? new Error('Could not save bookmark'))
    transaction.onabort = () => reject(transaction.error ?? new Error('Bookmark save aborted'))
    transaction.oncomplete = () => resolve(result ?? bookmark)
  })
}

export async function updateBookmark(input: BookmarkUpdateInput): Promise<Bookmark | null> {
  await ensureMigrated()
  const database = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(BOOKMARK_STORE, 'readwrite')
    const store = transaction.objectStore(BOOKMARK_STORE)
    let result: Bookmark | null = null
    const getRequest = store.get(input.id)

    getRequest.onsuccess = () => {
      const current = getRequest.result as Bookmark | undefined
      if (!current) return
      result = { ...current, ...input, updatedAt: Date.now() }
      const putRequest = store.put(result)
      putRequest.onerror = () => reject(putRequest.error ?? new Error('Could not update bookmark'))
    }
    getRequest.onerror = () => reject(getRequest.error ?? new Error('Could not find bookmark'))
    transaction.onerror = () => reject(transaction.error ?? new Error('Could not update bookmark'))
    transaction.onabort = () => reject(transaction.error ?? new Error('Bookmark update aborted'))
    transaction.oncomplete = () => resolve(result)
  })
}

export async function deleteBookmark(id: string): Promise<boolean> {
  await ensureMigrated()
  const database = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(BOOKMARK_STORE, 'readwrite')
    const store = transaction.objectStore(BOOKMARK_STORE)
    let deleted = false
    const getRequest = store.get(id)

    getRequest.onsuccess = () => {
      if (!getRequest.result) return
      deleted = true
      const deleteRequest = store.delete(id)
      deleteRequest.onerror = () =>
        reject(deleteRequest.error ?? new Error('Could not delete bookmark'))
    }
    getRequest.onerror = () => reject(getRequest.error ?? new Error('Could not find bookmark'))
    transaction.onerror = () => reject(transaction.error ?? new Error('Could not delete bookmark'))
    transaction.onabort = () => reject(transaction.error ?? new Error('Bookmark deletion aborted'))
    transaction.oncomplete = () => resolve(deleted)
  })
}

export async function restoreBookmark(bookmark: Bookmark): Promise<Bookmark> {
  if (!isValidBookmarkUrl(bookmark.url)) throw new Error('Invalid bookmark URL')
  await ensureMigrated()
  const database = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(BOOKMARK_STORE, 'readwrite')
    const store = transaction.objectStore(BOOKMARK_STORE)
    let result: Bookmark = bookmark
    const existingRequest = store.index('url').get(bookmark.url)

    existingRequest.onsuccess = () => {
      if (existingRequest.result) {
        result = existingRequest.result as Bookmark
        return
      }
      const addRequest = store.add(bookmark)
      addRequest.onerror = () => reject(addRequest.error ?? new Error('Could not restore bookmark'))
    }
    existingRequest.onerror = () =>
      reject(existingRequest.error ?? new Error('Could not check bookmark'))
    transaction.onerror = () => reject(transaction.error ?? new Error('Could not restore bookmark'))
    transaction.onabort = () => reject(transaction.error ?? new Error('Bookmark restore aborted'))
    transaction.oncomplete = () => resolve(result)
  })
}
