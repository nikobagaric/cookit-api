import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { UserFactory } from '#database/factories/user_factory'
import { RecipeFactory } from '#database/factories/recipe_factory'

/*
*
*/
export default class extends BaseSeeder {
  async run() {
   await UserFactory.with('profile', 1).with('activityLogs', 2).createMany(10)
   await RecipeFactory.with('tags', 1).with('steps', 5).create()
   await RecipeFactory.createMany(9)
  }
}