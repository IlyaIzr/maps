import { requestMaker } from './config'

export async function getReviews(placeId) {
  const f = requestMaker('GET', 'reviews', 'reviews', null, false, `targetId=${placeId}`)
  return await f()
}

export async function postReview(data, { isNew }) {
  const f = requestMaker('POST', 'reviews', 'postReview', { ...data, isNew }, false)
  return await f()
}

export async function postFeedback(comment) {
  const f = requestMaker('POST', 'reviews', 'postFeedback', { comment }, false)
  return await f()
}

export async function deleteReview(timestamp, place, author, asRoot) {
  const body = { timestamp, place, author, asRoot }
  const f = requestMaker('DELETE', 'reviews', 'reviews', body, true)
  return await f()
}
