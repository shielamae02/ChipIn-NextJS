interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  const { id } = params;

  return (
    <main>
      <h1>Dashboard for session id: {id}</h1>
    </main>
  );
}
