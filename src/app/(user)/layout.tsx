"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { MdHistory } from "react-icons/md";
export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname().slice(1);
  const [activeTab, setActiveTab] = useState(pathname);
  return (
    <div className="flex flex-col md:flex-row bg-gradient-to-r from-green-100 to-green-300 font-[Fredoka] min-h-[600px]">
      <aside className="w-full md:w-72 bg-white shadow-lg p-4 rounded-lg shrink-0">
        <nav className="space-y-4">
          <Link
            className={`flex items-center gap-2 p-3 rounded-md w-full cursor-pointer transition-all ${
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
            className={`flex items-center gap-2 p-3 rounded-md w-full cursor-pointer transition-all ${
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
          <button
            className={`flex items-center gap-2 p-3 rounded-md text-gray-700 hover:bg-red-200 w-full cursor-pointer transition-all`}
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
