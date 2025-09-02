# Email Campaign Management App

### A minimalistic email campaign management application built with Laravel, Inertia.js, React, and Shadcn UI.

## Features

- Create and manage email campaigns
- Create and manage contact lists
- Add contacts to lists
- Link campaigns to contact lists
- RESTful API endpoints


## Docker Installation
The project includes a docker-compose.yml file for easy setup.
```bash
docker compose up -d
```

## Manual Installation

## Requirements

- PHP 8.1 or higher
- Node.js 16+ and npm
- Composer


1. Clone the repository
```bash
git clone https://github.com/blessingchitra/vetro-campaign-man.git
cd vetro-campaign-man
```

2. Install PHP dependencies
```bash
composer install
```

3. Install Node.js dependencies
```bash
npm install
```

4. Copy the environment file and configure your database
```bash
cp .env.example .env
```

5. Generate application key
```bash
php artisan key:generate
```

6. Run database migrations
```bash
php artisan migrate
php artisan db:seed #(Optional, if you want to get going with some sample data)
```

7. Build frontend assets
```bash
npm run build
```

## Development

1. Start the Laravel development server
```bash
php artisan serve
```

2. Start the Vite development server
```bash
npm run dev
```

## API Endpoints

- `GET /api/campaigns` - List all campaigns
- `GET /api/campaigns/{id}` - Get campaign details with linked lists and contacts
- `GET /api/contacts` - List all contacts

## License

[MIT License](LICENSE.md)
