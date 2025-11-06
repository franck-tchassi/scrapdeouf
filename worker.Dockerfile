# worker.Dockerfile

FROM mcr.microsoft.com/playwright:focal

WORKDIR /app

# Copy package files first for caching
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies and generate Prisma client
RUN npm ci && npx prisma generate

# Install Playwright browsers
RUN npx playwright install chromium

# Copy source
COPY . .

ENV NODE_ENV=production

# Build if using TypeScript compilation
# RUN npm run build

CMD ["node", "--loader", "ts-node/esm", "src/worker.ts"]
