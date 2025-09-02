<?php

namespace App\Http\Controllers;

use App\Models\ContactList;
use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactListController extends Controller
{
    public function index()
    {
        $contactLists = ContactList::with('contacts')->latest()->get();
        return Inertia::render('ContactLists/Index', [
            'contactLists' => $contactLists,
        ]);
    }

    public function create()
    {
        return Inertia::render('ContactLists/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        ContactList::create($validated);

        return redirect()->route('contact-lists.index')
            ->with('success', 'Contact list created successfully.');
    }

    public function show(ContactList $contactList)
    {
        return Inertia::render('ContactLists/Show', [
            'contactList' => $contactList->load('contacts')
        ]);
    }

    /**
     * Return contacts not yet attached to the given contact list.
     */
    public function availableContacts(ContactList $contactList)
    {
        $attachedIds = $contactList->contacts()->pluck('contacts.id');

        $contacts = Contact::query()
            ->whereNotIn('id', $attachedIds)
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        return response()->json(['data' => $contacts]);
    }

    /**
     * Attach a contact to the given contact list.
     */
    public function attachContact(ContactList $contactList, Contact $contact)
    {
        $contactList->contacts()->syncWithoutDetaching([$contact->id]);

        return response()->noContent();
    }

    /**
     * Detach a contact from the given contact list.
     */
    public function detachContact(ContactList $contactList, Contact $contact)
    {
        $contactList->contacts()->detach($contact->id);

        return response()->noContent();
    }
}
