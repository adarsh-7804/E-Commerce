import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { confirmPayment, createPaymentIntentAPI } from '../../services/paymentServices'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'

const CheckoutForm = ({ items, totalAmount, onSuccess, address }) => {
  const navigate = useNavigate()
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const cardOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424242',
        fontFamily: 'Segoe UI, Roboto, sans-serif',
        '::placeholder': {
          color: '#9ca3af',
        },
      },
      invalid: {
        color: '#ef4444',
      },
    },
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!stripe || !elements) {
        throw new Error('Stripe not loaded')
      }

      // Check if user is logged in
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        throw new Error('Please login to proceed with payment');
      }

      // Step 1: Create Payment Intent
      try {
        const paymentIntentResponse = await createPaymentIntentAPI(items, totalAmount)
        const { clientSecret, paymentIntentId } = paymentIntentResponse

        if (!clientSecret || !paymentIntentId) {
          throw new Error('Failed to create payment intent: ' + JSON.stringify(paymentIntentResponse))
        }

        // Step 2: Confirm Payment with Stripe
        const cardElement = elements.getElement(CardElement)
        
        if (!cardElement) {
          throw new Error('Card element not found')
        }

        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: address?.name || 'Customer',
              address: {
                line1: address?.addressLine1 || '',
                line2: address?.addressLine2 || '',
                city: address?.city || '',
                state: address?.state || '',
                postal_code: address?.postalCode || '',
                country: address?.country || 'IN',
              },
            },
          },
        })

        // Step 3: Handle Payment Result
        if (result.error) {
          // Payment failed
          setError(result.error.message)
          setLoading(false)

          // Navigate to error page
          const errorCode = result.error.code || 'unknown'
          navigate(`/payment-failure?error=${errorCode}&amount=${totalAmount}`)
        } else if (result.paymentIntent.status === 'succeeded') {
          // Payment successful - Confirm with backend
          try {
            const confirmResponse = await confirmPayment(
              paymentIntentId,
              address,
              totalAmount - 99, // subtotal (assuming 99 is shipping)
              500, // discount (fixed at 500)
              99, // shipping
              totalAmount
            )

            if (confirmResponse.success) {
              // Navigate to success page
              navigate(
                `/payment-success?orderId=${paymentIntentId}&amount=${totalAmount}`
              )
              if (onSuccess) {
                onSuccess(paymentIntentId)
              }
            } else {
              throw new Error(confirmResponse.message || 'Confirmation failed')
            }
          } catch (confirmError) {
            console.error('Confirmation error:', confirmError)
            setError(confirmError.message)
            navigate(`/payment-failure?error=confirmation_failed&amount=${totalAmount}`)
          }
        } else {
          // Payment pending or requires action
          setError('Payment requires further verification. Please try again.')
          navigate(
            `/payment-failure?error=payment_pending&amount=${totalAmount}`
          )
        }
      } catch (paymentError) {
        console.error('Payment creation error:', paymentError)
        setError(paymentError.message || 'Failed to initiate payment')
        setLoading(false)
        // Show error but don't navigate yet
      }
    } catch (err) {
      console.error('Checkout error:', err)
      setError(err.message || 'An error occurred')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='w-full max-w-md'>
      {/* Card Element */}
      <div className='mb-6 p-4 border border-gray-300 rounded-lg bg-white'>
        <CardElement options={cardOptions} />
      </div>

      {/* Error Message */}
      {error && (
        <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg'>
          <p className='text-red-700 font-semibold text-sm'>{error}</p>
        </div>
      )}

      {/* Payment Button */}
      <button
        type='submit'
        disabled={!stripe || loading}
        className={`w-full px-6 py-3 rounded-lg font-semibold text-white transition ${
          loading || !stripe
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-black hover:bg-gray-800'
        }`}
      >
        {loading ? (
          <span className='flex items-center justify-center gap-2'>
            <span className='animate-spin'>⚙️</span>
            Processing Payment...
          </span>
        ) : (
          `Pay ₹${totalAmount.toLocaleString('en-IN')}`
        )}
      </button>

      {/* Security Info */}
      <div className='mt-4 text-center text-xs text-gray-600'>
        <p>🔒 Your payment is secure and encrypted</p>
        <p>Powered by Stripe</p>
      </div>
    </form>
  )
}

export default CheckoutForm
