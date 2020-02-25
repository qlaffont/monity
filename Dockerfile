# Pull from a base image
FROM node:12-alpine

# Copy the files from the current directory to app/
COPY . app/

# Use app/ as the working directory
WORKDIR app/

# Install dependencies (npm ci is similar to npm i, but for automated builds)
RUN yarn install --silent

# Build production client side React application
RUN yarn build

# Clean Unused files
RUN rm -R node_modules
RUN rm -R components pages server services


RUN yarn install --prod --frozen-lockfile --silent

# Listen on the specified port
EXPOSE 5000

# Set Node server
# ENTRYPOINT PORT=5000 yarn start
