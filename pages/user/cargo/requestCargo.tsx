'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Carousel } from 'flowbite-react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import axiosInstance from '@/pages/api/utils/axiosInstance';

function RequestCargo() {
  const Navbar = dynamic(() => import('../../components/Navbar'));
  const userId = Cookies.get('userId');
  const router = useRouter();

  const [formData, setFormData] = useState({
    packageName: '',
    senderName: '',
    receiverName: '',
    descriptionOfGoods: '',
    Weight: '',
    userId: userId,
    height: 0,
    width: 0,
    StartLocation: '',
    Destination: ''
  });

  const [errors, setErrors] = useState({
    packageName: '',
    senderName: '',
    receiverName: '',
    descriptionOfGoods: '',
    Weight: '',
    StartLocation: '',
    Destination: ''
  });

  const [isLoading, setIsLoading] = useState(true);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = { ...errors };
    let isValid = true;
  
    if (!formData.packageName.trim()) {
      newErrors.packageName = 'Package name is required';
      isValid = false;
    }
    if (!formData.senderName.trim()) {
      newErrors.senderName = 'Sender name is required';
      isValid = false;
    }
    if (!formData.receiverName.trim()) {
      newErrors.receiverName = 'Receiver name is required';
      isValid = false;
    }
    if (!formData.StartLocation.trim()) {
      newErrors.StartLocation = 'Sender location is required';
      isValid = false;
    }
    if (!formData.Destination.trim()) {
      newErrors.Destination = 'Receiver location is required';
      isValid = false;
    }
    if (!formData.descriptionOfGoods.trim()) {
      newErrors.descriptionOfGoods = 'Description of goods is required';
      isValid = false;
    }
    if (!formData.Weight.trim()) {
      newErrors.Weight = 'Weight is required';
      isValid = false;
    } else if (isNaN(Number(formData.Weight))) {
      newErrors.Weight = 'Weight must be a number';
      isValid = false;
    } else if (Number(formData.Weight) <= 0) {
      newErrors.Weight = 'Weight must be greater than zero';
      isValid = false;
    }
  
    setErrors(newErrors);
    return isValid;
  };
  

  useEffect(() => {
    const userId = Cookies.get('userId');
    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');

    if (!userId || !accessToken || !refreshToken) {
      Cookies.remove('userId');
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const res = await axiosInstance.post('/requestCargo', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res) {
        const data = await res.data;
        Swal.fire({
          title: 'Request Submitted!',
          html: `Your cargo booking request has been submitted successfully. TrackingID: 
                 <b>${data.trackingId}</b>`,
          icon: 'success',
          background: '#0d324e',
          color: '#fff',
          confirmButtonColor: '#1e90ff',
        });

        setFormData({
          packageName: '',
          senderName: '',
          receiverName: '',
          descriptionOfGoods: '',
          Weight: '',
          userId: Cookies.get('userId') || '',
          height: 0,
          width: 0,
          StartLocation: '',
          Destination: '',
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Cargo booking failed. Please try again later.',
          icon: 'error',
          background: '#0d324e',
          color: '#fff',
          confirmButtonColor: '#1e90ff',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'An unexpected error occurred. Please try again later.',
        icon: 'error',
        background: '#0d324e',
        color: '#fff',
        confirmButtonColor: '#1e90ff',
      });
      console.error('Error in cargo booking:', error);
    }
  };

  const loadingScreenStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#1a2d45',
  };

  const loadingBarStyle = {
    width: '100px',
    height: '5px',
    backgroundColor: '#0c2336',
    marginTop: '10px',
    borderRadius: '3px',
    overflow: 'hidden',
  };

  const loadingBarFillStyle = {
    width: '0',
    height: '100%',
    backgroundColor: '#0073b1',
    animation: 'load 4s ease-in-out infinite',
  };

  const loadingKeyframes = `
    @keyframes load {
      0% { width: 0; }
      50% { width: 100%; }
      100% { width: 0; }
    }
  `;

  return (
    <>
      <style>{loadingKeyframes}</style>
      {isLoading ? (
        <div style={{...loadingScreenStyle, flexDirection: 'column'}}>
          <Image
            src="/logo_airline.png"
            alt="Logo"
            width={200}
            height={200}
          />
          <div style={loadingBarStyle}>
            <div style={loadingBarFillStyle}></div>
          </div>
        </div>
      ) : (
        <>
          <Navbar />
          <div className="h-[250px] mt-[50px] sm:h-[55] xl:h-[500px] 2xl:h-[800px]">
            <Carousel>
              <img
                src="https://airline-datacenter.s3.ap-south-1.amazonaws.com/pexels-albinberlin-906982.jpg"
                alt="Career Carousel 1"
              />
              <img
                src="https://airline-datacenter.s3.ap-south-1.amazonaws.com/pexels-miguel-cuenca-67882473-18192938.jpg"
                alt="Career Carousel 2"
              />
            </Carousel>
          </div>
          <p className="text-center text-white font-extrabold text-4xl mt-4">Explore Cargo Facility With World's Best Airline</p>
          <form className="max-w-[800px] mx-auto mt-16">
            <div className="mb-5">
              <label htmlFor="packageName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Package Name
              </label>
              <input
                type="text"
                onChange={handleChange}
                value={formData.packageName}
                id="packageName"
                name="packageName"
                className="block w-full p-4 text-white rounded-lg bg-[#0d324e] text-white font-extrabold focus:ring-blue-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500"
                placeholder="Enter the package name"
              />
              {errors.packageName && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.packageName}</p>}
            </div>

            <div className="mb-5">
              <label htmlFor="senderName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Sender Name
              </label>
              <input
                type="text"
                onChange={handleChange}
                value={formData.senderName}
                id="senderName"
                name="senderName"
                className="block w-full bg-[#0d324e] h-14 text-white font-extrabold text-sm rounded-lg focus:ring-blue-500 p-2.5 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter the sender's name"
              />
              {errors.senderName && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.senderName}</p>}
            </div>

            <div className="mb-5">
              <label htmlFor="receiverName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Receiver Name
              </label>
              <input
                onChange={handleChange}
                value={formData.receiverName}
                type="text"
                id="receiverName"
                name="receiverName"
                className="block w-full text-white bg-[#0d324e] text-sm rounded-lg h-14 p-2.5 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter the receiver's name"
              />
              {errors.receiverName && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.receiverName}</p>}
            </div>

            <div className="mb-5">
              <label htmlFor="StartLocation" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Sender Location
              </label>
              <input
                onChange={handleChange}
                value={formData.StartLocation}
                type="text"
                id="StartLocation"
                name="StartLocation"
                className="block w-full text-white bg-[#0d324e] text-sm rounded-lg h-14 p-2.5 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter Your Location"
              />
              {errors.StartLocation && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.StartLocation}</p>}
            </div>

            <div className="mb-5">
              <label htmlFor="Destination" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Receiver Location
              </label>
              <input
                onChange={handleChange}
                value={formData.Destination}
                type="text"
                id="Destination"
                name="Destination"
                className="block w-full text-white bg-[#0d324e] text-sm rounded-lg h-14 p-2.5 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter Receiver Location"
              />
              {errors.Destination && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.Destination}</p>}
            </div>

            <div className="mb-5">
              <label htmlFor="descriptionOfGoods" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Description of Goods
              </label>
              <textarea
                onChange={handleChange}
                value={formData.descriptionOfGoods}
                id="descriptionOfGoods"
                name="descriptionOfGoods"
                className="block w-full p-4 text-white rounded-lg bg-[#0d324e] dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Describe the goods being shipped"
                rows={4}
              />
              {errors.descriptionOfGoods && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.descriptionOfGoods}</p>}
            </div>

            <div className="mb-5">
              <label htmlFor="Weight" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Weight (kg)
              </label>
              <input
                onChange={handleChange}
                value={formData.Weight}
                type="number"
                id="Weight"
                name="Weight"
                className="block w-full p-2 text-white bg-[#0d324e] rounded-lg focus:ring-blue-500 dark:placeholder-gray-400 h-12 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter the weight of the package"
              />
              {errors.Weight && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.Weight}</p>}
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={handleButtonClick}
                className="w-full bg-blue-900 h-12 text-white font-extrabold text-2xl p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                Submit
              </button>
            </div>
          </form>

          <footer className="bg-blue-800/20 text-center mt-20 rounded-md text-white/10 shadow-white/15 shadow-inner">
            <div className="container p-6">
             
            </div>

            <div className="bg-white p-4 text-center text-black">
              © 2023 Copyright:
              <a className="dark:text-neutral-400" href="https://tw-elements.com/">Skybeats</a>
            </div>
          </footer>
        </>
      )}
    </>
  );
}

export default RequestCargo;

