server {
    listen ${LISTEN_PORT} ssl;
    ssl_certificate     /etc/nginx/nginx.crt;
    ssl_certificate_key /etc/nginx/nginx.key;

    location /static {
        alias /vol/static;
    }

    location / {
        uwsgi_pass              ${APP_HOST}:${APP_PORT};
        include                 /etc/nginx/uwsgi_params;
        client_max_body_size    10M;
    }
}
