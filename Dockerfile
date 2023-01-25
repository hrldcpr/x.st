FROM nginx:1.23.3

COPY ssl/dhparam.pem /etc/ssl/
COPY nginx/*.conf /etc/nginx/conf.d/
COPY secret/*.htpasswd /etc/nginx/
