import { requsetMaker } from "./config"

export async function getFriends() {
  const f = requsetMaker('GET', 'friends', 'all', null, true)
  return await f()
}


export async function searchUsers(input) {
  const f = requsetMaker('GET', 'friends', 'search', null, true, 'input=' + input)
  return await f()
}