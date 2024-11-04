import type { HttpContext } from '@adonisjs/core/http'
import ActivityLog from '#models/activity_log'
import User from '#models/user'
import { v4 as uuid } from 'uuid'
import app from '@adonisjs/core/services/app'

type ActivityLogsData = {
    userId: number,
    action: string,
    image_url?: string,
}

export default class ActivityLogsController {

  public async index({ response }: HttpContext) {
    const activityLogs = await ActivityLog.query().preload('userId')
    return response.status(200).json(activityLogs)
  }

  public async show({ response, params }: HttpContext) {
    const activityLog = await ActivityLog.findOrFail(params.id)
    await activityLog.load('userId')
    return response.status(200).json(activityLog)
  }

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
      data.image_url = `uploads/activity_logs/${fileName}`
    }

    const activityLog = await ActivityLog.create(data)
    return response.status(201).json(activityLog)
  }

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
      data.image_url = `uploads/activity_logs/${fileName}`
    }

    activityLog.merge(data)
    await activityLog.save()

    return response.status(200).json(activityLog)
  }

  public async destroy({ response, params }: HttpContext) {
    const activityLog = await ActivityLog.findOrFail(params.id)
    await activityLog.delete()
    return response.status(204)
  }
}
