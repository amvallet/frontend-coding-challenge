export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

export function makeFuzzyRegex(input: string): RegExp {
  const cleaned = escapeRegExp(input.trim())
  const pattern = cleaned.split("").join(".*")
  return new RegExp(pattern, "i")
}
