/*
|--------------------------------------------------------------------------
| Routes File
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes with clear naming conventions.
|
*/

const AuthController = () => import('#controllers/auth_controller')
const UsersController = () => import('#controllers/users_controller')
const RecipesController = () => import('#controllers/recipes_controller')
const ActivityLogsController = () => import('#controllers/activity_logs_controller')
const UserProfilesController = () => import('#controllers/user_profiles_controller')
const LeaderboardsController = () => import('#controllers/leaderboards_controller')
const TagsController = () => import('#controllers/tags_controller')

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

// Auto-swagger import:
import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'


router.get('/swagger', async () => AutoSwagger.default.docs(router.toJSON(), swagger))
router.get('/docs', async () => AutoSwagger.default.ui('/swagger', swagger))

// Auth routes
router
  .group(() => {
    router.post('/register', [AuthController, 'register'])
    router.post('/login', [AuthController, 'login'])
    router.post('/logout', [AuthController, 'logout']).use(middleware.auth())
    router.get('/me', [AuthController, 'me']).use(middleware.auth())
  })
  .prefix('auth')

// User routes
router
  .group(() => {
    router.get('/', [UsersController, 'index'])
    router.get('/:id', [UsersController, 'show'])
    router.post('/', [UsersController, 'store'])
    router.put('/:id', [UsersController, 'update'])
    router.delete('/:id', [UsersController, 'destroy'])

    router.get('/:id/favorite-recipes', [UsersController, 'getFavoriteRecipes'])
    router.get('/:id/activity-logs', [UsersController, 'getActivityLogs'])
    router.get('/:id/follows', [UsersController, 'getFollowers'])
    router.post('/:id/follow', [UsersController, 'followUser']).use(middleware.auth())
    router.post('/:id/unfollow', [UsersController, 'unfollowUser']).use(middleware.auth())
  })
  .prefix('users')

// Recipe routes
router
  .group(() => {
    router.get('/', [RecipesController, 'index'])
    router.get('/:id', [RecipesController, 'show'])
    router.post('/', [RecipesController, 'store'])
    router.put('/:id', [RecipesController, 'update'])
    router.delete('/:id', [RecipesController, 'destroy'])
    router.post('/:id/favorite', [RecipesController, 'favoriteRecipe']).use(middleware.auth())
    router.post('/:id/unfavorite', [RecipesController, 'unfavoriteRecipe']).use(middleware.auth())
    router.get('/search', [RecipesController, 'searchRecipe'])
  })
  .prefix('recipes')

// Activity log routes
router
  .group(() => {
    router.get('/', [ActivityLogsController, 'index'])
    router.get('/:id', [ActivityLogsController, 'show'])
    router.post('/', [ActivityLogsController, 'store'])
    router.put('/:id', [ActivityLogsController, 'update'])
    router.delete('/:id', [ActivityLogsController, 'destroy'])
  })
  .prefix('activity-logs')

// User profile routes
router
  .group(() => {
    router.get('/', [UserProfilesController, 'index'])
    router.get('/:id', [UserProfilesController, 'show'])
    router.post('/', [UserProfilesController, 'store'])
    router.put('/:id', [UserProfilesController, 'update'])
    router.delete('/:id', [UserProfilesController, 'destroy'])
  })
  .prefix('user-profiles')

// Leaderboard routes
router
  .group(() => {
    router.get('/', [LeaderboardsController, 'getFullLeaderboard'])
    router.put('/:id', [LeaderboardsController, 'updateOneUserPoints'])
  })
  .prefix('leaderboards')

router
  .group(() => {
    router.get('/', [TagsController, 'index'])
    router.get('/:id', [TagsController, 'show'])
    router.post('/', [TagsController, 'store'])
    router.put('/:id', [TagsController, 'update'])
    router.delete('/:id', [TagsController, 'destroy'])
  })
  .prefix('tags')

// Root route
router.get('/', async () => {
  return { welcome: 'cookit API v.indev. Visit /swagger or /docs for details.' }
})
