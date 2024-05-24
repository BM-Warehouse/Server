
---

# BM-Warehouse Server

[![Deploy to Cloud with Docker Image](https://github.com/BM-Warehouse/Server/actions/workflows/deploy.yml/badge.svg)](https://github.com/BM-Warehouse/Server/actions/workflows/deploy.yml)
[![Check Linter and Unit Tests](https://github.com/BM-Warehouse/Server/actions/workflows/lintCheck.yml/badge.svg)](https://github.com/BM-Warehouse/Server/actions/workflows/lintCheck.yml)
[![Testing with Jest](https://github.com/BM-Warehouse/Server/actions/workflows/test.yml/badge.svg)](https://github.com/BM-Warehouse/Server/actions/workflows/test.yml)

## 🚀 Getting Started

Follow these steps to get the project up and running on your local machine:

### Prerequisites

- Ensure you have `Node.js v20.10.0` installed.
- Ensure you have `pnpm` installed.

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/BM-Warehouse/Server.git
   cd Server
   ```

2. **Duplicate and Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   Make necessary changes in the `.env` file.

3. **Install Dependencies**
   ```bash
   pnpm install
   ```

4. **Set Up Husky**
   ```bash
   pnpm prepare:husky
   ```

5. **Run Database Migrations**
   ```bash
   pnpm prisma:migrate
   ```

6. **Start the Server**
   ```bash
   pnpm start
   ```

### Viewing the Database

To explore the database, run:
```bash
pnpm prisma studio
```

---

## 🛠️ Available Scripts

Here are some useful scripts you can run:

- **Install Dependencies**
  ```bash
  pnpm install
  ```

- **Prepare Husky for Git Hooks**
  ```bash
  pnpm prepare:husky
  ```

- **Run Database Migrations**
  ```bash
  pnpm prisma:migrate
  ```

- **Start the Development Server**
  ```bash
  pnpm start
  ```

- **Run Linter and Unit Tests**
  ```bash
  pnpm lint
  pnpm test
  ```

- **Open Prisma Studio**
  ```bash
  pnpm prisma studio
  ```

---

## 📂 Project Structure

A brief overview of the project structure:

- **`/src`**: Contains the source code.
- **`/prisma`**: Contains Prisma schema and migrations.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

## 🌟 Contributing

Contributions are welcome! Please check out the [contributing guidelines](CONTRIBUTING.md) to get started.

---

For more details, check out our [documentation](https://documenter.getpostman.com/view/34576379/2sA3QpDZxC#00792c4c-1340-4ae8-99f6-1c0dc712d148).

---

Happy coding! 🚀

---
