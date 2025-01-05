import factory from '@adonisjs/lucid/factories'
import UserProfile from '#models/user_profile'
import { UserFactory } from './user_factory.js'

export const UserProfileFactory = factory
  .define(UserProfile, async ({ faker }) => {
    return {
      imageUrl: faker.image.avatar(),
      bio: faker.person.bio(),
      points: faker.number.int({min: 0, max: 3000}),
    }
  })
  .relation('user', () => UserFactory)
  .build()