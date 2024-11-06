import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

// make a user service, to be used in auth and here; for now this is ok
// add a validator for requests
export default class UsersController {
    
    /**
     * @index
     * @operationId indexUsers
     * @responseBody 200 - <User[]> - List of users
     */
    public async index({ response }: HttpContext) {
        const users = await User.all()
        return response.status(200).json(users)
    }

    /**
     * @show
     * @operationId showUser
     * @paramPath id - User id - @type(number) @required
     * @responseBody 200 - <User> - User found
     * @responseBody 404 - {"error": "user not found"} - User not found
     */
    public async show({ response, params }: HttpContext) {
        const user = await User.findOrFail(params.id)
        return response.status(200).json(user)
    }

    /**
     * @store
     * @operationId storeUser
     * @responseBody 201 - <User> - User created
     * @responseBody 400 - {"error": "bad request"} - Bad request
     * @requestBody - <User>
     */
    public async store({ request, response }: HttpContext) {
        const data = request.only(['username', 'email', 'password'])
        const user = await User.create(data)
        await user.related('profile').create({ })
        return response.status(201).json(user)
    }

    /**
     * @update
     * @operationId updateUser
     * @responseBody 200 - <User> - User updated
     * @responseBody 404 - <User> - User not found
     * @requestBody - <User>
     */
    public async update({ request, response, params }: HttpContext) {
        const user = await User.findOrFail(params.id)
        const data = request.only(['username', 'email', 'password'])
        user.merge(data)
        await user.save()
        return response.status(200).json(user)
    }

    /**
     * @destroy
     * @operationId destroyUser
     * @paramPath id - User id - @type(number) @required
     * @responseBody 204 - Deleted user
     * @responseBody 404 - User not found
     */
    public async destroy({ response, params }: HttpContext) {
        const user = await User.findOrFail(params.id)
        await user.delete()
        return response.status(204)
    }
}