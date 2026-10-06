export interface Bookmark {
  id: string
  url: string
  domain: string
  title: string
  favicon?: string
  createdAt: number
  updatedAt: number
}

export interface BookmarkCreateInput {
  url: string
  domain?: string
  title: string
  favicon?: string
}

export interface BookmarkUpdateInput {
  id: string
  title?: string
}
