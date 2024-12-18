import Recipe from '#models/recipe'
import Tag from '#models/tag'


export async function tagSearch(query: string, splitBy: string = ' ') {
  const words = query.split(splitBy)

  const tags = await Tag.query().whereIn('name', words)
  
  if (tags.length === 0) {
    return [];
  }

  const tagIDs = tags.map((tag) => tag.id)

  const recipes = await Recipe.query().whereHas('tags', (builder) => {
    builder.whereIn('tags.id', tagIDs)
  })

  return recipes
}
