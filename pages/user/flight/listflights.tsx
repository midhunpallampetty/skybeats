"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useScroll } from "framer-motion"
import Cookies from "js-cookie"
import DatePicker from "react-datepicker"
import Select, { type SingleValue, type ActionMeta } from "react-select"
import "react-datepicker/dist/react-datepicker.css"
import { useDispatch, useSelector } from "react-redux"
import debounce from "lodash.debounce"
import { setAirports, setFilteredAirports } from "@/redux/slices/airportsSlice"
import { setBookDetail } from "@/redux/slices/bookdetailSlice"
import type { Flight } from "../../../interfaces/flight"
import Swal from "sweetalert2"
import Image from "next/image"
import { clearSelectedSeat } from "@/redux/slices/selectedSeat"
import axiosInstance from "@/pages/api/utils/axiosInstance"
import dynamic from "next/dynamic"
import type { Airport } from "@/interfaces/Airport"
import type { RootState } from "@/redux/store"
import { setFlights, clearFlights } from "@/redux/slices/flightsSlice"
import { setDate } from "@/redux/slices/bookDate"
import { setReturnDate } from "@/redux/slices/returnDate"
import { setSelectedPassengers } from "@/redux/slices/passengerCountSlice"
import type { OptionType } from "@/interfaces/OptionType"
import { useRouter } from "next/router"
import { clearSelectedReturnFlight, selectReturnFlight } from "@/redux/slices/returnFlightSlice"
import {
  Plane,
  Calendar,
  Users,
  Search,
  ArrowRight,
  Clock,
  MapPin,
  Tag,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Filter,
  Sparkles,
} from "lucide-react"

const Navbar = dynamic(() => import("../../components/Navbar"), { ssr: true })

const ListFlights: React.FC = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const airports = useSelector((state: RootState) => state.airports.airports)
  const filteredAirports = useSelector((state: RootState) => state.airports.filteredAirports)
  const [isLoading, setIsLoading] = useState(true)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [returnDate, setreturnDate] = useState<Date | null>(null)
  const [error, setError] = useState("")
  const hasFetched = useRef(false)
  const [showMainFlights, setShowMainFlights] = useState(true)
  const [showReturnFlights, setShowReturnFlights] = useState(false)
  const [returnFlights, setReturnFlights] = useState<Flight[]>([])
  const [loadingReturnFlights, setLoadingReturnFlights] = useState(false)
  const [passengers, setPassengers] = useState({
    adults: 1,
    seniors: 0,
    children: 0,
    infants: 0,
  })
  const [selectedFrom, setSelectedFrom] = useState<SingleValue<OptionType>>(null)
  const [selectedTo, setSelectedTo] = useState<SingleValue<OptionType>>(null)
  const flights = useSelector((state: RootState) => state.flights.flights)
  const [sortOption, setSortOption] = useState<string>("price")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [flightsPerPage] = useState<number>(5)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const lastSearchRequest = useRef(null)
  const listingRef = useRef(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6 },
    },
  }

  // Enhanced flight card animations
  const flightCardVariants = {
    hidden: { opacity: 0, x: -50, rotateY: -5 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        delay: i * 0.1,
      },
    }),
    hover: {
      scale: 1.03,
      boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.2)",
      y: -5,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    tap: { scale: 0.98 },
  }

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  }

  // New staggered animation for flight details
  const flightDetailsVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const flightDetailItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  // Parallax effect for background
  const y = useMotionValue(0)
  const backgroundY = useTransform(y, [0, 1], [0, -100])

  useEffect(() => {
    dispatch(clearFlights())
    dispatch(clearSelectedReturnFlight())
  }, [dispatch])

  useEffect(() => {
    const userId = Cookies.get("userId")
    const accessToken = Cookies.get("accessToken")
    const refreshToken = Cookies.get("refreshToken")

    if (!userId || !accessToken || !refreshToken) {
      Cookies.remove("userId")
      Cookies.remove("accessToken")
      Cookies.remove("refreshToken")
      router.push("/")
    }
  }, [router])

  useEffect(() => {
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsLoading(false)
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchAirports = async () => {
      if (hasFetched.current) return

      try {
        hasFetched.current = true
        const response = await axiosInstance.get("/getAirports")
        const airportsData: Airport[] = response.data

        const airportOptions = airportsData.map((airport) => ({
          value: airport.code,
          label: `${airport.city} (${airport.code}) ${airport.country}`,
        }))

        dispatch(setAirports(airportOptions))
        dispatch(setFilteredAirports(airportOptions))
      } catch (error) {
        Swal.fire({
          text: "Error Fetching Airports",
          background: "dark",
        })
        console.error("Error fetching airports:", error)
      }
    }

    fetchAirports()
  }, [dispatch])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const increment = (type: keyof typeof passengers) => {
    if (totalPassengers < 10) {
      if ((type === "children" || type === "infants") && !hasAdultOrSenior()) {
        Swal.fire({
          title: "You must have at least one adult or senior citizen to select infants or children.",
          background: "#282c34",
          color: "#fff",
          confirmButtonColor: "#4CAF50",
        })
      } else {
        setPassengers((prev) => ({
          ...prev,
          [type]: prev[type] + 1,
        }))
      }
    } else {
      Swal.fire({
        title: "Maximum 10 passengers allowed.",
        background: "#282c34",
        color: "#fff",
        confirmButtonColor: "#4CAF50",
      })
    }
  }

  const decrement = (type: keyof typeof passengers) => {
    if (passengers[type] > 0) {
      // Ensure at least one adult or senior remains if there are children or infants
      if (
        type === "adults" &&
        passengers.adults === 1 &&
        passengers.seniors === 0 &&
        (passengers.children > 0 || passengers.infants > 0)
      ) {
        Swal.fire({
          title: "At least one adult is required with children or infants.",
          background: "#282c34",
          color: "#fff",
          confirmButtonColor: "#4CAF50",
        })
        return
      }

      if (
        type === "seniors" &&
        passengers.seniors === 1 &&
        passengers.adults === 0 &&
        (passengers.children > 0 || passengers.infants > 0)
      ) {
        Swal.fire({
          title: "At least one adult or senior is required with children or infants.",
          background: "#282c34",
          color: "#fff",
          confirmButtonColor: "#4CAF50",
        })
        return
      }

      setPassengers((prev) => ({
        ...prev,
        [type]: prev[type] - 1,
      }))
    }
  }

  const totalPassengers = passengers.adults + passengers.seniors + passengers.children + passengers.infants
  const hasAdultOrSenior = () => passengers.adults + passengers.seniors > 0

  const toggleFlights = (type: "main" | "return") => {
    if (type === "main") {
      setShowMainFlights(true)
      setShowReturnFlights(false)
    } else {
      setShowMainFlights(false)
      setShowReturnFlights(true)
      fetchReturnFlights()
    }
  }

  const fetchReturnFlights = async () => {
    if (!returnDate || !selectedFrom || !selectedTo) {
      Swal.fire({
        title: "Missing Information",
        text: "Please select a return date and destinations.",
        icon: "warning",
        background: "#1E3A8A",
        color: "#fff",
        confirmButtonColor: "#4F46E5",
      })
      return
    }

    setLoadingReturnFlights(true)
    try {
      const response = await axiosInstance.post("/searchFlights", {
        from: selectedTo?.label.split(" ")[0].toLowerCase(),
        to: selectedFrom?.label.split(" ")[0].toLowerCase(),
        date: returnDate,
      })
      setReturnFlights(response.data)
    } catch (error) {
      console.error("Error fetching return flights:", error)
      Swal.fire({
        title: "Error",
        text: "Failed to fetch return flights.",
        icon: "error",
        background: "#1E3A8A",
        color: "#fff",
        confirmButtonColor: "#4F46E5",
      })
    } finally {
      setLoadingReturnFlights(false)
    }
  }

  const handleSelectReturnFlight = (flight: Flight) => {
    dispatch(selectReturnFlight(flight))
    Swal.fire({
      title: "Return Flight Selected!",
      text: `${flight.flightNumber} from ${flight.departureAirport} to ${flight.arrivalAirport} has been selected as your return flight.`,
      icon: "success",
      confirmButtonText: "OK",
      background: "#1E3A8A",
      color: "#fff",
      confirmButtonColor: "#4F46E5",
    })
  }

  const handleSelectChange = (selectedOption: SingleValue<OptionType>, actionMeta: ActionMeta<OptionType>) => {
    if (actionMeta.name === "from") {
      setSelectedFrom(selectedOption)
      if (selectedTo && selectedOption?.value === selectedTo?.value) {
        setError("Departure and Destination cannot be the same.")
      } else {
        setError("")
      }
    } else if (actionMeta.name === "to") {
      setSelectedTo(selectedOption)
      if (selectedFrom && selectedOption?.value === selectedFrom?.value) {
        setError("Departure and Destination cannot be the same.")
      } else {
        setError("")
      }
    }
  }

  useEffect(() => {
    if (error !== "") {
      Swal.fire({
        icon: "info",
        title: "Info",
        text: "Departure & Arrival Should Not Be Same!",
        background: "#06093b",
        confirmButtonColor: "#3085d6",
        color: "#ffffff",
      })
      setSelectedTo(null)
    }
  }, [error])

  const handleInputChange = useCallback(
    debounce((inputValue: string) => {
      setError("")
      const filteredOptions = airports.filter((airport) =>
        airport.label.toLowerCase().includes(inputValue.toLowerCase()),
      )
      dispatch(setFilteredAirports(filteredOptions))
    }, 300),
    [airports, dispatch],
  )

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!selectedFrom || !selectedTo) {
      Swal.fire({
        title: "Missing Information",
        text: 'Please select both "From" and "To" locations.',
        icon: "warning",
        background: "#1E3A8A",
        color: "#fff",
        confirmButtonColor: "#4F46E5",
      })
      return
    }

    if (!startDate) {
      Swal.fire({
        title: "Missing Information",
        text: "Please select a departure date.",
        icon: "warning",
        background: "#1E3A8A",
        color: "#fff",
        confirmButtonColor: "#4F46E5",
      })
      return
    }

    if (totalPassengers === 0) {
      Swal.fire({
        title: "Warning",
        text: "Please select at least one passenger.",
        icon: "warning",
        background: "#1E3A8A",
        color: "#fff",
        confirmButtonColor: "#4F46E5",
      })
      return
    }

    const from = selectedFrom.label.split(" ")[0].toLowerCase()
    const to = selectedTo.label.split(" ")[0].toLowerCase()
    const searchRequest = { from, to, date: startDate }

    if (lastSearchRequest.current && JSON.stringify(lastSearchRequest.current) === JSON.stringify(searchRequest)) {
      return
    }

    lastSearchRequest.current = searchRequest

    try {
      setIsLoading(true)
      const response = await axiosInstance.post("/searchFlights", {
        from,
        to,
        date: startDate,
      })

      dispatch(setFlights(response.data as Flight[]))
      dispatch(setDate(startDate.toDateString()))
      dispatch(setReturnDate(returnDate?.toDateString()))

      setIsLoading(false)

      if (listingRef.current) {
        listingRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    } catch (error: any) {
      setIsLoading(false)
      console.error("Error searching flights:", error.message)
      Swal.fire({
        title: "Error",
        text: "Failed to search flights. Please try again.",
        icon: "error",
        background: "#1E3A8A",
        color: "#fff",
        confirmButtonColor: "#4F46E5",
      })
    }
  }

  const sortFlights = (flights: Flight[], criteria: string) => {
    switch (criteria) {
      case "price":
        return [...flights].sort((a, b) => a.price - b.price)
      case "duration":
        return [...flights].sort((a, b) => a.duration.localeCompare(b.duration))
      case "departureTime":
        return [...flights].sort((a, b) => a.departureTime.localeCompare(b.departureTime))
      default:
        return flights
    }
  }

  const sortedFlights = sortFlights(flights, sortOption)
  const sortedReturnFlights = sortFlights(returnFlights, sortOption)
  const indexOfLastFlight = currentPage * flightsPerPage
  const indexOfFirstFlight = indexOfLastFlight - flightsPerPage
  const currentFlights = sortedFlights.slice(indexOfFirstFlight, indexOfLastFlight)
  const currentReturnFlights = sortedReturnFlights.slice(indexOfFirstFlight, indexOfLastFlight)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Custom styles for react-select
  const customSelectStyles = {
    control: (provided: any) => ({
      ...provided,
      borderRadius: "0.5rem",
      border: "1px solid #e2e8f0",
      boxShadow: "none",
      "&:hover": {
        border: "1px solid #3b82f6",
      },
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#3b82f6" : state.isFocused ? "#e2e8f0" : "white",
      color: state.isSelected ? "white" : "#1e293b",
      cursor: "pointer",
    }),
  }

  // Custom styles for DatePicker
  const datePickerCustomStyles =
    "w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 pl-10"

  return (
    <>
      <Navbar />
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 z-50"
        style={{ scaleX, transformOrigin: "0%" }}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{ position: "relative", zIndex: 1 }}
      >
        <motion.div
          style={{
            backgroundImage: `url('https://airline-datace.s3.ap-south-1.amazonaws.com/pexels-pixabay-302769.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "80vh",
            display: "flex",
            opacity:"0.8",
            justifyContent: "center",
            alignItems: "center",
            y: backgroundY,
          }}
          className="relative overflow-hidden"
        >
          {/* Animated particles overlay */}
          <div className="absolute inset-0 z-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-white opacity-70"
                initial={{
                  x: Math.random() * 100 + "%",
                  y: Math.random() * 100 + "%",
                  scale: Math.random() * 0.5 + 0.5,
                }}
                animate={{
                  y: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: Math.random() * 10 + 20,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
            ))}
          </div>

          <motion.div
            variants={itemVariants}
            className="container mx-auto p-6 sm:p-8 bg-gradient-to-br from-blue-950/90 to-indigo-900/90 backdrop-blur-md text-white rounded-xl flex flex-col w-full max-w-lg sm:max-w-xl lg:w-[850px] justify-center space-y-6 shadow-2xl border border-blue-800/30 z-10"
          >
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
                <motion.div className="flex flex-col items-center space-y-6" variants={containerVariants}>
                  <motion.div
                    variants={itemVariants}
                    className="text-2xl font-bold text-white mb-2 flex items-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Sparkles className="w-6 h-6 mr-2 text-blue-300" />
                    Find Your Perfect Flight
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full"
                  >
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MapPin className="w-5 h-5 text-gray-400" />
                      </div>
                      <Select
                        name="from"
                        options={filteredAirports}
                        value={selectedFrom}
                        onChange={handleSelectChange}
                        onInputChange={handleInputChange}
                        placeholder="From"
                        className="w-full text-black"
                        styles={customSelectStyles}
                      />
                    </div>

                    <div className="relative flex items-center justify-center">
                      <motion.div
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.3 }}
                        className="hidden sm:flex bg-blue-600 rounded-full p-2 shadow-lg"
                      >
                        <RefreshCw className="w-5 h-5 text-white" />
                      </motion.div>
                    </div>

                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MapPin className="w-5 h-5 text-gray-400" />
                      </div>
                      <Select
                        name="to"
                        options={filteredAirports}
                        value={selectedTo}
                        onChange={handleSelectChange}
                        onInputChange={handleInputChange}
                        placeholder="To"
                        className="w-full text-black"
                        styles={customSelectStyles}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full"
                  >
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                        <Calendar className="w-5 h-5 text-gray-400" />
                      </div>
                      <DatePicker
                        selected={startDate}
                        onChange={(date: Date | null) => setStartDate(date)}
                        className={datePickerCustomStyles}
                        placeholderText="Departure Date"
                        minDate={new Date()}
                        dateFormat="dd/MM/yyyy"
                      />
                    </div>

                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                        <Calendar className="w-5 h-5 text-gray-400" />
                      </div>
                      <DatePicker
                        selected={returnDate}
                        onChange={(date: Date | null) => setreturnDate(date)}
                        className={datePickerCustomStyles}
                        placeholderText="Return Date (Optional)"
                        minDate={startDate || new Date()}
                        dateFormat="dd/MM/yyyy"
                      />
                    </div>

                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Filter className="w-5 h-5 text-gray-400" />
                      </div>
                      <Select
                        name="sort"
                        options={[
                          { value: "price", label: "Sort by Price" },
                          { value: "duration", label: "Sort by Duration" },
                          { value: "departureTime", label: "Sort by Departure Time" },
                        ]}
                        value={{
                          value: sortOption,
                          label:
                            sortOption === "price"
                              ? "Sort by Price"
                              : sortOption === "duration"
                                ? "Sort by Duration"
                                : "Sort by Departure Time",
                        }}
                        onChange={(option: SingleValue<OptionType>) => setSortOption(option?.value || "price")}
                        placeholder="Sort by"
                        className="w-full text-black pl-10"
                        styles={customSelectStyles}
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="relative w-full" ref={dropdownRef}>
                    <motion.button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="p-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium w-full flex items-center justify-between transition-colors duration-200"
                      whileHover={{ scale: 1.02, boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center">
                        <Users className="w-5 h-5 mr-2" />
                        Passenger Details
                      </div>
                      <span className="bg-blue-500 px-2 py-1 rounded-full text-sm">
                        {totalPassengers} {totalPassengers === 1 ? "Passenger" : "Passengers"}
                      </span>
                    </motion.button>

                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute w-full mt-2 bg-white shadow-xl rounded-lg border border-gray-200 z-20"
                        >
                          <div className="p-4 space-y-4">
                            {[
                              { label: "Adults", type: "adults", description: "Age 12+" },
                              { label: "Senior Citizens", type: "seniors", description: "Age 60+" },
                              { label: "Children", type: "children", description: "Age 2-11" },
                              { label: "Infants", type: "infants", description: "Under 2" },
                            ].map(({ label, type, description }) => (
                              <div
                                key={type}
                                className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                              >
                                <div>
                                  <span className="font-medium text-gray-800">{label}</span>
                                  <p className="text-xs text-gray-500">{description}</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <motion.button
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                    type="button"
                                    onClick={() => decrement(type as keyof typeof passengers)}
                                    className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition-colors duration-200"
                                    aria-label={`Decrease ${label}`}
                                  >
                                    <Minus className="w-4 h-4 text-gray-700" />
                                  </motion.button>
                                  <span className="w-8 text-center font-medium text-gray-800">
                                    {passengers[type as keyof typeof passengers]}
                                  </span>
                                  <motion.button
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                    type="button"
                                    onClick={() => increment(type as keyof typeof passengers)}
                                    className="w-8 h-8 flex items-center justify-center bg-blue-500 hover:bg-blue-600 rounded-full transition-colors duration-200"
                                    aria-label={`Increase ${label}`}
                                  >
                                    <Plus className="w-4 h-4 text-white" />
                                  </motion.button>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="border-t border-gray-200 p-3 flex justify-end">
                            <motion.button
                              variants={buttonVariants}
                              whileHover="hover"
                              whileTap="tap"
                              type="button"
                              onClick={() => setIsDropdownOpen(false)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                            >
                              Done
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div variants={itemVariants} className="flex justify-center mt-4 w-full">
                    <motion.button
                      type="submit"
                      className="w-full lg:w-[220px] text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 font-bold p-3 rounded-lg flex items-center justify-center shadow-lg"
                      variants={buttonVariants}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
                        textShadow: "0px 0px 8px rgba(255,255,255,0.5)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Searching...
                        </div>
                      ) : (
                        <>
                          <Search className="w-5 h-5 mr-2" />
                          Search Flights
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </motion.div>
              </form>
            )}
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="relative" ref={listingRef}>
        <motion.div
          className="absolute inset-0 min-h-[50vh] opacity-8 z-0"
          style={{
            opacity: "0.08",
            backgroundImage: "url('/clouds-2716_1920.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          animate={{
            scale: [1, 1.02, 1],
            opacity: [0.08, 0.1, 0.08],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <div className="relative z-10 top-0 left-0 w-full">
          <div className="container mx-auto px-4 h-auto pt-20 pb-10">
            <AnimatePresence mode="wait">
              {(flights.length > 0 || returnFlights.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="mb-8"
                >
                  <motion.div
                    className="flex flex-col sm:flex-row justify-center items-center mb-6 gap-4"
                    variants={containerVariants}
                  >
                    <motion.button
                      className={`px-6 py-3 rounded-full flex items-center ${
                        showMainFlights
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      } transition-all duration-300`}
                      onClick={() => toggleFlights("main")}
                      variants={buttonVariants}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plane className="w-5 h-5 mr-2" />
                      {selectedFrom?.label.split(" ")[0]}
                      <ArrowRight className="w-4 h-4 mx-1" />
                      {selectedTo?.label.split(" ")[0]}
                    </motion.button>

                    {returnDate && (
                      <motion.button
                        className={`px-6 py-3 rounded-full flex items-center ${
                          showReturnFlights
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        } transition-all duration-300`}
                        onClick={() => toggleFlights("return")}
                        variants={buttonVariants}
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Plane className="w-5 h-5 mr-2" />
                        {selectedTo?.label.split(" ")[0]}
                        <ArrowRight className="w-4 h-4 mx-1" />
                        {selectedFrom?.label.split(" ")[0]}
                      </motion.button>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {showMainFlights && (
                <motion.div
                  key="main-flights"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={containerVariants}
                >
                  {currentFlights.length > 0 ? (
                    currentFlights.map((flight, index) => (
                      <motion.div
                        key={flight.flightNumber}
                        variants={flightCardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        whileTap="tap"
                        custom={index}
                        className="bg-gradient-to-r from-blue-900/80 to-indigo-900/80 p-5 rounded-xl shadow-xl flex flex-col md:flex-row items-center justify-between w-full mb-5 backdrop-blur-sm border border-blue-800/50 overflow-hidden"
                      >
                        {/* Animated flight path */}
                        <motion.div
                          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                          animate={{
                            x: ["-100%", "100%"],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                        />

                        <motion.div
                          className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left mb-4 md:mb-0 w-full md:w-auto"
                          variants={flightDetailsVariants}
                        >
                          <motion.div
                            className="bg-blue-700/30 p-3 rounded-full mb-4 md:mb-0 md:mr-6 relative overflow-hidden"
                            whileHover={{
                              scale: 1.1,
                              rotate: [0, 5, -5, 0],
                              transition: { duration: 0.5 },
                            }}
                          >
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0"
                              animate={{
                                x: ["-100%", "100%"],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "linear",
                              }}
                            />
                            <Plane className="w-8 h-8 text-white" />
                          </motion.div>
                          <div>
                            <motion.div
                              className="text-xl font-bold text-white flex items-center justify-center md:justify-start"
                              variants={flightDetailItemVariants}
                            >
                              {flight.departureTime}
                              <motion.div
                                animate={{
                                  x: [0, 5, 0],
                                }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Number.POSITIVE_INFINITY,
                                  ease: "easeInOut",
                                }}
                              >
                                <ArrowRight className="w-4 h-4 mx-2 text-blue-300" />
                              </motion.div>
                              {flight.arrivalTime}
                            </motion.div>
                            <motion.div
                              className="text-blue-200 font-medium mt-1 flex items-center justify-center md:justify-start"
                              variants={flightDetailItemVariants}
                            >
                              <MapPin className="w-4 h-4 mr-1" />
                              {flight.departureAirport}
                              <ArrowRight className="w-3 h-3 mx-1" />
                              {flight.arrivalAirport}
                            </motion.div>
                            <motion.div
                              className="text-sm text-blue-300 mt-2 flex items-center justify-center md:justify-start"
                              variants={flightDetailItemVariants}
                            >
                              <Clock className="w-4 h-4 mr-1" />
                              {flight.duration} • {flight.stops}
                            </motion.div>
                            <motion.div
                              className="text-sm text-blue-300 mt-1 flex items-center justify-center md:justify-start"
                              variants={flightDetailItemVariants}
                            >
                              <Plane className="w-4 h-4 mr-1" />
                              {flight.flightNumber}
                            </motion.div>
                          </div>
                        </motion.div>
                        <motion.div
                          className="text-right flex flex-col items-center md:items-end"
                          variants={flightDetailsVariants}
                        >
                          <motion.div
                            className="text-2xl font-bold text-white"
                            variants={flightDetailItemVariants}
                            whileHover={{ scale: 1.1, color: "#4ade80" }}
                          >
                            ₹{flight.price}
                          </motion.div>
                          <motion.div
                            className="text-sm text-green-400 font-medium mt-1 flex items-center"
                            variants={flightDetailItemVariants}
                          >
                            <Tag className="w-4 h-4 mr-1" />
                            Save ₹750 with INTSAVER
                          </motion.div>
                          <motion.button
                            variants={buttonVariants}
                            whileHover={{
                              scale: 1.05,
                              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
                              background: "linear-gradient(to right, #22c55e, #16a34a)",
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 font-bold px-8 py-3 text-white rounded-full mt-3 shadow-lg"
                            onClick={() => {
                              dispatch(setBookDetail(flight))
                              dispatch(setSelectedPassengers(passengers))
                              dispatch(clearSelectedSeat())
                              router.push("/user/flight/selectSeats")
                            }}
                          >
                            Book Now
                          </motion.button>
                          <motion.div className="text-sm text-blue-300 mt-2" variants={flightDetailItemVariants}>
                            Partially refundable
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div variants={fadeIn} className="flex flex-col items-center justify-center py-10">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Image
                          src="https://airline-datacenter.s3.ap-south-1.amazonaws.com/de9dc8d1-fd3b-44a4-b095-d0e4f3a544b6.jpeg"
                          alt="No Flights Available"
                          width={700}
                          height={400}
                          className="rounded-lg shadow-lg"
                        />
                      </motion.div>
                      <motion.p
                        className="text-white text-xl mt-6 font-medium"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                      >
                        No Flights Available
                      </motion.p>
                      <motion.p
                        className="text-blue-300 mt-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                      >
                        Try different dates or destinations
                      </motion.p>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {showReturnFlights && (
                <motion.div
                  key="return-flights"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={containerVariants}
                >
                  {loadingReturnFlights ? (
                    <motion.div variants={fadeIn} className="flex justify-center items-center py-20">
                      <img src="/Animation.gif" alt="Loading..." className="w-32 h-32" />
                    </motion.div>
                  ) : currentReturnFlights.length > 0 ? (
                    currentReturnFlights.map((flight, index) => (
                      <motion.div
                        key={flight.flightNumber}
                        variants={flightCardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        whileTap="tap"
                        custom={index}
                        className="bg-gradient-to-r from-indigo-900/80 to-purple-900/80 p-5 rounded-xl shadow-xl flex flex-col md:flex-row items-center justify-between w-full mb-5 backdrop-blur-sm border border-indigo-800/50 overflow-hidden"
                      >
                        {/* Animated flight path */}
                        <motion.div
                          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                          animate={{
                            x: ["-100%", "100%"],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                        />

                        <motion.div
                          className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left mb-4 md:mb-0 w-full md:w-auto"
                          variants={flightDetailsVariants}
                        >
                          <motion.div
                            className="bg-indigo-700/30 p-3 rounded-full mb-4 md:mb-0 md:mr-6 relative overflow-hidden"
                            whileHover={{
                              scale: 1.1,
                              rotate: [0, 5, -5, 0],
                              transition: { duration: 0.5 },
                            }}
                          >
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/30 to-purple-500/0"
                              animate={{
                                x: ["-100%", "100%"],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "linear",
                              }}
                            />
                            <Plane className="w-8 h-8 text-white" />
                          </motion.div>
                          <div>
                            <motion.div
                              className="text-xl font-bold text-white flex items-center justify-center md:justify-start"
                              variants={flightDetailItemVariants}
                            >
                              {flight.departureTime}
                              <motion.div
                                animate={{
                                  x: [0, 5, 0],
                                }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Number.POSITIVE_INFINITY,
                                  ease: "easeInOut",
                                }}
                              >
                                <ArrowRight className="w-4 h-4 mx-2 text-indigo-300" />
                              </motion.div>
                              {flight.arrivalTime}
                            </motion.div>
                            <motion.div
                              className="text-indigo-200 font-medium mt-1 flex items-center justify-center md:justify-start"
                              variants={flightDetailItemVariants}
                            >
                              <MapPin className="w-4 h-4 mr-1" />
                              {flight.departureAirport}
                              <ArrowRight className="w-3 h-3 mx-1" />
                              {flight.arrivalAirport}
                            </motion.div>
                            <motion.div
                              className="text-sm text-indigo-300 mt-2 flex items-center justify-center md:justify-start"
                              variants={flightDetailItemVariants}
                            >
                              <Clock className="w-4 h-4 mr-1" />
                              {flight.duration} • {flight.stops}
                            </motion.div>
                            <motion.div
                              className="text-sm text-indigo-300 mt-1 flex items-center justify-center md:justify-start"
                              variants={flightDetailItemVariants}
                            >
                              <Plane className="w-4 h-4 mr-1" />
                              {flight.flightNumber}
                            </motion.div>
                          </div>
                        </motion.div>
                        <motion.div
                          className="text-right flex flex-col items-center md:items-end"
                          variants={flightDetailsVariants}
                        >
                          <motion.div
                            className="text-2xl font-bold text-white"
                            variants={flightDetailItemVariants}
                            whileHover={{ scale: 1.1, color: "#a78bfa" }}
                          >
                            ₹{flight.price}
                          </motion.div>
                          <motion.div
                            className="text-sm text-green-400 font-medium mt-1 flex items-center"
                            variants={flightDetailItemVariants}
                          >
                            <Tag className="w-4 h-4 mr-1" />
                            Save ₹750 with INTSAVER
                          </motion.div>
                          <motion.button
                            variants={buttonVariants}
                            whileHover={{
                              scale: 1.05,
                              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
                              background: "linear-gradient(to right, #a855f7, #9333ea)",
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 font-bold px-8 py-3 text-white rounded-full mt-3 shadow-lg"
                            onClick={() => handleSelectReturnFlight(flight)}
                          >
                            Select Return Flight
                          </motion.button>
                          <motion.div className="text-sm text-indigo-300 mt-2" variants={flightDetailItemVariants}>
                            Partially refundable
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div variants={fadeIn} className="flex flex-col items-center justify-center py-10">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Image
                          src="https://airline-datacenter.s3.ap-south-1.amazonaws.com/de9dc8d1-fd3b-44a4-b095-d0e4f3a544b6.jpeg"
                          alt="No Return Flights Available"
                          width={700}
                          height={400}
                          className="rounded-lg shadow-lg"
                        />
                      </motion.div>
                      <motion.p
                        className="text-white text-xl mt-6 font-medium"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                      >
                        No Return Flights Available
                      </motion.p>
                      <motion.p
                        className="text-blue-300 mt-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                      >
                        Try different dates or destinations
                      </motion.p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {(currentFlights.length > 0 || currentReturnFlights.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center mt-8"
              >
                <nav className="flex items-center">
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center px-4 py-2 mr-2 rounded-md ${
                      currentPage === 1
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    } transition-colors duration-200`}
                  >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Previous
                  </motion.button>

                  <div className="flex space-x-1">
                    {Array.from(
                      {
                        length: Math.ceil((showMainFlights ? flights.length : returnFlights.length) / flightsPerPage),
                      },
                      (_, i) => (
                        <motion.button
                          key={i}
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          className={`w-10 h-10 flex items-center justify-center rounded-md ${
                            currentPage === i + 1
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          } transition-colors duration-200`}
                          onClick={() => paginate(i + 1)}
                        >
                          {i + 1}
                        </motion.button>
                      ),
                    )}
                  </div>

                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() =>
                      paginate(
                        currentPage <
                          Math.ceil((showMainFlights ? flights.length : returnFlights.length) / flightsPerPage)
                          ? currentPage + 1
                          : currentPage,
                      )
                    }
                    disabled={
                      currentPage ===
                      Math.ceil((showMainFlights ? flights.length : returnFlights.length) / flightsPerPage)
                    }
                    className={`flex items-center px-4 py-2 ml-2 rounded-md ${
                      currentPage ===
                      Math.ceil((showMainFlights ? flights.length : returnFlights.length) / flightsPerPage)
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    } transition-colors duration-200`}
                  >
                    Next
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </motion.button>
                </nav>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="bg-gradient-to-b from-gray-900 to-blue-900 rounded-t-3xl shadow-inner shadow-white/15 mt-10 pt-20"
      >
        <div className="w-full max-w-screen-xl mx-auto p-6 md:py-12">
          <div className="sm:flex sm:items-center sm:justify-between">
            <motion.a
              href="/"
              className="flex items-center mb-6 sm:mb-0 space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <img src="/logo_airline.png" className="h-10" alt="Skybeats Logo" />
              <span className="text-white text-xl font-bold">Skybeats</span>
            </motion.a>
            <ul className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-300">
              <motion.li whileHover={{ scale: 1.1, color: "#ffffff" }}>
                <a href="#" className="hover:text-white transition-colors duration-200">
                  About Us
                </a>
              </motion.li>
              <motion.li whileHover={{ scale: 1.1, color: "#ffffff" }}>
                <a href="#" className="hover:text-white transition-colors duration-200">
                  Privacy Policy
                </a>
              </motion.li>
              <motion.li whileHover={{ scale: 1.1, color: "#ffffff" }}>
                <a href="#" className="hover:text-white transition-colors duration-200">
                  Terms & Conditions
                </a>
              </motion.li>
              <motion.li whileHover={{ scale: 1.1, color: "#ffffff" }}>
                <a href="#" className="hover:text-white transition-colors duration-200">
                  Contact
                </a>
              </motion.li>
            </ul>
          </div>
          <hr className="my-6 border-gray-700 sm:mx-auto lg:my-8" />
          <div className="text-center text-gray-400">
            <p>© 2023 Skybeats Airlines. All rights reserved.</p>
          </div>
        </div>
      </motion.footer>
    </>
  )
}

export default ListFlights

