import { restrictedLetters } from "../rest/config"
import { requestMaker } from "./config"

export async function searchTags(input) {
  const f = requestMaker('GET', 'tags', 'search', null, false, 'input=' + input)
  return await f()
}

export async function getTagInfo(tag) {
  const f = requestMaker('GET', 'tags', 'getTag', null, false, 'tag=' + tag)
  return await f()
}

export async function featuredTags() {
  const f = requestMaker('GET', 'tags', 'featuredTags', null, false)
  return await f()
}

export async function tagSuggestions(input) {
  const f = requestMaker('GET', 'tags', 'tagSuggestions', null, false, 'input=' + input)
  return await f()
}

export async function postTagsIfAny({ user, comment, featureId, iso_3166_2, lat, lng }) {
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
  tags = tags.filter((item, i, ar) => ar.indexOf(item) === i)

  const f = requestMaker('POST', 'tags', 'postTags', { user, featureId, iso_3166_2, tags }, false)
  return await f()
}