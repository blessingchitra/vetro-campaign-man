<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactList extends Model
{
    protected $fillable = [
        'name',
        'description',
    ];

    protected $hidden = [
        'pivot',
    ];

    public function contacts()
    {
        return $this->belongsToMany(Contact::class, 'contact_contact_list')->withTimestamps();
    }

    public function campaigns()
    {
        return $this->belongsToMany(Campaign::class, 'campaign_contact_list')->withTimestamps();
    }
}
