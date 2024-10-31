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

})
