import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="hero">
      <h1>GoDrive</h1>
      <p className="hero-subtitle">Car rental reservations, done right.</p>
      <Link to="/cars" className="btn btn-primary btn-lg">
        Browse available cars
      </Link>
    </div>
  );
}
