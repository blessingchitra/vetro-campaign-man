<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\ContactList;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CampaignController extends Controller
{
    public function index()
    {
        return Inertia::render('Campaigns/Index', [
            'campaigns' => Campaign::with('contactLists')->latest()->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Campaigns/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
        ]);

        Campaign::create($validated);

        return redirect()->route('campaigns.index')
            ->with('success', 'Campaign created successfully.');
    }

    public function show(Campaign $campaign)
    {
        return Inertia::render('Campaigns/Show', [
            'campaign' => $campaign->load('contactLists.contacts')
        ]);
    }

    /**
     * Return contact lists not yet attached to this campaign.
     */
    public function availableContactLists(Campaign $campaign)
    {
        $attachedIds = $campaign->contactLists()->pluck('contact_lists.id');

        $lists = ContactList::query()
            ->whereNotIn('id', $attachedIds)
            ->orderBy('name')
            ->get(['id', 'name']);

        return response()->json(['data' => $lists]);
    }

    /**
     * Attach a contact list to the campaign.
     */
    public function attachContactList(Campaign $campaign, ContactList $contactList)
    {
        $campaign->contactLists()->syncWithoutDetaching([$contactList->id]);

        return response()->noContent();
    }

    /**
     * Detach a contact list from the campaign.
     */
    public function detachContactList(Campaign $campaign, ContactList $contactList)
    {
        $campaign->contactLists()->detach($contactList->id);

        return response()->noContent();
    }
}
