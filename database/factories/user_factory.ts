import factory from '@adonisjs/lucid/factories'
import User from '#models/user'
import { UserProfileFactory } from './user_profile_factory.js'
import { RecipeFactory } from './recipe_factory.js'
import { ActivityLogFactory } from './activity_log_factory.js'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      username: faker.internet.username(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }
  })
  .relation('profile', () => UserProfileFactory)
  .relation('favoriteRecipes', () => RecipeFactory)
  .relation('activityLogs', () => ActivityLogFactory)
  .build()