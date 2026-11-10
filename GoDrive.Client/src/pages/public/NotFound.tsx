import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-[#090b10] px-5 py-16 text-white">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-orange-500/10 blur-[120px]" />
        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-orange-500/10 blur-[120px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:55px_55px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
        {/* Brand */}
        <Link to="/" className="mb-14 inline-flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-xl font-black text-white shadow-lg shadow-orange-500/20">
            G
          </span>

          <span className="text-xl font-extrabold tracking-tight">
            Go<span className="text-orange-500">Drive</span>
          </span>
        </Link>

        {/* Error visual */}
        <div className="relative mx-auto mb-8 w-fit">
          <h1 className="select-none text-[150px] leading-none font-black tracking-[-0.09em] text-white/[0.06] sm:text-[240px]">
            404
          </h1>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full border border-orange-500/30 bg-orange-500/10 px-6 py-2 backdrop-blur-md">
              <span className="text-sm font-black tracking-[0.35em] text-orange-500">
                LOST?
              </span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="mx-auto w-full max-w-2xl">
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.25em] text-orange-500">
            <span className="h-px w-7 bg-orange-500" />
            ROUTE NOT FOUND
            <span className="h-px w-7 bg-orange-500" />
          </span>

          <h2 className="mt-6 text-3xl font-extrabold leading-[1.2] tracking-tight text-white sm:text-5xl">
            <span className="block">Looks like you've</span>
            <span className="mt-2 block text-orange-500">
              missed your turn.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl px-2 text-sm leading-7 text-gray-400 sm:text-base">
            The road you're looking for doesn't seem to exist. It may have been
            moved, removed, or the address might be incorrect. Let's get you
            back on track.
          </p>

          {/* Actions */}
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-orange-500 px-8 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition duration-300 hover:-translate-y-1 hover:bg-orange-600"
            >
              <span className="text-lg">←</span>
              Back to homepage
            </Link>

            <Link
              to="/cars"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-8 text-sm font-bold text-gray-200 transition duration-300 hover:-translate-y-1 hover:border-orange-500/50 hover:bg-orange-500/5 hover:text-orange-400"
            >
              Explore available cars
              <span className="text-lg">→</span>
            </Link>
          </div>
        </div>        
      </div>
    </main>
  );
}
