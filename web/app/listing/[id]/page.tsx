export default function ListingPage({
  params: { id },
}: {
  params: { id: string };
}) {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">Listing Page</h1>
        <p>This is a placeholder for the listing details.</p>
        <p className="text-lg font-medium">Listing ID: {id}</p>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <p className="text-sm text-gray-500">© 2024 Your Company</p>
      </footer>
    </div>
  );
}
