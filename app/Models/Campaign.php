<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Campaign extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'body',
    ];

    protected $hidden = [
        'pivot',
    ];

    public function contactLists()
    {
        return $this->belongsToMany(ContactList::class, 'campaign_contact_list')->withTimestamps();
    }
}
