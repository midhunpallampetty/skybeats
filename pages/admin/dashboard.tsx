'use client';
import React, { useEffect, useState } from 'react';
import { ADMIN_LOGIN_MUTATION } from '@/graphql/mutations/adminLoginMutation';
import { useMutation } from '@apollo/client';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Users } from '@/interfaces/Users';

const SuperAdminDashboard: React.FC = () => {
    const [authorized, setAuthorized] = useState(false);
    const AdminNavbar = dynamic(() => import('../components/AdminNavbar'));
    const Adminaside = dynamic(() => import('../components/Adminaside'));
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 6;
    const router = useRouter();
    const token = Cookies.get('jwtToken');
    const cardsData = [
        {
            id: 1,
            name: 'Cargo Management',
            email: 'cargo@example.com',
            isBlocked: false,
            imageUrl: 'https://projectcargo.com.tr/images/bg-img/col-bgimage-1.jpg',
            Redirect: '/admin/receivedCargo'
        },

        {
            id: 2,
            name: 'Flight Management',
            email: 'flight@example.com',
            isBlocked: true,
            imageUrl: 'https://blog.adobe.com/en/publish/2022/06/14/media_101523c4fd5175e08bd6ffbe8c509525cccba34cb.jpeg?width=1200&format=pjpg&optimize=medium',
            Redirect: '/admin/flightBookings'

        },
        {
            id: 3,
            name: 'Hotel Management',
            email: 'booking@example.com',
            isBlocked: false,
            imageUrl: 'https://www.hotelierindia.com/public/styles/full_img_sml/public/images/2020/02/14/shutterstock_1560097280.jpg?XO8Z_aDT',
            Redirect:'/admin/bookingReport'

        },
        {
            id: 4,
            name: 'Career Management',
            email: 'jobs@example.com',
            isBlocked: true,
            imageUrl: 'https://img.onmanorama.com/content/dam/mm/en/entertainment/interview/images/2016/Apr/7/jacobinte-swargarajyam.jpg.image.784.410.jpg',
            Redirect:'/admin/receivedApplications'

        },
        {
            id: 5,
            name: 'Service',
            email: 'offers@example.com',
            isBlocked: false,
            imageUrl: 'https://blog.infraspeak.com/wp-content/uploads/2021/08/Maintenance-as-a-Service.jpeg',
            Redirect:'/admin/adminChat'

        },
        {
            id: 6,
            name: 'More',
            email: 'offers@example.com',
            isBlocked: false,
            imageUrl: 'https://img.freepik.com/free-vector/red-grunge-style-coming-soon-design_1017-26691.jpg'

        },
        {
            id: 7,
            name: 'More',
            email: 'offers@example.com',
            isBlocked: false,
            imageUrl: 'https://img.freepik.com/free-vector/red-grunge-style-coming-soon-design_1017-26691.jpg'

        },
        {
            id: 5,
            name: 'More',
            email: 'offers@example.com',
            isBlocked: false,
            imageUrl: 'https://img.freepik.com/free-vector/red-grunge-style-coming-soon-design_1017-26691.jpg'

        },
    ];
    const totalPages = Math.ceil(cardsData.length / usersPerPage);



    useEffect(() => {
        if (!token) {
            router.push('/admin/signin');
        }
    }, [token]);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const currentUsers = cardsData.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);



    useEffect(() => {
        (async () => {
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

                if (!response.ok) {
                    console.error('Error from API:', data.message);
                }
            } catch (error) {
                console.error('Error occurred while verifying token');
            }
        })();
    }, [token]);

    useEffect(() => {
        if (role) {
            if (role != '') {
                setAuthorized(true);
            }
        }
    }, [role]);


    return (
        <div className="relative w-full h-full flex justify-center items-center text-white">
            <AdminNavbar />

            <div className="absolute top-0 left-0 w-full h-full mb-64 opacity-8 pointer-events-none bg-cover bg-no-repeat bg-center" style={{ backgroundImage: 'url(/admin_bg.png)', opacity: 0.1 }} />

            <div className="relative z-10 xl:ml-[250px] xl:w-[1200px] md:w-[800px] sm:w-full">
                <Adminaside />

                <div className="p-4 mt-[200px]">
                    <div className="grid grid-cols-1 md:grid-cols-3  gap-6">
                        {authorized ? (
                            cardsData.map((user, index) => (
                                <button key={index}
                                    className={`max-w-sm bg-transparent border-4 ${(role !== 'hoteladmin' && user.name === 'Hotel Management') ||
                                            (role !== 'hradmin' && user.name === 'Career Management') || (role !== 'flightoperator' && user.name === 'Flight Management') ||( role !=='cargomanager' && user.name === 'Cargo Management') 
                                            ? 'border-gray-400 cursor-not-allowed opacity-50'
                                            : 'border-gray-600/60 cursor-pointer'
                                        } rounded-lg shadow-lg relative focus:outline-none`}
                                    onClick={() => {
                                        if (
                                            !(role !== 'hoteladmin' && user.name === 'Hotel Management') &&
                                            !(role !== 'hradmin' && user.name === 'Career Management') &&!(role !== 'flightoperator' && user.name === 'Flight Management') &&!(role !== 'cargomanager' && user.name === 'Cargo Management')
                                        ) {
                                            router.push(user?.Redirect);
                                        }
                                    }}
                                    disabled={
                                        (role !== 'hoteladmin' && user.name === 'Hotel Management') ||
                                        (role !== 'hradmin' && user.name === 'Career Management')
                                    }
                                >
                                    <div className="relative">
                                        <img
                                            className="w-full h-48 rounded-lg"
                                            src={user.imageUrl}
                                            alt="Background image"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center text-white">
                                            <h3 className="text-3xl font-bold">{user.name}</h3>
                                        </div>
                                    </div>
                                </button>




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


                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
