import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "@inertiajs/react"
import { FormEvent } from "react"
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title : 'Create Campaigns',
        href  : '/campaigns/create',
    },
];
export default function CampaignCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title : '',
        body  : '',
    })

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        post('/campaigns')
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Campaigns" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-6">Create A Campaign</h1>
                    <Card>
                        <CardContent className="pt-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Input
                                        placeholder="Campaign Title"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                                    )}
                                </div>

                                <div>
                                    <Textarea
                                        placeholder="Campaign Body"
                                        value={data.body}
                                        onChange={e => setData('body', e.target.value)}
                                        rows={6}
                                    />
                                    {errors.body && (
                                        <p className="text-sm text-red-500 mt-1">{errors.body}</p>
                                    )}
                                </div>

                                <Button type="submit" disabled={processing}>
                                    Create Campaign
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}
