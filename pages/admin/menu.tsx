'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import adminAxios from '../api/utils/adminAxiosInstance';
const Menu: React.FC = () => {
  const [authorized, setAuthorized] = useState(false);
  const [role, setRole] = useState('');
  const [foods, setFoods] = useState<any[]>([]); // State to hold the fetched food data
  const token = Cookies.get('adminaccessToken');
  const router = useRouter();
  const AdminNavbar = dynamic(() => import('../components/AdminNavbar'));

  // Fetch food data from API
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await adminAxios.get('/listFoods'); // Use axios to make a GET request
        setFoods(response.data); // Set the foods state with the data from the response
      } catch (error:any) {
        console.error('Error fetching food data:', error.message);
      }
    };
  
    fetchFoods();
  }, []);

  // Verify token and role
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        router.push('/admin/dashboard');
        return;
      }

      try {
        const response = await fetch('/api/tokenVerify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok && data === 'hoteladmin') {
          setRole(data);
          setAuthorized(true);
        } else {
          router.push('/admin/dashboard');
        }
      } catch (error) {
        console.error('Error verifying token:', error.message);
        router.push('/admin/dashboard');
      }
    };

    verifyToken();
  }, [token, router]);

  // Render loading or error states
  if (!authorized) return <p>Loading...</p>;

  // Render the component
  return (
    <>
      <div className="relative w-full h-full flex justify-center items-center text-white">
        <AdminNavbar />

        <div
          className="absolute top-0 left-0 w-full h-full mb-64 opacity-8 pointer-events-none bg-cover bg-no-repeat bg-center"
          style={{ backgroundImage: 'url(/admin_bg.png)', opacity: 0.1 }}
        />

        <div className="relative z-10 xl:ml-[250px] xl:w-[1200px] md:w-[800px] sm:w-full">

          <div className="p-4 mt-[200px]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {foods.map((food, index) => (
                <div
                  key={index}
                  className="max-w-sm bg-transparent border-2 rounded-lg shadow-lg relative focus:outline-none border-gray-600/60 cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative">
                    {/* Card Image */}
                    <img
                      className="w-full h-28 rounded-t-lg object-cover"
                      src={food.ImageUrl}
                      alt={food.itemName}
                    />
                    <div className="h-28 "></div>
                    {/* Overlay with text */}
                    <div className="absolute top-0 left-0 w-full h-full bg-transparent bg-opacity-60 flex flex-col justify-center items-center text-center text-white">
                      {/* Food Type Label */}
                      <div className="flex space-x-2 mb-2">
                        <span className={`px-10 py-2 font-extrabold rounded-full text-xs ${food.hotOrCold === 'Hot' ? 'bg-red-600/80' : 'bg-blue-600/80'}`}>
                          {food.hotOrCold}
                        </span>
                        <span className="bg-blue-600/80 px-10 py-2 font-extrabold rounded-full text-xs">Indian</span>
                      </div>

                      {/* Dish Name */}
                      <h3 className="text-2xl font-bold mt-10">{food.itemName}</h3>

                      {/* Category Label */}
                      <p className="text-sm">Lunch</p>

                      {/* Date Added */}
                      <p className="text-xs mt-1">
                        Menu added on: {new Date(food.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={() => router.push('/admin/addMeal')}
          className="p-4 bg-blue-900 text-white font-extrabold rounded-lg"
        >
          Add Menu
        </button>
      </div>
    </>
  );
};

export default Menu;
