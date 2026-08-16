import { Link } from "react-router-dom";

type TCTASectionProps = {
  isAuthenticated: boolean;
};

export default function CTASection({ isAuthenticated }: TCTASectionProps) {
  return (
    <section className="landing-cta-band">
      <h2>Ready to Get Moving?</h2>
      <p>Find a car that fits your journey and start your next trip with GoDrive.</p>
      <div className="landing-actions">
        <Link to="/cars" className="btn btn-primary btn-lg">
          Browse Cars
        </Link>
        {!isAuthenticated && (
          <Link to="/register" className="btn btn-lg">
            Create an Account
          </Link>
        )}
      </div>
    </section>
  );
}
