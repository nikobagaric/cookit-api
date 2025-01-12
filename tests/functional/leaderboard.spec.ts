import { test } from '@japa/runner'
import UserProfile from '#models/user_profile'

test.group('Leaderboard', () => {
  test('should get leaderboard (empty)', async ({ client }) => {
    const response = await client.get('/leaderboards')
    response.assertStatus(200)
    response.assertBodyContains([])
  })

  test('should get leaderboard after update', async ({ client }) => {
    const userProfile = await UserProfile.create({
      userId: 1,
      imageUrl: "test.png",
      bio: "testing bio",
    })
    await client.put(`/leaderboards/${userProfile.id}`).field('points', 200)
    const response = await client.get('/leaderboards')

    response.assertStatus(200)
    response.assertBodyContains([{
      "points": 200,
      "userId": userProfile.userId
    }])
  })
})