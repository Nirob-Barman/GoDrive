import { Link } from "react-router-dom";

type TCTASectionProps = {
  isAuthenticated: boolean;
};

export default function CTASection({ isAuthenticated }: TCTASectionProps) {
  return (
    <section className="relative isolate mb-24 overflow-hidden rounded-3xl bg-gray-950 px-6 py-16 text-center text-white sm:px-12 sm:py-20 lg:py-24">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-24 -top-24 -z-10 h-96 w-96 rounded-full bg-orange-500/15 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -right-24 -z-10 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />

      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]">
        <div className="h-full w-full bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
          <span className="h-2 w-2 rounded-full bg-orange-500" />
          Your Next Adventure Awaits
        </span>

        <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-6xl">
          Ready to Get
          <span className="block text-orange-500">Moving?</span>
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-gray-400 sm:text-base">
          Find a car that fits your journey, book your next ride, and enjoy the
          freedom to explore with GoDrive. Your next adventure starts here.
        </p>

        {/* Actions */}
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to="/cars"
            className="inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-orange-500 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition duration-300 hover:-translate-y-1 hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
          >
            Browse Available Cars
            <span aria-hidden="true" className="text-lg">
              →
            </span>
          </Link>

          {!isAuthenticated && (
            <Link
              to="/register"
              className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-8 py-4 text-sm font-bold text-white transition duration-300 hover:-translate-y-1 hover:border-orange-400/50 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
            >
              Create an Account
            </Link>
          )}
        </div>

        {/* Supporting Text */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs font-medium text-gray-500">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            Easy Booking
          </span>

          <span className="hidden h-4 w-px bg-white/15 sm:block" />

          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            Flexible Choices
          </span>

          <span className="hidden h-4 w-px bg-white/15 sm:block" />

          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            Simple Reservations
          </span>
        </div>
      </div>
    </section>
  );
}
