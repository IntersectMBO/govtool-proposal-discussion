FROM node:alpine AS builder
ENV NODE_ENV=production

# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY package.json .

RUN npm install --production
# Copy app files
COPY . .

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL $NEXT_PUBLIC_API_URL

ARG NEXT_PUBLIC_ANVIL_API_KEY
ENV NEXT_PUBLIC_ANVIL_API_KEY $NEXT_PUBLIC_ANVIL_API_KEY


# Build the app
RUN npm run build --production


EXPOSE 3000
CMD npm run start