import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Recipe from './recipe.js'

export default class RecipeStep extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare order: number

  @column()
  declare category: string

  @column()
  declare description: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Recipe)
  declare recipe: BelongsTo<typeof Recipe>
}