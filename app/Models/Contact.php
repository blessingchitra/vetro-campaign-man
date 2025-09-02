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

    protected $hidden = [
        'pivot',
    ];

    public function contactLists(): BelongsToMany
    {
        return $this->belongsToMany(ContactList::class, 'contact_contact_list')->withTimestamps();
    }
}
