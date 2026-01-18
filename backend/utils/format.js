function initials(name) {
  if (!name || typeof name !== "string") return "NA"
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0] || "N"
  const second = parts.length > 1 ? parts[1][0] : parts[0]?.[1]
  return (first + (second || "A")).toUpperCase()
}

function mapLetterGradeToProgress(letter) {
  if (!letter || typeof letter !== "string") return 0
  const g = letter.trim().toUpperCase()
  if (g.startsWith("A")) return 92
  if (g.startsWith("B")) return 86
  if (g.startsWith("C")) return 78
  if (g.startsWith("D")) return 68
  return 55
}

module.exports = { initials, mapLetterGradeToProgress }
