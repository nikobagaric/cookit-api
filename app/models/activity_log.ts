import { DateTime } from 'luxon'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class ActivityLog extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  
  @hasOne(() => User)
  declare userId: HasOne<typeof User>

  @column()
  declare action: string // enum, depending on value return a desc, e.g. "Userx has made this!"

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

}