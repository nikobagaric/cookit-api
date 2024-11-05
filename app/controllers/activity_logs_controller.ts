import type { HttpContext } from '@adonisjs/core/http'
import ActivityLog from '#models/activity_log'
import User from '#models/user'
import { v4 as uuid } from 'uuid'
import app from '@adonisjs/core/services/app'

type ActivityLogsData = {
    userId: number,
    action: string,
    imageUrl?: string,
}

export default class ActivityLogsController {
  /**
   * @index
   * @operationId indexActivityLog
   * @responseBody 200 - <ActivityLog[]> - List of logs
   */
  public async index({ response }: HttpContext) {
    const activityLogs = await ActivityLog.query().preload('user')
    return response.status(200).json(activityLogs)
  }

  /**
   * @show
   * @paramPath id - Describe the path param - @type(number) @required
   * @operationId showActivityLog
   * @responseBody 200 - <ActivityLog> - Sucessfully found log
   * @responseBody 404 - {"error": "Log not found"} - Not found
   */
  public async show({ response, params }: HttpContext) {
    const activityLog = await ActivityLog.findOrFail(params.id)
    await activityLog.load('user')
    return response.status(200).json(activityLog)
  }

  /**
   * @store
   * @operationId storeActivityLog
   * @responseBody 201
   * @responseBody 422
   * @requestBody <ActivityLog>
   */
  public async store({ request, response }: HttpContext) {
    const data: ActivityLogsData = request.only(['userId', 'action'])

    const image = request.file('image', {
      extnames: ['jpg', 'jpeg', 'png'],
      size: '3mb',
    })

    if (image) {
      if (!image.isValid) {
        return response.status(400).json({ error: 'invalid image file' })
      }

      const fileName = `${uuid()}.${image.extname}`
      await image.move(app.tmpPath('uploads/activity_logs'), { name: fileName })
      data.imageUrl = `uploads/activity_logs/${fileName}`
    }

    const activityLog = await ActivityLog.create(data)
    return response.status(201).json(activityLog)
  }

  /**
   * @update
   * @operationId updateActivityLog
   * @paramPath id - Describe the path param - @type(number) @required
   * @responseBody 200
   * @responseBody 422
   * @requestBody <ActivityLog>
   */
  public async update({ request, response, params }: HttpContext) {
    const activityLog = await ActivityLog.findOrFail(params.id)
    const data: ActivityLogsData = request.only(['action', 'userId'])

    const image = request.file('image', {
      extnames: ['jpg', 'jpeg', 'png'],
      size: '3mb',
    })

    if (image) {
      if (!image.isValid) {
        return response.status(400).json({ error: 'invalid image file' })
      }

      const fileName = `${uuid()}.${image.extname}`
      await image.move(app.tmpPath('uploads/activity_logs'), { name: fileName })
      data.imageUrl = `uploads/activity_logs/${fileName}`
    }

    activityLog.merge(data)
    await activityLog.save()

    return response.status(200).json(activityLog)
  }

  /**
   * @destroy
   * @operationId destroyActivityLog
   * @paramPath id - Describe the param path - @type(number) @required
   * @responseBody 204
   * @responseBody 404
   */
  public async destroy({ response, params }: HttpContext) {
    const activityLog = await ActivityLog.findOrFail(params.id)
    await activityLog.delete()
    return response.status(204)
  }
}
