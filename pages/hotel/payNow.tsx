'use client';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { RootState } from '@/redux/store';
import Swal from 'sweetalert2';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import Cookies from 'js-cookie';
interface PaymentIntentResponse {
  clientSecret: string;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PaymentForm: React.FC = () => {
  const hotelBookingDetail = useSelector((state: RootState) => state.hotelBookDetail.selectedHotel);
  const userId=Cookies.get('userId');
  const getGuestDetails=useSelector((state:RootState)=>state.hotelGuestData.selectedUser);
  const guestDetails = useSelector((state: RootState) => state.bookdetail.guestDetails);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const stripe = useStripe();
  const elements = useElements();
  const token=Cookies.get('jwtToken');
  const router=useRouter();
console.log(guestDetails);
  useEffect(()=>{
  if(!token){
    router.push('/');
  }
  },[]);
  useEffect(() => {
    if (getGuestDetails) {
      axios.post<PaymentIntentResponse>('/api/create-payment-intent', { amount: getGuestDetails!.amount * 100 })
        .then((response) => {
          setClientSecret(response.data.clientSecret);
        })
        .catch((error) => {
          console.error('Error creating payment intent:', error);
        });
    }
  }, [getGuestDetails]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    alert(getGuestDetails?.amount);

    if (!stripe || !elements || !clientSecret) {
      return;
    }  
    const data = {
      guestName: `${guestDetails.firstName} ${guestDetails.lastName}`,
      email: guestDetails.email,
      phoneNumber: guestDetails.phoneNumber,
      noOfGuests:getGuestDetails?.guests,
      checkin:getGuestDetails?.checkin,
      checkout:getGuestDetails?.checkout,
      amount:getGuestDetails?.amount,
      hotelName:hotelBookingDetail?.name,
      hotelLocation:JSON.stringify(hotelBookingDetail?.gps_coordinates),
      userId:userId
      

      
    };

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
        billing_details: {
          name: `${guestDetails.firstName} ${guestDetails.lastName}`,
          email: guestDetails.email,
          phone: guestDetails.phoneNumber,
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
      axios.post('/api/saveHotelBooking', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => console.log('Success:', response.data))
        .catch(error => console.error('Error:', error));

      Swal.fire({
        title: 'Success!',
        text: 'Payment Success.',
        imageUrl: 'https://i.pinimg.com/originals/cc/a5/02/cca5022c86f67861746d7cf2eb486de8.gif',
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: 'Custom image',
      });

      router.push('/hotel/thanksPage');
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
  const hotelBookingDetail = useSelector((state: RootState) => state.hotelBookDetail.selectedHotel);
  const bookdata = useSelector((state: RootState) => state.hotelGuestData.selectedUser);

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

        <div className="container mx-auto p-6 mt-6 bg-[#07152C] border border-white/5 rounded-lg shadow-lg">
          {hotelBookingDetail ? (
            <>
              <div className="flex justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-semibold">{hotelBookingDetail?.type} → {hotelBookingDetail?.name}</h2>
                </div>
                <div>
                  <p className="text-right">Fare Type: Regular</p>
                  <p className="text-right">Total Fare: ₹{bookdata?.amount}</p>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">Booking Details</h2>
                {bookdata && (
                  <div>
                    <p className="text-lg">Check-in: {bookdata.checkin}</p>
                    <p className="text-lg">Check-out: {bookdata.checkout}</p>
                    <p className="text-lg">Guests: {bookdata.guests}</p>
                    <p className="text-lg">Hotel Name: {hotelBookingDetail?.name}</p>
                    
                  </div>
                )}
              </div>
            </>
          ) : (
            <p>No hotel selected</p>
          )}
        </div>

        <div className="container mx-auto p-6 border border-white/5 mt-6 bg-[#07152C] rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Payment Details</h2>
          <PaymentForm />
        </div>
      </div>
    </Elements>
  );
};

export default PaymentPage;
