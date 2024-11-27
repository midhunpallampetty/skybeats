'use client';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import dynamic from 'next/dynamic';
import { usePDF } from 'react-to-pdf';
import { useMutation } from '@apollo/client';
import { DotLoader } from 'react-spinners';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { ADMIN_LOGIN_MUTATION } from '@/graphql/mutations/adminLoginMutation';
import adminAxios from '../api/utils/adminAxiosInstance';

export interface applyJob {
  name: string;
  email: string;
  phone: string;
  coverLetter: string;
  cv: string;
  Date: string;
}

interface JobApplicationsResponse {
  applications: applyJob[];
}

const ReceivedApplications: React.FC = ({ bookingData }: any) => {
  const { toPDF, targetRef } = usePDF({ filename: 'page.pdf' });
  const [authorized, setAuthorized] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const AdminNavbar = dynamic(() => import('../components/AdminNavbar'), { ssr: false });
  const AdminAside = dynamic(() => import('../components/Adminaside'), { ssr: false });
  const [applications, setApplications] = useState<applyJob[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 2;
  const router = useRouter();
  const token = Cookies.get('jwtToken');
  const [password, setPassword] = useState('');
  const [adminType, setadminType] = useState('');
  const [adminLogin, { loading, error, data }] = useMutation(ADMIN_LOGIN_MUTATION);
  const [booking, setBooking] = useState(bookingData);

  useEffect(() => {
    if (!token) {
      router.push('/admin/signin');
    }
  }, [token, router]);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch('/api/tokenVerify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();
        setRole(data);

        if (data === 'hradmin') {
          setAuthorized(true);
        }
      } catch (error) {
        console.error('Error verifying token:', error);
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<JobApplicationsResponse>('/api/getJobApplications');
        setApplications(response.data.applications || []);
      } catch (error) {
        console.error('Error fetching job applications:', error);
      }
    };
    fetchData();
  }, []);



  const currentUsers = applications.slice(
   (currentPage - 1) * usersPerPage,
   currentPage * usersPerPage
 );


useEffect(() => {
   const fetchApplications = async () => {
     try {
       const response = await axios.get('/api/getJobApplications');
       setApplications(response.data.applications || []);
     } catch (error) {
       console.error('Error fetching applications:', error);
     }
   };
   fetchApplications();
 }, []);
 const totalPages = Math.ceil(applications.length / usersPerPage);




  const handlePageChange = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  const handleSignin = async () => {
    try {
      const { data } = await adminLogin({
        variables: {
          email,
          password,
          adminType,
        },
      });

      if (data && data.adminLogin) {
        console.log('Login success', data.adminLogin);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Admin login failed:', error);
    }
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  };

  const contentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
  };

  const backgroundStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    opacity: 0.08,
    pointerEvents: 'none',
    backgroundImage: 'url(/admin_bg.png)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  };

  return (
    <div style={containerStyle}>
      {loading && <DotLoader color="#ffffff" size={60} />}
      <AdminNavbar />
      <div style={backgroundStyle} />
      <div style={contentStyle}>
      
        <section
          className="xl:ml-[250px] xl:w-[1200px] md:w-[800px] sm:w-full bg-transparent flex flex-col items-center justify-center"
          style={{ position: 'relative', zIndex: 10 }}
        >
          {authorized ? (
            <>
              <button
          className="text-white bg-blue-900 px-4 h-10 rounded-lg font-extrabold m-10"
          onClick={() => router.push('/admin/addJobs')}
        >
          Add Jobs
        </button>
              {currentUsers.map((application) => (
               <div
               key={application.name}
               className="bg-blue-900/70 p-6 rounded-xl shadow-lg w-full sm:w-10/12 lg:w-8/12 mx-auto mb-6"
             >
               
               <div className="relative rounded-lg overflow-hidden mb-4">
                 <img
                   src="https://airline-datacenter.s3.ap-south-1.amazonaws.com/31470401_7799874.jpg"
                   alt="Application Background"
                   className="w-full h-32 object-cover"
                 />
                 <span className="absolute top-2 left-2 bg-green-500 font-extrabold text-white text-xs px-3 py-1 rounded-full  shadow-md">
                   WalkIn
                 </span>
               </div>
             
               <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                 <div className="flex items-center gap-4">
                   <img
                     src="https://www.rosenaviation.com/wp-content/uploads/2024/02/Longest-commercial-flights-Rosen-Aviation-scaled.jpeg"
                     alt="Applicant Profile"
                     className="w-20 h-20 rounded-full border-4 border-blue-900 shadow-md"
                   />
                   <div>
                     <p className="text-white text-xl font-semibold">Name: {application.name}</p>
                     <p className="text-gray-300 text-sm">Applied Date: {application.Date}</p>
                     <p className="text-gray-300 text-sm">Email: {application.email}</p>
                     <p className="text-gray-300 text-sm">Cover Letter: {application.coverLetter}</p>
                   </div>
                 </div>
             
                 <div className="sm:text-right">
                   <button
                     onClick={() => window.open(application.cv, '_blank')}
                     className="mt-2 bg-gray-700 hover:bg-gray-900 text-white font-bold py-2 px-6 rounded-md shadow-md transition-all duration-300"
                   >
                     Download Resume
                   </button>
                 </div>
               </div>
             </div>
             
              ))}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  {Array.from({ length: totalPages }, (_, pageNumber) => (
                    <button
                      key={pageNumber}
                      className={`px-4 py-2 mx-1 rounded-lg transition-all duration-200 ${
                        currentPage === pageNumber + 1
                          ? 'bg-blue-500 text-white font-bold shadow-md'
                          : 'bg-gray-300 text-gray-700 hover:bg-blue-400 hover:text-white'
                      }`}
                      onClick={() => handlePageChange(pageNumber + 1)}
                    >
                      {pageNumber + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center text-red-500">
                <h1 className="text-4xl font-bold">Access Denied</h1>
                <p className="mt-4 text-lg">You do not have permission to access this page.</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ReceivedApplications;
