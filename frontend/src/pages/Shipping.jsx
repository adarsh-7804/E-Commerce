import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  FiChevronLeft,
  FiArrowRight,
  FiTruck,
  FiClock,
  FiDollarSign,
  FiCheck,
} from 'react-icons/fi'

const Shipping = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { selectedAddress } = useSelector((s) => s.address)
  const [selectedShipping, setSelectedShipping] = useState('standard')

  const shippingOptions = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: 'Delivery in 5-7 business days',
      cost: 0,
      icon: <FiTruck className="text-2xl" />,
      estimatedDays: '5-7 days',
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: 'Delivery in 2-3 business days',
      cost: 99,
      icon: <FiClock className="text-2xl" />,
      estimatedDays: '2-3 days',
    },
    {
      id: 'overnight',
      name: 'Overnight Shipping',
      description: 'Next day delivery before 10 AM',
      cost: 299,
      icon: <FiTruck className="text-2xl" />,
      estimatedDays: '1 day',
    },
  ]

  const handleBack = () => {
    navigate('/add-address')
  }

  const handleNext = () => {
    if (!selectedShipping) {
      alert('Please select a shipping method')
      return
    }
    // Store shipping selection and navigate to cart for payment
    navigate('/cart?step=payment')
  }

  const selectedOption = shippingOptions.find((opt) => opt.id === selectedShipping)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#211C24] mb-2">ShopSphere</h1>

          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1 text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white font-bold text-sm mb-2">
                <FiCheck />
              </div>
              <p className="text-xs font-semibold text-gray-600">Address</p>
            </div>

            <div className="flex-1 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-2 mb-6" />

            <div className="flex-1 text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm mb-2">
                2
              </div>
              <p className="text-xs font-semibold text-blue-600">Shipping</p>
            </div>

            <div className="flex-1 h-1 bg-gray-300 mx-2 mb-6" />

            <div className="flex-1 text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-gray-600 font-bold text-sm mb-2">
                3
              </div>
              <p className="text-xs font-semibold text-gray-600">Payment</p>
            </div>
          </div>
        </div>

        {/* Selected Address Summary */}
        {selectedAddress && (
          <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-blue-100">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">
              Shipping To:
            </h3>
            <p className="text-sm text-[#211C24] font-semibold">
              {selectedAddress.fullName}
            </p>
            <p className="text-sm text-gray-600">
              {selectedAddress.addressLine1}
              {selectedAddress.addressLine2 && `, ${selectedAddress.addressLine2}`}
            </p>
            <p className="text-sm text-gray-600">
              {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}
            </p>
            <p className="text-sm text-gray-600">{selectedAddress.phoneNumber}</p>
          </div>
        )}

        {/* Shipping Options */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-[#211C24]">
              Select Shipping Method
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {shippingOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => setSelectedShipping(option.id)}
                className={`p-6 cursor-pointer transition-all duration-200 ${
                  selectedShipping === option.id
                    ? 'bg-blue-50 border-l-4 border-blue-600'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  {/* Left: Icon & Details */}
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={`text-3xl transition-colors ${
                        selectedShipping === option.id
                          ? 'text-blue-600'
                          : 'text-gray-400'
                      }`}
                    >
                      {option.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#211C24] mb-1">
                        {option.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {option.description}
                      </p>
                      <div className="flex items-center gap-4">
                        <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
                          {option.estimatedDays}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Cost & Radio */}
                  <div className="text-right ml-4">
                    <p className="text-lg font-bold text-[#211C24] mb-3">
                      ₹{option.cost}
                    </p>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedShipping === option.id
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedShipping === option.id && (
                        <FiCheck className="text-white text-sm" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl text-white p-6 mb-8 shadow-lg">
          <h3 className="text-sm font-semibold mb-4 opacity-90">
            Estimated Delivery
          </h3>
          <p className="text-2xl font-bold mb-2">
            {selectedOption?.estimatedDays}
          </p>
          <p className="text-sm opacity-90">
            {selectedOption?.description}
          </p>
          <div className="mt-4 pt-4 border-t border-white border-opacity-20">
            <div className="flex justify-between items-center">
              <span className="text-sm">Shipping Cost:</span>
              <span className="text-lg font-bold">
                ₹{selectedOption?.cost || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex gap-3">
          <button
            onClick={handleBack}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border-2 border-gray-300 rounded-xl text-[#211C24] font-semibold hover:bg-gray-50 transition-colors duration-200 text-sm"
          >
            <FiChevronLeft /> Back
          </button>
          <button
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors duration-200 text-sm"
          >
            Continue to Payment <FiArrowRight />
          </button>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-xs text-blue-900">
            ℹ️ Standard shipping is free. Express and overnight options include
            delivery tracking and insurance.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Shipping
