'use client'

import { useState } from 'react'
import { Plane, Clock, Calendar, CreditCard } from 'lucide-react'

interface Passenger {
  age: string
  disability: string
  firstName: string
  lastName: string
  middleName: string
  passportNumber: string
}

interface BookingDetails {
  arrivalAirport: string
  arrivalTime: string
  DateofJourney: string
  departureAirport: string
  departureTime: string
  email: string
  FarePaid: number
  flightDuration: string
  flightModel: string | null
  flightNumber: string
  id: string
  passengerName: Passenger[]
  ticketUrls: string[]
}

interface BookingDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  bookings: BookingDetails[]
}

export default function BookingDetailsModal({ isOpen, onClose, bookings }: BookingDetailsModalProps) {
  const [activeTab, setActiveTab] = useState('details')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Booking Details</h2>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="mb-4 border-b">
          <button
            className={`px-4 py-2 ${activeTab === 'details' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Flight Details
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'tickets' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('tickets')}
          >
            Tickets
          </button>
        </div>

        {bookings.map((booking, bookingIndex) => (
          <div key={bookingIndex}>
            {activeTab === 'details' && (
              <div className="overflow-y-auto h-96">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Flight Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Plane className="h-5 w-5 mr-2" />
                      <div>
                        <p className="font-medium">Flight Number: {booking.flightNumber}</p>
                        <p className="text-gray-500">{booking.departureAirport} → {booking.arrivalAirport}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      <div>
                        <p className="font-medium">Departure: {booking.departureTime}</p>
                        <p className="font-medium">Arrival: {booking.arrivalTime}</p>
                        <p className="text-gray-500">Duration: {booking.flightDuration}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      <p className="font-medium">Date: {booking.DateofJourney}</p>
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      <p className="font-medium">Fare Paid: ${booking.FarePaid}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Passenger Information</h3>
                  {booking.passengerName.map((passenger, index) => (
                    <div key={index} className="mb-4">
                      <h4 className="font-semibold">Passenger {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <p className="text-gray-700">Name: {`${passenger.firstName} ${passenger.middleName} ${passenger.lastName}`}</p>
                        <p className="text-gray-700">Age: {passenger.age}</p>
                        <p className="text-gray-700">Passport: {passenger.passportNumber}</p>
                        <p className="text-gray-700">Disability: {passenger.disability}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'tickets' && (
              <div className="overflow-y-auto h-96">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {booking.ticketUrls.map((url, index) => (
                    <div key={index} className="relative cursor-pointer">
                      <img
                        src={url}
                        alt={`Ticket for ${booking.passengerName[index].firstName} ${booking.passengerName[index].lastName}`}
                        className="w-full h-48 object-cover rounded-lg"
                        onClick={() => setSelectedImage(url)}
                      />
                      <div className="absolute bottom-2 left-2 bg-gray-900 bg-opacity-75 text-white px-2 py-1 rounded">
                        <p>Ticket for {booking.passengerName[index].firstName} {booking.passengerName[index].lastName}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Lightbox modal for viewing larger image */}
                {selectedImage && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-75">
                    <div className="relative">
                      <img src={selectedImage} alt="Ticket" className="max-h-screen object-contain rounded-lg" />
                      <button
                        className="absolute top-2 right-2 text-white bg-black bg-opacity-50 p-2 rounded-full"
                        onClick={() => setSelectedImage(null)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
