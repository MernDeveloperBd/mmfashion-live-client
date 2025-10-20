import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FadeLoader from 'react-spinners/FadeLoader';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import error from '../assets/error.png';
import success from '../assets/success.png';

const load = async () => {
  return await loadStripe(import.meta.env.VITE_STRIPE_SKY); // Fixed: Case-sensitive env var
};

const ConfirmOrder = () => {
  const [loader, setLoader] = useState(true);
  const [stripe, setStripe] = useState(null); // Fixed: null initial
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!stripe) {
      return;
    }
    const clientSecret = new URLSearchParams(window.location.search).get('payment_intent_client_secret');
    if (!clientSecret) {
      setMessage('failed'); // No secret, treat as failed
      setLoader(false);
      return;
    }
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage('succeeded');
          break;
        case "processing":
          setMessage('processing');
          break;
        case "requires_payment_method":
          setMessage('failed');
          break;
        default:
          setMessage('failed');
      }
      setLoader(false); // Hide initial loader after intent check
    }).catch(() => {
      setMessage('failed');
      setLoader(false);
    });
  }, [stripe]);

  const get_load = async () => {
    try {
      const tempStripe = await load();
      setStripe(tempStripe);
    } catch (error) {
      console.error('Stripe load error:', error);
      setMessage('failed');
      setLoader(false);
    }
  };

  useEffect(() => {
    get_load();
  }, []);

  const update_payment = async () => {
    const orderId = localStorage.getItem('orderId');
    if (orderId) {
      try {
        const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'; // Fixed: Use env, fallback to localhost
        await axios.get(`${serverUrl}/api/order/confirm/${orderId}`);
        localStorage.removeItem('orderId');
        setLoader(false);
      } catch (error) {
        console.log(error.response?.data || error.message);
        setLoader(false); // Ensure loader hides on error
      }
    }
  };

  useEffect(() => {
    if (message === 'succeeded') { // Fixed: Only run on success
      update_payment();
    } else if (message) {
      setLoader(false); // Hide loader for non-success states
    }
  }, [message]);

  return (
    <div className='w-screen h-screen flex justify-center items-center flex-col gap-4'> {/* Fixed: Typo w-screen */}
      {
        (message === 'failed' || message === 'processing') ? (
          <>
            <img key="error" src={error} alt="Payment failed or processing" />
            <Link className='px-5 py-2 bg-green-500 rounded-sm text-white' to='/dashboard/my-orders'>
              Back to Dashboard
            </Link>
          </>
        ) : message === 'succeeded' ? (
          loader ? (
            <FadeLoader />
          ) : (
            <>
              <img key="success" src={success} alt="Payment succeeded" />
              <Link className='px-5 py-2 bg-green-500 rounded-sm text-white' to='/dashboard/my-orders'>
                Back to Dashboard
              </Link>
            </>
          )
        ) : (
          <FadeLoader />
        )
      }
    </div>
  );
};

export default ConfirmOrder;