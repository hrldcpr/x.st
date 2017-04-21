FROM nginx:alpine

COPY ssl/dhparam.pem /etc/ssl/
COPY nginx/*.conf /etc/nginx/conf.d/
COPY secret/*.htpasswd /etc/nginx/
