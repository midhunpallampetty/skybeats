import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Carousel } from 'flowbite-react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Job {
  description: string;
  designation: string;
  Image?: string;
}

const JobBoard = () => {
  const Navbar = dynamic(() => import('../../components/Navbar'));
  const ChatBox = dynamic(() => import('../../components/ChatBox'));

  const [career, setCareer] = useState<Job[]>([]);
  const router = useRouter();
  const token = Cookies.get('jwtToken');
  const [expandedJobIndex, setExpandedJobIndex] = useState<number | null>(null); 
  useEffect(() => {
    const fetchCareerData = async () => {
      try {
        const response = await axios.get('/api/getCareer');
        
        if (response.data && response.data.getJobs) {
          setCareer(response.data.getJobs); 
        } else {
          console.error("getJobs array not found in the response data");
        }
      } catch (error) {
        console.error("Error fetching career data:", error);
      }
    };

    fetchCareerData();
  }, []);

  useEffect(() => {
    if (!token) {
      router.push('/');
    }
  }, [token, router]);

  const toggleShowMore = (index: number) => {
    setExpandedJobIndex(expandedJobIndex === index ? null : index);
  };

  const gridBackgroundStyle = {
    backgroundImage: `
      linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
  };

  return (
    <>
      <Navbar />
      <ChatBox />

      <div className="h-56 mt-[50px] sm:h-[55] xl:h-80 2xl:h-96">
        <Carousel>
          <img
            src="https://airline-datacenter.s3.ap-south-1.amazonaws.com/e9f1d460-5e31-4a2c-9348-85d8ba317708.jpeg"
            alt="Career Carousel 1"
          />
          <img
            src="https://airline-datacenter.s3.ap-south-1.amazonaws.com/pexels-pixabay-164646.jpg"
            alt="Career Carousel 2"
          />
        </Carousel>
      </div>

      <div className="flex justify-center" style={gridBackgroundStyle}>
        <div className="flex flex-col md:flex-row mt-20 max-w-[1200px] w-full">
          <div className="w-full md:w-[350px] p-4 bg-white border border-white/35 rounded-lg ml-4">
            <div className="mb-4">
              <h3 className="font-bold mb-2 text-gray-800">Work mode</h3>
              <div>
                <input type="checkbox" id="remote" />
                <label className="ml-2" htmlFor="remote">Remote (13044)</label>
              </div>
              <div>
                <input type="checkbox" id="hybrid" />
                <label className="ml-2" htmlFor="hybrid">Hybrid (10980)</label>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-bold mb-2">Experience</h3>
              <input type="range" min="0" max="20" className="w-full" />
            </div>

            <div className="mb-4">
              <h3 className="font-bold mb-2">Department</h3>
              <div>
                <input type="checkbox" id="engineering" />
                <label className="ml-2" htmlFor="engineering">Engineering</label>
              </div>
              <div>
                <input type="checkbox" id="data-science" />
                <label className="ml-2" htmlFor="data-science">Data Science</label>
              </div>
            </div>
          </div>

          <div className="w-full md:w-3/4 p-4 ml-11">
            <div className="grid grid-cols-1 gap-4">
              {career.length > 0 ? (
                career.map((job: Job, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg w-[550px] min-h-[250px] p-4 border rounded-lg hover:shadow-lg shadow-black"
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

                        <p className="mt-2 text-sm text-gray-200">
                          <strong>Sender Name:</strong> Ailena John <br />
                          <strong>Receiver Name:</strong> Alan Nixon <br />
                          <strong>Destination Airport:</strong> COK <br />
                          <strong>Weight:</strong> 650 Kg
                        </p>

                        <div className="flex mt-3 space-x-2">
                          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Forward
                          </button>
                          <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
                            Update Status
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
          </div>
        </div>
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

export default JobBoard;
