FROM node:20.18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

RUN mkdir -p /tmp/drizzle-kit-modules \
  && cp -r node_modules/drizzle-kit /tmp/drizzle-kit-modules/ \
  && cp -r node_modules/@drizzle-team /tmp/drizzle-kit-modules/ \
  && cp -r node_modules/@esbuild-kit /tmp/drizzle-kit-modules/ \
  && cp -r node_modules/@esbuild /tmp/drizzle-kit-modules/ \
  && cp -r node_modules/esbuild /tmp/drizzle-kit-modules/ \
  && cp -r node_modules/tsx /tmp/drizzle-kit-modules/

FROM node:20.18-alpine AS production

ENV NODE_ENV=production
ENV PORT=3333

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 -G nodejs nodejs

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /tmp/drizzle-kit-modules/ ./node_modules/

COPY drizzle.config.ts ./
COPY drizzle ./drizzle
COPY src/db/schema.ts ./src/db/schema.ts
COPY docker-entrypoint.sh ./
RUN sed -i 's/\r$//' docker-entrypoint.sh && chmod +x docker-entrypoint.sh

COPY --from=builder /app/dist ./dist

RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3333

ENTRYPOINT ["/bin/sh", "./docker-entrypoint.sh"]
