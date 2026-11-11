# syntax=docker/dockerfile:1
FROM node:20.18.1-alpine AS build
WORKDIR /src
COPY package.json package-lock.json ./
# ng-recaptcha@13 declares a peer of Angular 17; the app runs it on Angular 18.
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund --legacy-peer-deps
COPY . .
# Point the app at the gateway for this deployment (the committed file targets Render).
ARG API_URL=http://localhost:9000
RUN sed -i -E "s#(localhost|localhostStats): '[^']*'#\1: '${API_URL}'#" src/environments/environment.ts \
 && grep -qF "localhost: '${API_URL}'" src/environments/environment.ts \
 && npx ng build --configuration production

FROM nginx:1.27.3-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/dist/chatbot-hibrido /usr/share/nginx/html
EXPOSE 80
