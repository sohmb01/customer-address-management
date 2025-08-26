import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Alert
} from '@mui/material';
import { addCustomer, updateCustomer } from '../services/api';

const CustomerForm = ({ open, customer, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    addresses: []
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (customer) {
      setFormData({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        addresses: customer.addresses || []
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        addresses: [{
          street: '',
          street2: '',
          city: '',
          state: '',
          pincode: '',
          country: 'USA'
        }]
      });
    }
    setErrors({});
    setTouched({});
    setApiError('');
  }, [customer, open]);

  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
        if (!value) return 'First name is required';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'First name should contain only letters';
        return '';
      case 'lastName':
        if (!value) return 'Last name is required';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Last name should contain only letters';
        return '';
      case 'email':
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email is not valid';
        return '';
      case 'phone':
        if (!value) return 'Phone is required';
        if (!/^\d{10}$/.test(value)) return 'Phone number must be 10 digits';
        return '';
      case 'street':
        if (!value) return 'Street is required';
        return '';
      case 'city':
        if (!value) return 'City is required';
        return '';
      case 'state':
        if (!value) return 'State is required';
        return '';
      case 'pincode':
        if (!value) return 'Pincode is required';
        if (!/^\d+$/.test(value)) return 'Pincode should contain only digits';
        if (value.length !== 5) return 'Pincode should contain exactly 5 digits';
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    
    // Handle address fields
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      const address = formData.addresses[0] || {};
      const error = validateField(field, address[field]);
      setErrors({ ...errors, [`address.${field}`]: error });
    } else {
      const error = validateField(name, formData[name]);
      setErrors({ ...errors, [name]: error });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      const updatedAddresses = [...formData.addresses];
      if (updatedAddresses.length === 0) {
        updatedAddresses.push({ [field]: value });
      } else {
        updatedAddresses[0] = { ...updatedAddresses[0], [field]: value };
      }
      setFormData({ ...formData, addresses: updatedAddresses });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
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
    
    // Validate customer fields
    Object.keys(formData).forEach(key => {
      if (key !== 'addresses') {
        newErrors[key] = validateField(key, formData[key]);
      }
    });
    
    // Validate address fields for new customers
    if (!customer && formData.addresses.length > 0) {
      const address = formData.addresses[0];
      ['street', 'city', 'state', 'pincode'].forEach(key => {
        newErrors[`address.${key}`] = validateField(key, address[key]);
      });
    }
    
    setErrors(newErrors);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      ...(customer ? {} : {
        'address.street': true,
        'address.city': true,
        'address.state': true,
        'address.pincode': true
      })
    });
    
    return Object.values(newErrors).every(x => !x);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      let response;
      if (customer) {
        response = await updateCustomer({ ...formData, id: customer.id });
      } else {
        response = await addCustomer(formData);
      }
      
      // Check if API returned an error
      if (response.errorCode && response.errorCode !== 'SUCCESS') {
        setApiError(response.errorMessage || 'An error occurred');
        return;
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving customer:', error);
      setApiError('Error saving customer: ' + error.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {customer ? 'Edit Customer' : 'Add New Customer'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {apiError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {apiError}
            </Alert>
          )}
          
          <Typography variant="h6" gutterBottom>
            Customer Information
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.firstName}
                helperText={errors.firstName}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.lastName}
                helperText={errors.lastName}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.email}
                helperText={errors.email}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                name="phone"
                label="Phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.phone}
                helperText={errors.phone}
                required
              />
            </Grid>
          </Grid>

          {!customer && (
            <>
              <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
                Address Information
              </Typography>
              <Grid container spacing={2}>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    name="address.street"
                    label="Street"
                    value={formData.addresses[0]?.street || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!errors['address.street']}
                    helperText={errors['address.street']}
                    required
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    name="address.street2"
                    label="Street 2"
                    value={formData.addresses[0]?.street2 || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    name="address.city"
                    label="City"
                    value={formData.addresses[0]?.city || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!errors['address.city']}
                    helperText={errors['address.city']}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    name="address.state"
                    label="State"
                    value={formData.addresses[0]?.state || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!errors['address.state']}
                    helperText={errors['address.state']}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    name="address.pincode"
                    label="Pincode"
                    value={formData.addresses[0]?.pincode || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!errors['address.pincode']}
                    helperText={errors['address.pincode']}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    name="address.country"
                    label="Country"
                    value={formData.addresses[0]?.country || 'USA'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                </Grid>
              </Grid>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {customer ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerForm;