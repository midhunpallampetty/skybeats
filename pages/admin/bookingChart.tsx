"use client"

import React from 'react'
import { Bar, BarChart, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import {useEffect,useState} from 'react';
import { bookData } from '@/interfaces/bookData';
import axios from 'axios';
const weeklyData = [
  { day: "Mon", value: 180 },
  { day: "Tue", value: 150 },
  { day: "Wed", value: 190 },
  { day: "Thu", value: 140 },
  { day: "Fri", value: 120 },
  { day: "Sat", value: 80 },
  { day: "Sun", value: 70 },
]

const categoryData = [
  { category: "Alpha", value: 8 },
  { category: "Omega", value: 6 },
  { category: "Meta", value: 4 },
  { category: "Strategic", value: 7 },
  { category: "Growth", value: 5 },
  { category: "Tech", value: 8 },
  { category: "Series", value: 6 },
]

const pieData1 = [
  { name: "Education", value: 30, fill: "#00ffff" },
  { name: "Fixed", value: 25, fill: "#ffff00" },
  { name: "Retail", value: 25, fill: "#ff00ff" },
  { name: "Fleet", value: 20, fill: "#00ff00" },
]

const pieData2 = [
  { name: "50M", value: 20, fill: "#00ffff" },
  { name: "50-100M", value: 25, fill: "#0099ff" },
  { name: "100-150M", value: 20, fill: "#ff00ff" },
  { name: "200-250M", value: 20, fill: "#ffff00" },
  { name: "250M", value: 15, fill: "#00ff00" },
]

const companyData = [
  { company: "Green Valley", amount: "1.5 mill", time: "2018.3", name: "Stella" },
  { company: "Xinyu", amount: "2 mill", time: "2018.4", name: "Avril" },
  { company: "Hongfei", amount: "0.5 mill", time: "2018.5", name: "Joe" },
  { company: "ev2", amount: "1 mill", time: "2018.6", name: "Stan" },
]

export default function InvestmentDashboard() {
    const [bookings, setBookings] = useState<bookData[]>([]);
    const [total,setTotal]=useState(0)
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
     useEffect(()=>{
     if(bookings){
        let total=0;
        for(let i of bookings){
         total+=i.FarePaid;
        }
        setTotal(total)
     }
     },[bookings])
  return (
    <div className="min-h-screen bg-[#050b2c] p-8 text-white">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold text-[#00ffff]">Total Airline Booking Report</h1>
        <div className="text-5xl font-bold">₹{total ||0}</div>
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
                <Line type="monotone" dataKey="value" stroke="#00ffff" strokeWidth={2} dot={false} />
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

        {/* Pie Charts */}
        <div className="rounded-lg bg-[#0a1445] p-4">
          <h2 className="mb-4 text-xl font-semibold">Investment Distribution</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData1}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                  />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData2}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                  />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Company Table */}
        <div className="col-span-full rounded-lg bg-[#0a1445] p-4">
          <h2 className="mb-4 text-xl font-semibold">Company Information</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left font-semibold">Company</th>
                  <th className="text-left font-semibold">Amount</th>
                  <th className="text-left font-semibold">Time</th>
                  <th className="text-left font-semibold">Name</th>
                </tr>
              </thead>
              <tbody>
                {companyData.map((row, index) => (
                  <tr key={index} className="border-t border-gray-700">
                    <td className="py-2">{row.company}</td>
                    <td className="py-2">{row.amount}</td>
                    <td className="py-2">{row.time}</td>
                    <td className="py-2">{row.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}