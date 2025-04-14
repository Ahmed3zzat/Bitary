"use client";
import Image from "next/image";
import * as Yup from "yup";
import loginImage from "@/assets/images/SplashScreen.jpg";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
export default function ResetCode() {
  const router = useRouter();
  const validationSchema = Yup.object().shape({
    code: Yup.string().required("Code is required"),
  });

  const formik = useFormik({
    initialValues: { code: "" },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
      router.push("/resetpassword");
    },
  });

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-gradient-to-r from-green-400 to-green-700">
      <div className="lg:w-1/2 w-full flex flex-col items-center justify-center p-12 bg-white shadow-2xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-8">Reset Code</h3>
        <form
          className="w-full max-w-md space-y-5"
          onSubmit={formik.handleSubmit}
        >
          <label className="text-md text-gray-700 block mb-2 font-semibold">
            We sent you an email with the OTP! please enter it here.
          </label>
          <div className="relative">
            <input
              type="text"
              name="code"
              id="code"
              value={formik.values.code}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Verficaition Code"
              required
              className="w-full px-4 py-3 text-lg bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:bg-white text-black" // Add `text-black` class here
            />
            {formik.touched.code && formik.errors.code && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.code}</p>
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
            Verify
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
