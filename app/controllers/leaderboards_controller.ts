import type { HttpContext } from '@adonisjs/core/http'
import { getLeaderboard } from '#services/leaderboard_service'

export default class LeaderboardsController {
    /**
   * @getLeaderboard
   * @operationId getLeaderboard
   * @description Fetches the entire leaderboard for the current month.
   * @responseBody 200 - [{ userId, username, points }] - Leaderboard data
   */
    public async getFullLeaderboard({ response }: HttpContext) {
        const leaderboard = getLeaderboard()
        return response.status(200).json(leaderboard)
    }
}