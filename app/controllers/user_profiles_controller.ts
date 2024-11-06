import type { HttpContext } from '@adonisjs/core/http'
import UserProfile from '#models/user_profile'

export default class UserProfilesController {
  
  /**
   * @index
   * @operationId indexUserProfiles
   * @responseBody 200 - <UserProfile[]> - List of user profiles
   */
  public async index({ response }: HttpContext) {
    const profiles = await UserProfile.all()
    return response.status(200).json(profiles)
  }

  /**
   * @show
   * @operationId showUserProfile
   * @paramPath id - Profile id - @type(number) @required
   * @responseBody 200 - <UserProfile> - Profile found
   * @responseBody 404 - {"error": "profile not found"} - Profile not found
   */
  public async show({ response, params }: HttpContext) {
    try {
      const profile = await UserProfile.findOrFail(params.id)
      return response.status(200).json(profile)
    } catch (error) {
      return response.status(404).json({ error: 'profile not found' })
    }
  }

  /**
   * @store
   * @operationId storeUserProfile
   * @responseBody 201 - <UserProfile> - Profile created
   * @responseBody 400 - {"error": "bad request"} - Bad request
   * @requestBody - <UserProfile>
   */
  public async store({ request, response }: HttpContext) {
    const data = request.only(['userId', 'imageUrl', 'bio'])
    const profile = await UserProfile.create(data)
    return response.status(201).json(profile)
  }

  /**
   * @update
   * @operationId updateUserProfile
   * @paramPath id - Profile id - @type(number) @required
   * @responseBody 200 - <UserProfile> - Profile updated
   * @responseBody 404 - {"error": "profile not found"} - Profile not found
   * @requestBody - <UserProfile>
   */
  public async update({ request, response, params }: HttpContext) {
    try {
      const profile = await UserProfile.findOrFail(params.id)
      const data = request.only(['imageUrl', 'bio'])
      profile.merge(data)
      await profile.save()
      return response.status(200).json(profile)
    } catch (error) {
      return response.status(404).json({ error: 'profile not found' })
    }
  }

  /**
   * @destroy
   * @operationId destroyUserProfile
   * @paramPath id - Profile id - @type(number) @required
   * @responseBody 204 - Deleted profile
   * @responseBody 404 - Profile not found
   */
  public async destroy({ response, params }: HttpContext) {
    try {
      const profile = await UserProfile.findOrFail(params.id)
      await profile.delete()
      return response.status(204)
    } catch (error) {
      return response.status(404).json({ error: 'profile not found' })
    }
  }
}
