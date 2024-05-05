## How to run in your local machine

1. Clone the repository
2. Make sure you have `Node.js v20.10.0` installed
3. Make sure you have `pnpm` installed
4. Duplicate `.env.example` file into `.env` and make changes accordingly
5. Run `pnpm install` in project directory to install all the dependencies
6. Run `pnpm prepare:husky`
7. Run `pnpm prisma:migrate`
8. Run `pnpm prisma:seed` for seeding the database with dummy data
9. Run `pnpm start` to start the website in your local machine

## How to see database

You can run the following command to see the database in your local machine

```bash
pnpm prisma studio
```
