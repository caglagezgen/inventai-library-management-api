# Invent.ai Backend Case Study

- This is a library management api that helping to members to borrowing books my members.

## API Docs

- Api documentation is available at "link". You can query the server from here.

## Demo Link

## Description

## Api Features

- Listing users
- Accessing information about a user (name, books borrowed in the past with their user
  scores, and currently borrowed books)
- Creating a new user
- Listing books
- Accessing information about a book (name and average rating). Book viewing should be
  considered as a process much more frequent than borrowing and returning.
- Creating a new book
- Borrowing a book
- Returning a book and giving a rating.

## Database Schema

The application uses a PostgreSQL database with the following structure:

### User Table

Stores information about library users

- `id`: Primary key, auto-incrementing integer
- `name`: User's full name
- `createdAt`: Timestamp of when the user was created
- `updatedAt`: Timestamp of when the user was last updated

### Book Table

Contains all book details

- `id`: Primary key, auto-incrementing integer
- `name`: Book title
- `averageScore`: Calculated average rating from all borrowers (0.0-10.0)
- `totalScore`: Sum of all ratings given
- `ratingsCount`: Number of users who have rated the book
- `createdAt`: Timestamp of when the book was added to the library

### Borrowing Table

Tracks all book borrowing transactions

- `id`: Primary key, auto-incrementing integer
- `userId`: Foreign key reference to User
- `bookId`: Foreign key reference to Book
- `borrowedAt`: Timestamp when the book was borrowed
- `returnedAt`: Timestamp when the book was returned (null when still borrowed)
- `score`: Rating given by the user (1-10) when returning the book

## Entity Relationship Diagram

```
User 1 --- * Borrowing * --- 1 Book
```

## Developed with tools

- Package manager NPM
- Express Framework with Node.js
- PostreSQL with Prisma
- Validation with Joi
- Logger with Winston and Morgan
- Documentation with Swagger
- Test with supertest and jest
- Published with Heroku

## Getting Started

### Database Setup Options

1. **Using Prisma Migrations (recommended):**

   ```
   npx prisma migrate dev
   ```

2. **Using Raw SQL:**
   Execute the provided `schema.sql` file in your PostgreSQL instance:
   ```
   psql -U postgres -d library_management -f schema.sql
   ```

### Start the Application

Start the PostgreSQL container:
`docker-compose up -d`

Check the running container:
`docker ps`

Verify the database tables exist:
`docker exec -it library_postgres psql -U postgres -d library_management -c '\dt'`

Install dependencies:
`npm install`

Run the application in development mode:
`npm run dev`
