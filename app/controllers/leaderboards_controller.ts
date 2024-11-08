import type { HttpContext } from '@adonisjs/core/http'
import { getLeaderboard, updateUserPoints } from '#services/leaderboard_service'
import { updatePointsValidator } from '#validators/user'

export default class LeaderboardsController {
  /**
   * @getFullLeaderboard
   * @operationId getLeaderboard
   * @description Fetches the entire leaderboard for the current month.
   * @responseBody 200 - Leaderboard data
   */
  public async getFullLeaderboard({ response }: HttpContext) {
    const leaderboard = await getLeaderboard()
    return response.status(200).json(leaderboard)
  }

  /**
   * @updateOneUserPoints
   * @operationId updateOneUserPoints
   * @description Updates given user's points by given integer value
   * @responseBody 200 - {"userId": "1"} - Something
   * @requestBody - <updatePointsValidator>
   */
  public async updateOneUserPoints({ response, request, params }: HttpContext) {
    const data = await request.validateUsing(updatePointsValidator)
    const output = await updateUserPoints(params.id, data.points)
    return response.status(200).json(output)
  }
}
