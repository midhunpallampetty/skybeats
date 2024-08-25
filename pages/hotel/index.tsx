'use client'
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/pages/components/Navbar';
import { ApolloClient, gql } from '@apollo/client'
import { Airport } from '@/interfaces/Airport';
import Modal from 'react-modal';
import { useDispatch, UseDispatch,useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import { useRef } from 'react';
import { setHotels } from '@/redux/slices/bookHotelSlice';
import Select, { SingleValue, ActionMeta, InputActionMeta } from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';
import debounce from 'lodash.debounce';
import GET_NEARBY_HOTELS from '@/graphql/queries/nearbyhotels';
import axios from 'axios';
import Image from 'next/image';
import { useQuery } from '@apollo/client';
import { AnyNaptrRecord } from 'dns';
import { OptionType } from '@/interfaces/OptionType';
import { CityOption } from '@/interfaces/cityOption';
import { IMycity } from '@/interfaces/IMyCity';
import { RootState } from '@/redux/store';

const Hotels: React.FC = () => {
  const dispatch=useDispatch()

  const [pixabayImages,setpixabayImages]=useState([])
  const [airports, setAirports] = useState<Airport[]>([]);
  
  // const [hotels, setHotels] = useState([]);
  const itemsPerPage = 6; 
  const [currentPage, setCurrentPage] = useState(1);
 

  // Handle page change
  const handlePageChange = (pageNumber:number) => {
    setCurrentPage(pageNumber);
  };
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response:any = await axios.get('https://pixabay.com/api/', {
          params: {
            key: '38643909-0965461316365ac27e67b31c5', // Replace with your Pixabay API key
            q: 'hotel+rooms',
            image_type: 'photo',
            per_page: 50,
          },
        });

        setpixabayImages(response.data.hits)
        console.log(pixabayImages,'testbvfhvghvb');
        if (images.length > 0) {
          const randomImage = images[Math.floor(Math.random() * images.length)];
          setImageUrl(randomImage.webformatURL);
        }
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchImage();
  }, []);
  const [filteredAirports, setFilteredAirports] = useState<OptionType[]>([]);
  const { loading, error, data } = useQuery(GET_NEARBY_HOTELS)
  const [myCity, SetmyCity] = useState<IMycity>({ city: "", Location: "", Region: "" });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedCity, setSelectedCity] = useState<SingleValue<OptionType> | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  // const [hotelOptions, setHotelOptions] = useState<any>([]);
  const hotelOptions=((state:RootState)=>state.hotels.hotels)
  console.log('accessed d')
  const currentHotels = hotelOptions?.HotelByLocation?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(hotelOptions?.HotelByLocation?.length / itemsPerPage);

  const [nearByHotel, setnearByHotel] = useState({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const scrollLeft = () => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.scrollBy({ left: -scrollContainer.clientWidth, behavior: 'smooth' });
    }
  };


  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await fetch('/api/getAirports');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const airportsData: Airport[] = await response.json();
        setAirports(airportsData);
        setFilteredAirports(airportsData.map(airport => ({
          value: airport.code,
          label: `${airport.city}`,
        })));
      } catch (error) {
        console.error('Error fetching airports:', error);
      }
    };

    fetchAirports();
  }, []);


  const scrollRight = () => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.scrollBy({ left: scrollContainer.clientWidth, behavior: 'smooth' });
    }
  };
  useEffect(() => {
    const myCity = axios.get('https://ipinfo.io').then((response: any) => {
      SetmyCity({ city: response.data.city, Location: "", Region: "" })
    })
  }, [])


  console.log(myCity, 'mycity is', new Date())



  const handleCityChange = (selectedOption: SingleValue<OptionType>) => {
    setSelectedCity(selectedOption);
  };
  const handleSearchHotels = async (event: React.FormEvent) => {
    event.preventDefault();

    if (selectedCity && startDate && endDate) {
      try {
        console.log(selectedCity.label.toLowerCase(), 'ok');
        const response = await axios.post('/api/searchHotels', {
          city: selectedCity.label.toLowerCase(),
        });
        dispatch(setHotels(response.data as any))
        setHotelOptions(response.data as any);  
        console.log(response.data, 'got data hotels from gql server');
      } catch (error: any) {
        console.error('Error searching hotels:', error.message);
      }
    } else {
      console.log('Please select all fields');
    }
  };
  console.log(hotelOptions, 'bhthbnghrbgrhebgh')
  function truncateWords(text: string, wordLimit: number): string {
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  }



  return (
    <>
      <Navbar />const scrollRef = useRef(null);



     <div style={{ position: 'relative', zIndex: 1 }}>
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1,
          opacity: 0.8,
        }}
      >
        <source src="/hotel intro.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div
        style={{
          height: '80vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '80px',
        }}
      >
        <div className="container w-[620px] h-[250px] mx-auto p-8 bg-blue-950/80 bg-opacity-90 rounded-3xl flex flex-col justify-center space-y-6">
          <form onSubmit={handleSearchHotels}>
            <div className="flex flex-col items-center space-y-4">
              <div className="flex space-x-10">
                <Select
                  options={filteredAirports}
                  className="w-64 border-none rounded-r-lg bg-blue-900"
                  onChange={setSelectedCity}
                />
              </div>
              <div className="relative flex space-x-4 mt-4">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  placeholderText="Start Date"
                  className="border p-2 rounded"
                />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  placeholderText="End Date"
                  className="border p-2 rounded"
                />
              </div>
              <button type="submit" className="mt-4 p-2 bg-blue-700 text-white rounded">
                Search Hotels
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
      <section className='h-auto bg-gradient-to-r from-[#0f172a] to-[#131723] p-8'>
        <h1 className='text-white text-3xl font-semibold'>Hotels In Nearby Locations  </h1>
        <span className='text-white' style={{ display: 'inline-flex', alignItems: 'center' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width='20' height='20' fill='red' viewBox="0 0 384 512">
            <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
          </svg>
          {myCity?.city}, {myCity?.Region}, {myCity?.Location}
        </span>
        <div className="overflow-hidden relative">
          {/* Left Scroll Button */}
          <div className="absolute top-1/2 transform -translate-y-1/2 left-2 z-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              onClick={scrollLeft}
              fill="gray"
              viewBox="0 0 256 512"
            >
              <path d="M9.4 278.6c-12.5-12.5-12.5-32.8 0-45.3l128-128c9.2-9.2 22.9-11.9 34.9-6.9s19.8 16.6 19.8 29.6l0 256c0 12.9-7.8 24.6-19.8 29.6s-25.7 2.2-34.9-6.9l-128-128z" />
            </svg>
          </div>

          {/* Right Scroll Button */}
          <div className="absolute top-1/2 transform -translate-y-1/2 right-2 z-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              onClick={scrollRight}
              fill="gray"
              viewBox="0 0 256 512"
            >
              <path d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9-7.8 24.6-19.8 29.6s25.7 2.2 34.9-6.9l128-128z" />
            </svg>
          </div>

          <div
            ref={scrollRef}
            className="flex mt-10 gap-8 overflow-x-auto scroll-smooth"
            style={{ scrollBehavior: 'smooth' }}
          >
            {data &&
              data?.NearByHotels?.map((hotel: any) => (
                <div
                  key={hotel.name}
                  className="flex-none w-80 relative max-w-sm rounded-lg shadow bg-transparent border border-white/10 cursor-pointer"
                  onClick={openModal}
                >
                  <a href="#">
                    <img
                      className="rounded-t-lg"
                      src="https://r1imghtlak.mmtcdn.com/b18f69d831c411eea1dd0a58a9feac02.jpg?&output-quality=75&downsize=520:350&crop=520:350;81,0&output-format=jpg&downsize=480:336&crop=480:336"
                      alt=""
                    />
                    <div className="absolute top-2 right-2 bg-green-400 text-white text-xs font-bold py-1 px-2 rounded-lg">
                      ⭐ {hotel.overall_rating.toFixed(1)}
                    </div>
                  </a>
                  <div className="p-5">
                    <a href="#">
                      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {hotel.name.length > 10
                          ? `${hotel.name.substring(0, 30)}`
                          : hotel.name}
                      </h5>
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>

      </section>
      <section className='h-auto bg-gradient-to-r from-[#0f172a] to-[#131723] p-8'>
        {hotelOptions.HotelByLocation && (
          <h1 className='text-white/50 font-semibold text-2xl mb-5 ml-[850px]'>
            Found {hotelOptions.HotelByLocation?.length} Hotels
          </h1>
        )}
        <div className="flex justify-center items-center h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentHotels?.map((hotel:any) => (
          <a key={hotel.id} href="#" className="flex flex-col border border-white/10 md:flex-row bg-[#141f3b] text-white rounded-xl overflow-hidden shadow-lg">
            <div className="relative">
              <img className="object-cover w-full md:w-full h-56 md:h-auto" src={imageUrl || 'https://cdn.pixabay.com/photo/2021/12/11/07/59/hotel-6862159_960_720.jpg'} alt="Hotel" />
              <button className="absolute top-3 left-3 bg-white text-red-500 p-2 rounded-full">
                ❤️
              </button>
            </div>
            <div className="flex flex-col rounded-tr-xl rounded-br-xl justify-between p-6 w-full">
              <div>
                <span className="bg-blue-600 text-xs px-2 py-1 rounded-full">  {hotel.overall_rating.toFixed(1)}</span>
                <h5 className="mt-4 mb-2 text-2xl font-bold tracking-tight">
                  {truncateWords(hotel.name, 10)}
                </h5>
                {selectedCity && (
                  <p className="text-gray-400">{selectedCity.label.toLowerCase()}</p>
                )}
              </div>
              <button className="self-end mt-4 bg-green-400 text-white py-2 px-4 font-extrabold rounded-full hover:bg-green-600">
                Book Now
              </button>
            </div>
          </a>
        ))}
      </div>
        </div>
      </section>
      <div className="flex justify-center mt-6">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-1 px-3 py-1 rounded-full ${index + 1 === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-300 text-black'} hover:bg-blue-500 hover:text-white`}
          >
            {index + 1}
          </button>
        ))}
      </div>


      <section>
        <div className='w-[70vh] h-[100vh] mt-20 rounded-lg'>
          <iframe width="1900px" height="800" src="https://api.maptiler.com/maps/satellite/?key=aooqoXjfCRyDM4af6JeU#8.8/9.15009/76.36635"></iframe>

        </div>
      </section>

      <footer className=" bg-blue">
        <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
          <div className="md:flex md:justify-between">
            <div className="mb-6 md:mb-0">
              <a href="https://flowbite.com/" className="flex items-center">
                <Image src="/logo_airline.png" alt="FlowBite Logo" width={152} height={52} />
              </a>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
              <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Resources</h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                  <li className="mb-4">
                    <a href="https://flowbite.com/" className="hover:underline">Flowbite</a>
                  </li>
                  <li>
                    <a href="https://tailwindcss.com/" className="hover:underline">Tailwind CSS</a>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Follow us</h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                  <li className="mb-4">
                    <a href="https://github.com/themesberg/flowbite" className="hover:underline ">Github</a>
                  </li>
                  <li>
                    <a href="https://discord.gg/4eeurUVvTy" className="hover:underline">Discord</a>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                  <li className="mb-4">
                    <a href="#" className="hover:underline">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="#" className="hover:underline">Terms &amp; Conditions</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <div className="sm:flex sm:items-center sm:justify-between">
            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="https://flowbite.com/" className="hover:underline">Flowbite™</a>. All Rights Reserved.</span>
            <div className="flex mt-4 sm:justify-center sm:mt-0">
              <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 8 19">
                  <path fillRule="evenodd" d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z" clipRule="evenodd" />
                </svg>
                <span className="sr-only">Facebook page</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 21 16">
                  <path d="M16.942 1.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.585 11.585 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3A17.392 17.392 0 0 0 .182 13.218a15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.63 10.63 0 0 1-1.706-.83c.143-.106.283-.217.418-.33a11.664 11.664 0 0 0 10.118 0c.137.113.277.224.418.33-.544.324-1.118.598-1.706.83.312.625.674 1.221 1.084 1.785a15.73 15.73 0 0 0 4.967-2.52A17.4 17.4 0 0 0 16.942 1.556ZM7 12.5V6l5 3-5 3Z" />
                </svg>
                <span className="sr-only">YouTube channel</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 17">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 3.805 0 8.5c0 2.668 1.453 5.03 3.735 6.572-.021-.5-.004-1.102.126-1.646.14-.592.94-3.992.94-3.992s-.239-.484-.239-1.2c0-1.123.65-1.96 1.457-1.96.688 0 1.02.517 1.02 1.137 0 .693-.44 1.73-.668 2.694-.19.802.4 1.457 1.18 1.457 1.417 0 2.505-1.495 2.505-3.648 0-1.906-1.37-3.244-3.325-3.244-2.265 0-3.594 1.698-3.594 3.452 0 .69.263 1.432.593 1.835.065.08.075.15.056.23-.06.252-.194.795-.22.908-.035.148-.115.178-.265.107-1.008-.468-1.637-1.935-1.637-3.117 0-2.537 1.846-4.872 5.322-4.872 2.793 0 4.963 1.986 4.963 4.638 0 2.772-1.743 5.01-4.161 5.01-.813 0-1.577-.423-1.838-.923l-.499 1.9c-.179.705-.667 1.587-.995 2.126.754.234 1.55.362 2.383.362 5.523 0 10-3.805 10-8.5C20 3.805 15.523 0 10 0Z" clipRule="evenodd" />
                </svg>
                <span className="sr-only">Dribbble account</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Hotel Details"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
          },
        }}
      >
        <h2>test</h2>
        <p>Rating:4.5</p>
        <p>More details about the hotel...</p>
        <button
          onClick={closeModal}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          Close Modal
        </button>
      </Modal>
    </>
  );
};

export default Hotels;
