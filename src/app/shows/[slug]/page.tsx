interface ShowPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ShowPage({ params }: ShowPageProps) {
  const { slug } = await params

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Show: {slug}</h1>
        <p className="text-muted-foreground mt-2">This is a placeholder page for the live show details.</p>
      </div>
    </div>
  )
}
