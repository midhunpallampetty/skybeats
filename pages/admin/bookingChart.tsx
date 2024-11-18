"use client"

import React, { useEffect, useState } from 'react';
import { Bar, BarChart, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import axios from 'axios';
import { bookData } from '@/interfaces/bookData';

const categoryData = [
  { category: "Alpha", value: 8 },
  { category: "Omega", value: 6 },
  { category: "Meta", value: 4 },
  { category: "Strategic", value: 7 },
  { category: "Growth", value: 5 },
  { category: "Tech", value: 8 },
  { category: "Series", value: 6 },
];

const pieData1 = [
  { name: "Education", value: 30, fill: "#00ffff" },
  { name: "Fixed", value: 25, fill: "#ffff00" },
  { name: "Retail", value: 25, fill: "#ff00ff" },
  { name: "Fleet", value: 20, fill: "#00ff00" },
];

const pieData2 = [
  { name: "50M", value: 20, fill: "#00ffff" },
  { name: "50-100M", value: 25, fill: "#0099ff" },
  { name: "100-150M", value: 20, fill: "#ff00ff" },
  { name: "200-250M", value: 20, fill: "#ffff00" },
  { name: "250M", value: 15, fill: "#00ff00" },
];

const companyData = [
  { company: "Green Valley", amount: "1.5 mill", time: "2018.3", name: "Stella" },
  { company: "Xinyu", amount: "2 mill", time: "2018.4", name: "Avril" },
  { company: "Hongfei", amount: "0.5 mill", time: "2018.5", name: "Joe" },
  { company: "ev2", amount: "1 mill", time: "2018.6", name: "Stan" },
];

export default function InvestmentDashboard() {
  const [bookings, setBookings] = useState<bookData[]>([]);
  const [weeklyData, setWeeklyData] = useState([
    { day: "Mon", value: 0 },
    { day: "Tue", value: 0 },
    { day: "Wed", value: 0 },
    { day: "Thu", value: 0 },
    { day: "Fri", value: 0 },
    { day: "Sat", value: 0 },
    { day: "Sun", value: 0 },
  ]);
  const [total, setTotal] = useState(0);
  const [pieData, setPieData] = useState<any[]>([]); // To store the top 4 arrival airports pie data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: any = await axios.get('/api/getBookings');
        console.log(response.data, 'congratulations.........');
        setBookings(response?.data);
      } catch (error) {
        console.log('An error occurred', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (bookings) {
      let total = 0;
      for (let i of bookings) {
        total += i.FarePaid;
      }
      setTotal(total);
    }
  }, [bookings]);

  useEffect(() => {
    if (bookings) {
      // Create a copy of the weekly data
      const updatedWeeklyData = [...weeklyData];

      bookings.forEach((booking) => {
        // Parse createdAt and ensure it's a valid number
        const timestamp = parseInt(booking.createdAt, 10);
        if (isNaN(timestamp)) {
          console.warn("Invalid createdAt value:", booking.createdAt);
          return; // Skip invalid entries
        }

        const date = new Date(timestamp); // Convert timestamp to Date
        if (isNaN(date.getTime())) {
          console.warn("Invalid date object for:", booking.createdAt);
          return; // Skip invalid date objects
        }

        // Get the abbreviated weekday name (e.g., Mon, Tue)
        const formattedDay = new Intl.DateTimeFormat("en-US", {
          weekday: "short", // Abbreviated weekday (e.g., Mon)
        }).format(date);

        // Map the formatted day to our weekly data days
        const dayMapping = {
          Sun: "Sun",
          Mon: "Mon",
          Tue: "Tue",
          Wed: "Wed",
          Thu: "Thu",
          Fri: "Fri",
          Sat: "Sat",
        };

        const day = dayMapping[formattedDay];
        if (day) {
          const dayIndex = updatedWeeklyData.findIndex((d) => d.day === day);
          if (dayIndex !== -1) {
            updatedWeeklyData[dayIndex].value += 1; // Increment count for the day
          }
        }
      });

      setWeeklyData(updatedWeeklyData); // Update state with the new weekly data
    }
  }, [bookings]);

  useEffect(() => {
    if (bookings) {
      // Count bookings per arrival airport
      const arrivalAirportCounts: { [key: string]: number } = {};

      bookings.forEach((booking) => {
        const arrivalAirport = booking.arrivalAirport; // Assuming this field is available

        if (arrivalAirport) {
          // Increment the booking count for the corresponding arrival airport
          arrivalAirportCounts[arrivalAirport] = (arrivalAirportCounts[arrivalAirport] || 0) + 1;
        }
      });

      // Convert the counts into an array and sort by the value (total bookings)
      const sortedAirports = Object.entries(arrivalAirportCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value); // Sort by value (descending)

      // Get top 4 airports (or fewer if there aren't enough)
      const topAirports = sortedAirports.slice(0, 4);

      // Create the pie data in the required format
      const pieData1 = topAirports.map((airport) => ({
        name: airport.name,
        value: airport.value,
        fill: getRandomColor(), // Optional: Assign random colors if needed
      }));

      setPieData(pieData1); // Update state with pie chart data
    }
  }, [bookings]);

  // Function to generate a random color (optional)
  const getRandomColor = () => {
    const getRandomComponent = () => Math.floor(Math.random() * 128); // Range from 0 to 127 (dark colors)
    const r = getRandomComponent();
    const g = getRandomComponent();
    const b = getRandomComponent();
  
    return `rgb(${r}, ${g}, ${b})`; // Return in RGB format
  };
  

  return (
    <div className="min-h-screen bg-[#050b2c] p-8 text-white">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold text-[#00ffff]">Total Airline Booking Report</h1>
        <div className="text-5xl font-bold">₹{total || 0}</div>
      </header>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "500+ Staff" },
          { label: "30+ Industries" },
          { label: "Professional" },
          { label: "Experienced" },
        ].map((stat, index) => (
          <div key={index} className="flex items-center gap-2 rounded-lg bg-[#0a1445] p-4">
            <div className="rounded-full bg-[#00ffff] p-2" aria-hidden="true" />
            <span>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Weekly Trend */}
        <div className="rounded-lg bg-[#0a1445] p-4">
          <h2 className="mb-4 text-xl font-semibold">Weekly Trend</h2>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <Line type="monotone" dataKey="value" stroke="#ffffff" strokeWidth={3} dot={false} />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="rounded-lg bg-[#0a1445] p-4">
          <h2 className="mb-4 text-xl font-semibold">Category Distribution</h2>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <Bar dataKey="value" fill="#00ffff" />
                <Tooltip />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart for Arrival Airports */}
        <div className="rounded-lg bg-[#0a1445] p-4">
          <h2 className="mb-4 text-xl font-semibold">Top 4 Arrival Airports</h2>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="90%" />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="col-span-full rounded-lg bg-[#0a1445] p-4 m-10">
          <h2 className="mb-4 text-xl font-semibold">Company Information</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left font-semibold">Fare</th>
                  <th className="text-left font-semibold">Departure</th>
                  <th className="text-left font-semibold">Arrival</th>
                  <th className="text-left font-semibold">Phone</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => (
                  <tr key={index} className="border-t border-gray-700">
                    <td className="py-2">{booking?.FarePaid}</td>
                    <td className="py-2">{booking?.departureAirport}</td>
                    <td className="py-2">{booking?.arrivalAirport}</td>
                    <td className="py-2">{booking?.phoneNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>

        </div>
      </div>
    </div>
    
  );
}
