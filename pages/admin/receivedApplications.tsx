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
import { cargoData } from '@/interfaces/cargoData';
import { ADMIN_LOGIN_MUTATION } from '@/graphql/mutations/adminLoginMutation';
export interface applyJob {
   name: string
   email: string
   phone: string
   coverLetter: string
   cv: string
   Date: string
}
const ReceivedCargo: React.FC = ({ bookingData }: any) => {
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
   const totalPages = Math.ceil(applications.length / usersPerPage);
   const token = Cookies.get('jwtToken');
   const [password, setPassword] = useState('');
   const [adminType, setadminType] = useState('');
   const [adminLogin, { loading, error, data }] = useMutation(ADMIN_LOGIN_MUTATION);
   const [booking, setBooking] = useState(bookingData);
   useEffect(() => {
      if (!token) {
         router.push('/admin/signin')
      }
   }, [token])
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
            const response = await axios.get('/api/getJobApplications');
            console.log(response.data); // Check the structure here

            // If response.data contains an array inside, like response.data.applications
            setApplications(response.data.applications || []); // Ensure it's an array or empty array
         } catch (error) {
            console.error('Error fetching job applications:', error);
         }
      };
      fetchData();
   }, []);


   const handlePageChange = (pageNumber: number) => {
      setCurrentPage(pageNumber);
   };



   const currentUsers = applications.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

   const handleSignin = async (event: React.MouseEvent<HTMLButtonElement>) => {
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
            <section className="xl:ml-[250px] xl:w-[1200px] md:w-[800px] sm:w-full bg-transparent" style={{ position: 'relative', zIndex: 10 }}>
               <AdminAside />
               {authorized ? (
                  currentUsers.map((applications) => (
                     <div key={applications.name} className="bg-blue-900/50 p-6 rounded-2xl shadow-white/25 shadow-inner w-full mb-10 mx-auto">
                        <div className="relative rounded-t-lg overflow-hidden">
                           <span className="absolute top-2 left-2 bg-red-400 text-white text-xs px-3 py-1 rounded-full">
                              Cabin Crew {/* Assuming this is a label, you can change the text dynamically */}
                           </span>
                           <img
                              src="https://airline-datacenter.s3.ap-south-1.amazonaws.com/31470401_7799874.jpg"
                              alt="Profile"
                              className="w-full h-28 object-cover rounded-lg"
                           />
                        </div>

                        <div className="flex justify-between items-center mt-4">
                           <div className="text-white">
                              <img
                                 src="https://www.rosenaviation.com/wp-content/uploads/2024/02/Longest-commercial-flights-Rosen-Aviation-scaled.jpeg"
                                 alt="Profile"
                                 className="w-16 h-16 rounded-full border-2 border-blue-900"
                              />
                              <div className="mt-2">
                                 <p className="text-lg font-bold">Name: {applications.email}</p>
                                 <p className="text-sm">Applied Date: {applications.Date}</p> {/* This should be dynamic */}
                                 <p className="text-sm">Email:{applications.email}</p> {/* This should be dynamic */}
                                 <p className="text-sm">coverLetter: {applications.coverLetter}</p> {/* This should be dynamic */}
                              </div>
                           </div>

                           <div className="text-white text-right">

                              <div className="flex space-x-2 mt-4">

                              </div>
                              <button
                                 onClick={() => window.open(applications.cv, '_blank')}
                                 className="mt-2 ml-4 bg-gray-700 hover:bg-gray-900 text-white font-bold py-1 px-4 rounded-md"
                              >
                                 Download Resume
                              </button>
                             

                           </div>
                        </div>
                     </div>

                  ))
               ) : (
                  <div className="flex items-center justify-center min-h-screen">
                     <div className="text-center text-red-500">
                        <h1 className="text-4xl font-bold">Access Denied</h1>
                        <p className="mt-4 text-lg">You do not have permission to access this page.</p>
                     </div>
                  </div>
               )}

               {authorized && totalPages > 1 && (
                  <div className="flex justify-center mt-4">
                     {Array.from({ length: totalPages }, (_, pageNumber) => (
                        <button
                           key={pageNumber}
                           className={`px-4 py-2 mx-1 rounded ${currentPage === pageNumber + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                           onClick={() => handlePageChange(pageNumber + 1)}
                        >
                           {pageNumber + 1}
                        </button>
                     ))}
                  </div>
               )}
            </section>
         </div>
      </div>
   );
};

export default ReceivedCargo;
