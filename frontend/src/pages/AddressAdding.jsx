import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserAddressesThunk, addAddressThunk, updateAddressThunk, deleteAddressThunk, setDefaultAddressThunk } from '../features/address/addressSlice'
import { IoClose, IoCreate } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

const AddressAdding = () => {
  const dispatch = useDispatch()
  const { addresses, loading, error } = useSelector(state => state.address)
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState(null)
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    addressType: 'HOME',
    isDefault: false
  })

  useEffect(() => {
    dispatch(getUserAddressesThunk())
  }, [dispatch])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleAddAddress = async (e) => {
    e.preventDefault()
    try {
      if (editingAddressId) {
        // Update existing address
        await dispatch(updateAddressThunk({ addressId: editingAddressId, addressData: formData })).unwrap()
        setEditingAddressId(null)
      } else {
        // Add new address
        await dispatch(addAddressThunk(formData)).unwrap()
      }
      setFormData({
        fullName: '',
        phoneNumber: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA',
        addressType: 'HOME',
        isDefault: false
      })
      setShowAddForm(false)
      dispatch(getUserAddressesThunk())
    } catch (err) {
      console.error('Failed to save address:', err)
    }
  }

  const handleEditAddress = (address) => {
    setFormData({
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      addressType: address.addressType,
      isDefault: address.isDefault
    })
    setEditingAddressId(address._id)
    setShowAddForm(true)
  }

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await dispatch(deleteAddressThunk(addressId)).unwrap()
        dispatch(getUserAddressesThunk())
        if (selectedAddress === addressId) {
          setSelectedAddress(null)
        }
      } catch (err) {
        console.error('Failed to delete address:', err)
      }
    }
  }

  const handleSelectAddress = (addressId) => {
    setSelectedAddress(addressId)
    dispatch(setDefaultAddressThunk(addressId))
  }

  const navigate = useNavigate()

  const handleNext = () => {
    if (selectedAddress) {
      // Navigate to shipping step
      navigate('/shipping')
    } else {
      alert('Please select an address')
    }
  }

  const handleCancelForm = () => {
    setShowAddForm(false)
    setEditingAddressId(null)
    setFormData({
      fullName: '',
      phoneNumber: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
      addressType: 'HOME',
      isDefault: false
    })
  }

  return (
    <div className='w-full min-h-screen bg-white p-6'>
      {/* Step Indicator */}
      <div className='flex items-center justify-between mb-12'>
        <div className='flex items-center'>
          <div className='flex items-center justify-center w-8 h-8 rounded-full bg-black text-white font-bold'>1</div>
          <span className='ml-2 text-sm font-semibold text-black'>Address</span>
        </div>
        <div className='flex-1 h-0.5 mx-4 bg-gray-300'></div>
        <div className='flex items-center'>
          <div className='flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 text-gray-500 font-bold'>2</div>
          <span className='ml-2 text-sm font-light text-gray-400'>Shipping</span>
        </div>
        <div className='flex-1 h-0.5 mx-4 bg-gray-300'></div>
        <div className='flex items-center'>
          <div className='flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 text-gray-500 font-bold'>3</div>
          <span className='ml-2 text-sm font-light text-gray-400'>Payment</span>
        </div>
      </div>

      {/* Loading State */}
      {loading && <p className='text-center py-8'>Loading addresses...</p>}

      {/* Error State */}
      {error && <p className='text-center py-8 text-red-500'>Error: {error}</p>}

      {/* Addresses List or Empty State */}
      {!loading && addresses.length === 0 && !showAddForm && (
        <div className='text-center py-12'>
          <p className='text-gray-500 mb-6'>No addresses found. Please add one to continue.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className='px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'
          >
            Add First Address
          </button>
        </div>
      )}

      {/* Select Address Section */}
      {!loading && addresses.length > 0 && !showAddForm && (
        <div className='mb-8'>
          <h2 className='text-lg font-semibold mb-6'>Select Address</h2>
          <div className='space-y-4'>
            {addresses.map(address => (
              <div
                key={address._id}
                className='flex items-start p-6 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer'
                onClick={() => handleSelectAddress(address._id)}
              >
                <input
                  type='radio'
                  name='address'
                  checked={selectedAddress === address._id || address.isDefault}
                  onChange={() => handleSelectAddress(address._id)}
                  className='mt-1 cursor-pointer'
                />
                <div className='ml-4 flex-1'>
                  <div className='flex items-center gap-2 mb-1'>
                    <p className='font-semibold text-gray-800'>{address.fullName}</p>
                    <span className='px-2 py-0.5 bg-black text-white text-xs font-semibold rounded'>
                      {address.addressType}
                    </span>
                    {address.isDefault && (
                      <span className='px-2 py-0.5 bg-gray-200 text-gray-800 text-xs font-semibold rounded'>
                        DEFAULT
                      </span>
                    )}
                  </div>
                  <p className='text-sm text-gray-600 mb-1'>
                    {address.addressLine1}
                    {address.addressLine2 && `, ${address.addressLine2}`}
                  </p>
                  <p className='text-sm text-gray-600'>
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p className='text-sm text-gray-600 mt-1'>{address.phoneNumber}</p>
                </div>
                <div className='flex gap-2 ml-4'>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditAddress(address)
                    }}
                    className='text-blue-600 hover:text-blue-800 transition p-2'
                    title='Edit address'
                  >
                    <IoCreate size={20} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteAddress(address._id)
                    }}
                    className='text-red-600 hover:text-red-800 transition p-2'
                    title='Delete address'
                  >
                    <IoClose size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Address Button */}
          <div className='flex justify-center mt-8'>
            <button
              onClick={() => {
                setEditingAddressId(null)
                setFormData({
                  fullName: '',
                  phoneNumber: '',
                  addressLine1: '',
                  addressLine2: '',
                  city: '',
                  state: '',
                  zipCode: '',
                  country: 'USA',
                  addressType: 'HOME',
                  isDefault: false
                })
                setShowAddForm(true)
              }}
              className='flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition'
            >
              <span className='text-2xl'>+</span>
              Add New Address
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Address Form */}
      {showAddForm && (
        <div className='mb-8'>
          <h2 className='text-lg font-semibold mb-6'>
            {editingAddressId ? 'Edit Address' : addresses.length > 0 ? 'Add New Address' : 'Add Your First Address'}
          </h2>
          <form onSubmit={handleAddAddress} className='bg-gray-50 p-6 rounded-lg'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Full Name */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Full Name *</label>
                <input
                  type='text'
                  name='fullName'
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder='John Doe'
                  required
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Phone Number *</label>
                <input
                  type='tel'
                  name='phoneNumber'
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder='(123) 456-7890'
                  required
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>

              {/* Address Line 1 */}
              <div className='md:col-span-2'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Address Line 1 *</label>
                <input
                  type='text'
                  name='addressLine1'
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                  placeholder='123 Main Street'
                  required
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>

              {/* Address Line 2 */}
              <div className='md:col-span-2'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Address Line 2</label>
                <input
                  type='text'
                  name='addressLine2'
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                  placeholder='Apartment, suite, etc.'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>

              {/* City */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>City *</label>
                <input
                  type='text'
                  name='city'
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder='New York'
                  required
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>

              {/* State */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>State *</label>
                <input
                  type='text'
                  name='state'
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder='NY'
                  required
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>

              {/* Zip Code */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Zip Code *</label>
                <input
                  type='text'
                  name='zipCode'
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  placeholder='10001'
                  required
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>

              {/* Country */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Country</label>
                <input
                  type='text'
                  name='country'
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder='USA'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>

              {/* Address Type */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Address Type</label>
                <select
                  name='addressType'
                  value={formData.addressType}
                  onChange={handleInputChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                  <option value='HOME'>Home</option>
                  <option value='OFFICE'>Office</option>
                  <option value='OTHER'>Other</option>
                </select>
              </div>

              {/* Set as Default */}
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  name='isDefault'
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  className='w-4 h-4 rounded border-gray-300'
                />
                <label className='ml-2 text-sm font-medium text-gray-700'>Set as default address</label>
              </div>
            </div>

            {/* Form Actions */}
            <div className='flex gap-4 mt-8'>
              <button
                type='button'
                onClick={handleCancelForm}
                className='flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-semibold'
              >
                Cancel
              </button>
              <button
                type='submit'
                className='flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold'
              >
                {editingAddressId ? 'Update Address' : 'Save Address'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bottom Navigation */}
      {!showAddForm && addresses.length > 0 && (
        <div className='flex gap-4 mt-12 pt-8 border-t border-gray-300'>
          <button className='flex-1 px-6 py-3 border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-100 transition font-semibold'>
            Back
          </button>
          <button
            onClick={handleNext}
            className='flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-semibold'
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default AddressAdding
