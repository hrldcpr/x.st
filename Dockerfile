FROM nginx:alpine

COPY ssl/dhparam.pem /etc/ssl/
COPY nginx/ssl.conf /etc/nginx/conf.d/

COPY ssl/*.crt /etc/ssl/certs/
COPY ssl/secret/*.key /etc/ssl/private/
COPY nginx/x.st.conf /etc/nginx/conf.d/

COPY html /usr/share/nginx/html
