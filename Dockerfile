# 1단계: 환경 설정 및 dependency 설치
FROM node:22-alpine
RUN apk add --no-cache libc6-compat

WORKDIR /usr/src/app

# package.json, package-lock.json 복사 (yarn.lock 대신 package-lock.json 사용)
COPY package.json package-lock.json ./

# 의존성 설치 (npm ci는 package-lock.json에 맞게 깨끗한 설치)
RUN npm ci

# 2단계: next.js 빌드 단계
FROM node:22-alpine

WORKDIR /usr/src/app

COPY --from=0 /usr/src/app/node_modules ./node_modules
COPY . .

# 환경 변수에 맞는 .env 파일 복사 (예: .env.production)
COPY .env ./.env

RUN npm run build

# 3단계: next.js 실행 단계
FROM node:22-alpine

WORKDIR /usr/src/app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=1 /usr/src/app/public ./public
COPY --from=1 --chown=nextjs:nodejs /usr/src/app/.next/standalone ./
COPY --from=1 --chown=nextjs:nodejs /usr/src/app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
