FROM nginx

COPY ./nginx.conf /etc/nginx/nginx.conf

ADD ./dist /usr/share/nginx/html

EXPOSE 80
ARG BACKEND_HOST
ENV BACKEND_HOST=$BACKEND_HOST

CMD ["nginx", "-g", "daemon off;"]