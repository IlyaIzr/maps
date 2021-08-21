import { requsetMaker } from "./config"

export async function getFriends() {
  const f = requsetMaker('GET', 'friends', 'all', null, true)
  return await f()
}


export async function searchUsers(input) {
  const f = requsetMaker('GET', 'friends', 'search', null, true, 'input=' + input)
  return await f()
}

export async function getProfileDetails(id) {
  const f = requsetMaker('GET', 'friends', 'details', null, true, 'id=' + id)
  return await f()
}

// Make friend request
export async function addFriend(id) {
  const f = requsetMaker('GET', 'friends', 'add', null, true, 'id=' + id)
  return await f()
}

export async function removeFriend(id) {
  const f = requsetMaker('GET', 'friends', 'remove', null, true, 'id=' + id)
  return await f()
}

export async function acceptRequest(id) {
  const f = requsetMaker('GET', 'friends', 'accept', null, true, 'id=' + id)
  return await f()
}

export async function addByLink(id) {
  const f = requsetMaker('GET', 'friends', 'addByLink', null, true, 'id=' + id)
  return await f()  
}
