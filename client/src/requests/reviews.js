import { requestMaker } from './config'

export async function getReviews(placeId) {
  const f = requestMaker('GET', 'reviews', 'reviews', null, false, `targetId=${placeId}`)
  return await f()
}


export async function postInitReview(data) {
  const f = requestMaker('POST', 'reviews', 'postInitReview', { ...data }, false)
  return await f()
}


export async function postNextReview(data) {
  const f = requestMaker('POST', 'reviews', 'postNextReview', { ...data }, false)
  return await f()
}


export async function postReview(data) {
  const f = requestMaker('POST', 'reviews', 'postReview', { ...data }, false)
  return await f()
}

export async function postFeedback(comment) {
  const f = requestMaker('POST', 'reviews', 'postFeedback', { comment }, false)
  return await f()
}

export async function deleteReview(timestamp, place) {
  const f = requestMaker('DELETE', 'reviews', 'reviews', { timestamp, place }, true)
  return await f()
}