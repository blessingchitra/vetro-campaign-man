import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Head } from '@inertiajs/react';
import { useCallback, useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'API Tester', href: '/api-tester' },
];

export default function ApiIndex() {
    const [result    , setResult]     = useState('');
    const [loadingKey, setLoadingKey] = useState<string | null>(null);
    const [campaignId, setCampaignId] = useState('');

    const routes = useMemo(
        () => [
            {
                key: 'contacts',
                label: 'GET /api/contacts',
                run: () => fetch('/api/contacts'),
            },
            {
                key: 'campaigns',
                label: 'GET /api/campaigns',
                run: () => fetch('/api/campaigns'),
            },
            {
                key: 'campaign-show',
                label: 'GET /api/campaigns/{id}',
                run: () => fetch(`/api/campaigns/${encodeURIComponent(campaignId || '1')}`),
                extra: (
                    <div className="flex items-center gap-2">
                        <label htmlFor="campaign-id" className="text-sm text-muted-foreground">
                            Campaign ID
                        </label>
                        <Input
                            id="campaign-id"
                            value={campaignId}
                            onChange={(e) => setCampaignId(e.target.value)}
                            placeholder="e.g. 1"
                            className="h-8 w-32"
                        />
                    </div>
                ),
            },
        ],
        [campaignId]
    );

    const runAndShow = useCallback(async (key: string, run: () => Promise<Response>) => {
        try {
            setLoadingKey(key);
            setResult('');
            const res = await run();
            const contentType = res.headers.get('content-type') || '';
            let text: string;
            if (contentType.includes('application/json')) {
                const json = await res.json();
                text = JSON.stringify(json, null, 2);
            } else {
                text = await res.text();
            }
            const statusLine = `HTTP ${res.status} ${res.statusText}`;
            setResult(`${statusLine}\n\n${text}`);
        } catch (err: any) {
            setResult(`Error: ${err?.message || String(err)}`);
        } finally {
            setLoadingKey(null);
        }
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="API Tester" />
            <div className="flex flex-col gap-6 p-4">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {routes.map((r) => (
                        <div key={r.key} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                            <div className="flex flex-col gap-2">
                                <div className="font-medium">{r.label}</div>
                                {r.extra}
                            </div>
                            <Button
                                size="sm"
                                onClick={() => runAndShow(r.key, r.run)}
                                disabled={loadingKey !== null}
                            >
                                {loadingKey === r.key ? 'Loading…' : 'Run'}
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="result" className="text-sm font-medium">Result</label>
                    <Textarea id="result" value={result} readOnly className="min-h-64 font-mono" />
                </div>
            </div>
        </AppLayout>
    );
}
