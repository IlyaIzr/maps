import { requsetMaker } from './config'

export async function getReviews(placeId) {
  const f = requsetMaker('GET', 'reviews', 'reviews', null, false, `targetId=${placeId}`)
  return await f()
}


export async function postInitReview(data) {
  const f = requsetMaker('POST', 'reviews', 'postInitReview', { ...data }, false)
  return await f()
}


export async function postNextReview(data) {
  const f = requsetMaker('POST', 'reviews', 'postNextReview', { ...data }, false)
  return await f()
}


export async function postReview(data) {
  const f = requsetMaker('POST', 'reviews', 'postReview', { ...data }, false)
  return await f()
}


export async function deleteReview(timestamp, place) {
  const f = requsetMaker('DELETE', 'reviews', 'reviews', { timestamp, place }, true)
  return await f()
}