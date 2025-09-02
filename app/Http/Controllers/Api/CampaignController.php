<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use Illuminate\Http\Request;

class CampaignController extends Controller
{
    public function index()
    {
        return response()->json(Campaign::all());
    }

    public function show($campaign)
    {
        $model = Campaign::with(['contactLists.contacts'])->find($campaign);
        if (!$model) return response()->json((object)[], 404);

        return response()->json($model);
    }
}
