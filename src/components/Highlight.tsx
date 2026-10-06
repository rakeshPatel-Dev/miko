import { tokenize } from '../lib/search'

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

interface HighlightProps {
  text: string
  query: string
}

export default function Highlight({ text, query }: HighlightProps) {
  const tokens = tokenize(query)
  if (!text || tokens.length === 0) return <>{text}</>

  const pattern = new RegExp(`(${tokens.map(escapeRegex).join('|')})`, 'gi')
  const parts = text.split(pattern)
  const lookup = new Set(tokens)

  return (
    <>
      {parts.map((part, i) =>
        lookup.has(part.toLowerCase()) ? (
          <mark key={i} className="bg-yellow-100 text-inherit rounded-sm">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}
