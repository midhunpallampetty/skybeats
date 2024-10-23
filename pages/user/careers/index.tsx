import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Carousel } from 'flowbite-react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setSelectedJob } from '@/redux/slices/jobSlice';

interface Job {
  description: string;
  designation: string;
  Image?: string;
}

const JobBoard = () => {
  const Navbar = dynamic(() => import('../../components/Navbar'));
  const ChatBox = dynamic(() => import('../../components/ChatBox'));
  const dispatch = useDispatch();
  const router = useRouter();

  const [career, setCareer] = useState<Job[]>([]);
  const token = Cookies.get('jwtToken');
  const [expandedJobIndex, setExpandedJobIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(5); // Jobs per page
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Fetch career data
  useEffect(() => {
    const fetchCareerData = async () => {
      try {
        const response = await axios.get('/api/getCareer');

        if (response.data && response.data.getJobs) {
          setCareer(response.data.getJobs);
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

  // Sorting logic
  const handleSort = (order: 'asc' | 'desc') => {
    const sortedJobs = [...career].sort((a, b) => {
      const designationA = a.designation.toUpperCase();
      const designationB = b.designation.toUpperCase();

      if (designationA < designationB) return order === 'asc' ? -1 : 1;
      if (designationA > designationB) return order === 'asc' ? 1 : -1;
      return 0;
    });
    setSortOrder(order);
    setCareer(sortedJobs);
  };

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = career.slice(indexOfFirstJob, indexOfLastJob);

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

      <div className="flex justify-center" style={{ backgroundImage: `
        linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
      `, backgroundSize: '40px 40px' }}>
        <div className="flex flex-col md:flex-row mt-20 max-w-[1200px] w-full">
          <div className="w-full md:w-[350px] p-4 bg-white border border-white/35 rounded-lg ml-4">
            {/* Filters */}
            <h3 className="font-bold mb-4">Sort by:</h3>
            <div className="flex space-x-4">
              <button
                onClick={() => handleSort('asc')}
                className={`bg-gray-200 py-2 px-4 rounded ${sortOrder === 'asc' ? 'bg-blue-500 text-white' : ''}`}
              >
                Ascending
              </button>
              <button
                onClick={() => handleSort('desc')}
                className={`bg-gray-200 py-2 px-4 rounded ${sortOrder === 'desc' ? 'bg-blue-500 text-white' : ''}`}
              >
                Descending
              </button>
            </div>
          </div>

          <div className="w-full md:w-3/4 p-4 ml-11">
            <div className="grid grid-cols-1 gap-4">
              {currentJobs.length > 0 ? (
                currentJobs.map((job: Job, index) => (
                  <div
                    key={index}
                    className="bg-blue-800/50 text-white w-full min-h-[250px] p-4 rounded-lg hover:shadow-lg"
                  >
                    <div className="flex items-center">
                      <div className="w-24 h-24 rounded overflow-hidden">
                        <img
                          src={job.Image}
                          alt="Job Image"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="ml-4">
                        <h2 className="font-bold text-xl">
                          {expandedJobIndex === index ? job.description : `${job.description.slice(0, 50)}...`}
                        </h2>
                        <button
                          onClick={() => toggleShowMore(index)}
                          className="text-blue-300 hover:text-blue-500 text-sm underline mt-1"
                        >
                          {expandedJobIndex === index ? 'Show Less' : 'Show More'}
                        </button>
                        <p className="text-gray-200">{job.designation}</p>

                        <div className="flex mt-3 space-x-2">
                          <button
                            onClick={() => handleDetailsClick(job)}
                            className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No jobs available at the moment.</p>
              )}
            </div>

            {/* Pagination Controls */}
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
                disabled={indexOfLastJob >= career.length}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 mt-20 text-white py-12">
        {/* Footer Content */}
      </footer>
    </>
  );
};

export default JobBoard;
