FROM node:alpine AS builder
ENV NODE_ENV=production

# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY package.json .
# COPY @intersect.mbo/intersectmbo.org-icons-set-1.0.5.tgz ./

ARG NPMRC_TOKEN
# Set npm configuration settings using environment variables
RUN npm config set @intersect.mbo:registry "https://registry.npmjs.org/" --location=global
RUN npm config set //registry.npmjs.org/:_authToken ${NPMRC_TOKEN} --location=global

RUN npm install --production
# Copy app files
COPY . .

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL $NEXT_PUBLIC_API_URL

# Build the app
RUN npm run build --production


EXPOSE 3000
CMD npm run start