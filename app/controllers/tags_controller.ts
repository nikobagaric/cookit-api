import type { HttpContext } from '@adonisjs/core/http'
import Tag from '#models/tag'

export default class TagsController {
  /**
   * @index
   * @operationId indexTag
   * @responseBody 200 - <Tag[]> - List of tags
   */
  public async index({ response }: HttpContext) {
    const tags = await Tag.all()
    return response.status(200).json(tags)
  }

  /**
   * @show
   * @paramPath id - Describe the path param - @type(number) @required
   * @operationId showTag
   * @responseBody 200 - <Tag> - Successfully found tag
   * @responseBody 404 - {"error": "Tag not found"} - Not found
   */
  public async show({ response, params }: HttpContext) {
    const tag = await Tag.findOrFail(params.id)
    return response.status(200).json(tag)
  }

  /**
   * @store
   * @operationId storeTag
   * @responseBody 201 - Successfully stored tag
   * @responseBody 400 - Validation error
   * @requestBody <Tag>
   */
  public async store({ request, response }: HttpContext) {
    const data = request.only(['name']) // Ensure 'name' exists in your model
    if (!data.name || typeof data.name !== 'string') {
      return response.status(400).json({ error: 'Invalid name provided' })
    }

    const tag = await Tag.create(data)
    return response.status(201).json(tag)
  }

  /**
   * @update
   * @operationId updateTag
   * @paramPath id - Describe the path param - @type(number) @required
   * @responseBody 200 - Successfully updated tag
   * @responseBody 404 - Tag not found
   * @requestBody <Tag>
   */
  public async update({ request, response, params }: HttpContext) {
    const tag = await Tag.findOrFail(params.id)
    const data = request.only(['name'])

    if (data.name && typeof data.name !== 'string') {
      return response.status(400).json({ error: 'Invalid name provided' })
    }

    tag.merge(data)
    await tag.save()
    return response.status(200).json(tag)
  }

  /**
   * @destroy
   * @operationId destroyTag
   * @paramPath id - Describe the param path - @type(number) @required
   * @responseBody 204 - Destroyed tag
   * @responseBody 404 - Tag not found
   */
  public async destroy({ response, params }: HttpContext) {
    const tag = await Tag.findOrFail(params.id)
    await tag.delete()
    return response.status(204)
  }
}
