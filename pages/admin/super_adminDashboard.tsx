'use client';
import React, { useEffect, useState } from 'react';
import { ADMIN_LOGIN_MUTATION } from '@/graphql/mutations/adminLoginMutation';
import { useMutation } from '@apollo/client';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { DotLoader } from 'react-spinners';
import { Users } from '@/interfaces/Users';
const Super_adminDashboard: React.FC = () => {
   const [authorized, setAuthorized] = useState(false);
   const AdminNavbar=dynamic(()=>import('../components/AdminNavbar'));
   const Adminaside=dynamic(()=>import('../components/Adminaside'));
   const [email, setEmail] = useState('');
   const [role, setRole] = useState('');
   const [users, setUsers] = useState<Users[]>([]);
   const [currentPage, setCurrentPage] = useState(1);
   const usersPerPage = 6; 
   const router = useRouter();
   const totalPages = Math.ceil(users.length / usersPerPage);
   const token = Cookies.get('jwtToken');
   const handleBlockUser = async (userId: string) => {
      try {
         const response = await fetch('/api/blockUser', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ blockUserId: userId }),
         });

         const data = await response.json();
         if (response.ok) {
            
            setUsers(prevUsers =>
               prevUsers.map(user =>
                  user.id === userId ? { ...user, isBlocked: !user.isBlocked } : user
               )
            );
            console.log(data.message);
         } else {
            console.error('Error blocking/unblocking user:', data.message);
         }
      } catch (error) {
         console.error('Request error:', error);
      }
   };

   useEffect(() => {
      if (!token) {
         router.push('/admin/signin');
      }
   }, [token]);
   const handlePageChange = (pageNumber: number) => {
      setCurrentPage(pageNumber);
   };


   const currentUsers = users.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);


   useEffect(() => {
      (async () => {
         try {
            const response = await fetch('/api/getUsers');
            console.log('data', response);
            const data = await response.json();
            if (response) {
               setUsers(data);
               console.log(users);
            } else {
               console.log('failed getting users');

               throw new Error('failed to fetch users data');
            }
         } catch (error) {
            console.log('External api error');

            throw new Error('Error occured while fetch api data');
         }
      })();
   }, []);
   useEffect(() => {
      (async () => {
         try {
            console.log('Sending token to API:', token);
            const response = await fetch('/api/tokenVerify', {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify({ token }),
            });
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            const data = await response.json();
            console.log('Received data:', data);

            setRole(data);



            console.log(role, 'datahvbfdhvb');
            if (!response.ok) {
               console.error('Error from API:', data.message);
            }
         } catch (error) {
            console.log('External api error');

         }
      })();
   }, [token]);
   useEffect(() => {
      if (role !== null) {
         console.log('Role has been updated:', role);
         if (role != '') {
            console.log('Setting authorised to true');
            setAuthorized(true);
            console.log('role is fine', role);
         }
         console.log('test', authorized);

      }
   }, [role]);
   useEffect(() => {
      console.log('Authorised state updated:', authorized);
   }, [authorized]);

   console.log(users, 'user');
   const [password, setPassword] = useState('');
   const [adminType, setadminType] = useState('');
   const [adminLogin, { loading, error, data }] = useMutation(ADMIN_LOGIN_MUTATION);
   const handleDropdown = (e: any) => {
      setadminType(e.target.value);
   };
   const handleSignin = async (event: React.MouseEvent<HTMLButtonElement>) => {
      try {
         const { data } = await adminLogin({
            variables: {
               email,
               password,
               adminType
            }
         });
         if (data && data.adminLogin) {
            console.log('login success', data.adminLogin);
         } else {
            throw new Error('Inavlid credentials');
            console.log('login failed invalid credentials');
         }
      } catch (error) {

         console.log('Operation of admin login not successful');
         throw new Error('can\'t perform admin login operation');
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
      pointerEvents: 'none' as 'none',
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
            <div className='ml-52 mb-32'>

            </div>

            <section className="xl:ml-[250px] xl:w-[1200px] md:w-[800px] sm:w-full bg-transparent" style={{ position: 'relative', zIndex: 10 }}>
               <button
                  data-drawer-target="logo-sidebar"
                  data-drawer-toggle="logo-sidebar"
                  aria-controls="logo-sidebar"
                  type="button"
                  className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
               >
                  <span className="sr-only">Open sidebar</span>
                  <svg
                     className="w-6 h-6"
                     aria-hidden="true"
                     fill="currentColor"
                     viewBox="0 0 20 20"
                     xmlns="http://www.w3.org/2000/svg"
                  >
                     <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                     />
                  </svg>
               </button>

               <Adminaside />

               <div className="p-4 mt-[200px]">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {authorized ? (
                        currentUsers.map((user, index) => (
                           <div key={index} className="max-w-sm bg-transparent border border-gray-600 rounded-lg shadow-lg">
                              <div className="relative">
                                 <img className="w-full h-48 rounded-t-lg object-cover" src="https://res.cloudinary.com/dbn1fdk8f/image/upload/v1723181608/airline/kch5xemyueavoffdg7r1.jpg" alt="Airplane in the sky" />
                                 <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                                    <img className="w-24 h-24 rounded-full border-4 border-white" src="https://res.cloudinary.com/dbn1fdk8f/image/upload/v1723181608/airline/kch5xemyueavoffdg7r1.jpg" alt="Profile Picture" />
                                 </div>
                              </div>
                              <div className="text-center mt-14 p-4">
                                 <h5 className="mb-1 text-xl font-bold text-white">{user?.username}</h5>
                                 <p className="text-sm text-gray-400">{user?.email}</p>
                                 <div className="flex justify-around mt-4 text-white">
                                    <div className="text-center">
                                       <span className="block text-2xl font-bold">Test</span>
                                       <span className="text-sm">Flying Hours</span>
                                    </div>
                                    <div className="border-l-2 border-gray-500"></div>
                                    <div className="text-center">
                                       
                                    </div>
                                 </div>
                                 <button
                                    onClick={() => handleBlockUser(user.id)}
                                    className={`mt-4 px-4 py-2 rounded-md ${user.isBlocked ? 'bg-red-500' : 'bg-green-500'} text-white`}
                                 >
                                    {user.isBlocked ? 'Unblock' : 'Block'}
                                 </button>
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

                  </div>
                  {authorized && totalPages > 1 && (
                     <div className="flex justify-center mt-4">
                        {Array.from({ length: totalPages }, (_, pageNumber) => (
                           <button
                              key={pageNumber}
                              className={`px-3 py-2 rounded-md ${currentPage === pageNumber + 1 ? 'bg-blue-500 text-white' : 'text-gray-500 hover:text-blue-500'}`}
                              onClick={() => handlePageChange(pageNumber + 1)}
                           >
                              {pageNumber + 1}
                           </button>
                        ))}
                     </div>
                  )}

               </div>
            </section>

         </div>
      </div>
   );
};

export default Super_adminDashboard;
