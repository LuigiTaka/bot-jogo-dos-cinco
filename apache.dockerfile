FROM php:8.1-apache

RUN apt-get -y update && apt-get install -y libicu-dev zlib1g-dev libpng-dev libonig-dev \
  && docker-php-ext-configure intl && docker-php-ext-install mysqli intl gd mbstring mysqli pdo pdo_mysql shmop \
    && docker-php-ext-enable pdo_mysql
RUN a2enmod rewrite headers expires cache cache_disk proxy_http

COPY apache2.conf /etc/apache2/apache2.conf
COPY 000-default.conf /etc/apache2/sites-enabled/000-default.conf