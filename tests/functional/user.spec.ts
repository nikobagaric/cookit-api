import { test } from '@japa/runner'
import User from '#models/user'

test.group('UsersController', (group) => {
  let userId: number

  group.setup(async () => {
    const user = await User.create({
      username: 'testuser',
      email: 'testuser333@example.com',
      password: 'password123',
    })
    userId = user.id
  })

  test('should get all users', async ({ client, assert }) => {
    const response = await client.get('/users/user')
    response.assertStatus(200)
    assert.isArray(response.body())
  })

  test('should get a single user by id', async ({ client, assert }) => {
    const response = await client.get(`/users/user/${userId}`)
    response.assertStatus(200)
    assert.equal(response.body().id, userId)
  })

  test('should return 404 for a non-existing user id', async ({ client }) => {
    const response = await client.get('/users/user/999999')
    response.assertStatus(404)
  })

  test('should create a new user', async ({ client, assert }) => {
    const response = await client.post('/users/user').json({
      username: 'newuser',
      email: 'newuser@example.com',
      password: 'password123',
    })
    response.assertStatus(201)
    assert.equal(response.body().username, 'newuser')
  })

  test('should update an existing user', async ({ client, assert }) => {
    const response = await client.put(`/users/user/${userId}`).json({
      username: 'updateduser',
    })
    response.assertStatus(200)
    assert.equal(response.body().username, 'updateduser')
  })

  test('should return 404 for updating a non-existing user', async ({ client }) => {
    const response = await client.put('/users/user/999999').json({
      username: 'nonexistinguser',
    })
    response.assertStatus(404)
  })

  test('should delete an existing user', async ({ client }) => {
    const response = await client.delete(`/users/user/${userId}`)
    response.assertStatus(204)
  })

  test('should return 404 for deleting a non-existing user', async ({ client }) => {
    const response = await client.delete('/users/user/999999')
    response.assertStatus(404)
  })
})
