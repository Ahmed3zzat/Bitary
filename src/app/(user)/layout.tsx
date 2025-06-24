"use client";
import { useAppDispatch } from "@/hooks/store.hook";
import { logout } from "@/store/Features/user.slice";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { MdHistory, MdRateReview } from "react-icons/md";
export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname().slice(1);
  const [activeTab, setActiveTab] = useState(pathname);
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  function logoutFunc() {
    localStorage.removeItem("token");
    localStorage.removeItem("basketId");
    localStorage.removeItem("email");
    localStorage.removeItem("userRole");
    dispatch(logout());
    router.push("/welcome");
  }

  return (
    <div className="flex flex-col md:flex-row bg-gradient-to-r from-green-100 to-green-200 font-[Inter] min-h-[calc(100vh-4.5rem)]">
      <aside className="w-full md:w-72 bg-white shadow-lg p-4 rounded-lg shrink-0">
        <nav className="space-y-4">
          <Link
            className={`font-[Fredoka] flex items-center gap-2 p-3 rounded-md w-full cursor-pointer transition-all ${
              activeTab == "profile"
                ? "bg-[#5ABC58] text-white hover:bg-green-700"
                : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
            href={"/profile"}
            onClick={() => setActiveTab("profile")}
          >
            <IoPerson className="text-xl" />
            <span className="text-lg">Profile</span>
          </Link>

          <Link
            className={`font-[Fredoka] flex items-center gap-2 p-3 rounded-md w-full cursor-pointer transition-all ${
              activeTab == "orders"
                ? "bg-[#5ABC58] text-white hover:bg-green-700"
                : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
            href={"/orders"}
            onClick={() => setActiveTab("orders")}
          >
            <MdHistory className="text-xl" />{" "}
            <span className="text-lg">Orders</span>
          </Link>
          {localStorage.getItem("userRole") == "0" && (
          <Link
            className={`font-[Fredoka] flex items-center gap-2 p-3 rounded-md w-full cursor-pointer transition-all ${
              activeTab == "reviews"
                ? "bg-[#5ABC58] text-white hover:bg-green-700"
                : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
            href={"/reviews"}
            onClick={() => setActiveTab("reviews")}
          >
            <MdRateReview className="text-xl" />{" "}
            <span className="text-lg">Reviews</span>
          </Link>)}
          <button
            className={`flex items-center gap-2 p-3 rounded-md text-gray-700 hover:bg-red-200 w-full cursor-pointer transition-all`}
            onClick={logoutFunc}
          >
            <FaSignOutAlt className="text-xl" />{" "}
            <span className="text-lg">Logout</span>
          </button>
        </nav>
      </aside>
      {children}
    </div>
  );
}
