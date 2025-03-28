import { UserCreateDto, UserWithBorrowingHistory, User } from '#models/user.model.js';
import { UserRepository } from '#repositories/user.repository.js';


export class UserService {
    constructor(private userRepository: UserRepository) { }

    async createUser(userData: UserCreateDto): Promise<User> {
        return this.userRepository.create(userData);
    }

    async getAllUsers(): Promise<User[]> {
        return this.userRepository.findAll();
    }

    async getUserById(id: number): Promise<UserWithBorrowingHistory | null> {
        const userWithBorrowings = await this.userRepository.findByIdWithBorrowings(id);

        if (!userWithBorrowings) {
            return null;
        }

        const past = userWithBorrowings.borrowings
            .filter((borrow) => borrow.returnedAt !== null)
            .map((borrow) => ({
                name: borrow.book.name,
                userScore: borrow.score,
            }));

        const present = userWithBorrowings.borrowings
            .filter((borrow) => borrow.returnedAt === null)
            .map((borrow) => ({
                name: borrow.book.name,
            }));

        return {
            id: userWithBorrowings.id,
            name: userWithBorrowings.name,
            books: {
                past: past,
                present: present,
            },
        };
    }
}