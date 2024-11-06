import { test } from '@japa/runner'
import User from '#models/user'

test.group('Auth', () => {

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

  test('should logout an authenticated user', async ({ client }) => {
    const user = await User.create({
      username: 'test_user4300',
      email: 'testtestest@example.com',
      password: 'some_password'
    })
    const response = await client.post('/auth/logout').withGuard('api').loginAs(user)

    response.assertStatus(200)
  })

  test('should get current auth user', async ({ client }) => {
    const user = await User.create({
      username: 'test_user43001',
      email: 'testtestest1@example.com',
      password: 'some_password'
    })
    const response = await client.get('/auth/me').withGuard('api').loginAs(user)

    response.assertStatus(200)
  })

})
