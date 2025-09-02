<?php

namespace Database\Seeders;

use App\Models\Contact;
use App\Models\ContactList;
use App\Models\Campaign;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Contact::factory()->count(5)->create();
        Campaign::factory()->count(5)->create();
        ContactList::factory()->count(5)->create();
    }
}
