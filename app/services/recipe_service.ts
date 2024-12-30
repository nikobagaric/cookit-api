import Recipe from '#models/recipe'

export async function tagSearch(query: string, splitBy: string = ' '): Promise<Recipe[]> {
  // Split the query into words and ensure no duplicates
  const words = Array.from(new Set(query.split(splitBy).map(word => word.trim().toLowerCase())));

  const recipes = await Recipe.query()
    .whereHas('tags', (tagQuery) => {
      tagQuery.whereIn('name', words);
    });

  return recipes;
}
