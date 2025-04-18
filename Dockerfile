# 1. Use official Node.js image as the base
FROM node:20-alpine AS deps

# 2. Set working directory
WORKDIR /app

# 3. Install pnpm
RUN corepack enable && corepack prepare pnpm@9.1.1 --activate

# 4. Copy package files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 5. Copy the rest of the app
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 6. Build the Next.js app
RUN pnpm build

# 7. Production image, copy only necessary files
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# If you use Next.js image optimization, install sharp
RUN apk add --no-cache libc6-compat

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.* ./ # for .js, .ts, .mjs

EXPOSE 3000

CMD ["pnpm", "start"]