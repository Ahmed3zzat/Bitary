import Link from "next/link";
import Image from "next/image";
import BitaryText from "@/assets/BitaryText.svg";
export default function Home() {
  return (
    <div className="relative h-[calc(100vh-5rem)] bg-[url('@/assets/images/SplashScreen.jpg')] bg-cover bg-no-repeat bg-center flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="getStarted my-auto mb-4 rounded-2xl text-center">
        <div className="relative text-center p-4 rounded-lg">
          <h2 className="text-white text-3xl font-bold">Welcome to Bitary!</h2>
          <p className="text-white text-lg">
            While you sit and stay - we’ll go out and play!
          </p>
        </div>

        <Link href="/signup" className="flex justify-center">
          <button className="relative cursor-pointer z-10 bg-green-600 hover:bg-green-800 transition-all duration-200 text-white font-bold px-8 py-3 mt-6 rounded-full shadow-lg">
            Create Account →
          </button>
        </Link>
      </div>

      <div className="z-10 mt-auto mb-4 w-[90%] max-w-3xl rounded-2xl p-8 mx-3 backdrop-blur-sm bg-white/[20%] text-center shadow-lg relative">
        <Image
          src={BitaryText}
          alt="Bitary Logo"
          className="hidden md:block w-auto h-9 md:absolute top-7 left-7"
        />
        <div className="box-text flex justify-center gap-1.5 items-baseline ">
          <p className="text-black font-semibold text-lg">
            Already have an account?
          </p>
          <Link
            className="text-green-600 hover:text-green-800 transition-all duration-200 font-bold text-lg"
            href="/login"
          >
            Login
          </Link>
        </div>
        <p className="mt-4 text-gray-800 text-sm text-start">
          We provide fast and efficient veterinary services along with
          comprehensive animal healthcare. Our universal digital solution
          enables pet owners, caregivers, and organizations to book nurse
          appointments, schedule follow-ups, order medicines and supplies, and
          generate animal ID cards to track their pets effortlessly.
        </p>
      </div>
    </div>
  );
}
