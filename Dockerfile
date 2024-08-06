FROM nginx:1.27.0

COPY ssl/ffdhe2048.txt /etc/ssl/
COPY nginx/*.conf /etc/nginx/conf.d/
COPY secret/*.htpasswd /etc/nginx/
