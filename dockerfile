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
    php8.2 \
    php8.2-cli \
    php8.2-fpm \
    php8.2-mysql \
    php8.2-pgsql \
    php8.2-sqlite3 \
    php8.2-redis \
    php8.2-xml \
    php8.2-curl \
    php8.2-mbstring \
    php8.2-zip \
    php8.2-bcmath \
    php8.2-gd \
    php8.2-intl

RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && \
    apt-get install -y nodejs

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

COPY . /app

RUN composer install --no-dev --optimize-autoloader

RUN npm install && npm run build

COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

EXPOSE 8000

CMD ["/app/start.sh"]
