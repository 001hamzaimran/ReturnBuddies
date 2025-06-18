import React from 'react';
import { Link } from 'react-router-dom';

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-4 py-12">
      {/* Large 404 Number */}
      <h1 className="text-[10rem] sm:text-[12rem] font-bold text-[#b152ee] leading-none">404</h1>

      {/* Message */}
      <h2 className="text-3xl sm:text-4xl font-semibold text-black mb-4">
        Page not found
      </h2>

      <p className="text-gray-600 mb-8">
        Sorry, the page you're looking for doesn’t exist or has been moved.
      </p>

      {/* Go Home Button */}
      <Link
        to="/admin/dashboard"
        className="inline-block bg-[#b152ee] hover:bg-[#9d3ddf] text-white font-semibold px-6 py-3 rounded-full transition"
      >
        Go to Dashbaord
      </Link>
    </div>
  );
}
