import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import AWS from 'aws-sdk';
import Swal from 'sweetalert2';
import S3 from 'aws-sdk/clients/s3';
import Modal from 'react-modal'; // Import react-modal

function uploadGallery() {
  const AdminNavbar = dynamic(() => import('../components/AdminNavbar'));
  const AdminAside = dynamic(() => import('../components/Adminaside'));

  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'application/pdf',
    'video/mp4',
    'video/quicktime',
    'audio/mpeg',
    'audio/wav',
  ];

  const uploadFile = async () => {
    if (!image) {
      alert("Please select a file to upload.");
      return;
    }

    setUploading(true);
    setIsModalOpen(true); // Open the modal when uploading starts

    const S3_BUCKET = "airline-datacenter";
    const REGION = "ap-south-1";

    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
      region: REGION,
    });

    const s3 = new S3({
      region: REGION,
    });

    const params = {
      Bucket: S3_BUCKET,
      Key: image.name,
      Body: image,
      ContentType: image.type,
    };

    try {
      const upload = await s3.upload(params).promise();
      console.log("Upload Success:", upload.Location);

      setUploading(false);
      setIsModalOpen(false); // Close the modal on success
      Swal.fire({
        title: "uploaded!",
        text: "Data Reached There",
        imageUrl: "https://cdn.dribbble.com/users/374672/screenshots/3295528/compbig.gif",
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: "Custom image",
        
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploading(false);
      setIsModalOpen(false); // Close the modal on error
      alert("Error uploading file: " + error.message);
    }
  };

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

  const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  return (
    <div style={backgroundStyle}>
      <AdminNavbar />
      <AdminAside />
      <div style={formContainerStyle}>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
          <input
            type="text"
            id="large-input"
            className="block w-full p-4 text-gray-900 border border-white/10 rounded-lg bg-blue-900/30 text-base focus:ring-blue-500 focus:border-blue-500   dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
          <input
            type="text"
            id="default-input"
            className="block w-full p-4 text-gray-900 border border-white/10 rounded-lg bg-blue-900/30 text-base focus:ring-blue-500 focus:border-blue-500   dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
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
            <input onChange={handleImage} id="dropzone-file" type="file" className="hidden" />
          </label>
        </div>

        <button onClick={uploadFile} className='bg-blue-950 mt-10 w-28 h-12 hover:bg-blue-700/30 rounded-lg border border-blue-900 text-white font-extrabold'>
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#1f2937',
            color: 'white',
            borderRadius: '10px',
            padding: '20px',
            textAlign: 'center',
          },
        }}
      >
        <h2>Uploading to AWS...</h2>
        <span>Contacting AWS Datacenters....</span>
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

export default uploadGallery;
