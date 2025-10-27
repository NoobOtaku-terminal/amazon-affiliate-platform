import React from 'react';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome, {user?.name}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Saved Products</h3>
          <p className="text-3xl font-bold text-primary-600">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Reviews Written</h3>
          <p className="text-3xl font-bold text-primary-600">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Comparisons</h3>
          <p className="text-3xl font-bold text-primary-600">0</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
