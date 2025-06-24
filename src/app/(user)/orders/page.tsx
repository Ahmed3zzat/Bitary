"use client";
import { useState, useEffect } from "react";
import { FiArrowRight } from "react-icons/fi";
import Loading from "@/app/loading";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { AdminOrder, getAllOrders, updateOrderStatus } from "@/store/Features/user.slice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

// Add proper types for the Redux dispatch and thunk return types
type RootState = {
  user: {
    msg: string | null;
    token: string | null;
    user: string | null;
    isError: boolean;
    isLoading: boolean;
    isCorrect: boolean;
    idToast: string;
    emailExist: string;
  }; 
};

type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

type AdminOrdersResult = {
  payload?: {
    orders: AdminOrder[];
    pagination: {
      totalCount: number;
      pageSize: number;
      currentPage: number;
      totalPages: number;
      hasPrevious: boolean;
      hasNext: boolean;
    };
  };
  error?: unknown;
};

type UpdateStatusResult = {
  payload?: {
    orderId: string;
    status: number;
    response: unknown;
  };
  error?: unknown;
};

// Improved type definitions with proper naming
type OrderItem = {
  productId: number;
  productName: string;
  pictureUrl: string;
  quantity: number;
  price: number;
}

type Order = {
  id: string;
  userEmail: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    country: string;
  };
  orderItems: OrderItem[];
  orderDate: string;
  paymentStatus: string;
  deliveryMethod: string;
  subtotal: number;
  paymentIntentId: string;
  total: number;
  clientSecret: string | null;
  stripeStatus: string | null;
  isCashPayment: boolean;
  paymentMethod: string;
}

// Helper functions moved outside the component for better organization
const formatDate = (dateString: string) => {
  // Parse the date and add 1 hour
  const date = new Date(dateString);
  date.setHours(date.getHours() + 1);
  
  // Return a more compact date format
  return date.toLocaleString("en-US", {
    year: "2-digit",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "PaymentReceived": return "bg-green-100 text-green-800";
    case "Pending": return "bg-yellow-100 text-yellow-800";
    case "PaymentFailed": 
    case "Cancelled": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

// Format status strings by adding spaces before capital letters
const formatStatus = (status: string): string => {
  // Add a space before all capital letters and ensure first letter is capital
  const formatted = status.replace(/([A-Z])/g, ' $1').trim();
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

export default function Orders() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [adminOrders, setAdminOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Default page size
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Calculate pagination for regular orders
  const regularOrdersPages = Math.ceil(orders.length / pageSize);
  const paginatedRegularOrders = orders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    const checkUserRole = () => {
      const userRole = localStorage.getItem("userRole");
      setIsAdmin(userRole === "2"); // 2 is admin role
    };
    
    checkUserRole();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        if (isAdmin) {
          console.log(`Fetching admin orders: page ${currentPage}, size ${pageSize}`);
          // Fetch admin orders - API uses 1-indexed page numbers
          const result = await dispatch(getAllOrders({ 
            pageNumber: currentPage,  
            pageSize 
          })) as AdminOrdersResult;
          
          if (result.payload && result.payload.orders) {
            console.log(`Received ${result.payload.orders.length} admin orders`);
            console.log(`Pagination info:`, result.payload.pagination);
            
            setAdminOrders(result.payload.orders);
            setTotalPages(result.payload.pagination.totalPages);
            setTotalCount(result.payload.pagination.totalCount);
          } else {
            console.log('No payload or orders in admin API response');
          }
        } else {
          // Fetch regular user orders
          const response = await fetch("http://bitary.runasp.net/api/Orders", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch orders: ${response.status}`);
          }

          const data = await response.json();
          if (Array.isArray(data)) {
            const sortedOrders = data.sort((a: Order, b: Order) => 
              new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
            );
            setOrders(sortedOrders);
          } else {
            setOrders([]);
          }
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err instanceof Error ? err.message : "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    // Include currentPage in dependencies to re-fetch data when page changes
  }, [isAdmin, currentPage, pageSize, dispatch]);

  // Reset to first page if orders or pageSize changes (for regular users only)
  useEffect(() => {
    if (!isAdmin) {
      setCurrentPage(1);
    }
  }, [pageSize, isAdmin]);

  // Add debug info for admin orders
  useEffect(() => {
    console.log(`Current admin status - Page: ${currentPage}, Total Pages: ${totalPages}, Count: ${totalCount}`);
  }, [currentPage, totalPages, totalCount]);

  const handleViewDetails = (orderId: string) => {
    router.push(`/orders/${orderId}`);
  };

  // Handle page size change with logging
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    console.log(`Changing page size from ${pageSize} to ${newSize}`);
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleStatusUpdate = async (orderId: string, newStatus: number) => {
    try {
      console.log(`Updating order ${orderId} status to ${newStatus}`);
      await dispatch(updateOrderStatus({ orderId, status: newStatus })) as UpdateStatusResult;
      toast.success("Order status updated successfully");
      
      // Refresh the orders list with current page
      console.log(`Refreshing orders after status update - page: ${currentPage}`);
      const result = await dispatch(getAllOrders({ 
        pageNumber: currentPage, 
        pageSize 
      })) as AdminOrdersResult;
      
      if (result.payload && result.payload.orders) {
        setAdminOrders(result.payload.orders);
        console.log(`Updated order list received with ${result.payload.orders.length} orders`);
      }
    } catch (err) {
      toast.error("Failed to update order status");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="w-full">      <Loading/>
</div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="orders-page"
        initial={{ opacity: 0, x: "-100%" }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: "-100%" }}
        transition={{ 
          duration: 0.5, 
          ease: [0.22, 1, 0.36, 1] // Use a more fluid cubic-bezier curve
        }}
        className="min-h-screen bg-gray-50 py-4 px-2 sm:px-4 md:px-6 lg:px-8 w-full"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="bg-white rounded-lg md:rounded-xl shadow-sm overflow-hidden border border-gray-200"
          >
            <div className="bg-green-700 px-4 py-3 sm:px-6 sm:py-4 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h2 className="text-xl sm:text-2xl font-bold">{isAdmin ? 'All Orders (Admin)' : 'Order History'}</h2>
              <div className="flex items-center gap-2">
                <label htmlFor="pageSize" className="text-sm font-medium">Orders per page:</label>
                <select
                  id="pageSize"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  className="rounded border-gray-300 text-black text-sm px-2 py-1 bg-white"
                >
                  {[5, 10, 20, 50].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>

            {isAdmin ? (
              // Admin view of all orders
              <>
                {adminOrders.length > 0 ? (
                  <>
                    {/* Desktop view */}
                    <div className="overflow-x-auto">
                      <table className="w-full hidden lg:table">
                        <thead>
                          <tr className="bg-gray-100 text-gray-800 text-sm lg:text-base">
                            <th className="p-3 md:p-4 text-left font-medium">Order ID</th>
                            <th className="p-3 md:p-4 text-left font-medium">User</th>
                            <th className="p-3 md:p-4 text-left font-medium">Status</th>
                            <th className="p-3 md:p-4 text-left font-medium">Date</th>
                            <th className="p-3 md:p-4 text-left font-medium">Total</th>
                            <th className="p-3 md:p-4 text-left font-medium">Payment</th>
                            <th className="p-3 md:p-4 text-left font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {adminOrders.map((order, index) => (
                            <motion.tr 
                              key={order.id} 
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05, duration: 0.3 }}
                              className={`${index % 2 === 1 ? 'bg-gray-100 hover:bg-gray-200' : ''} hover:bg-gray-100 transition-colors`}
                            >
                              <td className="p-3 md:p-4 text-gray-800">{order.id.substring(0, 8)}</td>
                              <td className="p-3 md:p-4 text-gray-600">{order.userEmail}</td>
                              <td className="p-3 md:p-4">
                                <div className="flex items-center justify-between space-x-2">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                    {formatStatus(order.status)}
                                  </span>
                                  <select 
                                    onChange={(e) => handleStatusUpdate(order.id, parseInt(e.target.value))}
                                    className="text-xs border rounded px-2 py-1"
                                    defaultValue=""
                                  >
                                    <option value="" disabled>Update</option>
                                    <option value="0">Pending</option>
                                    <option value="1">Payment Received</option>
                                    <option value="2">Payment Failed</option>
                                  </select>
                                </div>
                              </td>
                              <td className="p-3 md:p-4 text-gray-600 text-xs">{formatDate(order.orderDate)}</td>
                              <td className="p-3 md:p-4 text-gray-800 font-medium">
                                {order.total.toFixed(2)} EGP
                              </td>
                              <td className="p-3 md:p-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  order.paymentMethod === "Cash" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                                }`}>
                                  {order.paymentMethod}
                                </span>
                              </td>
                              <td className="p-3 md:p-4">
                                <button
                                  onClick={() => handleViewDetails(order.id)}
                                  className="inline-flex items-center text-sm text-green-600 hover:text-green-700 font-medium group"
                                >
                                  <span>View Details</span>
                                  <FiArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </button>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Mobile view */}
                      <div className="lg:hidden">
                        {adminOrders.map((order, index) => (
                          <motion.div 
                            key={order.id} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                            className={`${index % 2 === 1 ? 'bg-gray-50' : ''} border-b border-gray-200 p-4 hover:bg-gray-100 transition-colors`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-medium text-gray-800">{order.id.substring(0, 8)}</span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {formatStatus(order.status)}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600 mb-2">{formatDate(order.orderDate)}</div>
                            <div className="flex justify-between items-center mb-2">
                              <select 
                                onChange={(e) => handleStatusUpdate(order.id, parseInt(e.target.value))}
                                className="text-xs border rounded px-2 py-1"
                                defaultValue=""
                              >
                                <option value="" disabled>Update Status</option>
                                <option value="0">Pending</option>
                                <option value="1">Payment Received</option>
                                <option value="2">Payment Failed</option>
                              </select>
                              <span className="font-medium text-gray-800">{order.total.toFixed(2)} EGP</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                order.paymentMethod === "Cash" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                              }`}>
                                {order.paymentMethod}
                              </span>
                              <button
                                onClick={() => handleViewDetails(order.id)}
                                className="inline-flex items-center text-sm text-green-600 hover:text-green-700 font-medium group"
                              >
                                <span>View Details</span>
                                <FiArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Admin Pagination controls with backend pagination */}
                    <div className="px-4 py-3 sm:px-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2">
                      <div className="hidden sm:block text-sm text-gray-700">
                        Showing <span className="font-medium">{adminOrders.length}</span> of <span className="font-medium">{totalCount}</span> orders
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const prevPage = Math.max(1, currentPage - 1);
                            console.log(`Moving to previous page: ${prevPage}`);
                            setCurrentPage(prevPage);
                          }}
                          disabled={currentPage <= 1}
                          className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50"
                        >
                          Previous
                        </button>
                        <span className="text-sm text-gray-700">
                          Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages || 1}</span>
                        </span>
                        <button
                          onClick={() => {
                            const nextPage = currentPage + 1;
                            console.log(`Moving to next page: ${nextPage}`);
                            setCurrentPage(nextPage);
                          }}
                          className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No orders found.
                  </div>
                )}
              </>
            ) : (
              // Regular user view (existing code)
              <>
                {orders.length > 0 ? (
                  <>
                    {/* Desktop view */}
                    <div className="overflow-x-auto">
                      <table className="w-full hidden lg:table">
                        <thead>
                          <tr className="bg-gray-100 text-gray-800 text-sm lg:text-base">
                            <th className="p-3 md:p-4 text-left font-medium">Order ID</th>
                            <th className="p-3 md:p-4 text-left font-medium">Status</th>
                            <th className="p-3 md:p-4 text-left font-medium">Date</th>
                            <th className="p-3 md:p-4 text-left font-medium">Total</th>
                            <th className="p-3 md:p-4 text-left font-medium">Items</th>
                            <th className="p-3 md:p-4 text-left font-medium">Payment</th>
                            <th className="p-3 md:p-4 text-left font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {paginatedRegularOrders.map((order, index) => (
                            <motion.tr 
                              key={order.id} 
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05, duration: 0.3 }}
                              className={`${index % 2 === 1 ? 'bg-gray-100 hover:bg-gray-200' : ''} hover:bg-gray-100 transition-colors`}
                            >
                              <td className="p-3 md:p-4 text-gray-800">{order.id.substring(0, 8)}</td>
                              <td className="p-3 md:p-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusColor(order.paymentStatus)}`}>
                                  {formatStatus(order.paymentStatus)}
                                </span>
                              </td>
                              <td className="p-3 md:p-4 text-gray-600 text-xs">{formatDate(order.orderDate)}</td>
                              <td className="p-3 md:p-4 text-gray-800 font-medium">
                                {order.total.toFixed(2)} EGP
                              </td>
                              <td className="p-3 md:p-4 text-gray-600">
                                {order.orderItems.length} {order.orderItems.length === 1 ? "item" : "items"}
                              </td>
                              <td className="p-3 md:p-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  order.isCashPayment ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                                }`}>
                                  {order.paymentMethod}
                                </span>
                              </td>
                              <td className="p-3 md:p-4">
                                <button
                                  onClick={() => handleViewDetails(order.id)}
                                  className="inline-flex items-center text-sm text-green-600 hover:text-green-700 font-medium group"
                                >
                                  <span>View Details</span>
                                  <FiArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </button>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Mobile view */}
                      <div className="lg:hidden">
                        {paginatedRegularOrders.map((order, index) => (
                          <motion.div 
                            key={order.id} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                            className={`${index % 2 === 1 ? 'bg-gray-50' : ''} border-b border-gray-200 p-4 hover:bg-gray-100 transition-colors`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-medium text-gray-800">{order.id.substring(0, 8)}</span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.paymentStatus)}`}>
                                {formatStatus(order.paymentStatus)}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600 mb-2">{formatDate(order.orderDate)}</div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-gray-600">{order.orderItems.length} {order.orderItems.length === 1 ? "item" : "items"}</span>
                              <span className="font-medium text-gray-800">{order.total.toFixed(2)} EGP</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                order.isCashPayment ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                              }`}>
                                {order.paymentMethod}
                              </span>
                              <button
                                onClick={() => handleViewDetails(order.id)}
                                className="inline-flex items-center text-sm text-green-600 hover:text-green-700 font-medium group"
                              >
                                <span>View Details</span>
                                <FiArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Regular user pagination controls */}
                    <div className="px-4 py-3 sm:px-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2">
                      <div className="hidden sm:block text-sm text-gray-700">
                        Showing <span className="font-medium">{orders.length}</span> orders
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setCurrentPage(Math.max(1, currentPage - 1));
                          }}
                          disabled={currentPage <= 1}
                          className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50"
                        >
                          Previous
                        </button>
                        <span className="text-sm text-gray-700">
                          Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{regularOrdersPages || 1}</span>
                        </span>
                        <button
                          onClick={() => {
                            setCurrentPage(Math.min(regularOrdersPages, currentPage + 1));
                          }}
                          disabled={currentPage >= regularOrdersPages}
                          className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No orders found.
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}