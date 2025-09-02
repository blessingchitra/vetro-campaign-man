import { Button } from "@/components/ui/button"
import { Link } from "@inertiajs/react"
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title : 'Contact Lists',
        href  : '/contacts',
    },
];

interface Props {
    contactLists: Array<{
        id: number
        name: string
        description: string
        contacts: Array<{
            id: number
            name: string
            email: string
        }>
    }>
}

export default function ContactListsIndex({ contactLists }: Props) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contacts" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Contact Lists</h1>
                        <Button asChild>
                            <Link href="/contact-lists/create">Add New Contacts List</Link>
                        </Button>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Contacts</TableHead>
                                <TableHead className="text-right w-[140px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {contactLists?.map((list) => (
                                <TableRow key={list.id}>
                                    <TableCell className="font-medium">{list.name}</TableCell>
                                    <TableCell>
                                        <p className="line-clamp-2 text-muted-foreground">{list.description}</p>
                                    </TableCell>
                                    <TableCell>{list.contacts.length}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" asChild>
                                            <Link href={`/contact-lists/${list.id}`}>View Details</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableCaption>
                            {contactLists.length === 0 ? 'No lists found.' : `${contactLists.length} list${contactLists.length === 1 ? '' : 's'}`}
                        </TableCaption>
                    </Table>
                </div>
            </div>
        </AppLayout>
    )
}
