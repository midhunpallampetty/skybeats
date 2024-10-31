'use client';
import React, { useState, useEffect ,ChangeEvent} from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image'; // For your logo
import { Carousel } from 'flowbite-react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
function RequestCargo() {
  const Navbar = dynamic(() => import('../../components/Navbar'));
  const userId=Cookies.get('userId');
  const [formData, setFormData] = useState({
    packageName: '',
    senderName: '',
    receiverName: '',
    descriptionOfGoods: '',
    Weight: '',
    userId:userId,
    height:0,
    width:0,
    StartLocation:'',
    Destination:''
  });
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
const [url,setUrl]=useState('');
  const [image, setImage] = useState<File | null>(null);

  // Handle change for inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // const validateForm = () => {
  //   const newErrors = {};

  //   if (!formData.packageName) newErrors.packageName = 'Package name is required';
  //   if (!formData.senderName) newErrors.senderName = 'Sender name is required';
  //   if (!formData.receiverName) newErrors.receiverName = 'Receiver name is required';
  //   if (!formData.StartLocation) newErrors.StartLocation = 'Sender location is required';
  //   if (!formData.Destination) newErrors.Destination = 'Receiver location is required';
  //   if (!formData.descriptionOfGoods) newErrors.descriptionOfGoods = 'Description of goods is required';
  //   if (!formData.Weight) newErrors.Weight = 'Weight is required';

  //   setErrors(newErrors);
    
  //   // Return true if there are no errors
  //   return Object.keys(newErrors).length === 0;
  // };
  const [isLoading, setIsLoading] = useState(true);
  const handleButtonClick = async (e: any) => {
    e.preventDefault(); // Prevent form from reloading the page
  
    // Validate form data
    const {
      packageName,
      senderName,
      receiverName,
      descriptionOfGoods,
      Weight,
      StartLocation,
      Destination,
    } = formData;
  
    if (
      !packageName || 
      !senderName || 
      !receiverName || 
      !descriptionOfGoods || 
      !Weight || 
      !StartLocation || 
      !Destination
    ) {
      Swal.fire({
        title: 'Validation Error!',
        text: 'All fields are required. Please fill out all fields.',
        icon: 'warning',
        background: '#0d324e',
        color: '#fff',
        confirmButtonColor: '#1e90ff',
      });
      return; // Stop the function if validation fails
    }
  
    try {
      // Proceed with submitting the form
      const res = await fetch('/api/requestCargo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (res.ok) {
        const data = await res.json();
        Swal.fire({
          title: 'Request Submitted!',
          html: `Your cargo booking request has been submitted successfully. TrackingID: 
                 <b>${data.trackingId}</b>`,
          icon: 'success',
          background: '#0d324e',
          color: '#fff',
          confirmButtonColor: '#1e90ff',
        });
  
        // Reset form data after successful submission
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
  

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Simulate a loading time
    }, 2000); // 2 seconds delay for loading

    return () => clearTimeout(timer);
  }, []);

  // Inline styles for loading screen and animation
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

  // Keyframe animation using JavaScript
  const loadingKeyframes = `
    @keyframes load {
      0% { width: 0; }
      50% { width: 100%; }
      100% { width: 0; }
    }
  `;

  return (
    <>
      <style>
        {loadingKeyframes}
      </style>
      {isLoading ? (
        <div style={{...loadingScreenStyle,flexDirection:'column'}}>
          <Image
            src="/logo_airline.png" // Replace with your logo path
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
          {/* Other page content */}
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
      {/* Package Name */}
      <div className="mb-5">
        <label htmlFor="packageName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Package Name
        </label>
        <input
          type="text"
          onChange={handleChange}
          value={formData.packageName} // Corrected value for packageName
          id="packageName"
          name="packageName"
          className="block w-full p-4 text-whiterounded-lg bg-[#0d324e]  text-white font-extrabold focus:ring-blue-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500"
          placeholder="Enter the package name"
        />
      </div>

      {/* Sender Name */}
      <div className="mb-5">
        <label htmlFor="senderName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Sender Name
        </label>
        <input
          type="text"
          onChange={handleChange}
          value={formData.senderName} // Corrected value for senderName
          id="senderName"
          name="senderName"
          className="block w-full bg-[#0d324e] h-14 text-white font-extrabold text-sm rounded-lg focus:ring-blue-500 p-2.5 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Enter the sender's name"
        />
      </div>

      {/* Receiver Name */}
      <div className="mb-5">
        <label htmlFor="receiverName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Receiver Name
        </label>
        <input
          onChange={handleChange}
          value={formData.receiverName} // Corrected value for receiverName
          type="text"
          id="receiverName"
          name="receiverName"
          className="block w-full text-white bg-[#0d324e] text-sm rounded-lg h-14 p-2.5 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Enter the receiver's name"
        />
      </div>
      <div className="mb-5">
        <label htmlFor="receiverName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Sender Location
        </label>
        <input
          onChange={handleChange}
          value={formData.StartLocation} // Corrected value for receiverName
          type="text"
          id="StartLocation"
          name="StartLocation"
          className="block w-full text-white bg-[#0d324e] text-sm rounded-lg h-14 p-2.5 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Enter Your Location"
        />
      </div>
      <div className="mb-5">
        <label htmlFor="receiverName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Receiver Location
        </label>
        <input
          onChange={handleChange}
          value={formData.Destination} // Corrected value for receiverName
          type="text"
          id="Destination"
          name="Destination"
          className="block w-full text-white bg-[#0d324e] text-sm rounded-lg h-14 p-2.5 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Enter Receiver Location"
        />                                                                                                                                         
      </div>
      {/* Description of Goods */}
      <div className="mb-5">
        <label htmlFor="descriptionOfGoods" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Description of Goods
        </label>
        <textarea
          onChange={handleChange}
          value={formData.descriptionOfGoods} // Corrected value for descriptionOfGoods
          id="descriptionOfGoods"
          name="descriptionOfGoods"
          className="block w-full p-4 text-white rounded-lg bg-[#0d324e] dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Describe the goods being shipped"
          rows={4}
        />
      </div>

      {/* Weight */}
      <div className="mb-5">
        <label htmlFor="Weight" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Weight (kg)
        </label>
        <input
          onChange={handleChange}
          value={formData.Weight} // Corrected value for Weight
          type="number"
          id="Weight"
          name="Weight"
          className="block w-full p-2 text-white bg-[#0d324e] rounded-lg focus:ring-blue-500 dark:placeholder-gray-400  h-12 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Enter the weight of the package"
        />
      </div>
     
      {/* Submit Button */}
      <div className="mt-5">
        <button
          type="button" // Changed type to button to prevent form submission
          onClick={handleButtonClick} // Handle form submission on button click
          className="w-full bg-blue-900 h-12 text-white font-extrabold text-2xl p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </div>
    </form>

<footer
    className="bg-blue-800/20 text-center mt-20 rounded-md text-white/10 shadow-white/15 shadow-inner ">
    <div className="container p-6">
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <div className="mb-6 lg:mb-0">
          <img
            src="https://img.freepik.com/free-photo/logistics-transportation-container-cargo-ship-cargo-plane-with-working-crane-bridge-shipyard-sunrise-logistic-import-export-transport-industry-background-ai-generative_123827-24177.jpg?w=1380&t=st=1726561962~exp=1726562562~hmac=4f9324056b37759c8605a8232a03522b85c0f6897e9d95b198c5420f7ee21ab2"
            className="w-full rounded-md shadow-lg" />
        </div>
        <div className="mb-6 lg:mb-0">
          <img
            src="https://img.freepik.com/free-photo/top-view-plane-boxes_23-2149853127.jpg?t=st=1726562011~exp=1726565611~hmac=a569284458a99cdb3aa222d3ac69611901ce23ff6683ea28acc7a4f70e6edd1b&w=1480"
            className="w-full rounded-md shadow-lg" />
        </div>
        <div className="mb-6 lg:mb-0">
          <img
            src="https://img.freepik.com/free-photo/logistics-means-transport-together-with-technological-futuristic-holograms_23-2151662980.jpg?t=st=1726562042~exp=1726565642~hmac=010c2b0240f5d8b1ec9ea7f9d0b07fdff1376886cc1fddfc242752aacb6e153d&w=1380"
            className="w-full rounded-md shadow-lg" />
        </div>
        <div className="mb-6 lg:mb-0">
          <img
            src="https://img.freepik.com/free-photo/green-plane-ecofriendly-environment_23-2151582434.jpg?t=st=1726562078~exp=1726565678~hmac=62eea8807a3fc6a0f501a10a9dfa1819dd6f796b81385e3c079527f4b2d89a3d&w=1480"
            className="w-full rounded-md shadow-lg" />
        </div>
        <div className="mb-6 lg:mb-0">
          <img
            src="https://img.freepik.com/free-photo/airplane-sunset_1150-8368.jpg?t=st=1726562105~exp=1726565705~hmac=fbcd17be8fbc2c36498465085b83d955ee64636b59ea873e49ebc6c9728bb922&w=1380"
            className="w-full rounded-md shadow-lg" />
        </div>
        <div className="mb-6 lg:mb-0">
          <img
            src="https://img.freepik.com/free-photo/logistics-means-transport-together-with-technological-futuristic-holograms_23-2151662992.jpg?t=st=1726562148~exp=1726565748~hmac=9216655d617871585322a750005e26a46928b4b810d988a48cd647bb394f1c9e&w=1060"
            className="w-full rounded-md shadow-lg" />
        </div>
        
      </div>
    </div>

    {/* <!--Copyright section--> */}
    <div
      className="bg-white p-4 text-center text-black ">
      © 2023 Copyright:
      <a className="dark:text-neutral-400" href="https://tw-elements.com/"
      >Skybeats</a>
    </div>
  </footer>
        </>
      )}
    </>
  );
}

export default RequestCargo;
