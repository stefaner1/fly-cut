FROM nginx:latest

# Copy local nginx.conf configuration file into the container's /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf

# Copy local Vue 3 project build files into the container's /usr/share/nginx/html directory
COPY dist /usr/share/nginx/html/editor

COPY dianshi /usr/share/nginx/html/dianshi
