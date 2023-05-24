import { requestMaker } from "./config"

export async function getFriends() {
  const f = requestMaker('GET', 'friends', 'all', null, true)
  return await f()
}

export async function getRequests() {
  const f = requestMaker('GET', 'friends', 'requests', null, true)
  return await f()
}

export async function searchUsers(input) {
  const f = requestMaker('GET', 'friends', 'search', null, true, 'input=' + input)
  return await f()
}

export async function getProfileDetails(id) {
  const f = requestMaker('GET', 'friends', 'details', null, true, 'id=' + id)
  return await f()
}

// Make friend request
export async function addFriend(id) {
  const f = requestMaker('GET', 'friends', 'add', null, true, 'id=' + id)
  return await f()
}

export async function removeFriend(id) {
  const f = requestMaker('GET', 'friends', 'remove', null, true, 'id=' + id)
  return await f()
}

export async function acceptRequest(id) {
  const f = requestMaker('GET', 'friends', 'accept', null, true, 'id=' + id)
  return await f()
}

export async function addByLink(id) {
  const f = requestMaker('GET', 'friends', 'addByLink', null, true, 'id=' + id)
  return await f()  
}
