#!/bin/sh

if [ ! -f .env ]; then
    cp .env.example .env
fi

php artisan key:generate --force

echo "yes" | php artisan migrate --force
php artisan db:seed

npm run build


# Start Laravel development server
php artisan serve --host=0.0.0.0 --port=8000
