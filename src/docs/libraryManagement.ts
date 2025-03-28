export default {
    // User endpoints
    "/users": {
        post: {
            tags: ["Users"],
            summary: "Create a new user",
            description: "Creates a new library user",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/UserCreateDto"
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: "User created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/User"
                            }
                        }
                    }
                },
                400: {
                    $ref: "#/components/responses/Error400"
                },
                500: {
                    $ref: "#/components/responses/Error500"
                }
            }
        },
        get: {
            tags: ["Users"],
            summary: "Get all users",
            description: "Retrieves a list of all library users",
            responses: {
                200: {
                    description: "A list of users",
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: {
                                    $ref: "#/components/schemas/User"
                                }
                            }
                        }
                    }
                },
                500: {
                    $ref: "#/components/responses/Error500"
                }
            }
        }
    },
    "/users/{id}": {
        get: {
            tags: ["Users"],
            summary: "Get user by ID",
            description: "Retrieves a specific user by their ID with borrowing history",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "integer"
                    },
                    description: "The user ID"
                }
            ],
            responses: {
                200: {
                    description: "User details with borrowing history",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/UserWithBorrowingHistory"
                            }
                        }
                    }
                },
                404: {
                    $ref: "#/components/responses/Error404"
                },
                500: {
                    $ref: "#/components/responses/Error500"
                }
            }
        }
    },
    "/users/{userId}/borrow/{bookId}": {
        post: {
            tags: ["Borrowings"],
            summary: "Borrow a book",
            description: "A user borrows a specific book from the library",
            parameters: [
                {
                    name: "userId",
                    in: "path",
                    required: true,
                    schema: {
                        type: "integer"
                    },
                    description: "The user ID"
                },
                {
                    name: "bookId",
                    in: "path",
                    required: true,
                    schema: {
                        type: "integer"
                    },
                    description: "The book ID"
                }
            ],
            responses: {
                204: {
                    description: "Book successfully borrowed"
                },
                400: {
                    $ref: "#/components/responses/Error400"
                },
                404: {
                    $ref: "#/components/responses/Error404"
                },
                500: {
                    $ref: "#/components/responses/Error500"
                }
            }
        }
    },
    "/users/{userId}/return/{bookId}": {
        post: {
            tags: ["Borrowings"],
            summary: "Return a book",
            description: "A user returns a borrowed book and gives it a rating",
            parameters: [
                {
                    name: "userId",
                    in: "path",
                    required: true,
                    schema: {
                        type: "integer"
                    },
                    description: "The user ID"
                },
                {
                    name: "bookId",
                    in: "path",
                    required: true,
                    schema: {
                        type: "integer"
                    },
                    description: "The book ID"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/ReturnBookDto"
                        }
                    }
                }
            },
            responses: {
                204: {
                    description: "Book successfully returned and rated"
                },
                400: {
                    $ref: "#/components/responses/Error400"
                },
                404: {
                    $ref: "#/components/responses/Error404"
                },
                500: {
                    $ref: "#/components/responses/Error500"
                }
            }
        }
    },

    // Book endpoints
    "/books": {
        post: {
            tags: ["Books"],
            summary: "Create a new book",
            description: "Adds a new book to the library",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/BookCreateDto"
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: "Book created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Book"
                            }
                        }
                    }
                },
                400: {
                    $ref: "#/components/responses/Error400"
                },
                500: {
                    $ref: "#/components/responses/Error500"
                }
            }
        },
        get: {
            tags: ["Books"],
            summary: "Get all books",
            description: "Retrieves a list of all books in the library",
            responses: {
                200: {
                    description: "A list of books",
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: {
                                    $ref: "#/components/schemas/Book"
                                }
                            }
                        }
                    }
                },
                500: {
                    $ref: "#/components/responses/Error500"
                }
            }
        }
    },
    "/books/{id}": {
        get: {
            tags: ["Books"],
            summary: "Get book by ID",
            description: "Retrieves a specific book by its ID with detailed information including rating",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "integer"
                    },
                    description: "The book ID"
                }
            ],
            responses: {
                200: {
                    description: "Book details with rating",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/BookDetailResponseDto"
                            }
                        }
                    }
                },
                404: {
                    $ref: "#/components/responses/Error404"
                },
                500: {
                    $ref: "#/components/responses/Error500"
                }
            }
        }
    },

    // Health check endpoint
    "/health": {
        get: {
            tags: ["System"],
            summary: "Health check",
            description: "Checks if the API is working properly",
            responses: {
                200: {
                    description: "API is healthy",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status: {
                                        type: "string",
                                        example: "ok"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
