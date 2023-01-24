FROM nginx

COPY ssl/dhparam.pem /etc/ssl/
COPY nginx/*.conf /etc/nginx/conf.d/
