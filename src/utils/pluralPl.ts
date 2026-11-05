/** Polish plural: 1 -> one, 2-4 (except 12-14) -> few, everything else -> many. */
export function pluralPl(n: number, one: string, few: string, many: string): string {
  const abs = Math.abs(n)
  if (abs === 1) return one
  const last = abs % 10
  const lastTwo = abs % 100
  if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) return few
  return many
}
