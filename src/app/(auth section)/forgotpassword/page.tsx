"use client";
import Image from "next/image";
import * as Yup from "yup";
import loginImage from "@/assets/images/SplashScreen.jpg";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/store.hook";
import { setSendPassword } from "@/store/Features/user.slice";

export default function ForgetPassword() {
  const dispatch = useAppDispatch()
  const router = useRouter();
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema,
    onSubmit: async(values) => {
      try {
        await dispatch(setSendPassword(values)).unwrap()
        router.push("/resetpassword");
      } catch (error) {
        
      }
    },
  });

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-gradient-to-r from-green-400 to-green-700">
      <div className="lg:w-1/2 w-full flex flex-col items-center justify-center bg-white shadow-2xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-8">
          Forgot Your Password?
        </h3>
        <form
          className="w-full max-w-md space-y-5"
          onSubmit={formik.handleSubmit}
        >
          <label className="text-md text-gray-700 mb-2 block font-semibold">
            Please Enter your Email
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              id="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Email"
              required
              className="w-full px-4 py-3 text-lg bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:bg-white text-black" // Add `text-black` class here
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!formik.isValid || !formik.dirty}
            className={`cursor-pointer w-full bg-green-600 text-white py-4 rounded-xl text-lg font-semibold shadow-lg transition duration-300 ${
              !formik.isValid || !formik.dirty
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-green-700"
            }`}
          >
            Send Code
          </button>
        </form>
      </div>

      <div className="hidden lg:flex w-1/2 relative items-center justify-center">
        <Image
          priority
          src={loginImage}
          alt="Login Background"
          className="w-full h-full object-cover brightness-75 shadow-xl"
        />
      </div>
    </div>
  );
}
