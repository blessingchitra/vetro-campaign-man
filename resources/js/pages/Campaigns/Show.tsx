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
        title : 'Campaigns',
        href  : '/campaigns',
    },
];

interface Props {
    campaign: {
        id: number
        title: string
        body: string
        contact_lists: Array<{
            id: number
            name: string
            contacts: Array<{
                id: number
                name: string
                email: string
            }>
        }>
    }
}

export default function CampaignShow({ campaign }: Props) {
    type List = { id:number; name:string; contacts: Array<{id:number; name:string; email:string}> }
    const [lists, setLists] = useState<List[]>(campaign.contact_lists)

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [available, setAvailable] = useState<Array<{id:number; name:string}>>([])

    useEffect(() => {
        if (!open) return
        let aborted = false
        setLoading(true)
        fetch(`/campaigns/${campaign.id}/available-contact-lists`)
            .then(r => r.json())
            .then(d => { if (!aborted) setAvailable(d.data ?? []) })
            .finally(() => { if (!aborted) setLoading(false) })
        return () => { aborted = true }
    }, [open, campaign.id])

    async function handleAttach(listId: number) {
        await fetch(`/campaigns/${campaign.id}/contact-lists/${listId}`, {
            method: 'POST',
            headers: { 'X-Requested-With': 'XMLHttpRequest', 'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '' },
        })
        const added = available.find(l => l.id === listId)
        if (added) setLists(prev => [...prev, { id: added.id, name: added.name, contacts: [] }])
        setAvailable(prev => prev.filter(l => l.id !== listId))
    }

    const hasAvailable = useMemo(() => available.length > 0, [available])

    const [removeOpen, setRemoveOpen] = useState(false)
    const [toRemove, setToRemove] = useState<List | null>(null)

    function confirmRemove(list: List) {
        setToRemove(list)
        setRemoveOpen(true)
    }

    async function handleDetach() {
        if (!toRemove) return
        await fetch(`/campaigns/${campaign.id}/contact-lists/${toRemove.id}`, {
            method: 'DELETE',
            headers: { 'X-Requested-With': 'XMLHttpRequest', 'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '' },
        })
        setLists(prev => prev.filter(l => l.id !== toRemove.id))
        setRemoveOpen(false)
        setToRemove(null)
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Campaigns" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">{campaign.title}</h1>
                <Button variant="outline" asChild>
                    <Link href="/campaigns">Back to Campaigns</Link>
                </Button>
            </div>

            <Card className="mb-8">
                <CardContent className="">
                    <p className="whitespace-pre-wrap">{campaign.body}</p>
                </CardContent>
            </Card>

            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Linked Contact Lists</h2>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>Add Contact List</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Add contact lists to campaign</DialogTitle>
                            <DialogDescription>
                                Select from lists not already linked to this campaign.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead className="text-right w-[160px]">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading && (
                                        <TableRow>
                                            <TableCell colSpan={2} className="text-muted-foreground">Loading...</TableCell>
                                        </TableRow>
                                    )}
                                    {!loading && !hasAvailable && (
                                        <TableRow>
                                            <TableCell colSpan={2} className="text-muted-foreground">No contact lists available to add.</TableCell>
                                        </TableRow>
                                    )}
                                    {!loading && hasAvailable && available.map((l) => (
                                        <TableRow key={l.id}>
                                            <TableCell className="truncate">{l.name}</TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm" onClick={() => handleAttach(l.id)}>Add to campaign</Button>
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
                        <TableHead className="text-right w-[140px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {lists.map((list) => (
                        <TableRow key={list.id}>
                            <TableCell className="font-medium">{list.name}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="destructive" size="sm" onClick={() => confirmRemove(list)}>Remove</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableCaption>
                    {lists.length === 0 ? 'No contact lists linked.' : `${lists.length} list${lists.length === 1 ? '' : 's'} linked`}
                </TableCaption>
            </Table>
        </div>
    </div>
    <Dialog open={removeOpen} onOpenChange={setRemoveOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Remove contact list</DialogTitle>
                <DialogDescription>
                    This will unlink{toRemove ? ` "${toRemove.name}"` : ''} from this campaign.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="outline" onClick={() => setRemoveOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDetach}>Remove</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </AppLayout>
    )
}
