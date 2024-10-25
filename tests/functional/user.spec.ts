import { test } from '@japa/runner'

test.group('User', () => {
  test('Registering a user', async ({ client }) => {
    const response = await client.post('/auth/register').form({
      email: "test@example.com",
      password: "test@password"
    })
    
    response.assertStatus(201)
  })
})