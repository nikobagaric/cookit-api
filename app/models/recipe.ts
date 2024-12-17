import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Tag from './tag.js'

export default class Recipe extends BaseModel {
  serializeExtras = true

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
  
  @column()
  declare ingredients: string

  @column({ columnName: 'image_url' })
  declare imageUrl: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => User, {
    pivotTable: 'favorite_recipes',
    pivotTimestamps: true
  })
  declare userFavorited: ManyToMany<typeof User>

  @manyToMany(() => Tag, {
    pivotTable: 'recipe_tags',
    pivotTimestamps: true
  })
  declare tags: ManyToMany<typeof Tag>
}