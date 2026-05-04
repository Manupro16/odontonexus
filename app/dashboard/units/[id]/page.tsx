

interface UnitDetailPageProps {
    params: Promise<{ id: string }>
}

export default async function UnitDetailPage({params}: UnitDetailPageProps) {
    const { id } = await params;

    return <div>Unit ID: {id}</div>;
}
