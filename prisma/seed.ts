import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting to seed the database...');

    // Create users
    const users = await Promise.all([
        prisma.user.create({
            data: { name: 'John Doe', updatedAt: new Date() },
        }),
        prisma.user.create({
            data: { name: 'Jane Smith', updatedAt: new Date() },
        }),
        prisma.user.create({
            data: { name: 'Robert Johnson', updatedAt: new Date() },
        }),
        prisma.user.create({
            data: { name: 'Emily Davis', updatedAt: new Date() },
        }),
        prisma.user.create({
            data: { name: 'Michael Wilson', updatedAt: new Date() },
        }),
        // 10 more users
        prisma.user.create({
            data: { name: 'Sarah Thompson', updatedAt: new Date() },
        }),
        prisma.user.create({
            data: { name: 'David Martinez', updatedAt: new Date() },
        }),
        prisma.user.create({
            data: { name: 'Jessica Lee', updatedAt: new Date() },
        }),
        prisma.user.create({
            data: { name: 'William Brown', updatedAt: new Date() },
        }),
        prisma.user.create({
            data: { name: 'Olivia Taylor', updatedAt: new Date() },
        }),
        prisma.user.create({
            data: { name: 'James Anderson', updatedAt: new Date() },
        }),
        prisma.user.create({
            data: { name: 'Sophia Garcia', updatedAt: new Date() },
        }),
        prisma.user.create({
            data: { name: 'Daniel Rodriguez', updatedAt: new Date() },
        }),
        prisma.user.create({
            data: { name: 'Emma Martinez', updatedAt: new Date() },
        }),
        prisma.user.create({
            data: { name: 'Alexander White', updatedAt: new Date() },
        }),
    ]);

    console.log(`Created ${users.length} users`);

    // Create books
    const books = await Promise.all([
        prisma.book.create({
            data: { name: 'The Great Gatsby' },
        }),
        prisma.book.create({
            data: { name: '1984' },
        }),
        prisma.book.create({
            data: { name: 'To Kill a Mockingbird' },
        }),
        prisma.book.create({
            data: { name: 'The Catcher in the Rye' },
        }),
        prisma.book.create({
            data: { name: 'Pride and Prejudice' },
        }),
        // 10 more books
        prisma.book.create({
            data: { name: 'Lord of the Rings' },
        }),
        prisma.book.create({
            data: { name: 'Harry Potter and the Philosopher\'s Stone' },
        }),
        prisma.book.create({
            data: { name: 'The Hobbit' },
        }),
        prisma.book.create({
            data: { name: 'Brave New World' },
        }),
        prisma.book.create({
            data: { name: 'The Alchemist' },
        }),
        prisma.book.create({
            data: { name: 'Crime and Punishment' },
        }),
        prisma.book.create({
            data: { name: 'The Odyssey' },
        }),
        prisma.book.create({
            data: { name: 'Moby Dick' },
        }),
        prisma.book.create({
            data: { name: 'War and Peace' },
        }),
        prisma.book.create({
            data: { name: 'Don Quixote' },
        }),
    ]);

    console.log(`Created ${books.length} books`);

    // Create borrowings (some returned with ratings, some still active)
    const borrowings = await Promise.all([
        // Returned borrowings with ratings
        prisma.borrowing.create({
            data: {
                userId: users[0].id,
                bookId: books[0].id,
                borrowedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
                returnedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
                score: 8,
            },
        }),
        prisma.borrowing.create({
            data: {
                userId: users[1].id,
                bookId: books[1].id,
                borrowedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
                returnedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
                score: 7,
            },
        }),
        prisma.borrowing.create({
            data: {
                userId: users[2].id,
                bookId: books[2].id,
                borrowedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
                returnedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
                score: 9,
            },
        }),
        prisma.borrowing.create({
            data: {
                userId: users[0].id,
                bookId: books[1].id,
                borrowedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
                returnedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
                score: 6,
            },
        }),
        prisma.borrowing.create({
            data: {
                userId: users[1].id,
                bookId: books[0].id,
                borrowedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
                returnedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                score: 8,
            },
        }),

        // Active borrowings (not yet returned)
        prisma.borrowing.create({
            data: {
                userId: users[3].id,
                bookId: books[3].id,
                borrowedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            },
        }),
        prisma.borrowing.create({
            data: {
                userId: users[4].id,
                bookId: books[4].id,
                borrowedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            },
        }),

        // 20 more borrowings - mix of returned with ratings and active
        // Returned with ratings
        prisma.borrowing.create({
            data: {
                userId: users[5].id,
                bookId: books[5].id,
                borrowedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
                returnedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                score: 9,
            },
        }),
        prisma.borrowing.create({
            data: {
                userId: users[6].id,
                bookId: books[6].id,
                borrowedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
                returnedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
                score: 10,
            },
        }),
        prisma.borrowing.create({
            data: {
                userId: users[7].id,
                bookId: books[7].id,
                borrowedAt: new Date(Date.now() - 33 * 24 * 60 * 60 * 1000),
                returnedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
                score: 7,
            },
        }),
        prisma.borrowing.create({
            data: {
                userId: users[8].id,
                bookId: books[8].id,
                borrowedAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
                returnedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
                score: 8,
            },
        }),
        prisma.borrowing.create({
            data: {
                userId: users[9].id,
                bookId: books[9].id,
                borrowedAt: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000),
                returnedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
                score: 6,
            },
        }),
        prisma.borrowing.create({
            data: {
                userId: users[10].id,
                bookId: books[10].id,
                borrowedAt: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000),
                returnedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
                score: 9,
            },
        }),
        prisma.borrowing.create({
            data: {
                userId: users[11].id,
                bookId: books[11].id,
                borrowedAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000),
                returnedAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000),
                score: 8,
            },
        }),
        prisma.borrowing.create({
            data: {
                userId: users[0].id,
                bookId: books[12].id,
                borrowedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
                returnedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
                score: 7,
            },
        }),
        prisma.borrowing.create({
            data: {
                userId: users[1].id,
                bookId: books[13].id,
                borrowedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
                returnedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
                score: 6,
            },
        }),
        prisma.borrowing.create({
            data: {
                userId: users[2].id,
                bookId: books[14].id,
                borrowedAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000),
                returnedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
                score: 8,
            },
        }),

        // Active borrowings
        prisma.borrowing.create({
            data: {
                userId: users[12].id,
                bookId: books[0].id,
                borrowedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
        }),
        prisma.borrowing.create({
            data: {
                userId: users[13].id,
                bookId: books[1].id,
                borrowedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
            },
        }),
        prisma.borrowing.create({
            data: {
                userId: users[14].id,
                bookId: books[2].id,
                borrowedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            },
        }),
        prisma.borrowing.create({
            data: {
                userId: users[5].id,
                bookId: books[3].id,
                borrowedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            },
        }),
        prisma.borrowing.create({
            data: {
                userId: users[6].id,
                bookId: books[4].id,
                borrowedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            },
        }),
        prisma.borrowing.create({
            data: {
                userId: users[7].id,
                bookId: books[6].id,
                borrowedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            },
        }),
        prisma.borrowing.create({
            data: {
                userId: users[8].id,
                bookId: books[8].id,
                borrowedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            },
        }),
        prisma.borrowing.create({
            data: {
                userId: users[9].id,
                bookId: books[10].id,
                borrowedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
            },
        }),
        prisma.borrowing.create({
            data: {
                userId: users[10].id,
                bookId: books[12].id,
                borrowedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
            },
        }),
        prisma.borrowing.create({
            data: {
                userId: users[11].id,
                bookId: books[14].id,
                borrowedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            },
        }),
    ]);

    console.log(`Created ${borrowings.length} borrowings`);

    // Update book scores based on the borrowing ratings
    // This would typically be handled by the application logic when books are returned
    // Here we're manually updating the scores for seed data
    const bookScores = await Promise.all([
        // Original book score updates
        // Book 0: Ratings [8, 8] = Avg 8, Total 16, Count 2
        prisma.book.update({
            where: { id: books[0].id },
            data: {
                totalScore: 16,
                ratingsCount: 2,
                averageScore: 8.0,
            },
        }),
        // Book 1: Ratings [7, 6] = Avg 6.5, Total 13, Count 2
        prisma.book.update({
            where: { id: books[1].id },
            data: {
                totalScore: 13,
                ratingsCount: 2,
                averageScore: 6.5,
            },
        }),
        // Book 2: Ratings [9] = Avg 9, Total 9, Count 1
        prisma.book.update({
            where: { id: books[2].id },
            data: {
                totalScore: 9,
                ratingsCount: 1,
                averageScore: 9.0,
            },
        }),

        // New book score updates
        // Book 5: Ratings [9] = Avg 9, Total 9, Count 1
        prisma.book.update({
            where: { id: books[5].id },
            data: {
                totalScore: 9,
                ratingsCount: 1,
                averageScore: 9.0,
            },
        }),
        // Book 6: Ratings [10] = Avg 10, Total 10, Count 1
        prisma.book.update({
            where: { id: books[6].id },
            data: {
                totalScore: 10,
                ratingsCount: 1,
                averageScore: 10.0,
            },
        }),
        // Book 7: Ratings [7] = Avg 7, Total 7, Count 1
        prisma.book.update({
            where: { id: books[7].id },
            data: {
                totalScore: 7,
                ratingsCount: 1,
                averageScore: 7.0,
            },
        }),
        // Book 8: Ratings [8] = Avg 8, Total 8, Count 1
        prisma.book.update({
            where: { id: books[8].id },
            data: {
                totalScore: 8,
                ratingsCount: 1,
                averageScore: 8.0,
            },
        }),
        // Book 9: Ratings [6] = Avg 6, Total 6, Count 1
        prisma.book.update({
            where: { id: books[9].id },
            data: {
                totalScore: 6,
                ratingsCount: 1,
                averageScore: 6.0,
            },
        }),
        // Book 10: Ratings [9] = Avg 9, Total 9, Count 1
        prisma.book.update({
            where: { id: books[10].id },
            data: {
                totalScore: 9,
                ratingsCount: 1,
                averageScore: 9.0,
            },
        }),
        // Book 11: Ratings [8] = Avg 8, Total 8, Count 1
        prisma.book.update({
            where: { id: books[11].id },
            data: {
                totalScore: 8,
                ratingsCount: 1,
                averageScore: 8.0,
            },
        }),
        // Book 12: Ratings [7] = Avg 7, Total 7, Count 1
        prisma.book.update({
            where: { id: books[12].id },
            data: {
                totalScore: 7,
                ratingsCount: 1,
                averageScore: 7.0,
            },
        }),
        // Book 13: Ratings [6] = Avg 6, Total 6, Count 1
        prisma.book.update({
            where: { id: books[13].id },
            data: {
                totalScore: 6,
                ratingsCount: 1,
                averageScore: 6.0,
            },
        }),
        // Book 14: Ratings [8] = Avg 8, Total 8, Count 1
        prisma.book.update({
            where: { id: books[14].id },
            data: {
                totalScore: 8,
                ratingsCount: 1,
                averageScore: 8.0,
            },
        }),
    ]);

    console.log(`Updated scores for ${bookScores.length} books`);
    console.log('Seeding completed successfully!');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error('Error during seeding:', e);
        await prisma.$disconnect();
        process.exit(1);
    });
