# Library Management API

A RESTful API built with Node.js, Express, and PostgreSQL that helps manage a library system where users can borrow books, return them, and provide ratings.

## Project Overview

This Library Management API enables library members to:

- Create user accounts
- Browse available books
- Borrow books
- Return books with ratings
- View borrowing history and book ratings

The system automatically calculates average book ratings based on user reviews and maintains a complete borrowing history.

## Running the Application

### Prerequisites

- Node.js (v22+)
- npm (v10+)
- PostgreSQL (v17+)

### Environment Setup

1. Clone the repository:

   ```
   git clone https://github.com/caglagezgen/inventai-library-management-api.git
   cd inventai-library-management-api
   ```

2. Use the correct Node.js version:

   ```
   nvm use
   ```

   This will use the Node.js version specified in the `.nvmrc` file.

3. Install dependencies:

   ```
   npm install
   ```

4. Create a `.env` file in the project root with the following content:
   ```
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/library_management"
   PORT=3000
   ```
   Replace `your_password` with your PostgreSQL password.

### Database Setup

1. **Start the PostgreSQL database**

   If using Docker:

   ```
   docker-compose up -d
   ```

   If using a local PostgreSQL 17 installation, ensure it's running.

2. **Initialize the database schema**

   Using Prisma migrations (recommended):

   ```
   npm run db:migrate
   ```

3. **Seed the database with sample data**:
   ```
   npm run db:seed
   ```

### Running the Application

1. **Development mode** (with hot reload):

   ```
   npm run dev
   ```

2. **Production mode**:

   ```
   npm run build
   npm start
   ```

3. Access the application:
   - API: [http://localhost:3000](http://localhost:3000)
   - API Documentation: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
   - Health check: [http://localhost:3000/health](http://localhost:3000/health)

## API Documentation

API documentation is available via Swagger UI at `/api-docs` when running the application. This interactive documentation allows you to:

- View all available endpoints
- Test the API directly from the documentation
- See request/response samples and schemas

## Tech Stack

- **Backend**: Node.js with Express
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod schema validation
- **Documentation**: Swagger UI Express
- **Logging**: Winston
- **Testing**: Vitest
- **Code Quality**: ESLint, Prettier, Husky for pre-commit hooks

## API Features

- Listing users
- Accessing information about a user (name, books borrowed in the past with their user scores, and currently borrowed books)
- Creating a new user
- Listing books
- Accessing information about a book (name and average rating)
- Creating a new book
- Borrowing a book
- Returning a book and giving a rating

## Testing

Run unit tests:

```
npm run test:run
```

Run tests in watch mode:

```
npm test
```

View code coverage:

```
npm run coverage
```

## Useful Scripts

- `npm run db:reset`: Reset the database (deletes all data and recreates tables)
- `npm run db:refresh`: Reset the database and seed it with fresh data
- `npm run lint`: Check code for linting issues
- `npm run lint:fix`: Fix linting issues
- `npm run format`: Format code with Prettier
- `npm run type-check`: Verify TypeScript types

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

## License

This project is licensed under the MIT License - see the LICENSE file for details.
