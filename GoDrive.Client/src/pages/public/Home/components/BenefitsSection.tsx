import { BENEFITS } from "../homeData";

export default function BenefitsSection() {
  return (
    <section className="mb-24">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left: Section Heading */}
        <div className="max-w-xl">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            The GoDrive Advantage
          </span>

          <h2 className="text-3xl font-black leading-tight tracking-tight text-gray-950 sm:text-4xl lg:text-5xl">
            Everything You Need
            <span className="block text-orange-500">for a Better Rental.</span>
          </h2>

          <p className="mt-5 max-w-lg text-sm leading-8 text-gray-500 sm:text-base">
            Enjoy a straightforward rental experience with features designed to
            make every journey easier. From finding your ideal vehicle to
            managing your reservations, GoDrive keeps everything simple.
          </p>

          {/* Dark Feature Panel */}
          <div className="relative mt-9 overflow-hidden rounded-2xl bg-gray-950 p-6 text-white sm:p-8">
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-orange-500/20 blur-3xl" />

            <div className="relative z-10">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <path d="M12 3.5 5 6v5.5c0 4.2 2.9 7.4 7 8.5 4.1-1.1 7-4.3 7-8.5V6z" />
                  <path d="m9.3 12.2 1.8 1.8 3.6-3.6" />
                </svg>
              </div>

              <h3 className="text-xl font-bold">A Better Way to Rent</h3>

              <p className="mt-3 max-w-md text-sm leading-7 text-gray-400">
                Discover vehicles, make reservations, and manage your rental
                experience through one convenient platform.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Benefits List */}
        <div>
          <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-5">
            <h3 className="text-lg font-extrabold text-gray-950">
              Why Choose GoDrive?
            </h3>

            <span className="text-xs font-bold tracking-widest text-gray-300">
              {String(BENEFITS.length).padStart(2, "0")} BENEFITS
            </span>
          </div>

          <ul className="divide-y divide-gray-100">
            {BENEFITS.map((benefit, index) => (
              <li
                key={benefit}
                className="group flex items-center gap-5 py-6 transition-colors duration-300"
              >
                {/* Number */}
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-sm font-black text-orange-500 transition duration-300 group-hover:bg-orange-500 group-hover:text-white">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Benefit */}
                <p className="flex-1 text-sm font-semibold leading-7 text-gray-700 transition-colors duration-300 group-hover:text-orange-600 sm:text-base">
                  {benefit}
                </p>

                {/* Arrow */}
                <span className="text-xl text-gray-300 transition duration-300 group-hover:translate-x-1 group-hover:text-orange-500">
                  →
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
