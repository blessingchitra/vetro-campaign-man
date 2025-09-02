<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Contact extends Model
{
    protected $fillable = [
        'name',
        'email',
        'notes',
    ];

    public function contactLists(): BelongsToMany
    {
        return $this->belongsToMany(ContactList::class);
    }
}
