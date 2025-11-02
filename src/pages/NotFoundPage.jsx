import './NotFoundPage.css';
import { Header } from '../components/Header';
import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <>
      <Header />
      <div className="not-found-container">
        <h1 className="not-found-title">404</h1>
        <p className="not-found-message">Oops! The page you're looking for doesn't exist.</p>
        <div className="not-found-animation">
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
        </div>
        <Link to="/" className="go-home-link">Go back to Home</Link>
      </div>
    </>
  );
}
