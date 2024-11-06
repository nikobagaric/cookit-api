/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const AuthController = () => import('#controllers/auth_controller')
const UsersController = () => import('#controllers/users_controller')
const RecipesController = () => import('#controllers/recipes_controller')
const ActivityLogsController = () => import('#controllers/activity_logs_controller')
const UserProfilesController = () => import('#controllers/user_profiles_controller')

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js';

// Auto-swagger import:
import AutoSwagger from "adonis-autoswagger";
import swagger from "#config/swagger";


router.get("/swagger", async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})

router.get("/docs", async () => {
  return AutoSwagger.default.ui("/swagger", swagger)
})

// bad naming scheme?

router.group(() => {
  router.post('/register', [AuthController, 'register'])
  router.post('/login', [AuthController, 'login'])
  router.post('/logout', [AuthController, 'logout']).use(middleware.auth())
  router.get('/me', [AuthController, 'me']).use(middleware.auth())
}).prefix('auth')


router.group(() => {
  router.get('/user', [UsersController, 'index'])
  router.get('/user/:id', [UsersController, 'show'])
  router.post('/user', [UsersController, 'store'])
  router.put('/user/:id', [UsersController, 'update'])
  router.delete('/user/:id', [UsersController, 'destroy'])
}).prefix('users')

router.group(() => {
  router.get('/recipe', [RecipesController, 'index'])
  router.get('/recipe/:id', [RecipesController, 'show'])
  router.post('/recipe', [RecipesController, 'store'])
  router.put('/recipe/:id', [RecipesController, 'update'])
  router.delete('/recipe/:id', [RecipesController, 'destroy'])
}).prefix('recipes')

router.group(() => {
  router.get('/activity_log', [ActivityLogsController, 'index'])
  router.get('/activity_log/:id', [ActivityLogsController, 'show'])
  router.post('/activity_log', [ActivityLogsController, 'store'])
  router.put('/activity_log/:id', [ActivityLogsController, 'update'])
  router.delete('/activity_log/:id', [ActivityLogsController, 'destroy'])
}).prefix('activity_logs')

router.group(() => {
  router.get('/user_profile', [UserProfilesController, 'index'])
  router.get('/user_profile/:id', [UserProfilesController, 'show'])
  router.post('/user_profile', [UserProfilesController, 'store'])
  router.put('/user_profile/:id', [UserProfilesController, 'update'])
  router.delete('/user_profile/:id', [UserProfilesController, 'destroy'])
}).prefix('user_profiles')

router.get('/', async () => {
  return { welcome: "cookit api v.indev, go to /swagger or /docs"}
})