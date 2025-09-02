<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\CampaignController;

Route::middleware(['api'])->group(function () {
    Route::get('contacts'             , [ContactController::class , 'index']);
    Route::get('campaigns'            , [CampaignController::class, 'index']);
    Route::get('campaigns/{campaign}' , [CampaignController::class, 'show']);
});
