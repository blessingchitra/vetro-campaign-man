<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    protected $fillable = [
        'title',
        'body',
    ];

    public function contactLists()
    {
        return $this->belongsToMany(ContactList::class)->withTimestamps();
    }
}
