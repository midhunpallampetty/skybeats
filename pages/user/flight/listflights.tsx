import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';
import DatePicker from 'react-datepicker';
import Select, { SingleValue, ActionMeta } from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash.debounce';
import { setAirports, setFilteredAirports } from '@/redux/slices/airportsSlice';
import { setBookDetail } from '@/redux/slices/bookdetailSlice';
import { Flight } from '../../../interfaces/flight';
import Swal from 'sweetalert2';
import Image from 'next/image';
import { clearSelectedSeat } from '@/redux/slices/selectedSeat';
import axiosInstance from '@/pages/api/utils/axiosInstance';
import dynamic from 'next/dynamic';
import { Airport } from '@/interfaces/Airport';
import { RootState } from '@/redux/store';
import { setFlights, clearFlights } from '@/redux/slices/flightsSlice';
import { setDate } from '@/redux/slices/bookDate';
import { setReturnDate } from '@/redux/slices/returnDate';
import { setSelectedPassengers } from '@/redux/slices/passengerCountSlice';
import { OptionType } from '@/interfaces/OptionType';
import { useRouter } from 'next/router';
import { clearSelectedReturnFlight, selectReturnFlight } from '@/redux/slices/returnFlightSlice';
import LoadingSpinner from '@/pages/components/LoadingSpinner';

const Navbar = dynamic(() => import('../../components/Navbar'), { ssr: true });

const ListFlights: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const airports = useSelector((state: RootState) => state.airports.airports);
  const filteredAirports = useSelector((state: RootState) => state.airports.filteredAirports);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [returnDate, setreturnDate] = useState<Date | null>(null);
  const [error, setError] = useState('');
  const hasFetched = useRef(false);
  const [showMainFlights, setShowMainFlights] = useState(true);
  const [showReturnFlights, setShowReturnFlights] = useState(false);
  const [returnFlights, setReturnFlights] = useState<Flight[]>([]);
  const [loadingReturnFlights, setLoadingReturnFlights] = useState(false);
  const [passengers, setPassengers] = useState({
    adults: 0,
    seniors: 0,
    children: 0,
    infants: 0,
  });
  const [selectedFrom, setSelectedFrom] = useState<SingleValue<OptionType>>(null);
  const [selectedTo, setSelectedTo] = useState<SingleValue<OptionType>>(null);
  const flights = useSelector((state: RootState) => state.flights.flights);
  const [sortOption, setSortOption] = useState<string>('price');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [flightsPerPage] = useState<number>(5);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const lastSearchRequest = useRef(null);
  const listingRef = useRef(null);

  useEffect(() => {
    dispatch(clearFlights());
    dispatch(clearSelectedReturnFlight());
  }, [dispatch]);

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
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchAirports = async () => {
      if (hasFetched.current) return;

      try {
        hasFetched.current = true;
        const response = await axiosInstance.get('/getAirports');
        const airportsData: Airport[] = response.data;

        const airportOptions = airportsData.map((airport) => ({
          value: airport.code,
          label: `${airport.city} (${airport.code}) ${airport.country}`,
        }));

        dispatch(setAirports(airportOptions));
        dispatch(setFilteredAirports(airportOptions));
      } catch (error) {
        Swal.fire({
          text: 'Error Fetching Airports',
          background: 'dark',
        });
        console.error('Error fetching airports:', error);
      }
    };

    fetchAirports();
  }, [dispatch]);

  const increment = (type: keyof typeof passengers) => {
    if (totalPassengers < 10) {
      if ((type === 'children' || type === 'infants') && !hasAdultOrSenior()) {
        Swal.fire({
          title: 'You must have at least one adult or senior citizen to select infants or children.',
          background: '#282c34',
          color: '#fff',
          confirmButtonColor: '#4CAF50',
        });
      } else {
        setPassengers((prev) => ({
          ...prev,
          [type]: prev[type] + 1,
        }));
      }
    } else {
      Swal.fire({
        title: 'Maximum 10 passengers allowed.',
        background: '#282c34',
        color: '#fff',
        confirmButtonColor: '#4CAF50',
      });
    }
  };

  const decrement = (type: keyof typeof passengers) => {
    if (passengers[type] > 0) {
      setPassengers((prev) => ({
        ...prev,
        [type]: prev[type] - 1,
      }));
    }
  };

  const totalPassengers = passengers.adults + passengers.seniors + passengers.children + passengers.infants;
  const hasAdultOrSenior = () => passengers.adults + passengers.seniors > 0;

  const toggleFlights = (type: 'main' | 'return') => {
    if (type === 'main') {
      setShowMainFlights(true);
      setShowReturnFlights(false);
    } else {
      setShowMainFlights(false);
      setShowReturnFlights(true);
      fetchReturnFlights();
    }
  };

  const fetchReturnFlights = async () => {
    if (!returnDate || !selectedFrom || !selectedTo) {
      Swal.fire('Please select a return date and destinations.');
      return;
    }

    setLoadingReturnFlights(true);
    try {
      const response = await axiosInstance.post('/searchFlights', {
        from: selectedTo?.label.split(' ')[0].toLowerCase(),
        to: selectedFrom?.label.split(' ')[0].toLowerCase(),
        date: returnDate,
      });
      setReturnFlights(response.data);
    } catch (error) {
      console.error('Error fetching return flights:', error);
      Swal.fire('Failed to fetch return flights.');
    } finally {
      setLoadingReturnFlights(false);
    }
  };

  const handleSelectReturnFlight = (flight: Flight) => {
    dispatch(selectReturnFlight(flight));
    Swal.fire({
      title: 'Return Flight Selected!',
      text: `${flight.flightNumber} from ${flight.departureAirport} to ${flight.arrivalAirport} has been selected as your return flight.`,
      icon: 'success',
      confirmButtonText: 'OK',
    });
  };

  const handleSelectChange = (
    selectedOption: SingleValue<OptionType>,
    actionMeta: ActionMeta<OptionType>
  ) => {
    if (actionMeta.name === 'from') {
      setSelectedFrom(selectedOption);
      if (selectedTo && selectedOption?.value === selectedTo?.value) {
        setError("Departure and Destination cannot be the same.");
      } else {
        setError('');
      }
    } else if (actionMeta.name === 'to') {
      setSelectedTo(selectedOption);
      if (selectedFrom && selectedOption?.value === selectedFrom?.value) {
        setError("Departure and Destination cannot be the same.");
      } else {
        setError('');
      }
    }
  };

  useEffect(() => {
    if (error !== '') {
      Swal.fire({
        icon: 'info',
        title: 'Info',
        text: 'Departure & Arrival Should Not Be Same!',
        background: '#06093b',
        confirmButtonColor: '#3085d6',
        color: '#ffffff',
      });
      setSelectedTo(null);
    }
  }, [error]);

  const handleInputChange = useCallback(
    debounce((inputValue: string) => {
      setError('');
      const filteredOptions = airports.filter((airport) =>
        airport.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      dispatch(setFilteredAirports(filteredOptions));
    }, 300),
    [airports, dispatch]
  );

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedFrom || !selectedTo) {
      Swal.fire('Please select both "From" and "To" locations.');
      return;
    }

    if (!startDate) {
      Swal.fire('Please select a departure date.');
      return;
    }

    if (totalPassengers === 0) {
      Swal.fire({
        title: "Warning",
        text: "Please select at least one passenger.",
        icon: "warning",
        background: "#1E3A8A", // Dark blue background
        color: "#fff", // White text color
        confirmButtonColor: "#4F46E5", // Purple confirm button
        customClass: {
          popup: "small-alert", // Custom class to style size
        }
      });
      return;
    }

    const from = selectedFrom.label.split(' ')[0].toLowerCase();
    const to = selectedTo.label.split(' ')[0].toLowerCase();
    const searchRequest = { from, to, date: startDate };

    if (
      lastSearchRequest.current &&
      JSON.stringify(lastSearchRequest.current) === JSON.stringify(searchRequest)
    ) {
      return;
    }

    lastSearchRequest.current = searchRequest;

    try {
      const response = await axiosInstance.post('/searchFlights', {
        from,
        to,
        date: startDate,
      });

      if (listingRef.current) {
        listingRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      dispatch(setFlights(response.data as Flight[]));
      dispatch(setDate(startDate.toDateString()));
      dispatch(setReturnDate(returnDate?.toDateString()));
    } catch (error: any) {
      console.error('Error searching flights:', error.message);
    }
  };

  const sortFlights = (flights: Flight[], criteria: string) => {
    switch (criteria) {
      case 'price':
        return [...flights].sort((a, b) => a.price - b.price);
      case 'duration':
        return [...flights].sort((a, b) => a.duration.localeCompare(b.duration));
      case 'departureTime':
        return [...flights].sort((a, b) => a.departureTime.localeCompare(b.departureTime));
      default:
        return flights;
    }
  };

  const sortedFlights = sortFlights(flights, sortOption);
  const sortedReturnFlights = sortFlights(returnFlights, sortOption);
  const indexOfLastFlight = currentPage * flightsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - flightsPerPage;
  const currentFlights = sortedFlights.slice(indexOfFirstFlight, indexOfLastFlight);
  const currentReturnFlights = sortedReturnFlights.slice(indexOfFirstFlight, indexOfLastFlight);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4 }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            backgroundImage: `url('/pexels-yurix-sardinelly-504228832-16141006.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '80vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div className="container mx-auto p-4 sm:p-8 bg-blue-950 text-black rounded-xl flex flex-col w-full max-w-lg sm:max-w-xl lg:w-[850px] justify-center space-y-6">
            {isLoading ? (
              <div className="animate-pulse flex flex-col space-y-4">
                <div className="flex space-x-4">
                  <div className="bg-gray-300 rounded-lg h-12 w-48"></div>
                  <div className="bg-gray-300 rounded-lg h-12 w-48"></div>
                </div>
                <div className="flex space-x-4 w-full justify-between">
                  <div className="bg-gray-300 rounded-lg h-12 w-full"></div>
                  <div className="bg-gray-300 rounded-lg h-12 w-full"></div>
                  <div className="bg-gray-300 rounded-lg h-12 w-full"></div>
                </div>
                <div className="relative mb-4">
                  <div className="bg-gray-300 rounded-lg h-12 w-64"></div>
                </div>
                <div className="flex justify-center mt-4">
                  <div className="bg-green-400 rounded-lg h-12 lg:w-[180px]"></div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSearch}>
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex space-x-4">
                    <Select
                      name="from"
                      options={filteredAirports}
                      value={selectedFrom}
                      onChange={handleSelectChange}
                      onInputChange={handleInputChange}
                      placeholder="From"
                      className="p-2 rounded-lg text-black w-48"
                    />
                    <Select
                      name="to"
                      options={filteredAirports}
                      value={selectedTo}
                      onChange={handleSelectChange}
                      onInputChange={handleInputChange}
                      placeholder="To"
                      className="p-2 rounded-lg w-48"
                    />
                  </div>
                  <div className="flex space-x-4 w-full justify-between">
                    <div className="w-full">
                      <DatePicker
                        selected={startDate}
                        onChange={(date: Date | null) => setStartDate(date)}
                        className="w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                        placeholderText="Select date"
                        minDate={new Date()}
                      />
                    </div>
                    <div className="w-full">
                      <DatePicker
                        selected={returnDate}
                        onChange={(date: Date | null) => setreturnDate(date)}
                        className="w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                        placeholderText="Select Return Date"
                        minDate={startDate || new Date()}
                      />
                    </div>
                    <div className="w-full">
                      <Select
                        name="sort"
                        options={[
                          { value: 'price', label: 'Price(Sort)' },
                          { value: 'duration', label: 'Duration(Sort)' },
                          { value: 'departureTime', label: 'Departure Time(Sort)' },
                        ]}
                        value={{ value: sortOption, label: sortOption.charAt(0).toUpperCase() + sortOption.slice(1) }}
                        onChange={(option: SingleValue<OptionType>) => setSortOption(option?.value || 'price')}
                        placeholder="Sort by"
                        className="rounded-lg w-full"
                      />
                    </div>
                  </div>
                  <div className="relative mb-4">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="p-2 rounded-lg bg-gray-200 hover:bg-gray-100 font-extrabold w-64"
                    >
                      Passenger Details
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute w-full mt-1 bg-white shadow-lg rounded-lg border border-gray-200 z-10">
                        <div className="p-4 space-y-4">
                          {[
                            { label: 'Adults', type: 'adults' },
                            { label: 'Senior Citizens', type: 'seniors' },
                            { label: 'Children', type: 'children' },
                            { label: 'Infants', type: 'infants' },
                          ].map(({ label, type }) => (
                            <div key={type} className="flex justify-between items-center">
                              <span className="font-medium">{label}</span>
                              <div className="flex items-center space-x-3">
                                <button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  type="button"
                                  onClick={() => decrement(type as keyof typeof passengers)}
                                  className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
                                >
                                  -
                                </button>
                                <span className="w-8 text-center">
                                  {passengers[type as keyof typeof passengers]}
                                </span>
                                <button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  type="button"
                                  onClick={() => increment(type as keyof typeof passengers)}
                                  className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-center mt-4">
                    <button
                      type="submit"
                      className="lg:w-[180px] text-white bg-green-400 font-extrabold p-2 rounded-lg"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 min-h-[50vh] opacity-8 z-0" style={{ opacity: '0.08' }}>
          <Image
            src="/clouds-2716_1920.jpg"
            alt="Background Image"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="relative z-10 top-0 left-0 w-full">
          <div className="container mx-auto px-4 h-auto pt-20">
            <div className="flex justify-center mb-4">
              <button
                className={`px-4 py-2 mr-2 ${showMainFlights ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-md`}
                onClick={() => toggleFlights('main')}
              >
                Flights: {selectedFrom?.label.split(' ')[0]} → {selectedTo?.label.split(' ')[0]}
              </button>
              {returnDate && (
                <button
                  className={`px-4 py-2 ${showReturnFlights ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-md`}
                  onClick={() => toggleFlights('return')}
                >
                  Return Flights: {selectedTo?.label.split(' ')[0]} → {selectedFrom?.label.split(' ')[0]}
                </button>
              )}
            </div>

            {showMainFlights && (
              <>
                {currentFlights.length > 0 ? (
                  currentFlights.map((flight) => (
                    <div
                      key={flight.flightNumber}
                      className="bg-white/10 p-4 rounded-lg shadow-md flex items-center justify-between w-full mb-4"
                    >
                      <div className="flex items-center">
                        <div className="mr-4"></div>
                        <div>
                          <div className="text-lg font-bold text-white">
                            {flight.departureTime} - {flight.arrivalTime}
                          </div>
                          <div className="text-white">
                            {flight.departureAirport} - {flight.arrivalAirport}
                          </div>
                          <div className="text-sm text-white">
                            {flight.duration} ({flight.stops})
                          </div>
                          <div className="text-sm text-white">{flight.flightNumber}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">₹{flight.price}</div>
                        <div className="text-sm text-green-500">
                          Get at ₹{flight.price - 750} with INTSAVER
                        </div>
                        <button
                          className="bg-green-500 font-extrabold px-6 text-white py-2 rounded mt-2"
                          onClick={() => {
                            dispatch(setBookDetail(flight));
                            dispatch(setSelectedPassengers(passengers));
                            dispatch(clearSelectedSeat());
                            router.push('/user/flight/selectSeats');
                          }}
                        >
                          Book
                        </button>
                        <div className="text-sm text-white/80 mt-1">Partially refundable</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Image
                      src="https://airline-datacenter.s3.ap-south-1.amazonaws.com/de9dc8d1-fd3b-44a4-b095-d0e4f3a544b6.jpeg"
                      alt="No Flights Available"
                      width={700}
                      height={400}
                    />
                    <p className="text-white text-xl mt-4">No Flights Available</p>
                  </div>
                )}
              </>
            )}

            {showReturnFlights && (
              <>
                {loadingReturnFlights ? (
                  <div className="flex justify-center items-center">
                    <img src='/Animation.gif' alt="Loading..." className="w-100 h-100" />
                  </div>
                ) : currentReturnFlights.length > 0 ? (
                  currentReturnFlights.map((flight) => (
                    <div
                      key={flight.flightNumber}
                      className="bg-white/10 p-4 rounded-lg shadow-md flex items-center justify-between w-full mb-4"
                    >
                      <div className="flex items-center">
                        <div className="mr-4"></div>
                        <div>
                          <div className="text-lg font-bold text-white">
                            {flight.departureTime} - {flight.arrivalTime}
                          </div>
                          <div className="text-white">
                            {flight.departureAirport} - {flight.arrivalAirport}
                          </div>
                          <div className="text-sm text-white">
                            {flight.duration} ({flight.stops})
                          </div>
                          <div className="text-sm text-white">{flight.flightNumber}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">₹{flight.price}</div>
                        <div className="text-sm text-green-500">
                          Get at ₹{flight.price - 750} with INTSAVER
                        </div>
                        <button
                          className="bg-green-500 font-extrabold px-6 text-white py-2 rounded mt-2"
                          onClick={() => handleSelectReturnFlight(flight)}
                        >
                          Select Return Flight
                        </button>
                        <div className="text-sm text-white/80 mt-1">Partially refundable</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Image
                      src="https://airline-datacenter.s3.ap-south-1.amazonaws.com/de9dc8d1-fd3b-44a4-b095-d0e4f3a544b6.jpeg"
                      alt="No Return Flights Available"
                      width={700}
                      height={400}
                    />
                    <p className="text-white text-xl mt-4">No Return Flights Available</p>
                  </div>
                )}
              </>
            )}

            {(currentFlights.length > 0 || currentReturnFlights.length > 0) && (
              <div className="flex justify-center mt-6">
                <nav>
                  <ul className="inline-flex">
                    {Array.from({ length: Math.ceil((showMainFlights ? flights.length : returnFlights.length) / flightsPerPage) }, (_, i) => (
                      <li
                        key={i}
                        className={`px-3 py-2 ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                          } rounded-md mx-1 cursor-pointer`}
                        onClick={() => paginate(i + 1)}
                      >
                        {i + 1}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="rounded-lg w-full bg-gray-900 shadow-inner shadow-white/35 mt-10 pt-40">
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <a href="https://flowbite.com/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
              <img src="/logo_airline.png" className="h-8" alt="Flowbite Logo" />
            </a>
            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">About</a>
              </li>
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">Licensing</a>
              </li>
              <li>
                <a href="#" className="hover:underline">Contact</a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
};

export default ListFlights;