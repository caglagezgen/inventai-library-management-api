import { Book as PrismaBook } from '@prisma/client';

export type Book = PrismaBook;

export interface BookCreateDto {
    name: string;
}

export interface BookResponseDto {
    id: number;
    name: string;
}

export interface BookDetailResponseDto {
    id: number;
    name: string;
    score: number | string;
}