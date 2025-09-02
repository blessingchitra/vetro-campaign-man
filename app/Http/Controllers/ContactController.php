<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\ContactList;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index()
    {
        $contacts = Contact::
            orderBy('name')
            ->get();
        return Inertia::render('Contacts/Index', compact(['contacts']));
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:contacts,email',
            'notes' => 'nullable|string',
        ]);

        $contact = Contact::create([
            'name'  => $validated['name'],
            'email' => $validated['email'],
            'notes' => $validated['notes'] ?? null,
        ]);

        return redirect()->route('contacts.index')
            ->with('success', 'Contact created successfully.');
    }

    public function create()
    {
        return Inertia::render('Contacts/Create');
    }

    public function edit(Contact $contact)
    {
        return Inertia::render('Contacts/Create', [
            'contact' => $contact,
        ]);
    }

    public function update(Request $request, Contact $contact)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:contacts,email,' . $contact->id,
            'notes' => 'nullable|string',
            'contact_lists' => 'array'
        ]);

        $contact->update([
            'name'  => $validated['name'],
            'email' => $validated['email'],
            'notes' => $validated['notes'] ?? null,
        ]);

        return redirect()->route('contacts.index')
            ->with('success', 'Contact updated successfully.');
    }

    public function destroy(Contact $contact)
    {
        $contact->delete();
        return redirect()->route('contacts.index')
            ->with('success', 'Contact deleted successfully.');
    }
}
