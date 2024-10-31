import React, { ChangeEvent, useState,useEffect } from 'react';
import dynamic from 'next/dynamic';
import AWS from 'aws-sdk';
import axios from 'axios';
import Swal from 'sweetalert2';
import S3 from 'aws-sdk/clients/s3';

function addMeal() {
  const AdminNavbar = dynamic(() => import('../components/AdminNavbar'));
  const AdminAside = dynamic(() => import('../components/Adminaside'));
  const Modal = dynamic(() => import('react-modal'))
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemName, setItemName] = useState('')
  const [stock, setStock] = useState(0)
  const [foodType, setFoodType] = useState('')
  const [price,setPrice]=useState(0)
  const [foodImage, setFoodImage] = useState<any>('')
  const [shouldAddMeal, setShouldAddMeal] = useState(false); 
  console.log(itemName,stock,foodType,foodImage)
  useEffect(() => {
    if (shouldAddMeal && itemName && stock && foodType && foodImage &&price) {
      addMealToAPI();
      setShouldAddMeal(false); 
    }
  }, [shouldAddMeal, itemName, stock, foodType, foodImage,price]);
  async function addMealToAPI() {
    try {
      const mealData = {
        itemName,
        stock,
        hotOrCold:foodType,
        ImageUrl:foodImage.SaveImage.imageUrl,
        price,
        
      };
console.log(mealData,'cdcsd')
      // Send POST request to add meal API
      const response = await axios.post('/api/addMeal', mealData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      Swal.fire({
        title: 'Success!',
        text: 'Meal added successfully!',
        icon: 'success',
      });
    } catch (error) {
      console.error('Error adding meal:', error);
      Swal.fire({
        title: 'Error!',
        text: 'There was an error adding the meal',
        icon: 'error',
      });
    }
  }
  async function uploadToS3() {
    if (!image) {
      console.log('No image selected');
      return null;
    }

    const fileType = encodeURIComponent(image.type);

    try {
      console.log('Upload starting...');
      setUploading(true);
      setIsModalOpen(true);

      const { data } = await axios.get(`/api/media?fileType=${fileType}`);
      const { uploadUrl, key } = data;

      console.log('Uploading...');
      await axios.put(uploadUrl, image);

      console.log(`Upload completed.with key:${key}`);
      const formatedImage = { imageUrl: 'https://airline-datacenter.s3.ap-south-1.amazonaws.com/' + key }
      axios.post('http://localhost:3000/api/saveCloud', formatedImage, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => setFoodImage(response.data))

        .catch(error => console.error('Error:', error));
      setUploading(false);
      setIsModalOpen(false);
      Swal.fire({
        title: "uploaded!",
        text: "Data Reached There",
        imageUrl: "https://cdn.dribbble.com/users/374672/screenshots/3295528/compbig.gif",
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: "Custom image",

      });
 

  

      
      return key;
    } catch (error) {
      console.error('Error during upload:', error);
      setUploading(false);
      setIsModalOpen(false);
      return null;
    }
  }
 
 

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setImage(e.target.files[0]);
  };

  const handleUploadClick = async () => {
    await uploadToS3();
    setShouldAddMeal(true);
  };

  const handleTemperatureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFoodType(e.target.value);
  };

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'application/pdf',
    'video/mp4',
    'video/quicktime',
    'audio/mpeg',
    'audio/wav',
  ];




  const backgroundStyle: React.CSSProperties = {
    backgroundImage: "url('/admin-bg.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  };

  const formContainerStyle: React.CSSProperties = {
    width: '80%',
    maxWidth: '600px',
    padding: '20px',
  };

  
  return (
    <div style={backgroundStyle}>
      <AdminNavbar />
      <AdminAside />
      <div style={formContainerStyle}>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-extrabold text-white">Item Name</label>
          <input
            type="text" onChange={(e) => setItemName(e.target.value)}
            id="large-input"
            className="block w-full p-4 text-white font-extrabold border border-white/10 rounded-lg bg-blue-900/30 text-base focus:ring-blue-500 focus:border-blue-500   dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-extrabold text-white">Stock</label>
          <input
            type="number"
            onChange={(e) => setStock(Number(e.target.value))}  // Convert string to number
            id="large-input"
            className="block w-full p-4 text-white font-extrabold border border-white/10 rounded-lg bg-blue-900/30 text-base focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />

        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-extrabold text-white">Price</label>
          <input
            type="number"
            onChange={(e) => setPrice(Number(e.target.value))}  // Convert string to number
            id="large-input"
            className="block w-full p-4 text-white font-extrabold border border-white/10 rounded-lg bg-blue-900/30 text-base focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />

        </div>
        {/* <div className="mb-6">
          <label className="block mb-2 text-sm  font-extrabold text-white">Description</label>
          <input
            type="text"onChange={(e)=>setItemDescription(e.target.value)}
            id="default-input"
            className="block w-full p-4 text-gray-900 border border-white/10 rounded-lg bg-blue-900/30 text-base focus:ring-blue-500 focus:border-blue-500   dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div> */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-extrabold text-white">Food Type</label>
          <select
      id="temperature"
      value={foodType} // This binds the select value to the state
      onChange={handleTemperatureChange} // This updates the state when a selection is made
      className="block w-full p-4 text-white border border-white/10 rounded-lg bg-blue-900/30 text-base focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    >
      <option value="" className="text-white">Select Temperature</option>
      <option value="hot">Hot</option>
      <option value="cold">Cold</option>
    </select>
        </div>

        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-blue-950/30 hover:bg-blue-800/35 dark:border-gray-600">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
            </div>
            {image && <img className='opacity-20 w-28 h-52' src={URL.createObjectURL(image)} alt="Preview" />}
            <input onChange={handleFileChange} id="dropzone-file" type="file" className="hidden" />
          </label>
        </div>

        <button onClick={handleUploadClick} className='bg-blue-950 mt-10 w-28 h-12 hover:bg-blue-700/30 rounded-lg border border-blue-900 text-white font-extrabold'>
          {uploading ? 'Adding...' : 'Add'}
        </button>
      </div>


      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <h2>Uploading to AWS...</h2>
        <span>Contacting AWS Datacenters...</span>
        <div className="loader"></div>
      </Modal>


      <style jsx>{`
  .loader {
    border: 4px solid #f3f3f3;
    border-radius: 50%;
    border-top: 4px solid #3498db;
    width: 40px;
    height: 40px;
    animation: spin 2s linear infinite;
    margin: 20px auto;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`}</style>

    </div>
  );
}

export default addMeal;
