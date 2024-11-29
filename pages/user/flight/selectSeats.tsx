import Navbar from '@/pages/components/Navbar';
import Image from 'next/image';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { setSeats } from '@/redux/slices/seatSlice';
import { useRouter } from 'next/router';
import { setAircraftModel } from '@/redux/slices/aircraftModelSlice';
import { setSelectedSeat, clearSelectedSeat, clearSpecificSeat } from '@/redux/slices/selectedSeat';
import axios from 'axios';
import axiosInstance from '@/pages/api/utils/axiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const SelectSeats: React.FC = () => {
    const userId = Cookies.get('userId');
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const passengerCount = useSelector((state: RootState) => state.passengerCount.selectedPassenger);
    const dispatch = useDispatch<AppDispatch>();
    const seats = useSelector((state: RootState) => state.seats.seats);
    const [aircraftModel, setAircraftModelLocal] = useState('');
    const selectedFlight = useSelector((state: RootState) => state.bookdetail.selectedFlight);
    const selectedSeats = useSelector((state: RootState) => state.selectedSeats.selectedSeats);
    const [localSelectedSeats, setLocalSelectedSeats] = useState<any[]>([]);
    const selectedSeat = useSelector((state: RootState) => state.selectedSeats.selectedSeats);

    const [loading, setLoading] = useState(true);
    const totalPassengers = passengerCount?.adults + passengerCount?.seniors + passengerCount?.children + passengerCount?.infants;
    useEffect(() => {
        // Simulating data fetch delay
        setTimeout(() => {
            setLoading(false);
        }, 2000); // Adjust delay as needed or set loading to false when seats are fetched
    }, [seats]);
    useEffect(() => {
        setTimeout(() => setIsLoading(false), 5000);
    }, []);

    useEffect(() => {
        if (!selectedFlight || !selectedSeats || !seats) {
            router.push('/user/flight/listflights');
        }
    }, [selectedFlight, selectedSeats, seats, router]);

    useEffect(() => {
        const fetchAircraftModel = async () => {
            try {
                const response: any = await axiosInstance.post('/airRadar', {
                    flightNumber: selectedFlight?.flightNumber,
                    airline: selectedFlight?.airline,
                });
                const model = response.data?.aircraftDetails[0] || '';
                setAircraftModelLocal(model);
                if (model) dispatch(setAircraftModel(model));
            } catch (error) {
                console.error('Failed to fetch aircraft model:', error);
            }
        };

        if (selectedFlight?.flightNumber) {
            fetchAircraftModel();
        }
    }, [selectedFlight?.flightNumber, selectedFlight?.airline, dispatch]);

    useEffect(() => {
        dispatch(clearSelectedSeat());
        setLocalSelectedSeats([]);
    }, [dispatch]);
console.log(selectedSeat,'selectedSeat')
useEffect(() => {
    const fetchSeats = async () => {
        if (!aircraftModel) return;

        try {
            const response = await axiosInstance.post('/getSeats', {
                flightNumber: selectedFlight?.flightNumber,
                flightModel: aircraftModel,
            });

            console.log(response.data, 'seats');
            dispatch(setSeats(response.data || []));
        } catch (error: any) {
            console.error('Error fetching seats:', error.message);
        }
    };

    if (aircraftModel && selectedFlight?.flightNumber) {
        fetchSeats();
    }
}, [dispatch, aircraftModel, selectedFlight?.flightNumber]);

    const getPriceByClass = (seatClass: string) => {
        switch (seatClass) {
            case 'Business Class':
                return 1099;
            case 'First Class':
                return 899;
            default:
                return 499; // Economy
        }
    };

    const handleSeatClick = async (seat:any) => {
        const aircraftId = `${selectedFlight?.flightNumber}-${selectedFlight?.airline}`;
        try {
           
            // Show loading indicator or disable seat interaction
            const response = await axiosInstance.post('/checkSeat', {
                holdSeatId: seat._id, // Unique identifier for the seat
                aircraftId: aircraftId, // ID of the aircraft model
            });
    
            const isHeld = response.data.isHeld;
    console.log(isHeld,"isHeld")
            // If the seat is held by another passenger, show a toast and exit
            if (isHeld) {
                toast.error(`Seat ${seat.row}${seat.col} is currently held by another passenger. Please select a different seat.`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                });
                return;
            }
    
            // Check if the seat is already selected
            const alreadySelected = localSelectedSeats.find((s) => s._id === seat._id);
            const seatPrice = getPriceByClass(seat.class);
    
            // Enforce selection limit equal to the total number of passengers
            if (localSelectedSeats.length >= totalPassengers && !alreadySelected) {
                toast.error(`You can select exactly ${totalPassengers} seats.`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                });
                return;
            }
    
            if (alreadySelected) {
                // Remove the seat if it was already selected
                const updatedSeats = localSelectedSeats.filter((s) => s._id !== seat._id);
                setLocalSelectedSeats(updatedSeats);
                dispatch(clearSpecificSeat(seat._id)); // Update Redux state
            } else {
                // Add the seat with its price if not already selected
                const seatWithPrice = { ...seat, price: seatPrice };
                setLocalSelectedSeats([...localSelectedSeats, seatWithPrice]);
                dispatch(setSelectedSeat(seatWithPrice)); // Update Redux state
            }
        } catch (error) {
            // Handle any API errors
            console.error('Error checking seat availability:', error);
            toast.error('Error checking seat availability. Please try again.', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
            });
        }
    };
    
    

    const handleContinueWithSelectedSeat = () => {
        if (localSelectedSeats.length === totalPassengers) {
            router.push('/user/flight/bookingdetails');
        } else {
            toast.error(`Please select exactly ${totalPassengers} seats.`, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
            });
        }
    };
    const handleContinueWithSkipSeat = async () => {
        try {
            // Clear local and Redux state before beginning
            setLocalSelectedSeats([]); // Clear local state
            dispatch(clearSelectedSeat()); // Clear Redux state (you need a Redux action for this)
    
            const randomSeats = [];
    
            // Fetch random seat for each passenger
            for (let i = 0; i < totalPassengers; i++) {
                const response = await axiosInstance.post('/getRandomSeat', {
                    flightModel: aircraftModel,
                });
    
                const randomSeat = response.data;
    
                console.log(response, 'Fetched random seat');
    
                // Check if the random seat is valid
                if (!randomSeat || !randomSeat.seatId) {
                    toast.error(
                        'No available seats found for some passengers. Please try selecting manually.',
                        {
                            position: "top-center",
                            autoClose: 3000,
                            hideProgressBar: true,
                        }
                    );
                    return;
                }
    
                // Add price to seat details
                const seatWithPrice = {
                    ...randomSeat,
                    _id: randomSeat.seatId, // Ensure `_id` is included for Redux compatibility
                    price: getPriceByClass(randomSeat.class),
                };
    
                randomSeats.push(seatWithPrice);
            }
    
            // Update local and Redux state with new seats
            setLocalSelectedSeats(randomSeats); // Update local state
            randomSeats.forEach(seat => {
                dispatch(setSelectedSeat(seat)); // Add to Redux
            });
    
            console.log('Updated Redux state with random seats:', randomSeats);
    
            // Navigate to booking details page if all random seats are successfully assigned
            router.push('/user/flight/bookingdetails');
        } catch (error) {
            console.error('Error fetching random seats:', error);
            toast.error('Error fetching random seats. Please try again.', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
            });
        }
    };
    
   
  useEffect(() => {
    const userId = Cookies.get('userId');
    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');

    if (!userId || !accessToken || !refreshToken) {
      Cookies.remove('userId');
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      router.push('/');  // Redirect to home or login page
    }
  }, [router]);
    
    return (
        <>
            <ToastContainer />
            {isLoading ? (
                <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
                    <div className="text-center">
                        <Image src="/logo_airline.png" alt="Logo" width={100} height={100} />
                        <p>Launching Seat Layout Based On Aircraft...</p>
                    </div>
                </div>
            ) : (
                <>
                    <Navbar />
                    <div className="flex justify-center items-center mt-20">
                        <div className="flex flex-col items-center">
                            <div className="p-4 w-[350px] min-h-40 bg-blue-900/55 ml-10 text-white rounded mr-8">
                                <h3 className="text-xl font-extrabold">Selected Seats Details:</h3>
                                {localSelectedSeats.length > 0 ? (
                                    localSelectedSeats.map((seat, index) => (
                                        <p key={index} className="font-semibold text-lg">
                                            Seat Number: {seat.row}{seat.col} - Class: {seat.class}
                                        </p>
                                    ))
                                ) : (
                                    <p>No Seats Selected</p>
                                )}
                            </div>
                            <button onClick={handleContinueWithSelectedSeat} className="mb-4 px-4 py-2 bg-blue-500 text-white font-extrabold rounded mt-4">Continue</button>
                            <button onClick={handleContinueWithSkipSeat} className="mb-4 px-4 py-2 bg-gray-700 text-white font-extrabold rounded mt-4">Skip Seat Selection</button>
                            <h2 className="text-2xl font-bold mb-4 text-white">Flight Seat Selection <span>{aircraftModel}</span></h2>
                            <div className="grid grid-cols-6 gap-4">
            {loading ? (
                // Render skeleton loaders while data is being fetched
                Array.from({ length: 12 }).map((_, index) => (
                    <div
                        key={index}
                        className="relative p-2 rounded bg-gray-300 animate-pulse"
                    >
                        <div className="w-8 h-12 bg-gray-400 rounded"></div>
                    </div>
                ))
            ) : seats.length > 0 ? (
                // Render seat grid when data is available
                seats.map((seat, index) => (
                    <div
                        key={index}
                        className={`relative p-2 rounded ${
                            seat.isBooked
                                ? 'bg-gray-400 cursor-not-allowed'
                                : localSelectedSeats.some(s => s._id === seat._id)
                                ? 'bg-blue-500 cursor-pointer'
                                : 'bg-gray-800 cursor-pointer'
                        }`}
                        onClick={() => handleSeatClick(seat)}
                    >
                        <div className="w-8 h-12 text-white font-extrabold">
                            {seat.row}{seat.col}
                        </div>

                        {/* Hover overlay */}
                        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-75 rounded-md flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                            <img
                                src="https://planelyalex.com/wp-content/uploads/2023/03/al-soot-q9-rkEJfIG4-unsplash-scaled.jpg"
                                alt="Seat Image"
                                className="w-8 h-8 mb-2"
                            />
                            <p className="text-white text-[10px] font-semibold">
                                {seat.class}
                            </p>
                            <p className="text-white text-[10px]">
                                Price: ₹
                                {seat.class === 'First Class'
                                    ? '899'
                                    : seat.class === 'Business Class'
                                    ? '1099'
                                    : '499'}
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <p>No seats available</p>
            )}
        </div>

                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default SelectSeats;
