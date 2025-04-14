"use client";
import { useFormik } from "formik";
import Link from "next/link";
import Image from "next/image";
import * as Yup from "yup";
import loginImage from "@/assets/images/doctorimg.jpg";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import BitaryText from "@/assets/BitaryText.svg";
// import { FcGoogle } from "react-icons/fc";
// import { FaFacebookF } from "react-icons/fa";
// import { BsTwitterX } from "react-icons/bs";
import { useAppDispatch } from "@/hooks/store.hook";
import { setSignup } from "@/store/Features/user.slice";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleRePasswordVisibility = () => setShowRePassword(!showRePassword);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
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
    rePassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password")], "Passwords must match"),
    userName: Yup.string().required("Username is required"),
    phoneNumber: Yup.string()
      .matches(/^\d{10,15}$/, "Phone number is not valid")
      .required("Phone number is required"),
    gender: Yup.number().required("Gender is required"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      rePassword: "",
      userName: "",
      phoneNumber: "",
      gender: 0,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(setSignup(values)).unwrap();
        router.push("/home");
      } catch (error) {
        console.error(error); // Log the error for debugging
      }
    },
  });

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-green-500 to-green-700">
      {/* Form Container */}
      <div className="lg:w-1/2 w-full flex flex-col items-center justify-center p-6 sm:p-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          {/* Logo and Header */}
          <div className="text-center">
            <Image
              src={BitaryText}
              alt="Bitary Logo"
              className="w-auto h-14 mx-auto"
              priority
            />
            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Create your account
            </h1>
            {/* <p className="mt-2 text-gray-600">
              ahmed Bitary to access premium veterinary services
            </p> */}
          </div>

          {/* Social Media Signup */}
          {/* <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                className="p-3 rounded-full shadow-md border border-gray-300 hover:bg-gray-50 transition duration-300"
                aria-label="Sign up with Google"
              >
                <FcGoogle className="w-5 h-5" />
              </button>
              <button
                className="p-3 rounded-full shadow-md border border-gray-300 hover:bg-gray-50 transition duration-300 text-blue-600"
                aria-label="Sign up with Facebook"
              >
                <FaFacebookF className="w-5 h-5" />
              </button>
              <button
                className="p-3 rounded-full shadow-md border border-gray-300 hover:bg-gray-50 transition duration-300"
                aria-label="Sign up with Twitter"
              >
                <BsTwitterX className="w-5 h-5" />
              </button>
            </div>
          </div> */}

          {/* Signup Form */}
          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="ahmed"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.firstName}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Bitary"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="bitary@example.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="userName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  id="userName"
                  name="userName"
                  type="text"
                  placeholder="ahmedbitary11"
                  value={formik.values.userName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {formik.touched.userName && formik.errors.userName && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.userName}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formik.values.gender}
                  onChange={(e) =>
                    formik.setFieldValue("gender", parseInt(e.target.value))
                  }
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value={0} disabled>
                    Select Gender
                  </option>
                  <option value={1}>Male</option>
                  <option value={2}>Female</option>
                </select>
                {formik.touched.gender && formik.errors.gender && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.gender}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="011216740545"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.phoneNumber}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2 pr-10 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label
                htmlFor="rePassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="rePassword"
                  type={showRePassword ? "text" : "password"}
                  name="rePassword"
                  placeholder="••••••••"
                  value={formik.values.rePassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2 pr-10 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={toggleRePasswordVisibility}
                  aria-label={
                    showRePassword ? "Hide password" : "Show password"
                  }
                >
                  {showRePassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
              {formik.touched.rePassword && formik.errors.rePassword && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.rePassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!formik.isValid || !formik.dirty}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium text-lg shadow-sm transition-colors ${
                !formik.isValid || !formik.dirty
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              Create Account
            </button>
          </form>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-green-600 hover:text-green-500 hover:underline"
            >
              Sign in
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
            Welcome to Bitary
          </h2>
          <p className="text-gray-200 leading-relaxed">
            We provide fast and efficient veterinary services along with
            comprehensive animal healthcare. Our universal digital solution
            enables pet owners, caregivers, and organizations to book
            appointments, schedule follow-ups, order medicines, and track their
            pets effortlessly.
          </p>
        </div>
      </div>
    </div>
  );
}
