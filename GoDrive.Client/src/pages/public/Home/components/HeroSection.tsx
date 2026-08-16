import { Link } from "react-router-dom";

type THeroSectionProps = {
  heroImage: string | null;
};

export default function HeroSection({ heroImage }: THeroSectionProps) {
  return (
    <section className="landing-hero">
      <div className="landing-hero-content">
        <span className="landing-eyebrow">Premium Car Rental</span>
        <h1>Drive More. Worry Less.</h1>
        <p className="landing-hero-lead">
          Find the right car for your journey and book your next ride with GoDrive.
        </p>
        <div className="landing-actions">
          <Link to="/cars" className="btn btn-primary btn-lg">
            Browse Cars
          </Link>
          <a href="#how-it-works" className="btn btn-lg">
            How It Works
          </a>
        </div>
      </div>
      <div className="landing-hero-visual">
        {heroImage ? (
          <img src={heroImage} alt="A car available to rent on GoDrive" loading="eager" />
        ) : (
          <div className="landing-hero-visual-placeholder">GoDrive</div>
        )}
      </div>
    </section>
  );
}
