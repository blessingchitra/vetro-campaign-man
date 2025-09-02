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
        title : 'Create New Contact List',
        href  : '/contact-lists/create',
    },
];

export default function ContactListCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name        : '',
        description : '',
    })

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        post('/contact-lists')
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Contact" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-6">Create Contact List</h1>
                    <Card>
                        <CardContent className="pt-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Input
                                        placeholder="List Name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <Textarea
                                        placeholder="List Description"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        rows={4}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                                    )}
                                </div>

                                <Button type="submit" disabled={processing}>
                                    Create Contact List
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}
