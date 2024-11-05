import type { HttpContext } from '@adonisjs/core/http'
import Recipe from '#models/recipe'
import { v4 as uuid } from 'uuid'
import app from '@adonisjs/core/services/app'

type RecipeData = {
  title: string
  description: string
  difficulty: number
  ingredients: string
  imageUrl?: string
  type: string
  cuisine: string
  cookingTime: number
}

export default class RecipesController {

  public async index({ response }: HttpContext) {
    const recipes = await Recipe.all()
    return response.status(200).json(recipes)
  }

  public async show({ response, params }: HttpContext) {
    const recipe = await Recipe.findOrFail(params.id)
    return response.status(200).json(recipe)
  }

  public async store({ request, response }: HttpContext) {
    const data: RecipeData = request.only([
      'title',
      'description',
      'difficulty',
      'ingredients',
      'type',
      'cookingTime',
      'cuisine',
    ])
    const image = request.file('image', {
      extnames: ['jpg', 'jpeg', 'png'],
      size: '3mb',
    })

    if (image) {
      if (!image.isValid) {
        return response.status(400).json({ error: 'invalid image file' })
      }

      const fileName = `${uuid()}.${image.extname}`
      await image.move(app.tmpPath('uploads/recipes'), { name: fileName })

      data.imageUrl = `uploads/recipes/${fileName}`
    }

    const recipe = await Recipe.create(data)
    return response.status(201).json(recipe)
  }

  public async update({ request, response, params }: HttpContext) {
    const recipe = await Recipe.findOrFail(params.id)
    const data: RecipeData = request.only([
      'title',
      'description',
      'difficulty',
      'ingredients',
      'type',
      'cookingTime',
      'cuisine',
    ])

    const image = request.file('image', {
      extnames: ['jpg', 'jpeg', 'png'],
      size: '3mb',
    })

    if (image) {
      if (!image.isValid) {
        return response.status(400).json({ error: 'invalid image file' })
      }

      const fileName = `${uuid()}.${image.extname}`
      await image.move(app.tmpPath('uploads/recipes'), { name: fileName })

      data.imageUrl = `uploads/recipes/${fileName}`
    }

    recipe.merge(data)
    await recipe.save()

    return response.status(200).json(recipe)
  }

  public async destroy({ response, params }: HttpContext) {
    const recipe = await Recipe.findOrFail(params.id)
    await recipe.delete()
    return response.status(204)
  }
}
