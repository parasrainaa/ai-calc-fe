# Step 1: Use an official Node.js image as a base
FROM node:16 AS build

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (or yarn.lock) to install dependencies
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application files
COPY . .

# Step 6: Build the Vite app for production
RUN npm run build

# Step 7: Use a lightweight server to serve the app
FROM nginx:alpine

# Step 8: Copy the build output to the Nginx directory
COPY --from=build /app/dist /usr/share/nginx/html

# Step 9: Expose port 80 for the web server
EXPOSE 80

# Step 10: Start Nginx
CMD ["nginx", "-g", "daemon off;"]
