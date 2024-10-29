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

import router from '@adonisjs/core/services/router'

// Auto-swagger import:
import AutoSwagger from "adonis-autoswagger";
import swagger from "#config/swagger";


router.get("/swagger", async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})

router.get("/docs", async () => {
  return AutoSwagger.default.ui("/swagger", swagger)
})


router.group(() => {
  router.post('/register', [AuthController, 'register'])
  router.post('/login', [AuthController, 'login'])
  router.post('/logout', [AuthController, 'logout'])
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

router.get('/', async () => {
  return { welcome: "cookit api indev, go to /swagger or /docs"}
})