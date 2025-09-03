FROM ubuntu:22.04

WORKDIR /app

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    curl \
    wget \
    unzip \
    software-properties-common \
    ca-certificates \
    lsb-release \
    gnupg

RUN add-apt-repository ppa:ondrej/php -y && \
    apt-get update && \
    apt-get install -y \
    php8.4 \
    php8.4-cli \
    php8.4-fpm \
    php8.4-mysql \
    php8.4-pgsql \
    php8.4-sqlite3 \
    php8.4-redis \
    php8.4-xml \
    php8.4-curl \
    php8.4-mbstring \
    php8.4-zip \
    php8.4-bcmath \
    php8.4-gd \
    php8.4-intl

RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && \
    apt-get install -y nodejs

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

COPY . /app

RUN composer install --optimize-autoloader
RUN cp .env.example .env && php artisan key:generate --force

RUN npm install

COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

EXPOSE 8000

CMD ["/app/start.sh"]
