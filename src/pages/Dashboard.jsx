// src/pages/Dashboard.jsx

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { useUsers } from '../contexts/UserContext'; // Corrected import path
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { countUsersByRole, getTotalUserCount, exportUsers } = useUsers(); // Ensure exportUsers is included
  const [totalUsers, setTotalUsers] = useState(0);
  const [roleCounts, setRoleCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch total number of users
        const total = await getTotalUserCount();
        setTotalUsers(total || 0);

        // Fetch user counts by role
        const countsData = await countUsersByRole();
        // Transform countsData to an object with role as key and count as value
        const counts = {};
        countsData.forEach(item => {
          counts[item.role] = item.count;
        });
        setRoleCounts(counts || {});
      } catch (error) {
        // Handle errors and provide feedback
        const errorMessage = error?.message || 'An unexpected error occurred.';
        toast.error(`Error fetching dashboard data: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [countUsersByRole, getTotalUserCount]);

  // Prepare chart data with defensive checks
  const chartData = {
    labels: roleCounts && typeof roleCounts === 'object' ? Object.keys(roleCounts) : [],
    datasets: [
      {
        label: 'Number of Users',
        data: roleCounts && typeof roleCounts === 'object' ? Object.values(roleCounts) : [],
        backgroundColor: 'rgba(59, 130, 246, 0.5)', // Blue color
      },
    ],
  };

  /**
   * Handler for exporting users
   */
  const handleExport = () => {
    exportUsers('csv'); // You can change the format if needed
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <button
        onClick={handleExport}
        className="mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? 'Exporting...' : 'Export Users'}
      </button>
      {loading ? (
        <p>Loading dashboard data...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Users Card */}
            <div className="p-6 bg-white shadow-md rounded-md">
              <h2 className="text-xl font-semibold mb-2">Total Users</h2>
              <p className="text-4xl">{totalUsers}</p>
            </div>
            {/* Users by Role Chart */}
            <div className="p-6 bg-white shadow-md rounded-md">
              <h2 className="text-xl font-semibold mb-4">Users by Role</h2>
              {chartData.labels.length > 0 ? (
                <Bar data={chartData} />
              ) : (
                <p>No data available to display the chart.</p>
              )}
            </div>
          </div>
          {/* Additional Analytics and Metrics can be added here */}
        </>
      )}
    </div>
  );
};

export default Dashboard;
