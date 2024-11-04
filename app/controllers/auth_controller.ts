import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator, loginValidator } from '#validators/auth'

export default class AuthController {
  /**
   * @login
   * @operationId loginUser
   * @description Logs in the user with email and password, returning an access token on success
   * @responseBody 200 - {"token": "xxxxx"} - Successful login, returns a token
   * @responseBody 401 - {"error": "Invalid credentials"} - Login failed due to invalid credentials
   * @requestBody {"email": "x@x.x", "password": "x"}
   */
  async login({ request, response }: HttpContext): Promise<void> {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)

    return response.ok({
      token: token,
      ...user.serialize(),
    })
  }

  /**
   * @register
   * @operationId registerUser
   * @description Registers a new user by providing email, password, and username
   * @responseBody 201 - <User> - User created successfully
   * @responseBody 400 - {"error": "Validation failed"} - Validation error
   * @requestBody {"email": "x@x.x", "password": "x", "username": "x"}
   */
  async register({ request, response }: HttpContext): Promise<void> {
    const payload = await request.validateUsing(registerValidator)

    const user = await User.create(payload)

    return response.created(user)
  }

  /**
   * @logout
   * @operationId logoutUser
   * @description Logs out the user by invalidating the access token
   * @responseBody 200 - {"message": "Logged out"} - Successful logout
   * @responseBody 404 - {"error": "Token not found"} - Token not found or invalid
   */
  async logout({ auth, response }: HttpContext): Promise<void> {
    const user = auth.getUserOrFail()
    
    const token = auth.user?.currentAccessToken.identifier

    if (!token) {
      return response.badRequest({ message: 'Token not found' })
    }

    await User.accessTokens.delete(user, token)

    return response.ok({ message: 'Logged out' })
  }

  
  async me({ auth, response }: HttpContext): Promise<void> {
    const user = auth.getUserOrFail()
    
    return response.ok(
      {
        user: user
      }
    )
  }
}
