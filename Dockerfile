# build stage
FROM node:14-alpine as build-stage
WORKDIR /app
RUN apk add git
COPY ./package.json ./package.json
RUN yarn install
COPY . .
RUN yarn run build
# production stage
FROM nginx:1.17-alpine as production-stage
COPY --from=build-stage /app/build /usr/share/nginx/html
WORKDIR /usr/share/nginx/html
COPY ./env.sh .
COPY .env .
# Make our shell script executable
RUN chmod +x env.sh
CMD ["/bin/sh", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]
