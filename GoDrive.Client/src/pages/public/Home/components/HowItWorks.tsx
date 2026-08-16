import { STEPS } from "../homeData";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="landing-section">
      <div className="landing-section-header centered">
        <h2>Your Journey Starts Here</h2>
      </div>
      <ol className="landing-steps">
        {STEPS.map((step) => (
          <li key={step.number} className="landing-step">
            <span className="landing-step-number" aria-hidden="true">
              {step.number}
            </span>
            <h3>{step.title}</h3>
            <p className="text-sm text-muted">{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
