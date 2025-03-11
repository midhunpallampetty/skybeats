import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { RootState } from '@/redux/store'; 
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = dynamic(() => import('../../components/Navbar'));

const CareerDetails = () => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const selectedJob = useSelector((state: RootState) => state.job.selectedJob);
  const userId = Cookies.get('userId');

  useEffect(() => {
    setIsClient(true);
    if (!selectedJob) {
      router.push('/user/careers/jobBoard');
    }
  }, [selectedJob, router]);

  useEffect(() => {
    if (!userId) {
      router.push('/');
    }
  }, [userId]);

  if (!selectedJob) {
    return (
      <div className="min-h-screen bg-blue-950/60">
        <Navbar />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative h-[40vh] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/70 via-indigo-900/70 to-blue-950/70 backdrop-blur-sm" />
          <div className="absolute inset-0 bg-[url('https://airline-datacenter.s3.ap-south-1.amazonaws.com/e9f1d460-5e31-4a2c-9348-85d8ba317708.jpeg')] bg-cover bg-center opacity-10" />
          
          <div className="absolute inset-0 overflow-hidden">
            {isClient && Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className={`absolute rounded-full ${
                  i % 3 === 0 ? "bg-blue-400/30 w-3 h-3" : 
                  i % 3 === 1 ? "bg-indigo-400/20 w-2 h-2" : 
                  "bg-purple-400/20 w-4 h-4"
                }`}
                initial={{ 
                  x: Math.random() * window.innerWidth, 
                  y: Math.random() * window.innerHeight 
                }}
                animate={{ 
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  opacity: [0.1, 0.5, 0.1],
                  scale: [1, i % 4 === 0 ? 1.8 : 1.3, 1]
                }}
                transition={{ 
                  duration: 6 + Math.random() * 12,
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              />
            ))}
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4 px-4">
              <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-300 to-blue-100">
                Job Details
              </h1>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-blue-950/60 shadow-lg rounded-lg p-6 backdrop-blur-sm">
            <div className="flex items-start">
              <div className="w-48 h-48 rounded overflow-hidden animate-pulse">
                <div className="w-full h-full bg-blue-800/30 rounded" />
              </div>
              <div className="ml-6 flex-1">
                <div className="space-y-4">
                  <div className="h-8 bg-blue-800/30 rounded w-3/4 animate-pulse" />
                  <div className="h-6 bg-blue-800/30 rounded w-1/2 animate-pulse" />
                  
                  <div className="mt-4 space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-2 animate-pulse">
                        <div className="w-24 h-5 bg-blue-800/30 rounded" />
                        <div className="w-32 h-5 bg-blue-800/30 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-[40vh] overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/70 via-indigo-900/70 to-blue-950/70 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-[url('https://airline-datacenter.s3.ap-south-1.amazonaws.com/e9f1d460-5e31-4a2c-9348-85d8ba317708.jpeg')] bg-cover bg-center opacity-10" />
        
        <div className="absolute inset-0 overflow-hidden">
          {isClient && Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className={`absolute rounded-full ${
                i % 3 === 0 ? "bg-blue-400/30 w-3 h-3" : 
                i % 3 === 1 ? "bg-indigo-400/20 w-2 h-2" : 
                "bg-purple-400/20 w-4 h-4"
              }`}
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight 
              }}
              animate={{ 
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: [0.1, 0.5, 0.1],
                scale: [1, i % 4 === 0 ? 1.8 : 1.3, 1]
              }}
              transition={{ 
                duration: 6 + Math.random() * 12,
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            />
          ))}
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-300 to-blue-100">
              Job Details
            </h1>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-blue-950/60 shadow-lg rounded-lg p-6 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-start"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="w-48 h-48 rounded overflow-hidden"
            >
              <img
                src={selectedJob.Image || '/placeholder-job-image.jpg'}
                alt={selectedJob.designation}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="ml-6 flex-1">
              <motion.h2
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-2xl font-bold text-white mb-2"
              >
                {selectedJob.designation}
              </motion.h2>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap items-center gap-3 mb-4"
              >
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-900/30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414l-2.828-2.828A1 1 0 0011 7V6z" clipRule="evenodd" />
                  </svg>
                  {selectedJob?.company}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-900/30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 1110.9 10.9L10 18.9l-5.95-5.95a7 7 0 010-10.9zm1.414 1.414L14.146 8.586a2 2 0 102.828 2.828l-3 3a2 2 0 002.827 2.827l1.414 1.414a4 4 0 01-5.658 0l-3-3a4 4 0 010-5.659z" clipRule="evenodd" />
                  </svg>
                  {selectedJob?.location}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-900/30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                    <path d="M12 2l2.243 6.379a1 1 0 010 0.242L12.707 11a1 1 0 11-1.414 1.414l2.828-2.829a4 4 0 010-5.656zm-1.414 7.146a1 1 0 011.415-1.414l-2.829-2.829a4 4 0 015.656 0l2.828 2.828a1 1 0 11-1.415 1.415l-2.828-2.829a2 2 0 01-2.827 0l-2.828 2.828a1 1 0 01-1.415-1.415l2.828-2.828a4 4 0 010-5.656z" />
                  </svg>
                  {selectedJob?.salary} LPA
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-900/30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.414 12.586a2 2 0 002.586-2.586L14.828 5H12.5a1 1 0 00-1 1v3a1 1 0 00.293.707l2.828 2.829a1 1 0 001.414-1.414zM12.5 15a1 1 0 00-.293-.707l-2.828-2.829a1 1 0 00-1.414 1.414l2.828 2.828A1 1 0 0012.5 17a1 1 0 001-.293zm-2.586-8a2 2 0 012.586-2.586L15.172 8H17.5a1 1 0 110 2h-2.172l-2.586 2.585a2 2 0 11-2.828-2.828l2.828-2.829z" />
                  </svg>
                  Posted {selectedJob.posted}
                </span>
              </motion.div>

              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="text-white mb-6 overflow-hidden text-ellipsis line-clamp-2"
              >
                {selectedJob.description}
              </motion.p>

              <div className="flex justify-between items-center mt-6">
                <button 
                  onClick={() => router.push('/user/careers/applyCareer')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <footer className="bg-gray-900 mt-20 text-white py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center px-6">
          <div className="mb-8 md:mb-0">
            <h2 className="text-3xl font-bold mb-4">
              Landingfolio helps you to grow your career fast.
            </h2>
            <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
              Start 14 Days Free Trial
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">About</a></li>
                <li><a href="#" className="hover:underline">Features</a></li>
                <li><a href="#" className="hover:underline">Pricing & Plans</a></li>
                <li><a href="#" className="hover:underline">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">Account</a></li>
                <li><a href="#" className="hover:underline">Tools</a></li>
                <li><a href="#" className="hover:underline">Newsletter</a></li>
                <li><a href="#" className="hover:underline">Support</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Subscribe</h3>
              <p className="mb-2">Subscribe to our newsletter for the latest news and updates.</p>
              <div className="flex items-center">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 rounded-l-lg bg-gray-800 text-white border-none"
                />
                <button className="bg-blue-600 px-4 py-2 rounded-r-lg text-white hover:bg-blue-700">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default CareerDetails;