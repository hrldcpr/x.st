FROM nginx:1.25.3

COPY nginx/*.conf /etc/nginx/conf.d/
COPY secret/*.htpasswd /etc/nginx/
