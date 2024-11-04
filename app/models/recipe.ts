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
  
  @column()
  declare cooking_time: number

  @column()
  declare image_url: string

  @column()
  declare ingredients: string // can be another model

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}