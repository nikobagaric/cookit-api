import factory from '@adonisjs/lucid/factories'
import Recipe from '#models/recipe'
import { UserFactory } from './user_factory.js'
import { TagFactory } from './tag_factory.js'
import { RecipeStepFactory } from './recipe_step_factory.js'

export const RecipeFactory = factory
  .define(Recipe, async ({ faker }) => {
    return {
      title: faker.food.dish(),
      description: faker.food.description(),
      cookingTime: faker.number.int({min:5, max: 60}),
      type: faker.food.adjective(),
      cuisine: faker.food.ethnicCategory(),
      difficulty: faker.number.int({min: 1, max: 5}),
      ingredients: faker.food.ingredient(),
    }
  })
  .relation('tags', () => TagFactory)
  .relation('userFavorited', () => UserFactory)
  .relation('steps', () => RecipeStepFactory)
  .build()