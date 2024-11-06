import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { storeUserDataValidator, updateUserdataValidator } from '#validators/user'

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
   * @show
   * @operationId showFollowings
   * @paramPath id - User id - @type(number) @required
   * @responseBody 200 - User followings
   * @responseBody 404 - {"error": "user not found"} - User not found
   */
  public async getFollowers({ response, params }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.load('followedUsers')
    await user.load('followers')
    const responsePayload = {
      followers: user.followers,
      followed: user.followedUsers,
    }
    return response.status(200).json(responsePayload)
  }

  /**
   * @show
   * @operationId showFavoriteRecipes
   * @paramPath id - User id - @type(number) @required
   * @responseBody 200 - User favorite recipes
   * @responseBody 404 - {"error": "user not found"} - User not found
   */
  public async getFavoriteRecipes({ response, params }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.load('favoriteRecipes')
    const responsePayload = {
      favorite_recipes: user.favoriteRecipes,
    }
    return response.status(200).json(responsePayload)
  }

  /**
   * @show
   * @operationId showActivityLogs
   * @paramPath id - User id - @type(number) @required
   * @responseBody 200 - User activity logs
   * @responseBody 404 - {"error": "user not found"} - User not found
   */
  public async getActivityLogs({ response, params }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.load('activityLogs')
    const responsePayload = {
      activity_logs: user.activityLogs,
    }
    return response.status(200).json(responsePayload)
  }

  /**
   * @store
   * @operationId storeUser
   * @responseBody 201 - <User> - User created
   * @responseBody 400 - {"error": "bad request"} - Bad request
   * @requestBody - <User>
   */
  public async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(storeUserDataValidator)
    const user = await User.create(data)
    await user.related('profile').create({})
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
    const data = await request.validateUsing(updateUserdataValidator)
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

  /**
   * @followUser
   * @operationId followUser
   * @description Allows the authenticated user to follow another user.
   * @paramPath id - User id to follow - @type(number) @required
   * @responseBody 200 - {"status": "followed"} - User followed successfully
   * @responseBody 404 - {"error": "user not found"} - User not found
   */
  public async followUser({ response, params, auth }: HttpContext) {
    const userToFollow = await User.findOrFail(params.id)
    const user = await auth.authenticate()

    const alreadyFollowing = await user
      .related('followedUsers')
      .query()
      .where('following_id', userToFollow.id)
      .first()

    if (alreadyFollowing) {
      return response.status(409).json({ error: 'already following this user' })
    }

    await user.related('followedUsers').attach([userToFollow.id])
    return response.status(200).json({ status: 'followed' })
  }

  /**
   * @unfollowUser
   * @operationId unfollowUser
   * @description Allows the authenticated user to unfollow another user.
   * @paramPath id - User id to unfollow - @type(number) @required
   * @responseBody 200 - {"status": "unfollowed"} - User unfollowed successfully
   * @responseBody 404 - {"error": "user not found"} - User not found
   */
  public async unfollowUser({ response, params, auth }: HttpContext) {
    const userToUnfollow = await User.findOrFail(params.id)
    const user = await auth.authenticate()

    await user.related('followedUsers').detach([userToUnfollow.id])
    return response.status(200).json({ status: 'unfollowed' })
  }
}
