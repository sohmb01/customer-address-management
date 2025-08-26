import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  Dialog,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import CustomerForm from './CustomerForm';
import AddressList from './AddressList';
import { getCustomerById } from '../services/api';

const CustomerDetail = ({ customerId, onBack, onRefresh }) => {
  const [customer, setCustomer] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCustomer = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getCustomerById(customerId);
      
      // Check if API returned an error
      if (response.errorCode && response.errorCode !== 'SUCCESS') {
        setError(response.errorMessage || 'Failed to fetch customer details');
        return;
      }
      
      setCustomer(response);
      setError('');
    } catch (err) {
      setError('Failed to fetch customer details: ' + err.message);
      console.error('Error fetching customer:', err);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    if (customerId) {
      fetchCustomer();
    }
  }, [customerId, fetchCustomer]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!customer) return null;

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={onBack} sx={{ mb: 2 }}>
      </Button>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              <strong>Customer Information</strong>
            </Typography>
            <Typography><strong>Name: </strong> {customer.firstName} {customer.lastName}</Typography>
            <Typography><strong>Email: </strong> {customer.email}</Typography>
            <Typography><strong>Phone: </strong> {customer.phone}</Typography>
            <Typography><strong>Created: </strong> {new Date(customer.createdAt).toLocaleDateString()}</Typography>
          </Grid>
        </Grid>
      </Paper>

      <AddressList customer={customer} onRefresh={() => {
        fetchCustomer();
        if (onRefresh) onRefresh();
      }} />
      
    </Box>
  );
};

export default CustomerDetail;