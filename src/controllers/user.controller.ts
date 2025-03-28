import { Request, Response } from 'express';
import { UserCreateDto } from '#models/user.model.js';
import { UserService } from '#services/user.service.js';
import { AppError } from '#utils/app-error.js';


export class UserController {
    constructor(private userService: UserService) { }

    createUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const userData: UserCreateDto = req.body;
            const newUser = await this.userService.createUser(userData);
            res.status(201).json(newUser);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    getUsers = async (_req: Request, res: Response): Promise<void> => {
        try {
            const users = await this.userService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    getUserById = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = Number(req.params.id);
            const user = await this.userService.getUserById(userId);
            res.status(200).json(user);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    private handleError(error: unknown, res: Response): void {
        console.error('Error in UserController:', error);

        if (error instanceof AppError) {
            res.status(error.statusCode).json({ status: 'error', message: error.message });
            return;
        }

        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
}