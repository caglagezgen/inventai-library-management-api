export default {
    components: {
        schemas: {
            User: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'The auto-generated id of the user'
                    },
                    name: {
                        type: 'string',
                        description: 'The name of the user'
                    }
                },
                example: {
                    id: 1,
                    name: 'John Doe'
                }
            },
            UserCreateDto: {
                type: 'object',
                required: ['name'],
                properties: {
                    name: {
                        type: 'string',
                        description: 'The name of the user'
                    }
                },
                example: {
                    name: 'John Doe'
                }
            },
            UserWithBorrowingHistory: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'The auto-generated id of the user'
                    },
                    name: {
                        type: 'string',
                        description: 'The name of the user'
                    },
                    books: {
                        type: 'object',
                        properties: {
                            past: {
                                type: 'array',
                                items: {
                                    $ref: '#/components/schemas/PastBorrowing'
                                }
                            },
                            present: {
                                type: 'array',
                                items: {
                                    $ref: '#/components/schemas/PresentBorrowing'
                                }
                            }
                        }
                    }
                }
            },
            PastBorrowing: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        description: 'The name of the book'
                    },
                    userScore: {
                        type: 'integer',
                        nullable: true,
                        description: 'The score given by the user'
                    }
                }
            },
            PresentBorrowing: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        description: 'The name of the book'
                    }
                }
            },
            Book: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'The auto-generated id of the book'
                    },
                    name: {
                        type: 'string',
                        description: 'The name of the book'
                    }
                }
            },
            BookCreateDto: {
                type: 'object',
                required: ['name'],
                properties: {
                    name: {
                        type: 'string',
                        description: 'The name of the book'
                    }
                },
                example: {
                    name: 'The Great Gatsby'
                }
            },
            BookDetailResponseDto: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'The auto-generated id of the book'
                    },
                    name: {
                        type: 'string',
                        description: 'The name of the book'
                    },
                    score: {
                        oneOf: [
                            {
                                type: 'integer',
                                description: 'The average score of the book (-1 if no ratings)'
                            },
                            {
                                type: 'string',
                                description: 'The average score of the book as a formatted string'
                            }
                        ]
                    }
                }
            },
            ReturnBookDto: {
                type: 'object',
                required: ['score'],
                properties: {
                    score: {
                        type: 'integer',
                        minimum: 1,
                        maximum: 10,
                        description: 'The score given by the user (1-10)'
                    }
                },
                example: {
                    score: 8
                }
            },
            Error: {
                type: 'object',
                properties: {
                    status: {
                        type: 'string',
                        description: 'Error status',
                        example: 'error'
                    },
                    message: {
                        type: 'string',
                        description: 'Error message',
                        example: 'Book not found'
                    }
                }
            }
        },
        responses: {
            Error400: {
                description: 'Bad Request',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/Error'
                        }
                    }
                }
            },
            Error404: {
                description: 'Not Found',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/Error'
                        }
                    }
                }
            },
            Error500: {
                description: 'Internal Server Error',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/Error'
                        }
                    }
                }
            }
        }
    }
}
