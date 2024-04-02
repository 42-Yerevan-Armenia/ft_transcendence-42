# FROM nginxinc/nginx-unprivileged:1-alpine

# COPY nginx/default.conf.tpl /etc/nginx/default.conf.tpl
# COPY nginx/uwsgi_params /etc/nginx/uwsgi_params
# COPY nginx/deploy.sh /deploy.sh
# COPY nginx/nginx.crt /etc/nginx/nginx.crt
# COPY nginx/nginx.key /etc/nginx/nginx.key

# ENV LISTEN_PORT=443
# ENV APP_HOST=backend
# ENV APP_PORT=9000

# USER root

# RUN mkdir -p /vol/static && \
#     chmod 755 /vol/static && \
#     touch /etc/nginx/conf.d/default.conf && \
#     chown nginx:nginx /etc/nginx/conf.d/default.conf && \
#     chmod +x /deploy.sh

# VOLUME /vol/static

# USER nginx

# CMD ["/deploy.sh"]

FROM alpine:3.18

RUN apk update && apk upgrade && apk add --no-cache nginx

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]