import type { HttpContext } from '@adonisjs/core/http'
import RecipeStep from '#models/recipe_step'

export default class RecipeStepsController {
  /**
   * @index
   * @operationId indexRecipeStep
   * @responseBody 200 - <RecipeStep[]> - List of recipe steps
   */
  public async index({ response }: HttpContext) {
    const steps = await RecipeStep.all()
    return response.status(200).json(steps)
  }

  /**
   * @show
   * @paramPath id - The ID of the recipe step - @type(number) @required
   * @operationId showRecipeStep
   * @responseBody 200 - <RecipeStep> - Successfully found recipe step
   * @responseBody 404 - {"error": "RecipeStep not found"} - Not found
   */
  public async show({ response, params }: HttpContext) {
    const step = await RecipeStep.findOrFail(params.id)
    return response.status(200).json(step)
  }

  /**
   * @store
   * @operationId storeRecipeStep
   * @responseBody 201 - Successfully stored recipe step
   * @responseBody 400 - Validation error
   * @requestBody <RecipeStep>
   */
  public async store({ request, response }: HttpContext) {
    const data = request.only(['order', 'category', 'description', 'recipe_id'])

    if (
      typeof data.order !== 'number' ||
      typeof data.category !== 'string' ||
      typeof data.description !== 'string' ||
      typeof data.recipe_id !== 'number'
    ) {
      return response.status(400).json({ error: 'Invalid data provided' })
    }

    const step = await RecipeStep.create(data)
    return response.status(201).json(step)
  }

  /**
   * @update
   * @operationId updateRecipeStep
   * @paramPath id - The ID of the recipe step - @type(number) @required
   * @responseBody 200 - Successfully updated recipe step
   * @responseBody 404 - RecipeStep not found
   * @requestBody <RecipeStep>
   */
  public async update({ request, response, params }: HttpContext) {
    const step = await RecipeStep.findOrFail(params.id)
    const data = request.only(['order', 'category', 'description'])

    if (
      (data.order && typeof data.order !== 'number') ||
      (data.category && typeof data.category !== 'string') ||
      (data.description && typeof data.description !== 'string')
    ) {
      return response.status(400).json({ error: 'Invalid data provided' })
    }

    step.merge(data)
    await step.save()
    return response.status(200).json(step)
  }

  /**
   * @destroy
   * @operationId destroyRecipeStep
   * @paramPath id - The ID of the recipe step - @type(number) @required
   * @responseBody 204 - Successfully deleted recipe step
   * @responseBody 404 - RecipeStep not found
   */
  public async destroy({ response, params }: HttpContext) {
    const step = await RecipeStep.findOrFail(params.id)
    await step.delete()
    return response.status(204)
  }
}
