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
    const router = useRouter()
    const passengerCount = useSelector((state: RootState) => state.passengerCount.selectedPassenger);
    const dispatch = useDispatch<AppDispatch>();
    const seats = useSelector((state: RootState) => state.seats.seats);
    const [aircraftModel, setaircraftModel] = useState('')
    const selectedFlight = useSelector((state: RootState) => state.bookdetail.selectedFlight);
    const selectedSeats = useSelector((state: RootState) => state.selectedSeats.selectedSeats);
    const [localSelectedSeats, setLocalSelectedSeats] = useState<any[]>([]); // Local state for selected seats
    const seatDetailsRef = useRef<HTMLDivElement>(null);
useEffect(()=>{
console.log(selectedSeats,'cdcdscdsc')
},[selectedSeats])
    // Calculate the total number of passengers
    const totalPassengers = passengerCount!.adults + passengerCount!.seniors + passengerCount!.children + passengerCount!.infants;

    useEffect(() => { 
        const fetchAircraftModel = async () => {
            try {
                const response: any = await axios.post(
                    '/api/airRadar',
                    { flightNumber: selectedFlight?.airline },
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

    return (
        <>
            <Navbar />
            <div className="relative flex justify-center items-start mt-[150px] min-h-screen">
                <div className="p-4 w-[350px] bg-white/10 border border-white/10 rounded shadow-md mr-8">
                    <h3 className="text-3xl text-white font-extrabold">Selected Seats Details:</h3>
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
                    <h2 className="text-2xl font-bold mb-4 text-white">Flight Seat Selection <span className='text-sm '>{aircraftModel}</span></h2>

                    <div className="w-full bg-blue-600 text-white text-center py-2 mb-4 rounded">Cockpit</div>

                    <div className="grid grid-cols-6 gap-4 bg-gray-200 p-4 rounded-md shadow-lg w-fit">
                        {seats.length > 0 ? (
                            seats.map((seat, index) => (
                                <div
                                    key={index}
                                    className={`relative flex justify-center items-center cursor-pointer p-2 rounded-md ${
                                        seat.isBooked ? 'bg-gray-400' : localSelectedSeats.some(s => s._id === seat._id) ? 'bg-blue-500' : 'bg-green-500'
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
                </div>
            </div>
        </>
    );
};

export default SelectSeats;
