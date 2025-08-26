import React, { useState } from 'react';
import { Container, Typography } from '@mui/material';
import CustomerList from './components/CustomerList';
import CustomerDetail from './components/CustomerDetail';
import './App.css';

function App() {
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [view, setView] = useState('list');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSelectCustomer = (customer) => {
    setSelectedCustomerId(customer.id);
    setView('detail');
  };

  const handleBack = () => {
    setSelectedCustomerId(null);
    setView('list');
  };

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom align="center">
        Customer Management System
      </Typography>
      
      {view === 'list' ? (
        <CustomerList
          onSelectCustomer={handleSelectCustomer}
          refreshTrigger={refreshTrigger}
        />
      ) : (
        <CustomerDetail
          customerId={selectedCustomerId}
          onBack={handleBack}
          onRefresh={refreshData}
        />
      )}
    </Container>
  );
}

export default App;