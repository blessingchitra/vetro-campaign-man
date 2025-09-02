<?php

namespace Database\Factories;

use App\Models\ContactList;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ContactList>
 */
class ContactListFactory extends Factory
{
    protected $model = ContactList::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name'        => fake()->name(),
            'description' => fake()->text(50),
        ];
    }
}
