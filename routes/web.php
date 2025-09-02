<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\CampaignController;
use App\Http\Controllers\ContactListController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('contacts'      , ContactController::class    );
    Route::resource('campaigns'     , CampaignController::class   )->only(['index', 'create', 'store', 'show']);
    Route::resource('contact-lists' , ContactListController::class)->only(['index', 'create', 'store', 'show']);


    //--------
    // Contact list helpers
    //--------
    Route::get('contact-lists/{contactList}/available-contacts'    ,[ContactListController::class, 'availableContacts'])->name('contact-lists.available-contacts');
    Route::post('contact-lists/{contactList}/contacts/{contact}'   ,[ContactListController::class, 'attachContact'    ])->name('contact-lists.attach-contact');
    Route::delete('contact-lists/{contactList}/contacts/{contact}' ,[ContactListController::class, 'detachContact'    ])->name('contact-lists.detach-contact');


    //--------
    // Campaign helpers
    //--------
    Route::get('campaigns/{campaign}/available-contact-lists'       ,[CampaignController::class, 'availableContactLists'])->name('campaigns.available-contact-lists');
    Route::post('campaigns/{campaign}/contact-lists/{contactList}'  ,[CampaignController::class, 'attachContactList'    ])->name('campaigns.attach-contact-list');
    Route::delete('campaigns/{campaign}/contact-lists/{contactList}',[CampaignController::class, 'detachContactList'    ])->name('campaigns.detach-contact-list');


    //--------
    // API Tester page
    //--------
    Route::get('api-tester', [ApiController::class, 'index'])->name('api.index');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
