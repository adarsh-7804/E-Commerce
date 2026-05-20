import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FiCheckCircle, FiPackage, FiArrowRight } from 'react-icons/fi'

const PaymentSuccess = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')
  const amount = searchParams.get('amount')

  useEffect(() => {
    // Auto redirect to orders after 5 seconds (optional)
    // const timer = setTimeout(() => {
    //   navigate('/orders')
    // }, 5000)
    // return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className='w-full min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-lg shadow-2xl p-8 md:p-12 max-w-md w-full text-center'>
        {/* Success Icon */}
        <div className='flex justify-center mb-6'>
          <div className='bg-green-100 rounded-full p-4'>
            <FiCheckCircle size={48} className='text-green-600' />
          </div>
        </div>

        {/* Title */}
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>
          Payment Successful!
        </h1>

        {/* Subtitle */}
        <p className='text-gray-600 mb-6'>
          Thank you for your purchase. Your order has been confirmed.
        </p>

        {/* Order Details */}
        <div className='bg-gray-50 rounded-lg p-6 mb-8 text-left'>
          <div className='mb-4'>
            <p className='text-sm text-gray-600'>Order ID</p>
            <p className='text-lg font-semibold text-gray-800 break-all'>
              {orderId || 'N/A'}
            </p>
          </div>

          {amount && (
            <div>
              <p className='text-sm text-gray-600'>Amount Paid</p>
              <p className='text-lg font-semibold text-gray-800'>
                ₹{parseFloat(amount).toLocaleString('en-IN')}
              </p>
            </div>
          )}
        </div>

        {/* Order Tracking */}
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <FiPackage className='text-blue-600' size={24} />
              <div className='text-left'>
                <p className='text-sm font-semibold text-blue-900'>Track Order</p>
                <p className='text-xs text-blue-700'>
                  We'll send you tracking updates via email
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className='mb-8 text-left'>
          <h3 className='font-semibold text-gray-800 mb-3'>What's Next?</h3>
          <ul className='space-y-2 text-sm text-gray-700'>
            <li>✓ Order confirmation email sent</li>
            <li>✓ Order processing started</li>
            <li>✓ Tracking info coming soon</li>
            <li>✓ Estimated delivery: 3-5 days</li>
          </ul>
        </div>

        {/* Buttons */}
        <div className='flex flex-col gap-3'>
          <button
            onClick={() => navigate('/orders')}
            className='w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold flex items-center justify-center gap-2'
          >
            View Orders
            <FiArrowRight size={20} />
          </button>

          <button
            onClick={() => navigate('/')}
            className='w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold'
          >
            Continue Shopping
          </button>
        </div>

        {/* Support */}
        <div className='mt-8 pt-8 border-t border-gray-200'>
          <p className='text-xs text-gray-600 mb-2'>Need help?</p>
          <a
            href='mailto:support@ecommerce.com'
            className='text-blue-600 hover:text-blue-700 font-semibold text-sm'
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess
