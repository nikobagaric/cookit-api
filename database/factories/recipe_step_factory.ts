import factory from '@adonisjs/lucid/factories'
import RecipeStep from '#models/recipe_step'

export const RecipeStepFactory = factory
  .define(RecipeStep, async ({ faker }) => {
    return {
      order: faker.number.int({min: 1, max: 10}),
      category: faker.lorem.word(),
      description: faker.lorem.sentence(),
    }
  })
  .build()