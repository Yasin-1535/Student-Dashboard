import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/analytics/dashboard');
        setStats(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <DashboardLayout role="admin"><div className="p-4 text-center">Loading...</div></DashboardLayout>;

  const passFailData = {
    labels: ['Passed', 'Failed'],
    datasets: [
      {
        data: [stats.passed, stats.failed],
        backgroundColor: ['#4ade80', '#f87171'],
        borderWidth: 1,
      },
    ],
  };

  const gradeDistData = {
    labels: Object.keys(stats.grade_distribution),
    datasets: [
      {
        label: 'Number of Grades',
        data: Object.values(stats.grade_distribution),
        backgroundColor: '#6366f1',
      },
    ],
  };

  return (
    <DashboardLayout role="admin">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">Detailed performance insights.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Pass / Fail Ratio</h2>
          <div className="h-64 flex justify-center">
            <Pie data={passFailData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Grade Distribution</h2>
          <div className="h-64">
            <Bar 
              data={gradeDistData} 
              options={{ 
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true } }
              }} 
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
