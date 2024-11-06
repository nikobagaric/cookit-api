/**
 * User model
 *
 * Serves primarily as an authentication model,
 * whereas user_profile serves as a "user detail" model
 */

import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { HasMany, HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'
import UserProfile from './user_profile.js'
import ActivityLog from './activity_log.js'
import Recipe from './recipe.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare username: string

  @column()
  declare email: string

  @column()
  declare points: number | null

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
  
  
  @hasOne(() => UserProfile, {
    foreignKey: 'userId',
  })
  declare profile: HasOne<typeof UserProfile>
  
  // move relations to user profile?
  
  @hasMany(() => ActivityLog)
  declare activityLogs: HasMany<typeof ActivityLog>

  @manyToMany(() => Recipe, {
    pivotTable: 'favorite_recipes',
    pivotTimestamps: true
  })
  declare favoriteRecipes: ManyToMany<typeof Recipe>

  @manyToMany(() => User, {
    pivotTable: 'user_follows',
    pivotTimestamps: true,
    pivotForeignKey: 'follower_id',
    pivotRelatedForeignKey: 'following_id'
  })
  declare followedUsers: ManyToMany<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'user_follows',
    pivotTimestamps: true,
    pivotForeignKey: 'following_id',
    pivotRelatedForeignKey: 'follower_id'
  })
  declare followers: ManyToMany<typeof User>

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
