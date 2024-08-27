import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { RootState } from '@/redux/store';
import { setSelectedUser } from '@/redux/slices/hotelGuestSlice';
import Cookies from 'js-cookie';
const SelectHotel = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const data = useSelector((state: RootState) => state.hotelBookDetail.selectedHotel);
  const details = useSelector((state: RootState) => state.hotelGuestData.selectedUser);
  const token=Cookies.get('jwtToken');
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [guests, setGuests] = useState('');
  const [amount, setAmount] = useState(0);
  useEffect(()=>{
  if(!token){
  router.push('/')     
  }
  },[])
  const handleBookHotel = () => {
    dispatch(setSelectedUser({ checkin, checkout, guests,amount }));
    alert(JSON.stringify(details)); // Stringify details object for alert
    router.push('/hotel/hotelBookDetail');
  };

  useEffect(() => {
    if (checkin && checkout && guests) {
      const totalStayDays = dateDifference(checkin, checkout);
      const calculatedAmount = (1000 * parseInt(guests)) * totalStayDays;
      setAmount(calculatedAmount);
    }
  }, [checkin, checkout, guests]); // Add dependencies to avoid infinite loop

  function dateDifference(d1: string, d2: string) {
    const date1 = parseDate(d1);
    const date2 = parseDate(d2);
    const timeDifference = date2.getTime() - date1.getTime();
    const dayDifference = timeDifference / (1000 * 60 * 60 * 24);
    return Math.abs(dayDifference);
  }

  function parseDate(dateStr: string) {
    const [day, month, year] = dateStr.split('-').map(Number); // Adjust to match dd-mm-yyyy format
    return new Date(year, month - 1, day);
  }

  return (
    <>
      <Navbar />
      <div className='mt-28'>
        <div className="container mx-auto p-4">
          {/* Hotel Title */}
          <h1 className="text-3xl font-bold text-white">{data?.name}</h1>

          {/* Hotel Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <img className='rounded-lg' src="https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?cs=srgb&dl=pexels-pixabay-261102.jpg&fm=jpg" alt="Hotel Image 1" />
            <img className='rounded-lg' src="https://media.istockphoto.com/id/472899538/photo/downtown-cleveland-hotel-entrance-and-waiting-taxi-cab.jpg?s=612x612&w=0&k=20&c=rz-WSe_6gKfkID6EL9yxCdN_UIMkXUBsr67884j-X9o=" alt="Hotel Image 2" />
            <img className='rounded-lg' src="https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg" alt="Hotel Image 3" />
            <img className='rounded-lg' src="https://fariyas.com/wp-content/uploads/2023/08/Slide-2.jpg" alt="Hotel Image 4" />
            <img className='rounded-lg' src="https://media.istockphoto.com/id/487042276/photo/hotel-sign.jpg?s=612x612&w=0&k=20&c=DjEVAoFnjB2cWwX28cxSKWkxsbze7o9jgkYrhyfmq9E=" alt="Hotel Image 5" />
          </div>

          <div className='w-[500px] h-20 border-2 border-white/30 rounded-md flex items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" fill='white' width='25' viewBox="0 0 576 512">
              <path d="M288 376.4l.1-.1 26.4 14.1 85.2 45.5-16.5-97.6-4.8-28.7 20.7-20.5 70.1-69.3-96.1-14.2-29.3-4.3-12.9-26.6L288.1 86.9l-.1 .3 0 289.2zm175.1 98.3c2 12-3 24.2-12.9 31.3s-23 8-33.8 2.3L288.1 439.8 159.8 508.3C149 514 135.9 513.1 126 506s-14.9-19.3-12.9-31.3L137.8 329 33.6 225.9c-8.6-8.5-11.7-21.2-7.9-32.7s13.7-19.9 25.7-21.7L195 150.3 259.4 18c5.4-11 16.5-18 28.8-18s23.4 7 28.8 18l64.3 132.3 143.6 21.2c12 1.8 22 10.2 25.7 21.7s.7 24.2-7.9 32.7L438.5 329l24.6 145.7z" />
            </svg>
            <p className='text-white ml-3'>{data?.location_rating}</p>
          </div>

          {/* Hotel Info Section */}
          <div className=" text-white flex flex-col md:flex-row mt-8">
            <div className="flex-1">
              {data?.amenities?.map((amenity, index) => (
                <div className="mt-2" key={index}>
                  <span className="font-semibold">{amenity}</span>
                </div>
              ))}

              {/* About this place */}
              <div className="mt-4">
                <h2 className="text-2xl font-bold">About this place</h2>
                <p className="mt-2">
                  SANTIPHAP ROOM - is a spacious en-suite located on the top floor of the renovated 40-year-old shophouse called "Ba hao". The room is a Thai-contemporary inspired, overlooking one of the most sacred "Trimit Temple" and a balcony with little garden.
                </p>
              </div>
            </div>

            {/* Price and Booking Section */}
            <div className="bg-black/5 md:w-1/3 md:ml-8 mt-8 md:mt-0">
              <div className="border p-4 rounded-lg shadow-md">
                <p className="text-2xl font-bold">₹1000 / night</p>
                <div className="mt-4">
                  <label htmlFor="checkin">Check-in</label>
                  <input
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      const formattedDate =
                        ("0" + date.getDate()).slice(-2) + "-" +
                        ("0" + (date.getMonth() + 1)).slice(-2) + "-" +
                        date.getFullYear();
                      setCheckin(formattedDate);
                    }}
                    type="date"
                    id="checkin"
                    className="w-full text-black border p-2 rounded"
                  />
                </div>
                <div className="mt-4">
                  <label htmlFor="checkout">Check-out</label>
                  <input
                    type="date"
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      const formattedDate =
                        ("0" + date.getDate()).slice(-2) + "-" +
                        ("0" + (date.getMonth() + 1)).slice(-2) + "-" +
                        date.getFullYear();
                      setCheckout(formattedDate);
                    }}
                    id="checkout"
                    className="w-full text-black border p-2 rounded"
                  />
                </div>
                <div className="mt-4">
                  <label htmlFor="guests">Guests</label>
                  <input
                    onChange={(e) => setGuests(e.target.value)}
                    type="number"
                    id="guests"
                    className="w-full text-black border p-2 rounded"
                    placeholder="1"
                  />
                </div>
                <div className="mt-4">
                  <label htmlFor="amount">Total amount:</label>
                  <input
                    value={`₹${amount}`}
                    id="amount"
                    readOnly
                    className="w-full text-black border p-2 rounded"
                  />
                </div>
                <button
                  onClick={handleBookHotel}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SelectHotel;
