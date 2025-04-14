"use client"; 
import { useAppSelector } from "@/hooks/store.hook";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token } = useAppSelector((store) => store.userSlice);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/welcome"); // إعادة التوجيه إلى صفحة تسجيل الدخول
    }
  }, [token, router]);

  return children;

}
