import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import AdminNavbar from '../components/AdminNavbar';
import Adminaside from '../components/Adminaside';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const BookingReport: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for JWT token
    const token = Cookies.get('jwtToken'); // Replace 'jwt' with your actual cookie name

    if (!token) {
      // Redirect to the sign-in page if no token is found
      router.push('/admin/signin'); // Adjust this path to your sign-in page
      return;
    }

    const ctx = chartRef.current?.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June'], // Example labels
          datasets: [
            {
              label: 'Bookings',
              data: [12, 19, 3, 5, 2, 3], // Example data
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            x: {
              grid: {
                color: 'rgba(255, 99, 132, 0.2)', // X-axis gridline color
              },
            },
            y: {
              grid: {
                color: 'rgba(54, 162, 235, 0.2)', // Y-axis gridline color
              },
            },
          },
        },
      });
    }

    return () => {
      if (ctx) {
        Chart.getChart(ctx)?.destroy();
      }
    };
  }, [router]);

  return (
    <>
      <AdminNavbar />
      <Adminaside />

      <div
        className="flex items-center justify-center min-h-screen bg-cover bg-center relative"
        style={{ backgroundImage: 'url(/admin-bg.png)' }}
      >
        {/* Overlay with 10% opacity */}
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}></div>
        <div className="relative chart-container w-[50%]">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </>
  );
};

export default BookingReport;
