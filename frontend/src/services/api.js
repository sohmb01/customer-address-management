import axios from 'axios';

// Base URL for API 
const BASE_URL = 'http://localhost:8080/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error codes
export const ERROR_CODES = {
  SUCCESS: 'SUCCESS',
  DUPLICATE_EMAIL: 'DUPLICATE_EMAIL',
  DUPLICATE_PHONE: 'DUPLICATE_PHONE',
  DUPLICATE_ADDRESS: 'DUPLICATE_ADDRESS',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  DATA_INTEGRITY_ERROR: 'DATA_INTEGRITY_ERROR',
  DELETE_ERROR: 'DELETE_ERROR',
  ADDRESS_NOT_FOUND: 'ADDRESS_NOT_FOUND',
  CUSTOMER_NOT_FOUND: 'CUSTOMER_NOT_FOUND'
};

// Helper function to handle API responses
const handleResponse = (response) => {
  // Check for API-level errors in response
  if (response.data.errorCode && response.data.errorCode !== ERROR_CODES.SUCCESS) {
    throw new Error(response.data.errorMessage || `API Error: ${response.data.errorCode}`);
  }
  return response.data;
};

// Helper function to handle API errors
const handleError = (error) => {
  if (error.response) {
    // Server responded with error status
    const errorData = error.response.data;
    if (errorData.errorCode && errorData.errorCode !== ERROR_CODES.SUCCESS) {
      throw new Error(errorData.errorMessage || `API Error: ${errorData.errorCode}`);
    }
    throw new Error(error.response.statusText || 'API request failed');
  } else if (error.request) {
    // Request made but no response received
    throw new Error('No response received from server');
  } else {
    // Something else happened
    throw new Error(error.message || 'API request failed');
  }
};

// Customer API functions

// Get all customers with pagination and sorting
export const getAllCustomers = async (page = 0, size = 10, sortBy = 'lastName', sortDir = 'asc') => {
  try {
    const params = {
      page,
      size,
      sortBy,
      sortDir
    };
    
    const response = await apiClient.get('/customers', { params });
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

// Get customer by ID
export const getCustomerById = async (id) => {
  try {
    const response = await apiClient.get(`/customers/${id}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

// Add customer
export const addCustomer = async (customerData) => {
  try {
    const response = await apiClient.post('/customers', customerData);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

// Update customer
export const updateCustomer = async (customerData) => {
  try {
    const response = await apiClient.put('/customers', customerData);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

// Delete customer
export const deleteCustomer = async (id) => {
  try {
    const response = await apiClient.delete(`/customers/${id}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

// Search customers by query
export const searchCustomers = async (query, page = 0, size = 10, sortBy = 'lastName', sortDir = 'asc') => {
  try {
    const params = {
      query: query || '',
      page,
      size,
      sortBy,
      sortDir
    };
    
    const response = await apiClient.get('/customers/search', { params });
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

// Advanced search customers by address details
export const advancedSearchCustomers = async (filters, page = 0, size = 10, sortBy = 'lastName', sortDir = 'asc') => {
  try {
    const params = {
      ...filters,
      page,
      size,
      sortBy,
      sortDir
    };
    
    const response = await apiClient.get('/customers/search/advanced', { params });
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

// Address API functions

// Get addresses by customer ID
export const getAddressesByCustomerId = async (customerId) => {
  try {
    const response = await apiClient.get(`/addresses/${customerId}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

// Get address by ID
export const getAddressById = async (addressId) => {
  try {
    const response = await apiClient.get(`/addresses/getAddress/${addressId}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

// Add address
export const addAddress = async (customerId, addressData) => {
  try {
    const response = await apiClient.post(`/addresses/${customerId}`, addressData);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

// Update address
export const updateAddress = async (addressId, addressData) => {
  try {
    const response = await apiClient.put(`/addresses/${addressId}`, addressData);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

// Delete address
export const deleteAddress = async (addressId) => {
  try {
    const response = await apiClient.delete(`/addresses/${addressId}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};