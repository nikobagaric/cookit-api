import redis from '@adonisjs/redis/services/main'
import UserProfile from '#models/user_profile'

function getCurrentLeaderboardKey(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const year = now.getFullYear()
  return `leaderboard:${year}:${month}`
}

export async function updateUserPoints(userId: number, points: number) {
  const userProfile = await UserProfile.findOrFail(userId)

  userProfile.points = (userProfile.points || 0) + points
  await userProfile.save()

  const leaderboardKey = getCurrentLeaderboardKey()
  await redis.zadd(leaderboardKey, userProfile.points, userId.toString())
}

export async function getLeaderboard() {
  const leaderboardKey = getCurrentLeaderboardKey()
  const leaderboardData = await redis.zrevrange(leaderboardKey, 0, -1, 'WITHSCORES')
  const leaderboard = []

  for (let i = 0; i < leaderboardData.length; i += 2) {
    const userId = parseInt(leaderboardData[i])
    const points = parseInt(leaderboardData[i + 1])

    const user = await UserProfile.find(userId)
    if (user) {
      leaderboard.push({
        userId: user.id,
        points: points,
      })
    }
  }

  return leaderboard
}
