import { BENEFITS } from "../homeData";

export default function BenefitsSection() {
  return (
    <section className="landing-section">
      <div className="landing-section-header">
        <h2>Everything You Need for a Better Rental</h2>
      </div>
      <ul className="landing-benefits">
        {BENEFITS.map((benefit) => (
          <li key={benefit} className="landing-benefit">
            <svg
              className="landing-benefit-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m5 12.5 4.5 4.5L19 7.5" />
            </svg>
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
