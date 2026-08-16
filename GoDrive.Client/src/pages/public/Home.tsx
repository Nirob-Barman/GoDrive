import { Link } from "react-router-dom";
import { useGetCarsQuery } from "../../redux/features/cars/carsApi";
import { useAppSelector } from "../../redux/hooks";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";
import CarCard from "../../components/CarCard";
import { SkeletonGrid } from "../../components/ui/Skeleton";

const VALUE_ITEMS = [
  {
    title: "Wide Selection",
    description: "Find a vehicle that fits your journey.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12.5 5 7a2 2 0 0 1 1.9-1.4h10.2A2 2 0 0 1 19 7l2 5.5" />
        <path d="M3 12.5h18v4a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1V16h-11v.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
        <circle cx="7" cy="16.5" r="1.3" />
        <circle cx="17" cy="16.5" r="1.3" />
      </svg>
    ),
  },
  {
    title: "Transparent Pricing",
    description: "Clear hourly rental pricing.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12 12.6 4.6a2 2 0 0 0-1.4-.6H5a1 1 0 0 0-1 1v6.2c0 .5.2 1 .6 1.4L12 20a2 2 0 0 0 2.8 0l5.2-5.2a2 2 0 0 0 0-2.8Z" />
        <circle cx="8.5" cy="8.5" r="1.3" />
      </svg>
    ),
  },
  {
    title: "Secure Booking",
    description: "A reliable reservation and payment experience.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3.5 5 6v5.5c0 4.2 2.9 7.4 7 8.5 4.1-1.1 7-4.3 7-8.5V6z" />
        <path d="m9.3 12.2 1.8 1.8 3.6-3.6" />
      </svg>
    ),
  },
  {
    title: "Easy Management",
    description: "Manage your reservations from your account.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M4 9.5h16M8 3v3M16 3v3" />
        <path d="m8.5 14 2 2 4-4" />
      </svg>
    ),
  },
];

const STEPS = [
  { number: "01", title: "Choose Your Car", description: "Browse available vehicles and select the right one." },
  { number: "02", title: "Book Your Ride", description: "Choose your pickup and drop-off schedule." },
  { number: "03", title: "Get Approved", description: "Your reservation is reviewed and approved." },
  { number: "04", title: "Hit the Road", description: "Complete payment, pick up your car, and enjoy your journey." },
];

const BENEFITS = [
  "Easy car discovery with search and filters",
  "Simple, straightforward reservations",
  "Secure payments through Stripe",
  "Clear, real-time booking status",
  "Convenient account and reservation management",
];

export default function Home() {
  const user = useAppSelector(selectCurrentUser);
  const { data, isLoading } = useGetCarsQuery({ pageNumber: 1, pageSize: 6 });
  const featuredCars = data?.items ?? [];
  const heroImage = featuredCars.find((c) => c.primaryImageUrl)?.primaryImageUrl ?? null;
  const darkSectionImage = featuredCars.find((c) => c.primaryImageUrl && c.primaryImageUrl !== heroImage)?.primaryImageUrl ?? null;

  return (
    <div className="landing">
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

      <section className="landing-section">
        <div className="landing-section-header">
          <h2>Find Your Perfect Ride</h2>
          <p>Explore some of the vehicles available through GoDrive.</p>
        </div>

        {isLoading && <SkeletonGrid count={6} />}
        {!isLoading && featuredCars.length === 0 && (
          <p className="text-sm text-muted">No cars available right now — check back soon.</p>
        )}
        {featuredCars.length > 0 && (
          <>
            <div className="car-grid">
              {featuredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
            <div className="landing-section-footer">
              <Link to="/cars" className="btn">
                View All Cars &rarr;
              </Link>
            </div>
          </>
        )}
      </section>

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

      <section className="landing-dark-section">
        <div className="landing-dark-content">
          <h2>Built Around Your Journey.</h2>
          <p>
            From choosing your car to returning it, GoDrive keeps the rental experience simple and
            organized.
          </p>
          <Link to="/cars" className="btn btn-primary btn-lg">
            Explore Cars
          </Link>
        </div>
        {darkSectionImage && (
          <div className="landing-dark-visual">
            <img src={darkSectionImage} alt="A car available to rent on GoDrive" loading="lazy" />
          </div>
        )}
      </section>

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

      <section className="landing-cta-band">
        <h2>Ready to Get Moving?</h2>
        <p>Find a car that fits your journey and start your next trip with GoDrive.</p>
        <div className="landing-actions">
          <Link to="/cars" className="btn btn-primary btn-lg">
            Browse Cars
          </Link>
          {!user && (
            <Link to="/register" className="btn btn-lg">
              Create an Account
            </Link>
          )}
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer-grid">
          <div className="landing-footer-brand">
            <h3>GoDrive</h3>
            <p>A car rental reservation platform for finding, booking, and managing your next ride.</p>
          </div>
          <nav className="landing-footer-col" aria-label="Explore">
            <h4>Explore</h4>
            <ul>
              <li>
                <Link to="/cars">Cars</Link>
              </li>
              <li>
                <a href="#how-it-works">How It Works</a>
              </li>
            </ul>
          </nav>
          <nav className="landing-footer-col" aria-label="Account">
            <h4>Account</h4>
            <ul>
              {user ? (
                <>
                  <li>
                    <Link to="/reservations">My Reservations</Link>
                  </li>
                  <li>
                    <Link to="/profile">Profile</Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login">Log In</Link>
                  </li>
                  <li>
                    <Link to="/register">Sign Up</Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
        <p className="landing-footer-bottom">&copy; 2026 GoDrive. All rights reserved.</p>
      </footer>
    </div>
  );
}
