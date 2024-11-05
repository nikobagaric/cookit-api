import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

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
  declare ingredients: string // can be another model

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}