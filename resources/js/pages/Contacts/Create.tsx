import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useForm } from "@inertiajs/react"
import { FormEvent, useEffect } from "react"
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';


type Contact = {
        id    : number
        name  : string
        email : string
        notes?: string
        // contact_lists: Array<{
        //     id: number
        //     name: string
        // }>
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title : 'Create Contact',
        href  : '/contacts/create',
    },
];

 export default function ContactCreate() {
    
    const { contact } = usePage<{contact?: Contact}>().props;

    const { data, setData, post, put, processing, errors } = useForm({
        id      : contact?.id    ?? '',
        name    : contact?.name  ?? '',
        email   : contact?.email ?? '',
        notes   : contact?.notes ?? '',
    })

    useEffect(() => {
        setData({
            id    : contact?.id    ?? '',
            name  : contact?.name  ?? '',
            email : contact?.email ?? '',
            notes : contact?.notes ?? '',
        });
    }, [contact, setData]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (data.id) {
            put(`/contacts/${data.id}`);
        } else {
            post(`/contacts`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={contact ? "Edit Contact" : "Add Contact"} />
            <div key={contact?.id ?? 'create'} className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-2">{contact ? 'Edit Contact' : 'Add Contact'}</h1>
                    <Card>
                        <CardContent className="pt-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Input
                                        placeholder="Contact Name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <Input
                                        type="email"
                                        placeholder="Email Address"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                                    )}
                                </div>
                                <div>
                                    <Input
                                        placeholder="(Optional) Note"
                                        value={data.notes}
                                        onChange={e => setData('notes', e.target.value)}
                                    />
                                    {errors.notes && (
                                        <p className="text-sm text-red-500 mt-1">{errors.notes}</p>
                                    )}
                                </div>

                                <Button type="submit" disabled={processing}>
                                    {contact ? 'Update Contact' : 'Add Contact'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}
