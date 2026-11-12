import { VALUE_ITEMS } from "../homeData";

export default function ValueStrip() {
  return (
    <section
      className="relative z-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
      aria-label="Why choose GoDrive"
    >
      {VALUE_ITEMS.map((item, index) => (
        <div
          key={item.title}
          className="group flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5"
        >
          {/* Icon and Number */}
          <div className="mb-5 flex items-center justify-between">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-500 transition-colors duration-300 group-hover:bg-orange-500 group-hover:text-white [&>svg]:h-6 [&>svg]:w-6">
              {item.icon}
            </span>

            <span className="text-sm font-bold tracking-widest text-gray-200 transition-colors group-hover:text-orange-200">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Content */}
          <h3 className="mb-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-orange-500">
            {item.title}
          </h3>

          <p className="flex-1 text-sm leading-7 text-gray-500">
            {item.description}
          </p>

          {/* Bottom Accent */}
          <div className="mt-5 h-1 w-10 rounded-full bg-orange-500/30 transition-all duration-300 group-hover:w-16 group-hover:bg-orange-500" />
        </div>
      ))}
    </section>
  );
}
