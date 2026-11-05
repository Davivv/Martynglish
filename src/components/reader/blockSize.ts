/** Block text size by sentence length; the longest sentences (8-9 blocks) must fit 360x640 (D20). */
export function blockSizeClass(count: number): string {
  if (count <= 5) return 'text-2xl'
  if (count <= 7) return 'text-xl'
  return 'text-lg'
}
