import React from "react";
import { Link } from "react-router-dom";
import Error403 from "../assets/svg/403.svg";

const Unauthorized = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100 p-6">
      <img src={Error403} alt="Access Denied" className="h-64 w-64" />
      <h1 className="mt-6 text-6xl font-bold text-red-600">403</h1>
      <p className="mt-2 text-xl text-gray-700">
        Oops! You don’t have permission to access this page.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white shadow-md transition hover:bg-blue-700"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default Unauthorized;
