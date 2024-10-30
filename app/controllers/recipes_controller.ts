import type { HttpContext } from '@adonisjs/core/http'
import Recipe from '#models/recipe'
import { v4 as uuid } from 'uuid'
import app from '@adonisjs/core/services/app'

type RecipeData = {
  title: string
  description: string
  difficulty: number
  ingredients: string
  image_url?: string
}

export default class RecipesController {
  /**
   * @index
   * @operationId indexRecipe
   * @description Gets all recipes
   * @responseBody 200
   * @responseBody 404
   */
  public async index({ response }: HttpContext) {
    const recipes = await Recipe.all()
    return response.status(200).json(recipes)
  }

  /**
   * @show
   * @operationId showRecipe
   * @description Gets one recipe by id
   * @responseBody 200
   * @responseBody 404
   */
  public async show({ response, params }: HttpContext) {
    const recipe = await Recipe.findOrFail(params.id)
    return response.status(200).json(recipe)
  }

  /**
   * @store
   * @operationId storeRecipe
   * @description Save a recipe
   * @responseBody 201
   * @responseBody 404
   * @requestBody {"title": "string", "description": "string", "difficulty": "1-5", "ingredients": "list"}
   */
  public async store({ request, response }: HttpContext) {
    const data: RecipeData = request.only(['title', 'description', 'difficulty', 'ingredients'])
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

      data.image_url = `uploads/recipes/${fileName}`
    }

    const recipe = await Recipe.create(data)
    return response.status(201).json(recipe)
  }

  /**
   * @update
   * @operationId updateRecipe
   * @description Update a recipe
   * @responseBody 200
   * @responseBody 404
   * @requestBody {"title": "string", "description": "string", "difficulty": "1-5"}
   */
  public async update({ request, response, params }: HttpContext) {
    const recipe = await Recipe.findOrFail(params.id)
    const data: RecipeData = request.only(['title', 'description', 'difficulty', 'ingredients'])

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

      data.image_url = `uploads/recipes/${fileName}`
    }

    recipe.merge(data)
    await recipe.save()

    return response.status(200).json(recipe)
  }

  /**
   * @destroy
   * @operationId destroyRecipe
   * @responseBody 204
   * @responseBody 404
   * @requestBody {"id": number}
   */
  public async destroy({ response, params }: HttpContext) {
    const recipe = await Recipe.findOrFail(params.id)
    await recipe.delete()
    return response.status(204)
  }
}
