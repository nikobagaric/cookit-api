import type { HttpContext } from '@adonisjs/core/http'
import Recipe from '#models/recipe'
import { v4 as uuid } from 'uuid'
import app from '@adonisjs/core/services/app'
import { storeRecipeRequestValidator, updateRecipeRequestValidator } from '#validators/recipe'

export default class RecipesController {
  /**
   * @index
   * @operationId indexRecipes
   * @responseBody 200 - <Recipe[]> - List of recipes
   */
  public async index({ response }: HttpContext) {
    const recipes = await Recipe.all()
    return response.status(200).json(recipes)
  }

  /**
   * @show
   * @operationId showRecipe
   * @paramPath id - Recipe id - @type(number) @required
   * @responseBody 200 - <Recipe> - Recipe found
   * @responseBody 404 - {"error": "recipe not found"} - Recipe not found
   */
  public async show({ response, params }: HttpContext) {
    const recipe = await Recipe.findOrFail(params.id)
    await recipe.load('userFavorited')
    return response.status(200).json(recipe)
  }

  /**
   * @store
   * @operationId storeRecipe
   * @responseBody 201 - <Recipe> - Recipe created
   * @responseBody 400 - {"error": "bad request"} - Bad request
   * @requestBody - <storeRecipeRequestValidator>
   */
  public async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(storeRecipeRequestValidator)

    const image = request.file('image', {
      extnames: ['jpg', 'jpeg', 'png'],
      size: '3mb',
    })

    if (image) {
      if (!image.isValid) {
        return response.status(400).json({ error: 'invalid image file' })
      }

      const fileName = `${uuid()}.${image.extname}`
      await image.move(app.makePath('uploads/recipes'), { name: fileName })

      data.imageUrl = `uploads/recipes/${fileName}`
    }

    const recipe = await Recipe.create(data)
    return response.status(201).json(recipe)
  }

  /**
   * @update
   * @operationId updateRecipe
   * @responseBody 200 - <Recipe> - Recipe updated
   * @responseBody 404 - {"error": "recipe not found"} - Recipe not found
   * @requestBody - <updateRecipeRequestValidator>
   */
  public async update({ request, response, params }: HttpContext) {
    const recipe = await Recipe.findOrFail(params.id)
    const data = await request.validateUsing(updateRecipeRequestValidator)

    const image = request.file('image', {
      extnames: ['jpg', 'jpeg', 'png'],
      size: '3mb',
    })

    if (image) {
      if (!image.isValid) {
        return response.status(400).json({ error: 'invalid image file' })
      }

      const fileName = `${uuid()}.${image.extname}`
      await image.move(app.makePath('uploads/recipes'), { name: fileName })

      data.imageUrl = `uploads/recipes/${fileName}`
    }

    recipe.merge(data)
    await recipe.save()

    return response.status(200).json(recipe)
  }

  /**
   * @destroy
   * @operationId destroyRecipe
   * @paramPath id - Recipe id - @type(number) @required
   * @responseBody 204 - Deleted recipe
   * @responseBody 404 - Recipe not found
   */
  public async destroy({ response, params }: HttpContext) {
    const recipe = await Recipe.findOrFail(params.id)
    await recipe.delete()
    return response.status(204)
  }

  /**
   * @favoriteRecipe
   * @operationId favoriteRecipe
   * @description Marks a recipe as a favorite for the authenticated user.
   * @paramPath id - Recipe id - @type(number) @required
   * @responseBody 200 - {"status": "favorited"} - Recipe favorited successfully
   * @responseBody 404 - {"error": "recipe not found"} - Recipe not found
   */
  public async favoriteRecipe({ response, params, auth }: HttpContext) {
    const recipe = await Recipe.findOrFail(params.id)
    const user = await auth.authenticate()
    const alreadyFavorited = await recipe
      .related('userFavorited')
      .query()
      .where('user_id', user.id)
      .first()

    if(alreadyFavorited) {
      return response.status(409).json({ error: 'recipe already favorited'})
    }

    await recipe.related('userFavorited').attach([user.id])

    return response.status(200).json({ status: 'favorited' })
  }

  /**
   * @unfavoriteRecipe
   * @operationId unfavoriteRecipe
   * @description Removes a recipe from the authenticated user’s favorites.
   * @paramPath id - Recipe id - @type(number) @required
   * @responseBody 200 - {"status": "unfavorited"} - Recipe unfavorited successfully
   * @responseBody 404 - {"error": "recipe not found"} - Recipe not found
   */
  public async unfavoriteRecipe({ response, params, auth }: HttpContext) {
    const recipe = await Recipe.findOrFail(params.id)
    const user = await auth.authenticate()

    await recipe.related('userFavorited').detach([user.id])

    return response.status(200).json({ status: 'unfavorited' })
  }
}
