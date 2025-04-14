import { Formik, Form, Field } from "formik";

export default function SearchBar({ onSearch }: { onSearch: (value: string) => void }) {
  return (
    <div className="bg-[#F7F7F7]">
      <div className="flex flex-col items-center pt-5">
        <Formik
          initialValues={{ search: "" }}
          onSubmit={(values) => {
            onSearch(values.search);
          }}
        >
          {() => (
            <Form className="lg:w-1/2 w-2/3 drop-shadow-xl font-[Poppins] relative">
              <label
                htmlFor="search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only"
              >
                Search
              </label>
              <div className="relative">
                <button
                  type="submit"
                  className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 hover:text-green-600 transition-all transition-duration-300 cursor-pointer"
                >
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </button>
                <Field
                  type="search"
                  name="search"
                  id="search"
                  placeholder="Search keywords..."
                  className="block w-full p-3 pl-10 text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 text-gray-900 bg-white font-medium"
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
