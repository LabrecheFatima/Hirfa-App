import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
        Master Real Skills with <span className="text-indigo-600">Hirfa Platform</span>
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-gray-600">
        Hands-on artisanal and technical workshops. Book passes, manage attendance, and receive QR check-ins seamlessly.
      </p>
      <div className="mt-8 flex gap-4">
        <Link to="/courses">
          <Button>Explore Catalog</Button>
        </Link>
      </div>
    </div>
  );
};