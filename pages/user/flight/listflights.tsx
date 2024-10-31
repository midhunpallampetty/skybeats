import React, { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import DatePicker from 'react-datepicker';
import Select, { SingleValue, ActionMeta, InputActionMeta } from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { setAirports, setFilteredAirports } from '@/redux/slices/airportsSlice';
import debounce from 'lodash.debounce';
import { setBookDetail } from '@/redux/slices/bookdetailSlice';
import axios from 'axios';
import { Flight } from '../../../interfaces/flight';
import Swal from 'sweetalert2';
import Image from 'next/image';
import { clearSelectedSeat } from '@/redux/slices/selectedSeat';
import FlightModal from '../../components/returnFlightModal';
import dynamic from 'next/dynamic';
import { Airport } from '@/interfaces/Airport';
import { RootState } from '@/redux/store';
import { setFlights } from '@/redux/slices/flightsSlice';
import { setDate } from '@/redux/slices/bookDate';
import { setReturnDate } from '@/redux/slices/returnDate';
import { setSelectedPassengers } from '@/redux/slices/passengerCountSlice';
import { OptionType } from '@/interfaces/OptionType';
import { useRouter } from 'next/router';

const ListFlights: React.FC = () => {
  const Navbar = dynamic(() => import('../../components/Navbar'), { ssr: true });
  const router = useRouter();
  const dispatch = useDispatch();
  const airports = useSelector((state: RootState) => state.airports.airports);
  const filteredAirports = useSelector((state: RootState) => state.airports.filteredAirports);
  const selectedFlight = useSelector((state: RootState) => state.bookdetail.selectedFlight);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [returnDate, setreturnDate] = useState<Date | null>(null);

  const [passengers, setPassengers] = useState({
    adults: 0,
    seniors: 0,
    children: 0,
    infants: 0,
  });
  const passengerCount = useSelector((state: RootState) => state.passengerCount.selectedPassenger);
  const [selectedFrom, setSelectedFrom] = useState<SingleValue<OptionType>>(null);
  const [selectedTo, setSelectedTo] = useState<SingleValue<OptionType>>(null);
  const flights = useSelector((state: RootState) => state.flights.flights);
  const bookDate = useSelector((state: RootState) => state.bookDate.date);
  const [sortOption, setSortOption] = useState<string>('price');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [flightsPerPage] = useState<number>(5);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const token = Cookies.get('jwtToken');
  useEffect(() => {
    if (!token) {
      router.push('/');
    }
  }, []);
  const increment = (type: any) => {
    if (totalPassengers < 10) { // Check if total passengers are less than 10
      if ((type === 'children' || type === 'infants') && !hasAdultOrSenior()) {
        // Prevent adding child/infant without adult/senior
        Swal.fire({
          title: 'You must have at least one adult or senior citizen to select infants or children.',
          background: '#282c34',  // Dark background
          color: '#fff',  // Text color
          confirmButtonColor: '#4CAF50',  // Custom button color

        });

      } else {
        setPassengers((prev: any) => ({
          ...prev,
          [type]: prev[type] + 1,
        }));
      }
    } else {
      Swal.fire({
        title: 'Maximum 10 passengers allowed.',
        background: '#282c34',  // Dark background
        color: '#fff',  // Text color
        confirmButtonColor: '#4CAF50',  // Custom button color

      });
    }
  };

  const openModal = () => {
    if (returnDate && selectedFrom && selectedTo && startDate) {
      setIsModalVisible(true);

    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };
  const getMinReturnDate = (startDate: Date | null) => {
    if (!startDate) return new Date(); // Fallback to today if no startDate
    const nextDay = new Date(startDate);
    nextDay.setDate(nextDay.getDate() + 1); // Add one day to startDate
    return nextDay;
  };
  // Decrement function for passengers
  const decrement = (type: any) => {
    if (passengers[type] > 0) {
      setPassengers((prev) => ({
        ...prev,
        [type]: prev[type] - 1,
      }));
    }
  };
  const totalPassengers =
    passengers.adults + passengers.seniors + passengers.children + passengers.infants;
  const hasAdultOrSenior = () => passengers.adults + passengers.seniors > 0;
  const options = [
    {
      value: 'adults',
      label: `Adults (${passengers.adults})`,
    },
    {
      value: 'seniors',
      label: `Senior Citizen (${passengers.seniors})`,
    },
    {
      value: 'children',
      label: `Children (${passengers.children})`,
    },
    {
      value: 'infants',
      label: `Infants (${passengers.infants})`,
    },
  ];
  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await fetch('/api/getAirports');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const airportsData: Airport[] = await response.json();
        const airportOptions = airportsData.map((airport) => ({
          value: airport.code,
          label: `${airport.city} (${airport.code}) ${airport.country}`,
        }));
        dispatch(setAirports(airportOptions));
        dispatch(setFilteredAirports(airportOptions));
        setFilteredAirports(airportsData.map(airport => ({
          value: airport.code,
          label: `${airport.city} (${airport.code}) ${airport.country}`,
        })));
      } catch (error) {
        Swal.fire({
          text: 'Error Searching Flights',
          background: 'dark'
        });
        console.error('Error fetching airports:', error);
      }
    };

    fetchAirports();
  }, [dispatch]);

  const handleSelectChange = (selectedOption: SingleValue<OptionType>, actionMeta: ActionMeta<OptionType>) => {
    if (actionMeta.name === 'from') {
      setSelectedFrom(selectedOption);
    } else if (actionMeta.name === 'to') {
      setSelectedTo(selectedOption);
    }
  };

  const handleInputChange = useCallback(
    debounce((inputValue: string, actionMeta: InputActionMeta) => {
      const filteredOptions = airports.filter(
        (airport) =>
          airport.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      dispatch(setFilteredAirports(filteredOptions));
    }, 300), [airports, dispatch]);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();

    if (selectedFrom && selectedTo && startDate) {
      try {
        console.log(selectedFrom.label.split(' ')[0].toLowerCase(), selectedTo.label.split(' ')[0].toLowerCase(), 'ok ');
        const response = await axios.post('/api/searchFlights', {
          from: selectedFrom.label.split(' ')[0].toLowerCase(),
          to: selectedTo.label.split(' ')[0].toLowerCase(),
          date: startDate,
        });
        dispatch(setFlights(response.data as Flight[]));
        dispatch(setDate(startDate.toDateString()));
        dispatch(setReturnDate(returnDate?.toDateString()));
        console.log(response.data, bookDate, 'got data flights from gql server');
      } catch (error: any) {
        console.error('Error searching flights:', error.message);
      }
    } else {
      console.log('Please select all fields');
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

  const indexOfLastFlight = currentPage * flightsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - flightsPerPage;
  const currentFlights = sortedFlights.slice(indexOfFirstFlight, indexOfLastFlight);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      <FlightModal isVisible={isModalVisible} onClose={closeModal} returnOn={returnDate} from={selectedFrom} to={selectedTo} />

      <Navbar />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            backgroundImage: 'url(\'/pexels-yurix-sardinelly-504228832-16141006.jpg\')',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '80vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',

          }}
        >
          <div className="container mx-auto p-8 bg-blue-950 text-black   rounded-xl flex w-[850px] flex-col justify-center space-y-6">
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

                {/* Flex container for date, return date, and sort */}
                <div className="flex space-x-4 w-full justify-between">
                  <div className="w-full">
                    <DatePicker
                      selected={startDate}
                      onChange={(date: Date | null) => setStartDate(date)}
                      className="w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                      placeholderText="Select date"
                      minDate={new Date()}  // Ensure start date is today or later
                    />
                  </div>
                  <div className="w-full">
                    <DatePicker
                      selected={returnDate}
                      onChange={(date: Date | null) => setreturnDate(date)}
                      className="w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                      placeholderText="Select Return Date"
                      minDate={startDate || new Date()}  // Set minDate of returnDate to startDate or today
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
                      className=" rounded-lg  w-full"
                    />

                  </div>
                </div>

                <div className="relative mb-4">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown visibility
                    className="p-2 rounded-lg bg-gray-200 hover:bg-gray-100 font-extrabold w-64"
                  >
                    Passenger Details
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute w-full mt-1 bg-white shadow-lg rounded-lg border border-gray-200 z-10">
                      <div className="p-4 space-y-4 ">
                        {[
                          { label: 'Adults', type: 'adults' },
                          { label: 'Senior Citizens', type: 'seniors' },
                          { label: 'Children', type: 'children' },
                          { label: 'Infants', type: 'infants' },
                        ].map(({ label, type }) => (
                          <div key={type} className="flex w-full justify-between items-center">
                            <span>{label}:</span>
                            <div className="flex items-center">
                              <button
                                type="button"
                                onClick={() => decrement(type as keyof typeof passengers)}
                                className="bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded-lg"
                              >
                                -
                              </button>
                              <span className="mx-2">
                                {passengers[type as keyof typeof passengers]}
                              </span>
                              <button
                                type="button"
                                onClick={() => increment(type as keyof typeof passengers)}
                                className="bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded-lg"
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
                  <button type="submit" onClick={openModal} className="lg:w-[180px] text-white bg-green-400 font-extrabold p-2 rounded-lg">
                    Search
                  </button>
                </div>
              </div>
            </form>
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
            {currentFlights.length > 0 ? (
              currentFlights.map((flight, index) => (
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
                        console.log(flight, 'ffdsfsdf');
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
                  src="https://airline-datacenter.s3.ap-south-1.amazonaws.com/de9dc8d1-fd3b-44a4-b095-d0e4f3a544b6.jpeg" // replace with your actual image path
                  alt="No Flights Available"
                  width={700}
                  height={400}
                />
                <p className="text-white text-xl mt-4">No Flights Available</p>
              </div>
            )}
          </div>
          {currentFlights.length > 0 && (
            <div className="flex justify-center mt-6">
              <nav>
                <ul className="inline-flex">
                  {Array.from({ length: Math.ceil(flights.length / flightsPerPage) }, (_, i) => (
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


      <footer className=" rounded-lg w-full bg-gray-900 shadow-inner shadow-white/35 mt-10  pt-40">
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
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <a href="https://flowbite.com/" className="hover:underline">Skybeats™</a>. All Rights Reserved.</span>
        </div>
      </footer>
    </>
  );
};

export default ListFlights;