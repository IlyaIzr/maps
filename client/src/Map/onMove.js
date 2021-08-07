export function onMove(map, cs) {
  
}
const cs = {
  x: 100, y: 100
}
const reviewsStore = {
  x100y100: [1, 2, 3],
  x100y101: [1, 2],
  x101y101: [1, 2, 3],
  x101y100: [1],
}
// one step right
cs.x += 1
// ?x setter reaction onXChange
// check what we have
// if (reviewsStore['x' + cs.x + 'y' + cs.y]) {
//   // var cellsToRequest = []
//   // check if reviewsStore has surrounding cells
// }
// else basic request if store was empty (xmin 101, xmax 102, ymin 100, ymax 101)
const res = [
  { x: 102, y: 100, data: [3] },
  { x: 102, y: 101, data: [2, 1] }
]
res.forEach(({ x, y, data }) => {
  // filling
  reviewsStore['x' + x + 'y' + y] = data
  // clearing
})
// still onXChange
// define keys to delete onXChange
// filter reviewsStore where x is not in the range
const range = 1
const dataWeNeed = new Set([])
Object.keys(reviewsStore).forEach(coords => {
  const [x, y] = coords.substr(1).split('y')
  if (Math.abs(x - cs.x) > range) delete reviewsStore[coords]
  // else compare with data we need
  // if it's in store already, remove from needed data, else make request
})
