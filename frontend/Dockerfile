FROM nginx

COPY ./nginx.conf /etc/nginx/nginx.conf

ADD ./dist /usr/share/nginx/html

EXPOSE 80
ENV BACKEND_HOST='http://localhost:3000'

CMD ["nginx", "-g", "daemon off;"]