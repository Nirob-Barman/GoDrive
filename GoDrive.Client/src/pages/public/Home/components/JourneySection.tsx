import { Link } from "react-router-dom";

type TJourneySectionProps = {
  image: string | null;
};

export default function JourneySection({ image }: TJourneySectionProps) {
  return (
    <section className="relative isolate mb-24 overflow-hidden rounded-3xl bg-gray-950 px-6 py-14 text-white sm:px-10 sm:py-16 lg:px-16 lg:py-20">
      {/* Background Effects */}
      <div className="pointer-events-none absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 -z-10 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="relative z-10 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Content */}
        <div className="max-w-xl">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            Your Journey Matters
          </span>

          <h2 className="text-3xl font-black leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-5xl">
            Built Around
            <span className="mt-1 block text-orange-500">Your Journey.</span>
          </h2>

          <p className="mt-6 max-w-lg text-sm leading-8 text-gray-400 sm:text-base">
            From choosing your car to returning it, GoDrive keeps your rental
            experience simple, convenient, and organized. Spend less time
            worrying about transportation and more time enjoying the journey.
          </p>

          {/* CTA */}
          <Link
            to="/cars"
            className="mt-9 inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-orange-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition duration-300 hover:-translate-y-1 hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
          >
            Explore Cars
            <span aria-hidden="true" className="text-lg">
              →
            </span>
          </Link>

          {/* Supporting Text */}
          <p className="mt-6 text-xs font-medium tracking-wide text-gray-500">
            Simple booking. Flexible choices. Better journeys.
          </p>
        </div>

        {/* Image */}
        <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
          <div className="absolute -inset-4 rounded-[2rem] bg-orange-500/10 blur-2xl" />

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gray-900 shadow-2xl shadow-black/40">
            {image ? (
              <img
                src={image}
                alt="Discover your next journey with GoDrive"
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-gray-800 to-gray-950">
                <p className="text-4xl font-black tracking-tight text-white">
                  Go<span className="text-orange-500">Drive</span>
                </p>
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-950/40 via-transparent to-transparent" />
          </div>

          {/* Floating Label */}
          <div className="absolute -bottom-5 left-3 rounded-xl border border-white/10 bg-white px-5 py-3 shadow-xl sm:left-8">
            <p className="text-xs font-medium text-gray-500">
              Every journey counts
            </p>

            <p className="mt-1 text-sm font-black text-gray-950">
              Drive with confidence.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
