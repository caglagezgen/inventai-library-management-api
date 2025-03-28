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

## Developed with tools
- Package manager NPM
- Express Framework with Node.js
- PostreSQL with Prisma
- Validation with Joi
- Logger with Winston and Morgan
- Documentation with Swagger
- Test with supertest and jest
- Published with Heroku


## Geting Started


Start the PostgreSQL container:
`docker-compose up -d`

Check the running container:
`docker ps`

Verify the database tables exist:
`docker exec -it library_postgres psql -U postgres -d library_management -c '\dt'`
