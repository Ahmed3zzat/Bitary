"use client";
import Image from "next/image";
import { useState } from "react";
import DogFood from "@/assets/DogFood.svg";
import DogHealth from "@/assets/DogHealth.svg";
import DogLeash from "@/assets/DogLeash.svg";
import CatFood from "@/assets/CatFood.svg";

const categories = [
  { id: "dog food", name: "Dog Food", icon: DogFood },
  { id: "cat food", name: "Cat Food", icon: CatFood },
  { id: "medicine", name: "Medicine", icon: DogHealth },
  { id: "toys", name: "Toys", icon: DogLeash },
];

export default function Categories({
  setSelectedCategory,
}: {
  setSelectedCategory: (category: string | null) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex gap-12 text-[Poppins] mt-3">
      {categories.map(({ id, name, icon }) => (
        <div key={id} className="flex flex-col items-center">
          <button
            className={`flex flex-col items-center justify-center h-14 w-14 lg:h-20 lg:w-20 rounded-2xl shadow-md transition-all
              ${
                selected === id
                  ? "bg-[#5CB15A] text-white"
                  : "bg-gray-200 text-gray-700 drop-shadow-2xl"
              }
            `}
            onClick={() => {
              const newSelected = selected === id ? null : id;
              setSelected(newSelected);
              setSelectedCategory(newSelected);
            }}
          >
            <div className="relative w-10 h-10 lg:w-12 lg:h-12">
              <Image src={icon} alt={name} fill className="object-contain" />
            </div>
          </button>
          <span className="mt-2 text-gray-600 font-normal text-xs lg:text-sm">{name}</span>
        </div>
      ))}
    </div>
  );
}
