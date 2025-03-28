import { UserCreateDto, UserWithBorrowings, User } from '#models/user.model.js';
import { PrismaClient } from '@prisma/client';

export class UserRepository {
    constructor(private prisma: PrismaClient) { }

    async create(userData: UserCreateDto): Promise<User> {
        return this.prisma.user.create({
            data: userData,
            select: {
                id: true,
                name: true,

            }
        });
    }

    async findAll(): Promise<User[]> {
        return this.prisma.user.findMany({
            select: {
                id: true,
                name: true,
            }
        });
    }

    async findById(id: number): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async findByIdWithBorrowings(id: number): Promise<UserWithBorrowings | null> {
        return this.prisma.user.findUnique({
            where: { id },
            include: {
                borrowings: {
                    include: {
                        book: true,
                    },
                },
            },
        }) as Promise<UserWithBorrowings | null>;
    }
}