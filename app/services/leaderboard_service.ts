import Redis from '@adonisjs/redis/services/main'
import UserProfile from '#models/user_profile'

function getCurrentLeaderboardKey(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const year = now.getFullYear()
  return `leaderboard:${year}:${month}`
}

/**
 * Updates user points in both the database and Redis leaderboard.
 * @param userId - ID of the user whose points are being updated
 * @param points - Points to add to the user's total
 */
export async function updateUserPoints(userId: number, points: number) {
  const userProfile = await UserProfile.find(userId)
  if (!userProfile) throw new Error('User profile not found')

  userProfile.points = (userProfile.points ?? 0) + points
  await userProfile.save()

  const leaderboardKey = getCurrentLeaderboardKey()
  await Redis.zadd(leaderboardKey, userProfile.points, userId.toString())
}

/**
 * Retrieves the leaderboard data.
 * Fetches the leaderboard from Redis, then batches UserProfile fetches.
 */
export async function getLeaderboard() {
  const leaderboardKey = getCurrentLeaderboardKey()
  const leaderboardData = await Redis.zrevrange(leaderboardKey, 0, -1, 'WITHSCORES')
  
  const userIds = leaderboardData.filter((_, index) => index % 2 === 0).map(id => parseInt(id))

  const users = await UserProfile.query().whereIn('id', userIds)
  
  const leaderboard = users.map(user => {
    const pointsIndex = leaderboardData.indexOf(user.id.toString()) + 1
    const points = parseInt(leaderboardData[pointsIndex])
    return {
      userId: user.id,
      points: points,
    }
  })

  return leaderboard
}
