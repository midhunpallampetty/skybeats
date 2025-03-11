'use client';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import Cookies from 'js-cookie';
import { debounce } from 'lodash';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { setSelectedJob } from '@/redux/slices/jobSlice';
import axiosInstance from '@/pages/api/utils/axiosInstance';
import { Job } from '@/interfaces/Job';

const Navbar = dynamic(() => import('../../components/Navbar'), { ssr: false });
const ChatBox = dynamic(() => import('../../components/ChatBox'), { ssr: false });

const JobBoard = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [career, setCareer] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredCareer, setFilteredCareer] = useState<Job[]>([]);
  const accessToken = Cookies.get('accessToken');
  const [expandedJobIndex, setExpandedJobIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(2);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortBy, setSortBy] = useState<'designation' | 'salary' | 'createdAt'>('designation');
  const [selectedDesignation, setSelectedDesignation] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const isFetched = useRef(false); 
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;

  // Fetch job data from the server
  useEffect(() => {
    const fetchCareerData = async () => {
      try {
        const response = await axiosInstance.get('/getCareer');
        if (response.data?.getJobs) {
          setCareer(response.data.getJobs);
          setFilteredCareer(response.data.getJobs);
        } else {
          console.error('getJobs array not found in the response data');
        }
      } catch (error) {
        console.error('Error fetching career data:', error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      }
    };

    if (!isFetched.current) {
      // Only fetch data if it hasn't been fetched yet
      isFetched.current = true; // Mark as fetched
      fetchCareerData();
    }
  }, []);

  // Redirect to login if no access token
  useEffect(() => {
    if (!accessToken) {
      router.push('/');
    }
  }, [accessToken, router]);

  // Handle debounced search
  const handleSearch = debounce((query: string) => {
    const filteredJobs = career.filter((job) =>
      job.designation.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCareer(filteredJobs);
    setCurrentPage(1); // Reset pagination
  }, 300);

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  // Sort the job list
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
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });

    setFilteredCareer(sortedJobs);
  };

  // Filter by designation
  const handleFilterByDesignation = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const designation = event.target.value;
    setSelectedDesignation(designation);

    const filteredJobs = designation
      ? career.filter((job) => job.designation === designation)
      : career;

    setFilteredCareer(filteredJobs);
    setCurrentPage(1);
  };

  const currentJobs = useMemo(
    () => filteredCareer.slice(indexOfFirstJob, indexOfLastJob),
    [filteredCareer, indexOfFirstJob, indexOfLastJob]
  );

  const uniqueDesignations = useMemo(
    () => [...new Set(career.map((job) => job.designation))],
    [career]
  );

  // Handle pagination
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const toggleShowMore = (index: number) => {
    setExpandedJobIndex(expandedJobIndex === index ? null : index);
  };

  const handleDetailsClick = (job: Job) => {
    dispatch(setSelectedJob(job));
    router.push('/user/careers/careerDetails');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const headerTextVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        delay: 0.2
      }
    }
  };
  
  const floatingParticleVariants = {
    animate: (i) => ({
      y: [0, -15, 0],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 3 + i % 3,
        repeat: Infinity,
        ease: "easeInOut",
        delay: i * 0.2
      }
    })
  };

  const expandVariants = {
    collapsed: { height: "auto", opacity: 1 },
    expanded: { height: "auto", opacity: 1 }
  };

  const descriptionVariants = {
    collapsed: { height: "auto", opacity: 1 },
    expanded: { height: "auto", opacity: 1 }
  };

  return (
    <>
      <Navbar />
      <ChatBox />
       
      <div className="relative h-[40vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/70 via-indigo-900/70 to-blue-950/70 backdrop-blur-sm" />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-[url('https://airline-datacenter.s3.ap-south-1.amazonaws.com/e9f1d460-5e31-4a2c-9348-85d8ba317708.jpeg')] bg-cover bg-center"
        />
        
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={floatingParticleVariants}
              animate="animate"
              className={`absolute rounded-full ${
                i % 3 === 0 ? "bg-blue-400/30 w-3 h-3" : 
                i % 3 === 1 ? "bg-indigo-400/20 w-2 h-2" : 
                "bg-purple-400/20 w-4 h-4"
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            className="text-center space-y-4 px-4"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h1 
              variants={headerTextVariants}
              className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-300 to-blue-100"
            >
              Find Your Next Career
            </motion.h1>
            <motion.p 
              variants={headerTextVariants}
              className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto"
            >
              Discover opportunities that match your expertise and aspirations
            </motion.p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="lg:col-span-1">
            <motion.div 
              className="bg-blue-950/60 p-6 rounded-xl backdrop-blur-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-blue-100 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-.997.993L3 16V4a1 1 0 011-1zm10.66 11.34a1 1 0 01-1.98 0l-1.998-1.998a1 1 0 010-1.414l1.998-1.998a1 1 0 011.414 0l1.998 1.998a1 1 0 010 1.414l-1.998 1.998zm5.207-8.207a1 1 0 010 1.414l-1.998 1.998a1 1 0 01-1.414 0l-1.998-1.998a1 1 0 010-1.414l1.998-1.998a1 1 0 011.414 0l1.998 1.998z" clipRule="evenodd" />
                </svg>
                Filters
              </h2>
              
              <motion.div 
                className="space-y-5 mt-6"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <motion.div variants={itemVariants}>
                  <label className="text-sm text-blue-200 mb-2 block">Search Jobs</label>
                  <div className="relative group">
                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 h-4 w-4 group-hover:text-blue-400 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      type="text"
                      value={searchQuery}
                      onChange={onSearchChange}
                      placeholder="Search by title..."
                      className="pl-10 bg-blue-900/20 border-blue-400/20 text-white focus:border-blue-400 focus:ring-blue-600/50 transition-all w-full py-2 px-4 rounded"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="text-sm text-blue-200 mb-2 block">Sort By</label>
                  <motion.select
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onChange={(e) => handleSort(sortOrder, e.target.value as 'designation' | 'salary' | 'createdAt')}
                    value={sortBy}
                    className="w-full py-2 px-4 bg-blue-900/20 border-blue-400/20 text-white hover:bg-blue-800/30 transition-colors rounded"
                  >
                    <option value="designation">Designation</option>
                    <option value="salary">Salary</option>
                    <option value="createdAt">Latest</option>
                  </motion.select>
                  <motion.select
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onChange={(e) => handleSort(e.target.value as 'asc' | 'desc', sortBy)}
                    value={sortOrder}
                    className="w-full py-2 px-4 bg-blue-900/20 border-blue-400/20 text-white hover:bg-blue-800/30 transition-colors rounded mt-2"
                  >
                    <option value="asc">Low to High</option>
                    <option value="desc">High to Low</option>
                  </motion.select>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="text-sm text-blue-200 mb-2 block">Filter By Location</label>
                  <motion.select
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onChange={handleFilterByDesignation}
                    value={selectedDesignation}
                    className="w-full py-2 px-4 bg-blue-900/20 border-blue-400/20 text-white hover:bg-blue-800/30 transition-colors rounded"
                  >
                    <option value="">All Locations</option>
                    {uniqueDesignations.map((designation, index) => (
                      <option key={index} value={designation}>
                        {designation}
                      </option>
                    ))}
                  </motion.select>
                </motion.div>

                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-all"
                >
                  Apply Filters
                </motion.button>
              </motion.div>
            </motion.div>
          </div>

          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentPage + searchQuery + selectedDesignation + sortBy + sortOrder}
                className="grid gap-6"
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: 20 }}
                variants={containerVariants}
              >
                {loading ? (
                  Array(3).fill(null).map((_, i) => (
                    <motion.div
                      key={i}
                      variants={itemVariants}
                      className="bg-blue-950/60 p-6 animate-pulse rounded-xl shadow-md"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-blue-800/30" />
                        <div className="space-y-2 flex-1">
                          <div className="h-5 bg-blue-800/30 rounded w-3/4" />
                          <div className="h-4 bg-blue-800/30 rounded w-1/2" />
                        </div>
                      </div>
                      <div className="h-24 bg-blue-800/20 rounded-lg mt-4" />
                      <div className="flex space-x-2 mt-4">
                        <div className="h-8 bg-blue-800/30 rounded w-24" />
                        <div className="h-8 bg-blue-800/30 rounded w-24" />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  currentJobs.map((job, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.1)" }}
                      className="bg-blue-950/60 p-6 rounded-xl shadow-md transition-all hover:shadow-lg"
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-3 flex-1">
                          <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 * index }}
                            className="flex items-center"
                          >
                            <h3 className="text-xl font-semibold text-blue-100">{job.designation}</h3>
                            {job.featured && (
                              <motion.span 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 * index, type: "spring" }}
                                className="ml-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-blue-300 fill-blue-300" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                Featured
                              </motion.span>
                            )}
                          </motion.div>
                          <motion.div 
                            className="flex flex-wrap items-center gap-3 text-sm text-blue-200"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 * index }}
                          >
                            <motion.span 
                              whileHover={{ scale: 1.05 }}
                              className="flex items-center gap-1 bg-blue-900/30 px-2 py-1 rounded-full backdrop-blur-sm"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11.707 10.293V6z" clipRule="evenodd" />
                              </svg>
                              {job.company}
                            </motion.span>
                            <motion.span 
                              whileHover={{ scale: 1.05 }}
                              className="flex items-center gap-1 bg-blue-900/30 px-2 py-1 rounded-full backdrop-blur-sm"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 1110.9 10.9L10 18.9l-5.95-5.95a7 7 0 010-10.9zm1.414 1.414L14.146 8.586a2 2 0 102.828 2.828l-3 3a2 2 0 002.827 2.827l1.414 1.414a4 4 0 01-5.658 0l-3-3a4 4 0 010-5.659z" clipRule="evenodd" />
                              </svg>
                              {job.location}
                            </motion.span>
                            <motion.span 
                              whileHover={{ scale: 1.05 }}
                              className="flex items-center gap-1 bg-blue-900/30 px-2 py-1 rounded-full backdrop-blur-sm"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                                <path d="M12 2l2.243 6.379a1 1 0 010 0.242L12.707 11a1 1 0 11-1.414 1.414l2.828-2.829a4 4 0 010-5.656zm-1.414 7.146a1 1 0 011.415-1.414l-2.829-2.829a4 4 0 015.656 0l2.828 2.828a1 1 0 11-1.415 1.415l-2.828-2.829a2 2 0 01-2.827 0l-2.828 2.828a1 1 0 01-1.415-1.415l2.828-2.828a4 4 0 010-5.656z" />
                              </svg>
                              {job.salary} LPA
                            </motion.span>
                            <motion.span 
                              whileHover={{ scale: 1.05 }}
                              className="flex items-center gap-1 bg-blue-900/30 px-2 py-1 rounded-full backdrop-blur-sm"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M17.414 12.586a2 2 0 002.586-2.586L14.828 5H12.5a1 1 0 00-1 1v3a1 1 0 00.293.707l2.828 2.829a1 1 0 001.414-1.414zM12.5 15a1 1 0 00-.293-.707l-2.828-2.829a1 1 0 00-1.414 1.414l2.828 2.828A1 1 0 0012.5 17a1 1 0 001-.293zm-2.586-8a2 2 0 012.586-2.586L15.172 8H17.5a1 1 0 110 2h-2.172l-2.586 2.585a2 2 0 11-2.828-2.828l2.828-2.829z" />
                              </svg>
                              Posted {job.posted}
                            </motion.span>
                          </motion.div>
                          
                          <div className="mt-4">
                            <AnimatePresence mode="wait">
                              <motion.p 
                                key={expandedJobIndex === index ? 'expanded' : 'collapsed'}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="text-blue-100"
                              >
                                {expandedJobIndex === index ? job.description : `${job.description.substring(0, 150)}...`}
                              </motion.p>
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                      
                      <motion.div 
                        className="mt-6 flex items-center justify-between"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 * index }}
                      >
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleShowMore(index)}
                          className="bg-transparent hover:bg-blue-600 text-blue-200 hover:text-white py-2 px-4 border border-blue-400 hover:border-transparent rounded transition-all"
                        >
                          {expandedJobIndex === index ? 'Show Less' : 'Read More'}
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDetailsClick(job)}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-all"
                        >
                          Apply Now
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            </AnimatePresence>
            
            <motion.div 
              className="mt-12 flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex space-x-3">
                {[1, 2, 3].map((page) => (
                  <motion.button
                    key={page}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => paginate(page)}
                    className={`py-2 px-4 rounded ${
                      currentPage === page
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-900/30 text-blue-200 hover:bg-blue-800/30'
                    }`}
                  >
                    {page}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default JobBoard;