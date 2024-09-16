import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Swal from 'sweetalert2'
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
  marginTop: '250px',
  maxWidth: '600px',
  padding: '20px',
};

const gridBackgroundStyle = {
  backgroundImage: "url('/admin-bg.png')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '100vh',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
};

function AddJobs() {
  const [designation, setDesignation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  const AdminNavbar = dynamic(() => import('../components/AdminNavbar'));
  const AdminAside = dynamic(() => import('../components/Adminaside'));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const getPresignedUrl = async (filename: string, filetype: string) => {
    const response = await fetch('/api/awss3', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filename, filetype }),
    });

    if (!response.ok) {
      throw new Error('Failed to get pre-signed URL');
    }

    const data = await response.json();
    return data.uploadUrl;
  };

  const uploadToS3 = async (file: File) => {
    const filename = file.name;
    const filetype = file.type;

    try {
      const uploadUrl = await getPresignedUrl(filename, filetype);
      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': filetype,
        },
      });
      console.log(uploadUrl.split('?')[0],'hairgrfgrtgyh');
      setImageUrl(uploadUrl.split('?')[0]); 
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (image) {
        await uploadToS3(image);
      }

      const jobData = {
        designation:designation,
        description:description,
        Image:imageUrl, 
      };

      const response = await fetch('/api/createJob', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      if (response.ok) {
        Swal.fire("Job Posted Succesfully!");
        console.log('Job added successfully');
      } else {
        console.error('Failed to add job');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <AdminNavbar />
      <AdminAside />
      <div className="flex justify-center h-screen " style={gridBackgroundStyle}>
        <div style={formContainerStyle}>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Select Job Designation
              </label>
              <select
                id="large-select"
                className="block w-full p-4 text-gray-900 border border-white/10 rounded-lg bg-blue-900/30 text-base focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 custom-dropdown"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
              >
                <option value="">Choose an option</option>
                <option value="Flight Cleaner">Flight Cleaner</option>
                <option value="Air Cabin Crew">Air Cabin Crew</option>
                <option value="First Class Pilot">First Class Pilot</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Description
              </label>
              <input
                type="text"
                id="default-input"
                className="block w-full p-4 text-gray-900 border border-white/10 rounded-lg bg-blue-900/30 text-base focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-blue-950/30 hover:bg-blue-800/35 dark:border-gray-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
              </label>
            </div>

            <button
              type="submit"
              className="bg-blue-950 mt-10 w-28 h-12 hover:bg-blue-700/30 rounded-lg border border-blue-900 text-white font-extrabold"
            >
              Add
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddJobs;
