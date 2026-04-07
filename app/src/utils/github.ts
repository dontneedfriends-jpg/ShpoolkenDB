export function generateIssueUrl(jsonData: Record<string, unknown>, manufacturer: string) {
  const jsonStr = JSON.stringify(jsonData, null, 4)
  const filename = `${manufacturer.toLowerCase().replace(/[^a-z0-9]/g, '')}.json`

  const title = encodeURIComponent(`Add filament: ${manufacturer}`)

  const body = encodeURIComponent(
`## Добавить новый филамент

**Производитель:** ${manufacturer}

### JSON файл: \`${filename}\`

\`\`\`json
${jsonStr}
\`\`\`

---
*Добавлено через форму на ShpoolkenDB*`
  )

  return `https://github.com/dontneedfriends-jpg/ShpoolkenDB/issues/new?title=${title}&body=${body}`
}
