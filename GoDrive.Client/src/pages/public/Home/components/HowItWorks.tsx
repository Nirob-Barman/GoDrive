import { STEPS } from "../homeData";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-28">
      {/* Section Heading */}
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
          Simple & Easy
        </span>

        <h2 className="text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
          Your Journey <span className="text-orange-500">Starts Here.</span>
        </h2>

        <p className="mt-4 text-sm leading-7 text-gray-500 sm:text-base">
          Getting your next rental car is simple. Follow these easy steps and
          hit the road with GoDrive.
        </p>
      </div>

      {/* Steps */}
      <ol
        aria-label="Steps to rent a car with GoDrive"
        className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {STEPS.map((step, index) => (
          <li
            key={step.number}
            className="group relative h-full rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5"
          >
            {/* Step Number */}
            <div className="mb-6 flex items-center justify-between">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-xl font-black text-orange-500 transition duration-300 group-hover:bg-orange-500 group-hover:text-white">
                {step.number}
              </span>

              <span
                aria-hidden="true"
                className="text-4xl font-black text-gray-100 transition group-hover:text-orange-100"
              >
                0{index + 1}
              </span>
            </div>

            {/* Step Content */}
            <h3 className="mb-3 text-lg font-bold text-gray-900 transition group-hover:text-orange-500">
              {step.title}
            </h3>

            <p className="text-sm leading-7 text-gray-500">
              {step.description}
            </p>

            {/* Bottom Decoration */}
            <div className="mt-6 h-1 w-10 rounded-full bg-orange-500/30 transition-all duration-300 group-hover:w-16 group-hover:bg-orange-500" />
          </li>
        ))}
      </ol>
    </section>
  );
}
