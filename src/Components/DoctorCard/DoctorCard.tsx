import Image from "next/image";
import { BsCheckCircle } from "react-icons/bs";
import { AiFillLike } from "react-icons/ai";
import Link from "next/link";

// DoctorCard component to display doctor details
export default function DoctorCard({
  doctor,
}: {
  doctor: {
    id: number;
    name: string;
    experience: string;
    location: string; 
    clinic: string;
    fee: string; 
    originalFee: string; 
    rating: string; 
    reviews: string; 
    available: string; 
    image: string; 
  };
}) {
  return (
    <div className="p-6 rounded-lg shadow-sm mb-6 mx-6 bg-[#EBEBEB]">
      {/* Main container for the card */}
      <div className="flex flex-col md:flex-row">
        {/* Doctor's image section */}
        <div className="relative flex-shrink-0 rounded-lg border-2 border-green-300 mb-4 md:mb-0 md:mr-6">
          <Image
            src={doctor.image}
            width={200}
            height={200}
            className="object-contain w-full h-full rounded-lg"
            alt={doctor.name}
          />
          {/* Verified badge */}
          <div className="absolute bottom-1 right-1 bg-green-500 text-white p-1 rounded-full">
            <BsCheckCircle />
          </div>
        </div>

        {/* Doctor's details section */}
        <div className="flex-1">
          {/* Doctor's name */}
          <h3 className="text-xl font-semibold text-gray-800">{doctor.name}</h3>
          {/* Doctor's experience */}
          <p className="text-gray-500 text-sm">{doctor.experience}</p>

          {/* Doctor's location and clinic */}
          <p className="text-gray-700 font-medium mt-3">{doctor.location}</p>
          <p className="text-gray-700">{doctor.clinic}</p>

          {/* Fee details */}
          <div className="mt-2">
            <span className="text-green-600 font-semibold">{doctor.fee} EGP</span>
            <span className="line-through text-gray-400 ml-1">
              {doctor.originalFee} EGP
            </span>
            <p>Consultation fee at clinic</p>
          </div>

          {/* Rating and reviews */}
          <div className="flex items-center gap-3 mt-3">
            {/* Rating badge */}
            <span className="bg-green-600 text-white px-3 py-1 rounded-sm text-sm font-medium flex items-center">
              <AiFillLike className="mr-1" />
              {doctor.rating}% {/* Doctor's rating */}
            </span>
            {/* Number of patient reviews */}
            <span className="text-gray-600 text-sm">
              {doctor.reviews} Patient Stories
            </span>
          </div>
        </div>

        {/* Booking section */}
        <div className="mt-4 md:mt-0 md:text-right flex lg:flex-col lg:justify-between justify-center items-start md:items-end">
          <div></div>
          <div>
            {/* Availability status */}
            <p className="text-green-600 font-semibold text-center">{doctor.available}</p>
            {/* Booking button */}
            <Link className="bg-green-600 text-white px-4 py-2 rounded-lg mt-2 text-sm hover:bg-green-700 cursor-pointer block" href={"/clinics/" + doctor.id}>
              Book FREE Clinic Visit
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}