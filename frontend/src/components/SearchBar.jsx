import React, { useState } from 'react';
import {
  TextField,
  Box,
  Grid,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Chip,
  Paper,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  FilterList,
  Clear,
  ExpandMore,
  Search,
  LocationCity,
  Map,
  PinDrop
} from '@mui/icons-material';

const SearchBar = ({ onSearch, onFilterChange, onClearFilters, searchQuery, searchFilters }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery || '');
  const [localFilters, setLocalFilters] = useState(searchFilters || {
    city: '',
    state: '',
    pincode: ''
  });

  const handleSearchChange = (value) => {
    setLocalQuery(value);
    onSearch(value);
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...localFilters, [filterType]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    setLocalQuery('');
    setLocalFilters({ city: '', state: '', pincode: '' });
    setShowAdvanced(false);
    onClearFilters();
  };

  const hasActiveFilters = localFilters.city || localFilters.state || localFilters.pincode;

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
      <Grid container spacing={4} alignItems="center">
        {/* Search Field */}
        <Grid item xs={12} md={6}>
          <TextField
            style = {{width: 400}}
            label="Search by name, email or phone"
            value={localQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        {/* Action Buttons */}
        <Grid item xs={12} md={6} container spacing={1} justifyContent="flex-end">
          <Grid item>
            <Button
              variant={showAdvanced ? "contained" : "outlined"}
              color={showAdvanced ? "primary" : "inherit"}
              startIcon={<FilterList />}
              onClick={() => setShowAdvanced(!showAdvanced)}
              size="small"
            >
              Filters
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<Clear />}
              onClick={handleClearFilters}
              disabled={!localQuery && !hasActiveFilters}
              size="small"
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Grid>

      {/* Advanced Filters */}
      {showAdvanced && (
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Address Filters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="City"
                value={localFilters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationCity fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="State"
                value={localFilters.state}
                onChange={(e) => handleFilterChange('state', e.target.value)}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Map fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Pincode"
                value={localFilters.pincode}
                onChange={(e) => handleFilterChange('pincode', e.target.value)}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PinDrop fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Active Filters:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {localFilters.city && (
              <Chip
                label={`City: ${localFilters.city}`}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {localFilters.state && (
              <Chip
                label={`State: ${localFilters.state}`}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {localFilters.pincode && (
              <Chip
                label={`Pincode: ${localFilters.pincode}`}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default SearchBar;