const orders = [
  {
    id: "#96459761",
    status: "In progress",
    date: "March 19, 2025 07:52",
    total: "250 EGP (5 Products)",
  },
  {
    id: "#71667167",
    status: "Completed",
    date: "March 19, 2025 23:26",
    total: "300 EGP (4 Products)",
  },
  {
    id: "#95214362",
    status: "Cancelled",
    date: "March 19, 2025 23:26",
    total: "500 EGP (2 Products)",
  },
];

export default function Orders() {
  return (
    <div className="flex-1 p-4 md:p-6">
      <div className="bg-white shadow-lg rounded-xl p-4 md:p-6 overflow-x-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 font-[Inter] text-gray-800">
          Order History
        </h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-300 text-gray-900 text-base md:text-lg">
              <th className="p-2 md:p-3 text-start">Order ID</th>
              <th className="p-2 md:p-3 text-start">Status</th>
              <th className="p-2 md:p-3 text-start">Date</th>
              <th className="p-2 md:p-3 text-start">Total</th>
              <th className="p-2 md:p-3 text-start">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr
                key={order.id}
                className={`${
                  index % 2 === 1 ? "bg-gray-100" : "bg-white"
                } hover:bg-gray-200 transition-all text-base md:text-lg`}
              >
                <td className="p-2 md:p-3">{order.id}</td>
                <td
                  className={`p-2 md:p-3 font-medium ${
                    order.status === "Completed"
                      ? "text-green-600"
                      : order.status === "Cancelled"
                      ? "text-red-500"
                      : "text-orange-500"
                  }`}
                >
                  {order.status.toUpperCase()}
                </td>
                <td className="p-2 md:p-3">{order.date}</td>
                <td className="p-2 md:p-3">{order.total}</td>
                <td className="p-2 md:p-3 text-blue-600 cursor-pointer hover:underline transition-all">
                  View Details
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
