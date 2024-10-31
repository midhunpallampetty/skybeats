'use client';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale);

interface BookingChartProps {
   data: any; // Replace with your proper data type
}

const BookingChart: React.FC<BookingChartProps> = ({ data }) => {
   const chartData = {
      labels: data.map((booking: any) => booking.passengerName),
      datasets: [
         {
            label: 'Fare Paid',
            data: data.map((booking: any) => booking.FarePaid),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
         },
      ],
   };

   return <Bar data={chartData} />;
};

export default BookingChart;
