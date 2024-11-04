import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

// make a user service, to be used in auth and here; for now this is ok
export default class UsersController {
    
    public async index({ response }: HttpContext) {
        const users = await User.all()
        return response.status(200).json(users)
    }

    public async show({ response, params }: HttpContext) {
        const user = await User.findOrFail(params.id)
        return response.status(200).json(user)
    }

    public async store({ request, response }: HttpContext) {
        const data = request.only(['username', 'email', 'password'])
        const user = await User.create(data)
        await user.related('profile').create({ })
        return response.status(201).json(user)
    }

    public async update({ request, response, params }: HttpContext) {
        const user = await User.findOrFail(params.id)
        const data = request.only(['username', 'email', 'password'])
        user.merge(data)
        await user.save()
        return response.status(200).json(user)
    }

    public async destroy({ response, params }: HttpContext) {
        const user = await User.findOrFail(params.id)
        await user.delete()
        return response.status(204)
    }
}