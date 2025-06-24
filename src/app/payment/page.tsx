"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/hooks/store.hook";
import { delteCart, getCartById } from "@/store/Features/user.cart";
import { FiArrowLeft, FiCreditCard, FiDollarSign, FiCheck } from "react-icons/fi";
import { motion } from "framer-motion";
import Link from "next/link";
import { fetchUserData } from "@/store/Features/profile.slice";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { StripeElementsOptions, Appearance } from '@stripe/stripe-js';
import Loading from "../loading";

interface DeliveryMethod {
  id: number;
  shortName: string;
  description: string;
  deliveryTime: string;
  price: number;
}

// Initialize Stripe
const stripePromise = loadStripe('pk_test_51R3Mc8FVyNuwRcDeZjNYDpwDxjqebf4Nl5TYkRY9lcKrYhwbKOxLWj1zgX5k90QIZ0x45fKERCWKNHuS4MuCfHbd00J0Mm7oX5');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
        confirmParams: {
          return_url: `${window.location.origin}/orders`,
        },
      });

      if (error) {
        throw error;
      } else {
        await dispatch(delteCart());
        router.push("/orders");
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An error occurred during payment');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className={`mt-4 w-full py-3 rounded-lg font-medium text-white transition-all ${
          !stripe || isProcessing 
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
            Processing...
          </div>
        ) : (
          'Complete Payment'
        )}
      </button>
    </form>
  );
};

export default function PaymentForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items: basketItems, id: basketId } = useAppSelector((state) => state.userCartSlice);
  const { user } = useAppSelector((state) => state.profileSlice);
  const [loading, setLoading] = useState(true);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    street: "",
    city: "",
    country: "",
  });
  const [activeSection, setActiveSection] = useState<'delivery' | 'shipping'>('delivery');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isStripeReady, setIsStripeReady] = useState(false);

  useEffect(() => {
    const initializePayment = async () => {
      try {
        if (!basketId) {
          router.push('/cart');
          return;
        }
        await dispatch(getCartById());
        await dispatch(fetchUserData());
        setLoading(false);
      } catch (error) {
        console.error('Error initializing payment:', error);
        router.push('/cart');
      }
    };

    initializePayment();
  }, [dispatch, router, basketId]);

  // Pre-fill form data when user data is available
  useEffect(() => {
    if (user?.address) {
      setFormData({
        name: user.address.name || "",
        street: user.address.street || "",
        city: user.address.city || "",
        country: user.address.country || "",
      });
    }
  }, [user]);

  const deliveryMethods: DeliveryMethod[] = [
    { 
      id: 1, 
      shortName: 'Express', 
      description: 'Fastest delivery time', 
      deliveryTime: '1-2 Days',
      price: 10.000 
    },
    { 
      id: 2, 
      shortName: 'Standard', 
      description: 'Get it within 5 days', 
      deliveryTime: '2-5 Days',
      price: 5.000 
    },
    { 
      id: 3, 
      shortName: 'Economy', 
      description: 'Slower but cheap', 
      deliveryTime: '5-10 Days',
      price: 2.000 
    },
    { 
      id: 4, 
      shortName: 'FREE', 
      description: 'Free shipping', 
      deliveryTime: '1-2 Weeks',
      price: 0.000 
    }
  ];

  const totalItems = basketItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const calculateTotal = (): number => {
    if (!basketItems) return 0;
    const itemsTotal = basketItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryPrice = selectedDeliveryMethod ? 
      deliveryMethods.find(m => m.id === selectedDeliveryMethod)?.price || 0 : 0;
    return itemsTotal + deliveryPrice;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  async function handlePayment(paymentType: 'cash' | 'card') {
    try {
      setProcessingPayment(true);
      if (!basketItems || basketItems.length === 0) {
        throw new Error('No items in basket');
      }

      if (!selectedDeliveryMethod) {
        throw new Error('Please select a delivery method');
      }

      if (!basketId) {
        throw new Error('No basket ID found');
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error('No authentication token found');
      }

      const orderData = {
        basketId,
        shippingAddress: {
          name: formData.name,
          street: formData.street,
          city: formData.city,
          country: formData.country
        },
        deliveryMethodId: selectedDeliveryMethod,
        paymentType
      };

      // Create the order
      const orderResponse = await fetch('http://bitary.runasp.net/api/Orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (!orderResponse.ok) throw new Error('Order creation failed');

      const orderResult = await orderResponse.json();
      const orderId = orderResult.id;

      if (paymentType === 'cash') {
        const cashPaymentResponse = await fetch(`http://bitary.runasp.net/api/Payments/cash/${orderId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!cashPaymentResponse.ok) throw new Error('Cash payment confirmation failed');
        const cashResult = await cashPaymentResponse.json();
        console.log('Cash Payment API Response:', cashResult);
        
        await dispatch(delteCart());
        router.push("/orders");
      } else if (paymentType === 'card') {
        // Get Stripe payment intent
        const stripeResponse = await fetch(`http://bitary.runasp.net/api/Payments/stripe/${orderId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!stripeResponse.ok) throw new Error('Failed to create Stripe payment');
        
        const stripeData = await stripeResponse.json();
        console.log('Stripe Payment API Response:', stripeData);
        
        setClientSecret(stripeData.clientSecret);
        setIsStripeReady(true);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Payment failed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  }

  // Render Stripe Elements when ready
  const renderStripeElements = () => {
    if (!clientSecret || !isStripeReady) return null;

    const appearance: Appearance = {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#16a34a',
      },
    };

    const options: StripeElementsOptions = {
      clientSecret,
      appearance,
    };

    return (
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm />
      </Elements>
    );
  };

  if (loading) {
    return (
      <Loading />
    );
  }

  if (!basketItems || basketItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto bg-white rounded-2xl shadow-sm p-8">
          <p className="text-lg text-gray-600 mb-6">Your cart is empty. Please add items before proceeding to payment.</p>
          <Link 
            href="/shop"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-all"
          >
            <FiArrowLeft className="mr-2" /> Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with Progress Indicator */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Complete Your Order</h1>
          <div className="flex items-center justify-center gap-2">
            <div 
              className={`flex flex-col items-center cursor-pointer ${activeSection === 'delivery' ? 'text-green-600' : 'text-gray-400'}`}
              onClick={() => setActiveSection('delivery')}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${activeSection === 'delivery' ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100'}`}>
                <span className="font-medium">1</span>
              </div>
              <span className="text-sm font-medium">Delivery</span>
            </div>
            <div className="h-px w-16 bg-gray-300 mx-2"></div>
            <div 
              className={`flex flex-col items-center cursor-pointer ${activeSection === 'shipping' ? 'text-green-600' : 'text-gray-400'}`}
              onClick={() => setActiveSection('shipping')}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${activeSection === 'shipping' ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100'}`}>
                <span className="font-medium">2</span>
              </div>
              <span className="text-sm font-medium">Shipping</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Order Summary - Shows first on mobile */}
          <div className="col-span-12 lg:col-span-5 order-1 lg:order-2">
            <div className="sticky top-8 space-y-6">
              {/* Order Items */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {basketItems.map((item) => (
                    <div 
                      key={item.id}
                      className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0"
                    >
                      <div className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100`}>
                        <Image 
                          src={item.pictureUrl} 
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-800 text-md">{item.productName}</h3>
                        <div className="flex items-center justify-between mt-1">
                          <p className="font-medium text-green-600 text-md">{item.price.toFixed(2)} EGP × {item.quantity}</p>
                          <p className="font-medium text-gray-700 text-md">{(item.price * item.quantity).toFixed(2)} EGP</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Summary */}
                <div className="border-t border-gray-100 mt-4 pt-4 space-y-3">
                  <div className="flex justify-between text-md text-gray-600">
                    <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                    <span>{basketItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)} EGP</span>
                  </div>
                  <div className="flex justify-between text-md text-gray-600">
                    <span>Delivery</span>
                    <span>
                      {selectedDeliveryMethod ? 
                        `${deliveryMethods.find(m => m.id === selectedDeliveryMethod)?.price.toFixed(3)} EGP` : 
                        'Not selected'
                      }
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-800">Total</span>
                      <span className="text-xl font-bold text-green-600">{calculateTotal().toFixed(2)} EGP</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Main Content - Shows second on mobile */}
          <div className="col-span-12 lg:col-span-7 order-2 lg:order-1 space-y-6">
            {/* Delivery Methods */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-xl shadow-sm p-6 border border-gray-100 ${activeSection !== 'delivery' ? 'hidden' : ''}`}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Select Delivery Option</h2>
              <div className="space-y-3">
                {deliveryMethods.map((method) => (
                  <motion.div
                    key={method.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setSelectedDeliveryMethod(method.id)}
                    className={`relative cursor-pointer rounded-lg p-4 transition-all flex items-start gap-4 ${
                      selectedDeliveryMethod === method.id
                        ? 'bg-green-50 border-2 border-green-500'
                        : 'border border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full border ${
                      selectedDeliveryMethod === method.id 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {selectedDeliveryMethod === method.id && <FiCheck className="text-white text-sm" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-800">{method.shortName}</h3>
                        <span className="font-medium text-green-600">{method.price.toFixed(3)} EGP</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{method.description}</p>
                      <p className="text-xs text-gray-400 mt-2">Estimated delivery: {method.deliveryTime}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <button
                onClick={() => setActiveSection('shipping')}
                disabled={!selectedDeliveryMethod}
                className={`mt-6 w-full py-3 rounded-lg font-medium text-white transition-all ${
                  !selectedDeliveryMethod 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                Continue to Shipping
              </button>
            </motion.div>

            {/* Shipping Information */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`bg-white rounded-xl shadow-sm p-6 border border-gray-100 ${activeSection !== 'shipping' ? 'hidden' : ''}`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Shipping Information</h2>
                <button 
                  onClick={() => setActiveSection('delivery')}
                  className="text-sm text-green-600 hover:text-green-700 flex items-center"
                >
                  <FiArrowLeft className="mr-1" /> Back
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="123 Main St"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Cairo"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="Egypt"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Payment Methods */}
            {activeSection === 'shipping' && !isStripeReady && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <button
                  onClick={() => handlePayment('cash')}
                  disabled={!selectedDeliveryMethod || !formData.name || !formData.street || !formData.city || !formData.country || processingPayment}
                  className={`flex items-center justify-center gap-3 px-6 py-4 rounded-lg font-medium transition-all ${
                    !selectedDeliveryMethod || !formData.name || !formData.street || !formData.city || !formData.country || processingPayment
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-white border border-green-500 text-green-600 hover:bg-green-50 shadow-sm'
                  }`}
                >
                  {processingPayment ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-green-500 border-t-transparent" />
                  ) : (
                    <>
                      <FiDollarSign className="text-xl" />
                      Pay with Cash
                    </>
                  )}
                </button>
                <button
                  onClick={() => handlePayment('card')}
                  disabled={!selectedDeliveryMethod || !formData.name || !formData.street || !formData.city || !formData.country || processingPayment}
                  className={`flex items-center justify-center gap-3 px-6 py-4 rounded-lg font-medium transition-all ${
                    !selectedDeliveryMethod || !formData.name || !formData.street || !formData.city || !formData.country || processingPayment
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
                  }`}
                >
                  {processingPayment ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <FiCreditCard className="text-xl" />
                      Pay with Card
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {/* Stripe Elements */}
            {isStripeReady && renderStripeElements()}
          </div>
        </div>
      </div>
    </div>
  );
}