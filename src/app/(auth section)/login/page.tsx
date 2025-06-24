"use client";
import { useFormik } from "formik";
import Link from "next/link";
import Image from "next/image";
import * as Yup from "yup";
import loginImage from "@/assets/images/SplashScreen.jpg";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import BitaryText from "@/assets/BitaryText.svg";
import { useAppDispatch } from "@/hooks/store.hook";
import { setLogin } from "@/store/Features/user.slice";
import { createCart, getCartById } from "@/store/Features/user.cart";
import { store } from "@/store/store";

export default function Login() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);


   
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Must include uppercase, lowercase, number, and special character"
      ),
  });


  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(setLogin(values)).unwrap();
        localStorage.setItem("email", values.email);
        const data = await dispatch(getCartById());

        if (
          data.payload == undefined &&
          store.getState().userCartSlice.checkBasketExist == false
        ) {
          dispatch(createCart());
        }
        localStorage.setItem("email", values.email);
        if(
        localStorage.getItem("userRole")=="2"){
          router.push("/shop");
        }else{

          router.push("/home");
        }

      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <div className="min-h-[calc(100vh-5rem)] flex bg-gradient-to-r from-green-500 to-green-700">
      {/* Form Container */}
      <div className="lg:w-1/2 w-full flex flex-col items-center justify-center p-6 sm:p-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Header */}
          <div className="text-center">
            <Image
              src={BitaryText}
              alt="Bitary Logo"
              className="w-auto h-16 mx-auto"
              priority
            />
            <h1 className="mt-8 text-3xl font-bold text-gray-900">
              Welcome back
            </h1>
            <p className="mt-2 text-gray-600">Sign in to your Bitary account</p>
          </div>


          {/* Login Form */}
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your email"
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <Link
                  href="/forgotpassword"
                  className="text-sm font-medium text-green-600 hover:text-green-500 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-10 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!formik.isValid || !formik.dirty}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium text-lg shadow-sm transition-colors ${
                !formik.isValid || !formik.dirty
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 cursor-pointer"
              }`}
            >
              Sign in
            </button>
          </form>

          <div className="text-center text-sm text-gray-600">
            Don{"`"}t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-green-600 hover:text-green-500 hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Background Image & Info */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center">
        <Image
          priority
          src={loginImage}
          alt="Login Background"
          className="w-full h-full object-cover brightness-75 shadow-xl"
        />
        <div className="absolute bottom-10 left-10 right-10 bg-black/60 backdrop-blur-sm p-8 rounded-xl shadow-lg max-w-lg">
          <h2 className="text-3xl font-bold text-white mb-4">
            Bitary Veterinary Services
          </h2>
          <p className="text-gray-200 leading-relaxed">
            We provide fast and efficient veterinary services along with
            comprehensive animal healthcare. Our universal digital solution
            enables pet owners to book appointments, schedule follow-ups, order
            medicines, and track their pets{"`"} health effortlessly.
          </p>
        </div>
      </div>
    </div>
  );
}
