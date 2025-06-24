"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { FiArrowLeft, FiClock, FiMail, FiMapPin, FiUser } from "react-icons/fi";
import Link from "next/link";
import Loading from "@/app/loading";
import { motion, AnimatePresence } from "framer-motion";

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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "PaymentReceived": return "bg-green-100 text-green-800";
    case "Pending": return "bg-yellow-100 text-yellow-800";
    case "Cancelled": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export default function OrderDetails() {
  const { orderId } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(`http://bitary.runasp.net/api/Orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch order details: ${response.status}`);
        }

        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleBackToOrders = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsNavigatingBack(true);
    setTimeout(() => {
      router.push("/orders");
    }, 500);
  };

  if (loading) {
    return <div className="w-full"><Loading /></div>;
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">Error: {error || "Order not found"}</div>
      </div>
    );
  }

  const shippingCost = order.total - order.subtotal;

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key="order-details-page"
        initial={{ opacity: 0, x: "100%" }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: "100%" }}
        transition={{ 
          duration: 0.5, 
          ease: [0.22, 1, 0.36, 1] // Consistent easing with orders page
        }}
        className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 w-full"
      >
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <button 
              onClick={handleBackToOrders}
              className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
            >
              <FiArrowLeft className="mr-2" />
              Back to Orders
            </button>
          </div>

          {/* Main Content */}
          <motion.div 
            animate={{ opacity: isNavigatingBack ? 0.5 : 1, scale: isNavigatingBack ? 0.98 : 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Header */}
            <div className="border-b border-gray-200 bg-white px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-xl font-semibold text-gray-900">
                  Order #{order.id.substring(0, 8)}
                </h1>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            {/* Order Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
              {/* Customer & Order Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Order Date</h3>
                  <div className="mt-1 flex items-center text-sm text-gray-900">
                    <FiClock className="mr-2 h-4 w-4 text-gray-400" />
                    {formatDate(order.orderDate)}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Customer</h3>
                  <div className="mt-1 flex items-center text-sm text-gray-900">
                    <FiUser className="mr-2 h-4 w-4 text-gray-400" />
                    {order.shippingAddress.name}
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-600">
                    <FiMail className="mr-2 h-4 w-4 text-gray-400" />
                    {order.userEmail}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Shipping Address</h3>
                  <div className="mt-1 flex items-start text-sm text-gray-900">
                    <FiMapPin className="mr-2 h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      {order.shippingAddress.street}<br />
                      {order.shippingAddress.city}<br />
                      {order.shippingAddress.country}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Payment Method</h3>
                  <p className="mt-1 text-sm text-gray-900">{order.paymentMethod}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Delivery Method</h3>
                  <p className="mt-1 text-sm text-gray-900">{order.deliveryMethod}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="border-t border-gray-200">
              <div className="px-6 py-4 bg-gray-50">
                <h2 className="text-lg font-medium text-gray-900">Order Items</h2>
              </div>
              <ul className="divide-y divide-gray-200">
                {order.orderItems.map((item) => (
                  <li key={item.productId} className="px-6 py-4 flex items-center">
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden relative">
                      <Image
                        src={item.pictureUrl}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            <Link href={`/shop/${item.productId}`} className="hover:text-green-600">
                              {item.productName}
                            </Link>
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {(item.price * item.quantity).toFixed(2)} EGP
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Order Summary */}
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <p>Subtotal</p>
                <p>{order.subtotal.toFixed(2)} EGP</p>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-4">
                <p>Shipping</p>
                <p>{shippingCost.toFixed(2)} EGP</p>
              </div>
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Total</p>
                <p>{order.total.toFixed(2)} EGP</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}