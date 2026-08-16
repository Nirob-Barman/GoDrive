import { VALUE_ITEMS } from "../homeData";

export default function ValueStrip() {
  return (
    <section className="landing-value-strip" aria-label="Why choose GoDrive">
      {VALUE_ITEMS.map((item) => (
        <div key={item.title} className="landing-value-item">
          <span className="landing-value-icon" aria-hidden="true">
            {item.icon}
          </span>
          <h3>{item.title}</h3>
          <p className="text-sm text-muted">{item.description}</p>
        </div>
      ))}
    </section>
  );
}
