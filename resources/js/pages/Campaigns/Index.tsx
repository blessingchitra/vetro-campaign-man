import { Button } from "@/components/ui/button"
import { Link } from "@inertiajs/react"
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Props {
    campaigns: Array<{
        id      : number
        title   : string
        body    : string
        contact_lists: Array<{
            id       : number
            name     : string
            contacts : Array<{
                id   : number
                name : string
                email: string
            }>
        }>
    }>
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Campaigns',
        href: '/campaigns',
    },
];

export default function CampaignsIndex({ campaigns }: Props) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Campaigns" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Campaigns</h1>
                        <Button asChild>
                            <Link href="/campaigns/create">Create Campaign</Link>
                        </Button>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Body</TableHead>
                                <TableHead className="text-right w-[140px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {campaigns.map((campaign) => (
                                <TableRow key={campaign.id}>
                                    <TableCell className="font-medium">{campaign.title}</TableCell>
                                    <TableCell>
                                        <p className="line-clamp-2 text-muted-foreground">{campaign.body}</p>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" asChild>
                                            <Link href={`/campaigns/${campaign.id}`}>View Details</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableCaption>
                            {campaigns.length === 0 ? 'No campaigns found.' : `${campaigns.length} campaign${campaigns.length === 1 ? '' : 's'}`}
                        </TableCaption>
                    </Table>
                </div>
            </div>
        </AppLayout>
    )
}
