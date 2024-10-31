import { test } from '@japa/runner'
import Recipe from '#models/recipe'
import mock from 'mock-fs'
import { faker } from '@faker-js/faker'

test.group('RecipesController', (group) => {
  let recipeId: number

  group.setup(async () => {
    mock({
      'fake-dir': {
        'valid-image.jpg': Buffer.from(
          faker.image.urlPlaceholder()
        ),
        'invalid-text.txt': faker.lorem.paragraph(),
      },
    })
  })

  group.each.setup(async () => {
    const recipe = await Recipe.create({
      title: 'Test Recipe',
      description: 'A test recipe description',
      difficulty: 3,
      ingredients: 'test ingredient 1, test ingredient 2',
    })
    recipeId = recipe.id
  })

  test('should get all recipes', async ({ client, assert }) => {
    const response = await client.get('/recipes/recipe')
    response.assertStatus(200)
    assert.isArray(response.body())
  })

  test('should get a single recipe by id', async ({ client, assert }) => {
    const response = await client.get(`/recipes/recipe/${recipeId}`)
    response.assertStatus(200)
    assert.equal(response.body().id, recipeId)
    assert.equal(response.body().title, 'Test Recipe')
  })

  test('should return 404 for a non-existing recipe id', async ({ client }) => {
    const response = await client.get('/recipes/recipe/999999')
    response.assertStatus(404)
  })

  test('should create a new recipe', async ({ client, assert }) => {
    const response = await client.post('/recipes/recipe').form({
      title: 'New Recipe',
      description: 'A new recipe description',
      difficulty: 2,
      ingredients: 'ingredient 1, ingredient 2',
    })
    response.assertStatus(201)
    assert.equal(response.body().title, 'New Recipe')
  })

  test('should return 400 for invalid image file during create', async ({ client }) => {
    const response = await client
      .post('/recipes/recipe')
      .field('title', 'Invalid Image Recipe')
      .field('description', 'Description with invalid image')
      .field('difficulty', 2)
      .field('ingredients', 'ingredient 1')
      .file('image', 'fake-dir/invalid-text.txt') // Test invalid file
    response.assertStatus(400)
    response.assertBodyContains({ error: 'invalid image file' })
  })

  test('should update an existing recipe', async ({ client, assert }) => {
    const response = await client.put(`/recipes/recipe/${recipeId}`).form({
      title: 'Updated Recipe',
      description: 'An updated recipe description',
      difficulty: 4,
    })
    response.assertStatus(200)
    assert.equal(response.body().title, 'Updated Recipe')
  })

  test('should return 404 for updating a non-existing recipe', async ({ client }) => {
    const response = await client.put('/recipes/recipe/999999').form({
      title: 'Non-existing Recipe',
      description: 'Should fail',
      difficulty: 1,
    })
    response.assertStatus(404)
  })

  test('should delete an existing recipe', async ({ client }) => {
    const response = await client.delete(`/recipes/recipe/${recipeId}`)
    response.assertStatus(204)
  })

  test('should return 404 for deleting a non-existing recipe', async ({ client }) => {
    const response = await client.delete('/recipes/recipe/999999')
    response.assertStatus(404)
  })
})
