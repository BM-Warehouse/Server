# Gunakan image Node.js Alpine dari Docker Hub
FROM node:alpine

# Install pnpm dan nodemon
RUN npm install -g pnpm nodemon

# Set folder kerja di dalam container
WORKDIR /server

# Salin package.json dan pnpm
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY .env ./

# Install dependensi
RUN pnpm install

# Salin semua file proyek Anda ke dalam folder kerja di dalam container
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port yang akan digunakan oleh aplikasi
EXPOSE 5000

# Perintah untuk menjalankan aplikasi
CMD ["pnpm", "start"]
