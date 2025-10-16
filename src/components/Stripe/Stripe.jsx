
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

import axios from 'axios'
import { useState } from 'react'
import CheckoutForm from '../CheckoutForm'

// import { stripe_sky } from '../utils/config'
// import { api_url } from '../utils/config'
const stripePromise = loadStripe('pk_test_51Rl7FN6uWmc1ye7HzEdg0gw0h5dJJHTxIkfMqNpknJP0Q7XJMEdhoj8wF2X5jF7erH7pJXmF72PXWAaO6tFhfLmq006IxS4qMO')


const Stripe = ({ price, orderId }) => {
    const [clientSecret, setClientSecret] = useState('')
    const appearance = {
        theme: 'stripe'
    }
    const options = {
        appearance,
        clientSecret
    }
    const create_payment = async () => {
        try {
            const { data } = await axios.post(`http://localhost:5000/api/order/create-payment`, { price }, { withCredentials: true })
            setClientSecret(data.clientSecret)
        } catch (error) {
            console.log(error.response.data)
        }
    }
    return (
        <div className='py-8 px-4 '>
            {
                clientSecret ? (
                    <Elements options={options} stripe={stripePromise}>
                        <CheckoutForm orderId={orderId} />
                    </Elements>
                ) : <button onClick={create_payment} className='px-10 py-[6px] rounded-sm hover:shadow-orange-500/20 hover:shadow-lg bg-orange-500 text-white cursor-pointer'>Start Payment</button>
            }

        </div>
    )
}

export default Stripe