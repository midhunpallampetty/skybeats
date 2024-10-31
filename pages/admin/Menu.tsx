'use client';
import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import dynamic from 'next/dynamic';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

// GraphQL query to fetch foods
const LIST_FOODS = gql`
  query {
    listFoods {
      hotOrCold
      ImageUrl
      itemName
      stock
      createdAt
    }
  }
`;

const Menu: React.FC = () => {
  const [authorized, setAuthorized] = useState(false);
  const { loading, error, data } = useQuery(LIST_FOODS); // Query to fetch the foods
  const AdminNavbar = dynamic(() => import('../components/AdminNavbar'));
  const Adminaside = dynamic(() => import('../components/Adminaside'));
  const [role, setRole] = useState('');
  const router = useRouter();
  const token = Cookies.get('jwtToken');
  const [foods, setFoods] = useState<any[]>([]); // State to hold the fetched food data

  // Ensure food data is set when it's fetched
  useEffect(() => {
    if (data) {
      setFoods(data.listFoods);
    }
  }, [data]);

  // Redirect to login if token is not present
  useEffect(() => {
    if (!token) {
      router.push('/admin/signin');
    }
  }, [token]);

  // Verify token and set role
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

  // Set authorized status based on role
  useEffect(() => {
    if (role) {
      if (role !== '') {
        setAuthorized(true);
      }
    }
  }, [role]);

  // Render the component
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="relative w-full h-full flex justify-center items-center text-white">
      <AdminNavbar />

      <div className="absolute top-0 left-0 w-full h-full mb-64 opacity-8 pointer-events-none bg-cover bg-no-repeat bg-center" style={{ backgroundImage: 'url(/admin_bg.png)', opacity: 0.1 }} />

      <div className="relative z-10 xl:ml-[250px] xl:w-[1200px] md:w-[800px] sm:w-full">
        <Adminaside />

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
                  <div className='h-28 '></div>
                  {/* Overlay with text */}
                  <div className="absolute top-0 left-0 w-full h-full bg-transparent bg-opacity-60 flex flex-col justify-center items-center text-center text-white">
                    {/* Food Type Label */}
                    <div className="flex space-x-2 mb-2">
                      <span className="bg-red-600/80 px-10 py-2 font-extrabold rounded-full text-xs">Hot</span>
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
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {/* Centered Button */}
                <div className="flex justify-center items-center mt-2">
                  <button
                    className="w-28 mx-auto flex items-center rounded-lg font-extrabold justify-center bg-blue-500/50 hover:bg-blue-600 text-white py-2 rounded-b-lg mb-2"
                  >
                    Remove
                  </button>
                </div>
              </div>

            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
