import { test } from '@japa/runner'
import ActivityLog from '#models/activity_log'
import User from '#models/user'
import fs from 'fs'
import path from 'path'

const sampleImage = fs.readFileSync(path.resolve('./tests/functional/image/sample-image.jpg'))

test.group('ActivityLogsController', (group) => {
  let userId: number

  group.setup(async () => {
    const user = await User.create({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
    })
    userId = user.id
  })


  test('should get all activity logs', async ({ client, assert }) => {
    const response = await client.get('/activity_logs/activity_log')
    response.assertStatus(200)
    assert.isArray(response.body())
  })

  test('should get a single activity log by id', async ({ client, assert }) => {
    const activityLog = await ActivityLog.create({
      userId,
      action: 'User logged in',
    })
    const response = await client.get(`/activity_logs/activity_log/${activityLog.id}`)
    response.assertStatus(200)
    assert.equal(response.body().id, activityLog.id)
    assert.equal(response.body().action, 'User logged in')
  })

  test('should return 404 for a non-existing activity log id', async ({ client }) => {
    const response = await client.get('/activity_logs/999999')
    response.assertStatus(404)
  })

  test('should create a new activity log', async ({ client, assert }) => {
    const response = await client.post('/activity_logs/activity_log').form({
      userId: userId,
      action: 'User made a recipe',
    })
    response.assertStatus(201)
    assert.equal(response.body().action, 'User made a recipe')
  })

  test('should return 400 for invalid image file during create', async ({ client }) => {
    const response = await client
      .post('/activity_logs/activity_log')
      .field('userId', userId)
      .field('action', 'User with invalid image')
      .file('image', './tests/functional/image/sample.txt') // Test invalid file
    response.assertStatus(400)
    response.assertBodyContains({ error: 'invalid image file' })
  })

  test('should update an existing activity log', async ({ client, assert }) => {
    const activityLog = await ActivityLog.create({
      userId: userId,
      action: 'User followed someone',
    })
    const response = await client.put(`/activity_logs/activity_log/${activityLog.id}`).form({
      action: 'User followed another user',
    })
    response.assertStatus(200)
    assert.equal(response.body().action, 'User followed another user')
  })

  test('should update an existing activity log with image', async ({ client }) => {
    const activityLog = await ActivityLog.create({
      userId: userId,
      action: 'User updated profile',
    })
    const response = await client
      .put(`/activity_logs/activity_log/${activityLog.id}`)
      .file('image', sampleImage)
    response.assertStatus(200)
  })

  test('should return 404 for updating a non-existing activity log', async ({ client }) => {
    const response = await client.put('/activity_logs/activity_log/999999').form({
      action: 'Non-existing activity log',
    })
    response.assertStatus(404)
  })

  test('should delete an existing activity log', async ({ client }) => {
    const activityLog = await ActivityLog.create({
      userId,
      action: 'User deleted an activity',
    })
    const response = await client.delete(`/activity_logs/activity_log/${activityLog.id}`)
    response.assertStatus(204)
  })

  test('should return 404 for deleting a non-existing activity log', async ({ client }) => {
    const response = await client.delete('/activity_logs/activity_log/999999')
    response.assertStatus(404)
  })
})
