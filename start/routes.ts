/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const AuthController = () => import('#controllers/auth_controller')

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

router.get('/', async () => {
  return { welcome: "cookit api indev, go to /swagger or /docs"}
})