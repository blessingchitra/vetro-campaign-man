<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Contact extends Model
{
    use HasFactory;
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
