import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Link } from "@inertiajs/react"
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title : 'Contact Lists',
        href  : '/contact-lists',
    },
];


interface Props {
    contactList: {
        id: number
        name: string
        description: string
        contacts: Array<{
            id: number
            name: string
            email: string
        }>
    }
}

export default function ContactListShow({ contactList }: Props) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [available, setAvailable] = useState<Array<{id:number; name:string; email:string}>>([])
    const [contacts, setContacts] = useState(contactList.contacts)

    const [removeOpen, setRemoveOpen] = useState(false)
    const [toRemove, setToRemove] = useState<{id:number; name:string; email:string} | null>(null)

    useEffect(() => {
        if (!open) return
        let aborted = false
        setLoading(true)
        fetch(`/contact-lists/${contactList.id}/available-contacts`)
            .then(r => r.json())
            .then(d => {
                if (aborted) return
                setAvailable(d.data ?? [])
            })
            .finally(() => !aborted && setLoading(false))
        return () => { aborted = true }
    }, [open, contactList.id])

    async function handleAttach(id: number) {
        await fetch(`/contact-lists/${contactList.id}/contacts/${id}`, {
            method: 'POST',
            headers: { 'X-Requested-With': 'XMLHttpRequest', 'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '' },
        })

        setAvailable(prev => prev.filter(c => c.id !== id))
        const added = available.find(c => c.id === id)
        if (added) setContacts(prev => [...prev, added])
    }

    function confirmRemove(contact: {id:number; name:string; email:string}) {
        setToRemove(contact)
        setRemoveOpen(true)
    }

    async function handleDetach() {
        if (!toRemove) return
        await fetch(`/contact-lists/${contactList.id}/contacts/${toRemove.id}`, {
            method: 'DELETE',
            headers: { 'X-Requested-With': 'XMLHttpRequest', 'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '' },
        })
        setContacts(prev => prev.filter(c => c.id !== toRemove.id))
        setRemoveOpen(false)
        setToRemove(null)
    }

    const hasAvailable = useMemo(() => available.length > 0, [available])

    return (
        <>
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contacts List" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold">{contactList.name}</h1>
                        <Button variant="outline" asChild>
                            <Link href="/contact-lists">Back to Lists</Link>
                        </Button>
                    </div>

                    <Card className="mb-8">
                        <CardContent className="">
                            <p className="text-gray-600">{contactList.description}</p>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Contacts</h2>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button>Add Contact</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Add contacts to list</DialogTitle>
                                    <DialogDescription>
                                        Select from contacts not already in this list.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="border rounded-md">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead className="text-right w-[180px]">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {loading && (
                                                <TableRow>
                                                    <TableCell colSpan={3} className="text-muted-foreground">Loading...</TableCell>
                                                </TableRow>
                                            )}
                                            {!loading && !hasAvailable && (
                                                <TableRow>
                                                    <TableCell colSpan={3} className="text-muted-foreground">No contacts available to add.</TableCell>
                                                </TableRow>
                                            )}
                                            {!loading && hasAvailable && available.map((c) => (
                                                <TableRow key={c.id}>
                                                    <TableCell className="truncate">{c.name}</TableCell>
                                                    <TableCell className="truncate text-muted-foreground">{c.email}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button size="sm" onClick={() => handleAttach(c.id)}>Add to contact list</Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead className="text-right w-[140px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {contacts.map((contact) => (
                                <TableRow key={contact.id}>
                                    <TableCell className="font-medium">{contact.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{contact.email}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="destructive" size="sm" onClick={() => confirmRemove(contact)}>Remove</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableCaption>
                            {contacts.length === 0 ? 'No contacts in this list.' : `${contacts.length} contact${contacts.length === 1 ? '' : 's'}`}
                        </TableCaption>
                    </Table>
                </div>
            </div>
            </AppLayout>
            <Dialog open={removeOpen} onOpenChange={setRemoveOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Remove contact</DialogTitle>
                        <DialogDescription>
                            This will remove{toRemove ? ` "${toRemove.name}"` : ''} from this contact list.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRemoveOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDetach}>Remove</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
