import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import UserProfile from './user_profile.js'
import ActivityLog from './activity_log.js'

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
  declare profile_picture: string

  @column()
  declare points: number

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

  @hasMany(() => ActivityLog, {
    localKey: 'id',
    foreignKey: 'userId'
  })
  declare activityLogs: HasMany<typeof ActivityLog>

  static accessTokens = DbAccessTokensProvider.forModel(User)
}