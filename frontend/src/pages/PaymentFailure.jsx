import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FiAlertCircle, FiArrowLeft, FiRefreshCw } from 'react-icons/fi'

const PaymentFailure = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const error = searchParams.get('error')
  const amount = searchParams.get('amount')

  const getErrorMessage = () => {
    switch (error) {
      case 'card_declined':
        return 'Your card was declined. Please try another card.'
      case 'insufficient_funds':
        return 'Insufficient funds. Please check your account balance.'
      case 'expired_card':
        return 'Your card has expired. Please use a valid card.'
      case 'incorrect_cvc':
        return 'Incorrect CVC. Please verify your card details.'
      case 'network_error':
        return 'Network error occurred. Please check your connection and try again.'
      case 'payment_cancelled':
        return 'Payment was cancelled. Please try again.'
      default:
        return 'Payment failed. Please try again or contact support.'
    }
  }

  return (
    <div className='w-full min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-lg shadow-2xl p-8 md:p-12 max-w-md w-full text-center'>
        {/* Error Icon */}
        <div className='flex justify-center mb-6'>
          <div className='bg-red-100 rounded-full p-4'>
            <FiAlertCircle size={48} className='text-red-600' />
          </div>
        </div>

        {/* Title */}
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>
          Payment Failed
        </h1>

        {/* Subtitle */}
        <p className='text-gray-600 mb-6'>
          We couldn't process your payment. Please try again.
        </p>

        {/* Error Message */}
        <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-8'>
          <p className='text-red-700 font-semibold text-sm'>
            {getErrorMessage()}
          </p>
        </div>

        {/* Payment Details */}
        {amount && (
          <div className='bg-gray-50 rounded-lg p-6 mb-8 text-left'>
            <p className='text-sm text-gray-600 mb-1'>Amount Attempted</p>
            <p className='text-2xl font-bold text-gray-800'>
              ₹{parseFloat(amount).toLocaleString('en-IN')}
            </p>
          </div>
        )}

        {/* Troubleshooting */}
        <div className='bg-blue-50 rounded-lg p-4 mb-8 text-left'>
          <h3 className='font-semibold text-gray-800 mb-3 text-sm'>
            Troubleshooting Tips:
          </h3>
          <ul className='space-y-2 text-sm text-gray-700'>
            <li>• Check if your card details are correct</li>
            <li>• Verify your card hasn't expired</li>
            <li>• Ensure sufficient funds in your account</li>
            <li>• Try a different payment method</li>
            <li>• Check your internet connection</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col gap-3'>
          <button
            onClick={() => navigate('/cart')}
            className='w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2'
          >
            <FiRefreshCw size={20} />
            Try Again
          </button>

          <button
            onClick={() => navigate('/cart')}
            className='w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold flex items-center justify-center gap-2'
          >
            <FiArrowLeft size={20} />
            Back to Cart
          </button>
        </div>

        {/* Support */}
        <div className='mt-8 pt-8 border-t border-gray-200'>
          <p className='text-sm text-gray-600 mb-3'>Still having issues?</p>
          <div className='flex flex-col gap-2'>
            <a
              href='mailto:support@ecommerce.com'
              className='text-blue-600 hover:text-blue-700 font-semibold text-sm'
            >
              Email Support
            </a>
            <a
              href='tel:+919876543210'
              className='text-blue-600 hover:text-blue-700 font-semibold text-sm'
            >
              Call Support: +91-9876-543-210
            </a>
          </div>
        </div>

        {/* Additional Info */}
        <div className='mt-6 pt-6 border-t border-gray-200 text-xs text-gray-600'>
          <p>Your order will not be placed until payment succeeds.</p>
          <p>No amount has been deducted from your account.</p>
        </div>
      </div>
    </div>
  )
}

export default PaymentFailure
