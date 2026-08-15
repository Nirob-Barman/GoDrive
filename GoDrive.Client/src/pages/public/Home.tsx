import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1>GoDrive</h1>
      <p>Car rental reservations, done right.</p>
      <p>
        <Link to="/cars">Browse available cars</Link>
      </p>
    </div>
  );
}
