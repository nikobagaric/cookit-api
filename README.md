# Cookit API

## Content

1. [Installation](#1-installation)

2. [Endpoints](#2-endpoints)

## 1. Installation

1. Ensure Git is installed

2. Download and install [Docker](https://www.docker.com/)

3. Download and install [Node.js](https://nodejs.org/en)

4. Clone the repository using a CLI
    ```bash
    git clone https://github.com/nikobagaric/cookit-api.git
    ```

5. Open the directory using `cd` in a CLI
    ```bash
    cd cookit-api
    ```

6. Copy the  file to  and configure your environment variables:
    ```bash
    cp .env.example .env
    ```

7. Install dependencies:
    ```bash
    npm i
    ```

8. Generate the application key:
    ```bash
    docker-compose run --rm cookit sh -c "node ace generate:key"
    ```

9. Build the Docker container:
    ```bash
    docker-compose build
    ```

10. Run the database migrations:
    ```bash
    docker-compose run --rm cookit sh -c "node ace migration:run"
    ```

11. (Optional) Seed the database with initial data:
    ```bash
    docker-compose run --rm cookit sh -c "node ace db:seed"
    ```

12. Boot the app:
    ```bash
    docker-compose up
    ```

13. Verify Docker containers are running:
    ```bash
    docker ps
    ```

14. Access the API documentation at:
    > http://localhost:3333/docs

## 2. Endpoints

### AUTH
Everything related to AUTH.

- **POST** `/auth/register` - Register
- **POST** `/auth/login` - Login
- **POST** `/auth/logout` - Logout
- **GET** `/auth/me` - Get current authenticated user (me)

---

### USERS
Everything related to USERS.

- **GET** `/users/user` - Get a list of users (index)
- **POST** `/users/user` - Create a new user (store)
- **GET** `/users/user/{id}` - Get a single user (show)
- **PUT** `/users/user/{id}` - Update user data (update)
- **DELETE** `/users/user/{id}` - Delete a user (destroy)
- **GET** `/users/user/{id}/favorite_recipes` - Get favorite recipes of a user
- **GET** `/users/user/{id}/activity_logs` - Get activity logs of a user
- **GET** `/users/user/{id}/follows` - Get followers of a user
- **POST** `/users/user/{id}/follow` - Follow a user
- **POST** `/users/user/{id}/unfollow` - Unfollow a user

---

### RECIPES
Everything related to RECIPES.

- **GET** `/recipes/recipe` - Get a list of recipes (index)
- **POST** `/recipes/recipe` - Create a new recipe (store)
- **GET** `/recipes/recipe/{id}` - Get a single recipe (show)
- **PUT** `/recipes/recipe/{id}` - Update a recipe (update)
- **DELETE** `/recipes/recipe/{id}` - Delete a recipe (destroy)
- **POST** `/recipes/recipe/{id}/favorite` - Favorite a recipe
- **POST** `/recipes/recipe/{id}/unfavorite` - Unfavorite a recipe

---

### RECIPE_STEPS
Everything related to RECIPE_STEPS.

- **GET** `/recipe-steps/recipe_step` - Get a list of recipe steps (index)
- **POST** `/recipe-steps/recipe_step` - Create a new recipe step (store)
- **GET** `/recipe-steps/recipe_step/{id}` - Get a single recipe step (show)
- **PUT** `/recipe-steps/recipe_step/{id}` - Update a recipe step (update)
- **DELETE** `/recipe-steps/recipe_step/{id}` - Delete a recipe step (destroy)

---

### ACTIVITY_LOGS
Everything related to ACTIVITY_LOGS.

- **GET** `/activity_logs/activity_log` - Get a list of activity logs (index)
- **POST** `/activity_logs/activity_log` - Create a new activity log (store)
- **GET** `/activity_logs/activity_log/{id}` - Get a single activity log (show)
- **PUT** `/activity_logs/activity_log/{id}` - Update an activity log (update)
- **DELETE** `/activity_logs/activity_log/{id}` - Delete an activity log (destroy)

---

### USER_PROFILES
Everything related to USER_PROFILES.

- **GET** `/user_profiles/user_profile` - Get a list of user profiles (index)
- **POST** `/user_profiles/user_profile` - Create a new user profile (store)
- **GET** `/user_profiles/user_profile/{id}` - Get a single user profile (show)
- **PUT** `/user_profiles/user_profile/{id}` - Update a user profile (update)
- **DELETE** `/user_profiles/user_profile/{id}` - Delete a user profile (destroy)

---

### LEADERBOARDS
Everything related to LEADERBOARDS.

- **GET** `/leaderboards/leaderboard` - Get the full leaderboard
- **PUT** `/leaderboards/leaderboard/{id}` - Update points for a single user
