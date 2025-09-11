import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans min-h-screen p-8 pb-20 gap-16 sm:p-20 curvy-bg">
      <main className="space-y-4">
        <div className="flex flex-col gap-6 items-center sm:items-start">
          <h1 className="text-5xl font-extrabold leading-[1.15] text-center sm:text-left">
            Welcome to <span className="text-[#53ba04]">Livora</span>
          </h1>
          <p className="text-2xl text-center sm:text-left max-w-[560px]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem,
            ipsum dolor.
          </p>
          <div className="flex gap-4 flex-wrap justify-center sm:justify-start">
            <Link
              href="/listings"
              className="px-6 py-3 bg-[#53ba04] text-white rounded-md hover:bg-[hsl(280,100%,60%)] transition"
            >
              Find your place
            </Link>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
