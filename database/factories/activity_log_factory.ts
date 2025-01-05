import factory from '@adonisjs/lucid/factories'
import ActivityLog from '#models/activity_log'
import { UserFactory } from './user_factory.js'

export const ActivityLogFactory = factory
  .define(ActivityLog, async ({ faker }) => {
    return {
      action: faker.word.verb(),
      imageUrl: faker.image.urlPlaceholder(),
    }
  })
  .relation('user', () => UserFactory)
  .build()