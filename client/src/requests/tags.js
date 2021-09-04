import { restrictedLetters } from "../rest/config"
import { requsetMaker } from "./config"

export async function searchTags(input) {
  const f = requsetMaker('GET', 'tags', 'search', null, false, 'input=' + input)
  return await f()
}

export async function getTagInfo(tag) {
  const f = requsetMaker('GET', 'tags', 'getTag', null, false, 'tag=' + tag)
  return await f()
}

export async function featuredTags() {
  const f = requsetMaker('GET', 'tags', 'featuredTags', null, false)
  return await f()
}

export async function tagSuggestions(input) {
  const f = requsetMaker('GET', 'tags', 'tagSuggestions', null, false, 'input=' + input)
  return await f()
}

export async function postTags({ user, comment, placeId }) {
  const tagWords = comment.split(' ').filter(w => w?.startsWith('#'))
  let tags = []
  tagWords.forEach(tag => {
    let word = ''
    for (let i = 1; i < tag.length; i++) {
      const letter = tag[i]
      if (restrictedLetters.includes(letter)) break
      word += letter
    }
    if (word) tags.push(word)
  })

  if (!tags.length) return { status: 'OK' }
  console.log('%c⧭', 'color: #e5de73', [...tags]);
  tags = tags.filter((item, i, ar) => ar.indexOf(item) === i)
  console.log('%c⧭', 'color: #33cc99', tags);

  const f = requsetMaker('POST', 'tags', 'postTags', { user, placeId, tags }, false)
  return await f()
}