FROM alpine AS builder

WORKDIR /app

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories
RUN apk add --no-cache --update yarn
COPY package.json /app/package.json
RUN yarn --prod --registry https://registry.npm.taobao.org/

FROM keymetrics/pm2:latest-alpine

# Bundle APP files
COPY dist dist/
COPY package.json .
COPY ecosystem.config.js .

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
COPY --from=builder /app/node_modules ./node_modules

CMD [ "pm2-runtime", "start", "ecosystem.config.js", "--env", "production" ]
