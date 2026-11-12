import { Link } from "react-router-dom";

type THeroSectionProps = {
  heroImage: string | null;
};

export default function HeroSection({ heroImage }: THeroSectionProps) {
  return (
    <section className="relative isolate overflow-hidden rounded-3xl bg-gray-950 px-5 py-14 text-white sm:px-10 sm:py-20 lg:px-14 lg:py-20">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-20 -top-20 -z-10 h-80 w-80 rounded-full bg-orange-500/20 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 -z-10 h-80 w-80 rounded-full bg-orange-500/10 blur-[100px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        {/* Hero Content */}
        <div className="flex flex-col items-start">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            Premium Car Rental
          </span>

          <h1 className="max-w-2xl text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            Drive More.
            <span className="mt-2 block text-orange-500">Worry Less.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-gray-300 sm:text-lg">
            Find the perfect car for every journey. Explore our collection, book
            with confidence, and enjoy a simpler rental experience with GoDrive.
          </p>

          {/* Actions */}
          <div className="mt-9 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
            <Link
              to="/cars"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-orange-500 px-8 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition duration-300 hover:-translate-y-1 hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
            >
              Browse Cars
              <span aria-hidden="true" className="text-lg">
                →
              </span>
            </Link>

            <a
              href="#how-it-works"
              className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-8 text-sm font-bold text-white transition duration-300 hover:border-orange-400/50 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
            >
              How It Works
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-white/10 pt-7">
            <div>
              <p className="text-sm font-bold text-white">Easy Booking</p>
              <p className="mt-1 text-xs text-gray-400">
                Simple reservation process
              </p>
            </div>

            <div className="hidden h-9 w-px bg-white/15 sm:block" />

            <div>
              <p className="text-sm font-bold text-white">Flexible Choices</p>
              <p className="mt-1 text-xs text-gray-400">
                Cars for every journey
              </p>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative mx-auto w-full min-w-0 max-w-2xl lg:max-w-none">
          <div className="absolute -inset-4 rounded-[2rem] bg-orange-500/10 blur-2xl" />

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gray-900 shadow-2xl shadow-black/40">
            {heroImage ? (
              <img
                src={heroImage}
                alt="Featured car available for rent on GoDrive"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="aspect-[4/3] w-full object-cover transition duration-700 hover:scale-105 lg:aspect-[5/4]"
              />
            ) : (
              <div className="flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-br from-gray-800 to-gray-950 lg:aspect-[5/4]">
                <div className="text-center">
                  <p className="text-4xl font-black tracking-tight text-white">
                    Go<span className="text-orange-500">Drive</span>
                  </p>
                  <p className="mt-2 text-sm text-gray-400">
                    Your journey starts here.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Floating Label */}
          <div className="absolute -bottom-5 left-3 max-w-[calc(100%-1.5rem)] rounded-xl border border-white/10 bg-white px-4 py-3 shadow-xl sm:left-8 sm:px-5">
            <p className="text-xs font-medium text-gray-500">
              Your next journey
            </p>
            <p className="mt-1 text-sm font-black text-gray-950">
              Starts with GoDrive
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
