/** Which section of a scrolling list is the current one: the last whose top has reached the top of the view
 *  (give or take `slack` px), or the last one once scrolled to the bottom, since a short last section can't
 *  reach the top. `tops`: each section's top, measured from the top of the scrolled content. */
export function activeSection(tops: number[], scrollTop: number, viewHeight: number, scrollHeight: number, slack = 60) {
  if (scrollTop + viewHeight >= scrollHeight - 2) return tops.length - 1
  let i = 0
  while (i + 1 < tops.length && tops[i + 1] <= scrollTop + slack) i++
  return i
}
