import { test } from '@japa/runner'
import User from '#models/user'

test.group('Auth', (group) => {
  test('should register a user', async ({ client }) => {
    const response = await client.post('/auth/register').form({
      username: 'test_username',
      email: 'test@test.com',
      password: 'password',
    })

    response.assertStatus(201)
  })

  test('should login a user', async ({ client }) => {
    const response = await client.post('/auth/login').form({
      email: 'test@test.com',
      password: 'password',
    })

    response.assertStatus(200)
  })

  test('should login user and get me', async ({ client }) => {
    const testUser = await User.create({
      id: 100,
      username: "testuser",
      password: "testpass",
      email: "test1@test.com",
    })

    const meResponse = await client.get('/auth/me').loginAs(testUser)

    meResponse.assertStatus(200)
  })
})
