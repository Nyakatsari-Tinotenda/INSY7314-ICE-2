# Movies API — Structured Backend (INSY7314 ICE Task 2)

A structured Express backend API demonstrating routes, controllers, middleware,
input validation, controlled CORS, and a central error handler, using **movies**
as the sample resource.

## Project Structure

```
secure-mern-app/
└── api/
    ├── controllers/
    │   └── movieController.js
    ├── middleware/
    │   ├── errorHandler.js
    │   └── validateMovieInput.js
    ├── routes/
    │   └── movieRoutes.js
    ├── .env
    ├── .gitignore
    ├── index.js
    ├── package.json
    └── package-lock.json
```

## Setup & Run

```bash
cd secure-mern-app/api
npm install
npm start
```

Server runs at: `http://localhost:4000`

## Routes / Endpoints Tested in Postman

| Method | Endpoint                     | Description                          |
|--------|-------------------------------|---------------------------------------|
| GET    | `/`                           | Root route — welcome message          |
| GET    | `/health`                     | Health check — server status & uptime |
| GET    | `/api/movies`                 | Fetch all movies                      |
| GET    | `/api/movies/:id`             | Fetch a single movie by id (e.g. `m1`)|
| POST   | `/api/movies`                 | Add a new movie                       |

### 1. GET Root Route
`GET http://localhost:4000/`

### 2. GET Health Route
`GET http://localhost:4000/health`

### 3. GET All Movies
`GET http://localhost:4000/api/movies`

### 4. GET Movie by ID
`GET http://localhost:4000/api/movies/m1`

### 5. POST New Movie
`POST http://localhost:4000/api/movies`
Header: `Content-Type: application/json`

Note: `id` is generated automatically by the controller and must **not** be
included in the POST body. Allowed `genre` values: Action, Drama, Comedy,
Horror, Sci-Fi, Thriller, Documentary, Animation.

## Sample Request Bodies (POST /api/movies)

At least 5 new movies used for testing:

```json
{
  "title": "The Dark Knight",
  "director": "Christopher Nolan",
  "genre": "Action",
  "releaseYear": 2008,
  "rating": 9.0
}
```

```json
{
  "title": "Parasite",
  "director": "Bong Joon-ho",
  "genre": "Thriller",
  "releaseYear": 2019,
  "rating": 8.6
}
```

```json
{
  "title": "Interstellar",
  "director": "Christopher Nolan",
  "genre": "Sci-Fi",
  "releaseYear": 2014,
  "rating": 8.7
}
```

```json
{
  "title": "Whiplash",
  "director": "Damien Chazelle",
  "genre": "Drama",
  "releaseYear": 2014,
  "rating": 8.5
}
```

```json
{
  "title": "Get Out",
  "director": "Jordan Peele",
  "genre": "Horror",
  "releaseYear": 2017,
  "rating": 7.7
}
```

## Input Validation Checks (tested against POST /api/movies)

The `validateMovieInput` middleware rejects requests where:
- `title`, `director`, or `genre` is missing, not a string, or empty
- `releaseYear` or `rating` is missing or not a number
- `title` is not 1–100 characters, or `director` is not 2–60 characters
- `genre` is not one of the allowed values
- `releaseYear` is unrealistic (before 1888 or more than a year in the future)
- `rating` is outside the 0–10 range

Example invalid request bodies used for testing:

```json
{ "director": "Unknown Director", "genre": "Comedy", "releaseYear": 2021, "rating": 7 }
```
→ `400 { "error": "All fields are required" }`

```json
{ "title": "Some Movie", "director": "Some Director", "genre": "Romance", "releaseYear": 2021, "rating": 7 }
```
→ `400 { "error": "Genre must be one of: Action, Drama, Comedy, Horror, Sci-Fi, Thriller, Documentary, Animation" }`

```json
{ "title": "Some Movie", "director": "Some Director", "genre": "Action", "releaseYear": 2021, "rating": 15 }
```
→ `400 { "error": "Rating must be a number between 0 and 10" }`

Also test an invalid ID format and a non-existent ID on `GET /api/movies/:id`:
- `GET /api/movies/bad<script>` → `400 { "error": "Invalid movie ID format" }`
- `GET /api/movies/m999` → `404 { "error": "Movie not found" }`

## Security Headers & CORS

- **Helmet** applies a Content Security Policy and other security headers
  (`X-Content-Type-Options`, `Cross-Origin-Resource-Policy`, etc.).
- `x-powered-by` is disabled to avoid disclosing the tech stack.
- **CORS** is restricted to the single origin set in `CLIENT_ORIGIN` (`.env`) —
  not opened to all origins.
- Request bodies are capped at 10kb via `express.json({ limit: '10kb' })`.

## HTTPS (optional, disabled by default)

`USE_HTTPS=false` in `.env` runs the server over plain HTTP for this ICE task.
Setting it to `true` (and generating a self-signed cert into `./certs/`, as
covered in Learning Unit 2 Theme 2) switches the server to HTTPS.

## Error Handling

- `404` for unmatched routes: `{ "error": "Route not found" }`
- Validation errors respond directly from the middleware with `400` and a
  descriptive `{ "error": "..." }` message.
- Any unhandled/unexpected error is caught by the central error handler
  (`middleware/errorHandler.js`), which logs it server-side and returns a
  generic `500 { "error": "Something went wrong" }` — no stack traces or
  internal details are ever sent to the client.
