import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Alert
} from '@mui/material';
import { addAddress, updateAddress } from '../services/api';

// Address Form
const AddressForm = ({ open, customerId, address, onClose }) => {
  const [formData, setFormData] = useState({
    street: '',
    street2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'USA'
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (address) {
      setFormData({
        street: address.street || '',
        street2: address.street2 || '',
        city: address.city || '',
        state: address.state || '',
        pincode: address.pincode || '',
        country: address.country || 'USA'
      });
    } else {
      setFormData({
        street: '',
        street2: '',
        city: '',
        state: '',
        pincode: '',
        country: 'USA'
      });
    }
    setErrors({});
    setTouched({});
    setApiError(''); // Reset API error when form opens
  }, [address, open]);

  const validateField = (name, value) => {
    switch (name) {
      case 'street':
        if (!value) return 'Street is required';
        return '';
      case 'city':
        if (!value) return 'City is required';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'City should contain only letters';
        return '';
      case 'state':
        if (!value) return 'State is required';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'State should contain only letters';
        return '';
      case 'pincode':
        if (!value) return 'Zipcode is required';
        if (!/^\d+$/.test(value)) return 'Zipcode should contain only digits';
        if (value.length !== 5) return 'Zipcode should contain exactly 5 digits';
        return '';
      case 'country':
        if (!value) return 'Country is required';
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    const error = validateField(name, formData[name]);
    setErrors({ ...errors, [name]: error });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear API error when user starts typing
    if (apiError) setApiError('');
    
    // Validate field if it's been touched before
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors({ ...errors, [name]: error });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      newErrors[key] = validateField(key, formData[key]);
    });
    setErrors(newErrors);
    setTouched({
      street: true,
      city: true,
      state: true,
      pincode: true,
      country: true
    });
    return Object.values(newErrors).every(x => x === '');
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      let response;
      if (address) {
        response = await updateAddress(address.id, formData);
      } else {
        response = await addAddress(customerId, formData);
      }
      
      // Check if API returned an error
      if (response.errorCode && response.errorCode !== 'SUCCESS') {
        setApiError(response.errorMessage || 'An error occurred');
        return;
      }
      
      onClose(true); // Pass true to indicate successful submission
    } catch (error) {
      console.error('Error saving address:', error);
      setApiError('Error saving address: ' + error.message);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="md" fullWidth>
      <DialogTitle>
        {address ? 'Edit Address' : 'Add New Address'}
      </DialogTitle>
      <DialogContent>
        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {apiError}
          </Alert>
        )}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="street"
              label="Street"
              value={formData.street}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.street}
              helperText={errors.street}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="street2"
              label="Street 2"
              value={formData.street2}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="city"
              label="City"
              value={formData.city}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.city}
              helperText={errors.city}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="state"
              label="State"
              value={formData.state}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.state}
              helperText={errors.state}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="pincode"
              label="Zipcode"
              value={formData.pincode}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.pincode}
              helperText={errors.pincode}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="country"
              label="Country"
              value={formData.country}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.country}
              helperText={errors.country}
              required
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {address ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddressForm;