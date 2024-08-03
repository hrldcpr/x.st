FROM nginx:1.27.0

COPY nginx/*.conf /etc/nginx/conf.d/
COPY secret/*.htpasswd /etc/nginx/
