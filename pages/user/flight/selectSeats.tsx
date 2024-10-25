import Navbar from '@/pages/components/Navbar';
import Image from 'next/image';
import Cookies from 'js-cookie'
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { setSeats } from '@/redux/slices/seatSlice';
import { useRouter } from 'next/router';
import { setAircraftModel } from '@/redux/slices/aircraftModelSlice';
import { setSelectedSeat, clearSelectedSeat,clearSpecificSeat } from '@/redux/slices/selectedSeat'; // Import clearSelectedSeats action
import axios from 'axios'


const SelectSeats: React.FC = () => {
    const userId = Cookies.get('userId')
      const [isLoading, setIsLoading] = useState(true);
    const router = useRouter()
    const passengerCount = useSelector((state: RootState) => state.passengerCount.selectedPassenger);
    const dispatch = useDispatch<AppDispatch>();
    const seats = useSelector((state: RootState) => state.seats.seats);
    const [aircraftModel, setaircraftModel] = useState('')
    const selectedFlight = useSelector((state: RootState) => state.bookdetail.selectedFlight);
    const selectedSeats = useSelector((state: RootState) => state.selectedSeats.selectedSeats);
    const [localSelectedSeats, setLocalSelectedSeats] = useState<any[]>([]); // Local state for selected seats
    const seatDetailsRef = useRef<HTMLDivElement>(null);
    const returnFlight=useSelector((state:RootState)=>state.returnFlights.selectedReturnFlight)

console.log(selectedSeats)
    useEffect(()=>{
console.log(selectedSeats,'cdcdscdsc')
console.log(returnFlight,'return flights')
console.log(selectedFlight,'return flights')

},[selectedSeats])
useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Simulate loading time
    }, 5000); // 2 seconds delay for loading

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);
                                                    
  useEffect(() => {
    if (!selectedFlight || !selectedSeats || !seats) {
      router.push('/user/flight/listflights');  // Redirect to list flights page
    }
  }, [selectedFlight, selectedSeats, seats, router]);  // Dependencies

  // If any of the values are missing, don't render the page content
  if (!selectedFlight || !selectedSeats || !seats) {
    return null;  // Return null to avoid rendering any content
  }
    // Calculate the total number of passengers
    const totalPassengers = passengerCount!.adults + passengerCount!.seniors + passengerCount!.children + passengerCount!.infants;

    useEffect(() => { 
        const fetchAircraftModel = async () => {
            try {
                const response: any = await axios.post(
                    '/api/airRadar',
                    { flightNumber: selectedFlight?.flightNumber,airline:selectedFlight?.airline },
                    { headers: { 'Content-Type': 'application/json' } }
                );
                const aircraftModel = response.data?.aircraftDetails[0] || '';
                setaircraftModel(aircraftModel);
                if (aircraftModel) {
                    dispatch(setAircraftModel(aircraftModel));
                }
            } catch (error) {
                console.error('Failed to fetch aircraft model:', error);
            }
        };

        if (selectedFlight?.airline) {
            fetchAircraftModel();
        }
    }, [selectedFlight?.airline]);
    
    // async function holdSeat(input: {}) {
    //     try {
    //         const response = await axios.post(
    //             '/api/holdSeat',
    //             input,
    //             { headers: { 'Content-Type': 'application/json' } }
    //         );
    //         console.log('Seat held successfully:', input);
    //     } catch (error: any) {
    //         console.error('Error holding seat:', error.response ? error.response.data : error.message);
    //         throw new Error('Failed to hold seat');
    //     }
    // }

    useEffect(() => {
        const fetchSeats = async () => {
            if (!aircraftModel) return;
            try {
                const response = await fetch('/api/getSeats', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ flightNumber: selectedFlight?.flightNumber, flightModel: aircraftModel }),
                });

                const data = await response.json();
                dispatch(setSeats(data || []));
            } catch (error: any) {
                console.error('Error fetching seats:', error.message);
            }
        };

        if (selectedFlight?.flightNumber && aircraftModel) {    
            fetchSeats();
        }
    }, [dispatch, selectedFlight?.flightNumber, aircraftModel]);

    const handleSeatClick = (seat: any) => {
        const alreadySelected = localSelectedSeats.find(s => s._id === seat._id);
    
        // Check if the seat is already selected
        if (alreadySelected) {
            const updatedSeats = localSelectedSeats.filter(s => s._id !== seat._id);  // Deselect if clicked again
            setLocalSelectedSeats(updatedSeats);
            dispatch(clearSpecificSeat(seat._id));  
        } else if (localSelectedSeats.length < totalPassengers) {
            // Only add if we haven't reached the passenger limit
            const updatedSeats = [...localSelectedSeats, seat];
            setLocalSelectedSeats(updatedSeats);
            dispatch(setSelectedSeat(seat));  // Dispatch the individual selected seat
        } else {
            console.log('Cannot select more than the allowed number of seats.');
        }
    };
    
    
    

    // Handle proceeding with selected seats
    const handleContinueWithSelectedSeat = async () => {
        if (localSelectedSeats.length > 0) {
            const flightNumber: string = selectedFlight?.flightNumber ?? '';
    
            // Prepare the input for GraphQL mutation
            // const input = {
            //     input: {
            //         aircraftId: flightNumber,  // The flight number/aircraft ID
            //         holdSeatId: localSelectedSeats.map(seat => seat._id),  // Array of seat IDs
            //         userId: userId  // The user's ID
            //     }
            // };
    
            // Call holdSeat once for all seats
            try {
                // await holdSeat(input);
                // console.log('All seats held successfully.');
                router.push('/user/flight/bookingdetails');
            } catch (error) {
                console.error('Error while holding seats:', error);
            }
        } else {
            console.log('No seats selected.');
        }
    };
    

    const handleSkipSelection = () => {
        setLocalSelectedSeats([]);
        dispatch(clearSelectedSeat());
        router.push('/user/flight/bookingdetails');
    };
    const loadingScreenStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#1a2d45', // Dark background for loading screen
      };
    
      const loadingBarStyle = {
        width: '100px',
        height: '5px',
        backgroundColor: '#0c2336', // Bar background
        marginTop: '10px',
        borderRadius: '3px',
        overflow: 'hidden',
      };
    
      const loadingBarFillStyle = {
        width: '0',
        height: '100%',
        backgroundColor: '#0073b1', // Loading bar fill color
        animation: 'load 3s ease-in-out infinite',
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
      <div style={loadingScreenStyle}>
        <Image
          src="/logo_airline.png" // Replace with your logo path
          alt="Logo"
          width={100}
          height={100}
        />
        <p className='text-white font-extrabold font-sans text-xl'>Launching Seat Layout Based On Aircarft......</p>
        <div style={loadingBarStyle}>
          <div style={loadingBarFillStyle}></div>
        </div>
      </div>
    ) : (
        <>
            <Navbar />
            <div className="relative flex justify-center items-start mt-[150px] w-full">
                <div className="p-4 w-[350px] bg-blue-900 shadow shadow-white text-black border border-white/10 rounded mr-8">
                    <h3 className="text-xl text-white font-extrabold">Selected Seats Details:</h3>
                    {localSelectedSeats.length > 0 ? (
                        localSelectedSeats.map((seat, index) => (
                            <p key={index} className="font-semibold text-white text-2xl">
                                Seat Number: {seat.row}{seat.col} - Class: {seat.class}
                            </p>
                        ))
                    ) : (
                        <p className="font-semibold text-white text-2xl">No Seats Selected</p>
                    )}
                </div>

                <div className="flex flex-col items-center">
                <div className="flex justify-center mt-8 space-x-4">
                        <button
                            onClick={handleContinueWithSelectedSeat}
                            className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
                        >
                            Continue with Selected Seats
                        </button>

                        <button
                            onClick={handleSkipSelection}
                            className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600"
                        >
                            Skip Selection
                        </button>
                    </div>
                    <h2 className="text-2xl font-bold mb-4 text-white">Flight Seat Selection <span className='text-sm '>{aircraftModel}</span></h2>

                    <div className="w-full bg-blue-600 text-white text-center py-2 mb-4 rounded">Cockpit</div>

                    <div className="grid grid-cols-6 gap-4 bg-gray-200 p-4 rounded-md shadow-lg w-fit">
                        {seats.length > 0 ? (
                            seats.map((seat, index) => (
                                <div
                                    key={index}
                                    className={`relative flex justify-center items-center cursor-pointer p-2 rounded-md ${
                                        seat.isBooked ? 'bg-gray-400' : localSelectedSeats.some(s => s._id === seat._id) ? 'bg-blue-500' : 'bg-gray-800'
                                    }`}
                                    onClick={() => handleSeatClick(seat)}
                                >
                                    <div className="w-8 h-12 text-white font-extrabold">
                                        {seat.row}{seat.col}
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
