FROM mcr.microsoft.com/playwright:focal

WORKDIR /app

# Copy package files first for caching
COPY package.json package-lock.json* ./

# Install all dependencies (we need ts-node & playwright in the container)
RUN npm ci

# Copy source
COPY . .

ENV NODE_ENV=production

# If you prefer to run a compiled worker, replace the CMD by the compiled file path
CMD ["node", "--loader", "ts-node/esm", "src/worker.ts"]
