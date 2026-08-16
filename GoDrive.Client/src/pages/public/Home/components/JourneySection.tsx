import { Link } from "react-router-dom";

type TJourneySectionProps = {
  image: string | null;
};

export default function JourneySection({ image }: TJourneySectionProps) {
  return (
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
      {image && (
        <div className="landing-dark-visual">
          <img src={image} alt="A car available to rent on GoDrive" loading="lazy" />
        </div>
      )}
    </section>
  );
}
