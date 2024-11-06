import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Recipe extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string
  
  @column()
  declare description: string

  @column() // enum
  declare cuisine: string 

  @column() // enum
  declare type: string

  @column()
  declare difficulty: number
  
  @column({ columnName: 'cooking_time' })
  declare cookingTime: number

  @column({ columnName: 'image_url' })
  declare imageUrl: string | null

  @column()
  declare ingredients: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => User, {
    pivotTable: 'favorite_recipes',
    pivotTimestamps: true
  })
  declare userFavorited: ManyToMany<typeof User>
}