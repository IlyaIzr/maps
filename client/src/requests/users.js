export async function registerUser(data) {
  const f = requsetMaker('POST', 'users', 'register', { ...data }, false)
  return await f()
}

export async function registerGUser(data) {
  const f = requsetMaker('POST', 'users', 'gregister', { ...data }, false)
  return await f()
}

export async function updateUser(data) {
  const f = requsetMaker('POST', 'users', 'update', { ...data }, true)
  return await f()
}

export async function updateUserPword(data) {
  const f = requsetMaker('POST', 'users', 'updatePword', { ...data }, true)
  return await f()
}
