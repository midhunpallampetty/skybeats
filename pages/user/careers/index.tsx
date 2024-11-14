'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Carousel } from 'flowbite-react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setSelectedJob } from '@/redux/slices/jobSlice';
import Link from 'next/link';

interface Job {
  description: string;
  designation: string;
  Image?: string;
  salary: number;
  createdAt: string; // ISO date string
}

const JobBoard = () => {
  const Navbar = dynamic(() => import('../../components/Navbar'));
  const ChatBox = dynamic(() => import('../../components/ChatBox'));
  const dispatch = useDispatch();
  const router = useRouter();

  const [career, setCareer] = useState<Job[]>([]);
  const [filteredCareer, setFilteredCareer] = useState<Job[]>([]);
  const token = Cookies.get('jwtToken');
  const [expandedJobIndex, setExpandedJobIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(4);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortBy, setSortBy] = useState<'designation' | 'salary' | 'createdAt'>('designation');
  const [selectedDesignation, setSelectedDesignation] = useState<string>('');

  useEffect(() => {
    const fetchCareerData = async () => {
      try {
        const response = await axios.get('/api/getCareer');
        if (response.data && response.data.getJobs) {
          setCareer(response.data.getJobs);
          setFilteredCareer(response.data.getJobs);
        } else {
          console.error('getJobs array not found in the response data');
        }
      } catch (error) {
        console.error('Error fetching career data:', error);
      }
    };
    fetchCareerData();
  }, []);

  useEffect(() => {
    if (!token) {
      router.push('/');
    }
  }, [token, router]);

  const handleDetailsClick = (job: Job) => {
    dispatch(setSelectedJob(job));
    router.push('/user/careers/careerDetails');
  };

  const toggleShowMore = (index: number) => {
    setExpandedJobIndex(expandedJobIndex === index ? null : index);
  };

  const handleSort = (sortOrder: 'asc' | 'desc', sortBy: 'designation' | 'salary' | 'createdAt') => {
    setSortOrder(sortOrder);
    setSortBy(sortBy);

    const sortedJobs = [...filteredCareer].sort((a, b) => {
      if (sortBy === 'designation') {
        return sortOrder === 'asc'
          ? a.designation.localeCompare(b.designation)
          : b.designation.localeCompare(a.designation);
      } else if (sortBy === 'salary') {
        return sortOrder === 'asc' ? a.salary - b.salary : b.salary - a.salary;
      } else if (sortBy === 'createdAt') {
        const dateA = new Date(a.createdAt).getTime(); // Convert to timestamp
        const dateB = new Date(b.createdAt).getTime(); // Convert to timestamp
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });
    setFilteredCareer(sortedJobs);
  };

  const handleFilterByDesignation = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const designation = event.target.value;
    setSelectedDesignation(designation);
    const filteredJobs = designation
      ? career.filter((job) => job.designation === designation)
      : career;
    setFilteredCareer(filteredJobs);
    setCurrentPage(1);
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredCareer.slice(indexOfFirstJob, indexOfLastJob);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      <Navbar />
      <ChatBox />

      <div className="h-56 mt-[50px] sm:h-[85] xl:h-80 2xl:h-[600px]">
        <Carousel>
          <img
            src="https://airline-datacenter.s3.ap-south-1.amazonaws.com/e9f1d460-5e31-4a2c-9348-85d8ba317708.jpeg"
            alt="Career Carousel 1"
          />
        </Carousel>
      </div>

      <div className="flex justify-center h-[500px]" style={{ backgroundImage: `
        linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
      `, backgroundSize: '40px 40px' }}>
        <div className="flex flex-col md:flex-row mt-20 max-w-[1200px] w-full">
          <div className="w-full md:w-[350px] p-4 bg-blue-950 text-white rounded-lg ml-4">
            <h3 className="font-bold mb-4">Filters</h3>
            <div className="space-y-4">
              <div>
                <label className="font-bold mb-2 block">Sort by:</label>
                <select
                  onChange={(e) => handleSort(sortOrder, e.target.value as 'designation' | 'salary' | 'createdAt')}
                  value={sortBy}
                  className="w-full py-2 px-4 bg-gray-200 text-black rounded"
                >
                  <option value="designation">Designation</option>
                  <option value="salary">Salary</option>
                  <option value="createdAt">Latest</option>
                </select>
                <select
                  onChange={(e) => handleSort(e.target.value as 'asc' | 'desc', sortBy)}
                  value={sortOrder}
                  className="w-full py-2 px-4 bg-gray-200 text-black rounded mt-2"
                >
                  <option value="asc">Low to High</option>
                  <option value="desc">High to Low</option>
                </select>
              </div>
              <div>
                <label className="font-bold mb-2 block">Filter by Designation:</label>
                <select
                  onChange={handleFilterByDesignation}
                  value={selectedDesignation}
                  className="w-full py-2 px-4 bg-gray-200 text-black rounded"
                >
                  <option value="">All</option>
                  {[...new Set(career.map((job) => job.designation))].map((designation, index) => (
                    <option key={index} value={designation}>
                      {designation}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="w-full md:w-3/4 p-4 ml-11">
            <div className="grid grid-cols-1 gap-6">
              {currentJobs.length > 0 ? (
                currentJobs.map((job, index) => (
                  <div
                    key={index}
                    className="bg-blue-950 text-white w-full min-h-[300px] p-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 ease-in-out"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-32 h-32 rounded-md overflow-hidden shadow-inner border-2 border-blue-500 mb-4">
                        <img
                          src={job.Image}
                          alt="Job Image"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 text-center">
                        <h2 className="font-bold text-lg mb-2">
                          {expandedJobIndex === index
                            ? job.description
                            : `${job.description.slice(0, 50)}...`}
                        </h2>
                        <p className="text-gray-300 text-sm mb-4">{job.designation}</p>
                        <p className="text-white font-semibold text-lg mb-4">
                          Salary: {job.salary} LPA
                        </p>
                        
                      </div>

                      <div className="flex mt-auto">
                        <button
                          onClick={() => handleDetailsClick(job)}
                          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md mr-4"
                        >
                          Apply Now
                        </button>

                        <button
                          onClick={() => toggleShowMore(index)}
                          className="text-blue-400 hover:text-blue-500"
                        >
                          {expandedJobIndex === index ? 'Show Less' : 'Show More'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center">No jobs available at the moment.</p>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Previous
              </button>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={indexOfLastJob >= filteredCareer.length}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobBoard;
