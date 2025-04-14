"use client";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import {
  FiEdit2,
  FiCheck,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLock,
} from "react-icons/fi";

// Define all types first
type ProfileData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  password?: string;
};

type EditableFields = "firstName" | "lastName" | "address";
type ReadonlyFields = "email" | "phoneNumber" | "password";
type AllFields = EditableFields | ReadonlyFields;

type ProfileFormValues = Pick<ProfileData, EditableFields>;

const profileData: ProfileData = {
  firstName: "John",
  lastName: "Doe",
  email: "example@gmail.com",
  phoneNumber: "0123456789",
  address: "1234 Main St, New York, NY 10030",
};

export default function Profile() {
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    address: Yup.string().required("Address is required"),
  });

  const formik = useFormik<ProfileFormValues>({
    initialValues: {
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      address: profileData.address,
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
      toast.success("Profile updated successfully!", {
        position: "top-center",
        style: {
          background: "#4BB543",
          color: "#fff",
          fontWeight: 500,
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#4BB543",
        },
      });
    },
  });

  const getFieldIcon = (field: AllFields) => {
    switch (field) {
      case "firstName":
      case "lastName":
        return <FiUser className="text-gray-500" />;
      case "email":
        return <FiMail className="text-gray-500" />;
      case "phoneNumber":
        return <FiPhone className="text-gray-500" />;
      case "address":
        return <FiMapPin className="text-gray-500" />;
      case "password":
        return <FiLock className="text-gray-500" />;
      default:
        return <FiUser className="text-gray-500" />;
    }
  };

  const getFieldValue = (field: ReadonlyFields) => {
    return profileData[field] || "";
  };

  const renderEditableField = (field: EditableFields) => (
    <div key={field} className="relative">
      <label
        htmlFor={field}
        className="block text-sm font-medium text-gray-700 mb-1 capitalize"
      >
        {field.replace(/([A-Z])/g, " $1")}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {getFieldIcon(field)}
        </div>
        <input
          type="text"
          id={field}
          name={field}
          className={`pl-10 bg-gray-50 border ${
            formik.touched[field] && formik.errors[field]
              ? "border-red-300"
              : "border-gray-300"
          } text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 transition duration-200`}
          value={formik.values[field]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </div>
      {formik.touched[field] && formik.errors[field] && (
        <p className="mt-1 text-xs text-red-600 animate-fadeIn">
          {formik.errors[field]}
        </p>
      )}
    </div>
  );

  const renderReadonlyField = (field: ReadonlyFields) => (
    <div key={field} className="relative w-full">
      <label
        htmlFor={field}
        className="block text-sm font-medium text-gray-700 mb-1 capitalize"
      >
        {field === "phoneNumber"
          ? "Phone Number"
          : field === "email"
          ? "Email Address"
          : "Password"}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {getFieldIcon(field)}
        </div>
        <input
          type={field === "email" ? "email" : field === "password" ? "password" : "tel"}
          id={field}
          autoComplete={field === "email" ? "username" : undefined}
          className="pl-10 bg-gray-100 border border-gray-300 text-gray-500 text-sm rounded-lg block w-full p-2.5 cursor-not-allowed"
          value={getFieldValue(field)}
          placeholder={field === "password" ? "••••••••" : ""}
          readOnly
          disabled
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <FiCheck className="text-green-500" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-[Inter] bg-gradient-to-br from-green-50 to-green-100 flex justify-center p-4 w-full">
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden w-full max-w-4xl">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-Inter">Profile Settings</h2>
              <p className="text-green-100">Manage your personal information</p>
            </div>
            <div className="bg-white/20 p-2 rounded-full">
              <FiUser className="text-xl" />
            </div>
          </div>
        </div>

        {/* Profile form */}
        <div className="p-6 md:p-8">
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {(["firstName", "lastName"] as EditableFields[]).map(renderEditableField)}
            </div>

            {renderEditableField("address")}

            {(["email", "phoneNumber"] as ReadonlyFields[]).map(renderReadonlyField)}

            {/* Password field with change button */}
            <div className="relative w-full">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-500" />
                </div>
                <input
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  className="pl-10 bg-gray-100 border border-gray-300 text-gray-500 text-sm rounded-lg block w-full p-2.5 cursor-not-allowed"
                  placeholder="••••••••"
                  disabled
                  readOnly
                />
                <button
                  type="button"
                  onClick={() => router.push("/changepassword")}
                  className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center text-green-600 hover:text-green-800 transition-colors duration-200 text-sm font-medium"
                >
                  <FiEdit2 className="mr-1" /> Change
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={!formik.isValid || !formik.dirty}
                className={`w-full py-3 px-6 rounded-xl text-lg font-semibold shadow-sm transition-all duration-300 flex items-center justify-center cursor-pointer ${
                  !formik.isValid || !formik.dirty
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:shadow-md"
                }`}
              >
                <FiCheck className="mr-2 " />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}