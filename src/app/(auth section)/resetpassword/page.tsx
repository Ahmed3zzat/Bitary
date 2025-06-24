"use client";
import Image from "next/image";
import * as Yup from "yup";
import loginImage from "@/assets/images/SplashScreen.jpg";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useAppDispatch } from "@/hooks/store.hook";
import { setResetPassword } from "@/store/Features/user.slice";

export default function ResetPassword() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    token: Yup.string().required("Verification Token is required"),
    newPassword: Yup.string()
      .required("newPassword is required")
      .min(8, "newPassword must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Must include uppercase, lowercase, number, and special character"
      ),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      token: "",
      newPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        await dispatch(setResetPassword(values)).unwrap();
        // Simulate API call
        console.log(values);
        // router.push("/login");
      } catch (error) {
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-green-500 to-green-700">
      {/* Left Panel - Form */}
      <div className="lg:w-1/2 w-full flex flex-col items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-6">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="flex items-center text-green-600 hover:text-green-800 transition-colors mb-4"
          >
            <ArrowLeft size={18} className="mr-1" />
            Back
          </button>

          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">Reset Password</h1>
            <p className="mt-2 text-gray-600">
              Enter your email, verification Token, and new password
            </p>
          </div>

          <form className="space-y-5" onSubmit={formik.handleSubmit}>
            {/* Email Field */}
            <div className="space-y-2">
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
                placeholder="your@email.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-green-200 focus:border-green-500"
                }`}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>

            {/* Token Field */}
            <div className="space-y-2">
              <label
                htmlFor="token"
                className="block text-sm font-medium text-gray-700"
              >
                Verification Token
              </label>
              <div className="flex space-x-2">
                <input
                  id="token"
                  name="token"
                  type="text"
                  placeholder="CfDJ8B2eb45f/ulMujQOG02y4gVwX+Rb5m5kpW+n...."
                  value={formik.values.token}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                    formik.touched.token && formik.errors.token
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-green-200 focus:border-green-500"
                  }`}
                />
              </div>
              {formik.touched.token && formik.errors.token && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.token}
                </p>
              )}
            </div>

            {/* newPassword Field */}
            <div className="space-y-2">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="Enter new newPassword"
                  value={formik.values.newPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                    formik.touched.newPassword && formik.errors.newPassword
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-green-200 focus:border-green-500"
                  }`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formik.touched.newPassword && formik.errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.newPassword}
                </p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Password must contain:
              </p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li
                  className={`flex items-center ${
                    formik.values.newPassword.length >= 8
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {formik.values.newPassword.length >= 8 ? "✓" : "•"} At least 8
                  characters
                </li>
                <li
                  className={`flex items-center ${
                    /[A-Z]/.test(formik.values.newPassword)
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {/[A-Z]/.test(formik.values.newPassword) ? "✓" : "•"} One
                  uppercase letter
                </li>
                <li
                  className={`flex items-center ${
                    /[a-z]/.test(formik.values.newPassword)
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {/[a-z]/.test(formik.values.newPassword) ? "✓" : "•"} One
                  lowercase letter
                </li>
                <li
                  className={`flex items-center ${
                    /\d/.test(formik.values.newPassword) ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {/\d/.test(formik.values.newPassword) ? "✓" : "•"} One number
                </li>
                <li
                  className={`flex items-center ${
                    /[@$!%*?&]/.test(formik.values.newPassword)
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {/[@$!%*?&]/.test(formik.values.newPassword) ? "✓" : "•"} One
                  special character (@$!%*?&)
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!formik.isValid || !formik.dirty || isSubmitting}
              className={`w-full py-3 px-4 rounded-lg text-white font-semibold shadow-md transition-all ${
                !formik.isValid || !formik.dirty
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              } flex items-center justify-center`}
            >
              {isSubmitting ? (
                <>
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
                  Processing...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="text-center text-sm text-gray-600">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-green-600 hover:text-green-800 font-medium"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Right Panel - Image */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center bg-green-800">
        <Image
          priority
          src={loginImage}
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-10 left-10 right-10 text-white z-20 p-5 rounded-2xl bg-black/60">
          <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
          <p className="text-green-100">
            Secure your account with a new strong password to protect your data
            and privacy.
          </p>
        </div>
      </div>
    </div>
  );
}
