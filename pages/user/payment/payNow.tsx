import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { RootState } from '@/redux/store';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
interface PaymentIntentResponse {
  clientSecret: string;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PaymentForm: React.FC = () => {
  const selectedSeat = useSelector((state: RootState) => state.selectedSeats.selectedSeats);
  const bookDate=useSelector((state:RootState)=>state.bookDate.date)
  const aircraftModel = useSelector((state: RootState) => state.aircraftModel.aircraftModel);
  const selectedFlight = useSelector((state: RootState) => state.bookdetail.selectedFlight);
  const passengerDetails = useSelector((state: RootState) => state.bookdetail.passengerDetails);
  
  const returnDate=useSelector((state:RootState)=>state.returnDate.returndate)
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const stripe = useStripe();
  const passengers=useSelector((state:RootState)=>state.bookdetail.passengerDetails)

  const router=useRouter()
  const elements = useElements();
  const token=Cookies.get('jwtToken');
useEffect(()=>{
if(!token){
  router.push('/');
}
},[])

  useEffect(() => {
    if (selectedFlight) {
      axios.post<PaymentIntentResponse>('/api/create-payment-intent', { amount: selectedFlight.price * 100 })
        .then((response) => {
          setClientSecret(response.data.clientSecret);
        })
        .catch((error) => {
          console.error('Error creating payment intent:', error);
        });
    }
  }, [selectedFlight]);
useEffect(()=>{
  console.log(passengers,'test fine')

},[])
const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();

  const seatArray: string[] = selectedSeat.map((seat: any) => seat._id);
  const passengerArray = passengers.passengers.map((passenger: any) => passenger);

  if (!stripe || !elements || !clientSecret) {
    return;
  }

  const userId = Cookies.get('userId');
  const data = {
    passengerName: passengerArray,
    email: passengers?.email,
    phoneNumber: passengers?.phoneNumber,
    departureAirport: selectedFlight?.departureAirport,
    arrivalAirport: selectedFlight?.arrivalAirport,
    stop: selectedFlight?.stops,
    flightNumber: selectedFlight?.flightNumber,
    flightDuration: selectedFlight?.duration,
    departureTime: selectedFlight?.departureTime,
    arrivalTime: selectedFlight?.arrivalTime,
    totalPassengers: passengers.passengers.length,
    FarePaid: selectedFlight!.price * selectedSeat.length,
    userId: userId,
    seatNumber: seatArray,
    DateofJourney: bookDate,
    flightModel: aircraftModel,
    returnDate: returnDate,
  };

  const result = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: elements.getElement(CardElement)!,
      billing_details: {
        name: `${passengers.passengers[0].firstName} ${passengers.passengers[0].lastName}`,
        email: passengers?.email,
        phone: passengers?.phoneNumber,
      },
    },
  });

  if (result.error) {
    Swal.fire({
      title: 'Payment Failed!',
      text: 'Payment Failed.',
      imageUrl: 'https://cdn.dribbble.com/users/2469324/screenshots/6538803/comp_3.gif',
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: 'Custom image',
    });
    console.error('Payment error:', result.error.message);
  } else if (result.paymentIntent?.status === 'succeeded') {
    console.log('Payment successful!');

    const handleRequests = async (data: {}) => {
      try {
        const sendTicketAndBookingRequest = await axios.post('http://localhost:3000/api/sendTicket', data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('Send Ticket and Booking Response:', sendTicketAndBookingRequest.data);

        Swal.fire({
          title: 'Success!',
          text: 'Payment Successful. Your booking and ticket have been saved.',
          imageUrl: 'https://i.pinimg.com/originals/cc/a5/02/cca5022c86f67861746d7cf2eb486de8.gif',
          imageWidth: 400,
          imageHeight: 200,
          imageAlt: 'Success image',
        });
      } catch (error: any) {
        console.error('Error:', error.response ? error.response.data : error.message);
      }
    };

    handleRequests(data);
    router.push('/user/payment/thanksPayment');
  }
};


  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              color: '#ffffff',
              fontFamily: 'Arial, sans-serif',
              fontSize: '16px',
              '::placeholder': {
                color: '#aab7c4',
                
              },
            },
            invalid: {
              color: '#fa755a',
              iconColor: '#fa755a',
            },
          },
        }}
      />
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="bg-green-500 text-white font-semibold px-4 py-2 rounded"
        >
          Pay Now
        </button>
      </div>
    </form>
  );
};

const PaymentPage: React.FC = () => {
  const selectedFlight = useSelector((state: RootState) => state.bookdetail.selectedFlight);
  const passengerDetails = useSelector((state: RootState) => state.bookdetail.passengerDetails);

  return (
    <Elements stripe={stripePromise}>
      <div className="bg-gray-900 text-white min-h-screen">
        {/* Header Image */}
        <div className="relative h-64">
          <img
            src="/flight-pay.webp" 
            className="w-full h-full object-cover rounded-b-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div>
              <h1 className="text-3xl font-bold">Seamless Payment Interface</h1>
              <span className='ml-20'>Powered By Stripe® Payment Gateway</span>
            </div>
          </div>
        </div>

        {/* Flight and Passenger Details Section */}
        <div className="container mx-auto p-6 mt-6 bg-[#07152C]  border border-white/5 rounded-lg shadow-lg">
          {selectedFlight ? (
            <>
              <div className="flex justify-between mb-4 ">
                <div>
                  <h2 className="text-2xl font-semibold">{selectedFlight.departureAirport} → {selectedFlight.arrivalAirport}</h2>
                  <p>{selectedFlight.departureTime} - {selectedFlight.arrivalTime}</p>
                  <p>{selectedFlight.duration}</p>
                </div>
                <div>
                  <p className="text-right">Fare Type: Regular</p>
                  <p className="text-right">Total Passengers: 1</p>
                  <p className="text-right">Total Fare: ₹{selectedFlight.price}</p>
                </div>
              </div>

              <div className="flex justify-between mb-4">
                <div>
                  <p className="text-lg">Flight Number: {selectedFlight.flightNumber}</p>
                  <p className="text-sm">Stop: {selectedFlight.stops}</p>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">Passenger Details</h2>
                {passengerDetails ? (
                  <div>
                    {/* <p className="text-lg">Name: {passengerDetails[0]?.firstName} {passengerDetails[0].lastName}</p>
                    <p className="text-lg">Email: {passengerDetails[0].email}</p>
                    <p className="text-lg">Phone: {passengerDetails[0].phoneNumber}</p> */}
                  </div>
                ) : (
                  <p>No passenger details available</p>
                )}
              </div>
            </>
          ) : (
            <p>No flight selected</p>
          )}
        </div>

        {/* Payment Form Section */}
        <div className="container mx-auto p-6 border border-white/5 mt-6 bg-[#07152C] rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Payment Details</h2>
          <PaymentForm />
        </div>
      </div>
    </Elements>
  );
};

export default PaymentPage;
