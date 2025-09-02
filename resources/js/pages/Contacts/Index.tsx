import { Button } from "@/components/ui/button"
import { Link, router } from "@inertiajs/react"
import { Mail, Pencil, Trash } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

type Contact = {
        id   : number
        name : string
        email: string
        notes?: string
        // contact_lists: Array<{
        //     id: number
        //     name: string
        // }>
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title : 'Contacts',
        href  : '/contacts',
    },
];

export default function ContactsIndex() {
    const { contacts } = usePage<{contacts: Contact[]}>().props;

    const [open, setOpen]         = useState(false)
    const [toDelete, setToDelete] = useState<Contact | null>(null)

    function confirmDelete(contact: Contact) {
        setToDelete(contact)
        setOpen(true)
    }

    function handleDelete() {
        if (!toDelete) return
        router.delete(`/contacts/${toDelete.id}`, {
            onFinish: () => {
                setOpen(false)
                setToDelete(null)
            },
        })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contacts" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Contacts</h1>
                        <Button asChild>
                            <Link href="/contacts/create">Add Contact</Link>
                        </Button>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Notes</TableHead>
                                <TableHead className="text-right w-[120px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {contacts.map((contact) => (
                                <TableRow key={contact.id}>
                                    <TableCell className="font-medium">{contact.name}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center text-gray-600 gap-2">
                                            <Mail className="w-4 h-4" />
                                            <span>{contact.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-500">{contact.notes ?? ''}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="icon" asChild>
                                                <Link href={`/contacts/${contact.id}/edit`}>
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="destructive" size="icon" onClick={() => confirmDelete(contact)}>
                                                <Trash className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableCaption>
                            {contacts.length === 0 ? 'No contacts found.' : `${contacts.length} contact${contacts.length === 1 ? '' : 's'}`}
                        </TableCaption>
                    </Table>
                </div>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete contact</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the contact
                            {toDelete ? ` "${toDelete.name}"` : ''} and remove their data from our servers.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    )
}

