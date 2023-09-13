FROM node:20-alpine AS deps

WORKDIR /usr/src/app

COPY --chown=node:node package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY --chown=node:node . .

USER node


FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY --chown=node:node package.json yarn.lock ./
COPY --chown=node:node --from=deps /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

RUN yarn build

ENV NODE_ENV production

RUN yarn install --production --frozen-lockfile

USER node


FROM node:20-alpine AS runner

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]
