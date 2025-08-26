package com.example.backend.controller;

import com.example.backend.dto.AddressResponse;
import com.example.backend.mapper.AddressMapper;
import com.example.backend.model.Address;
import com.example.backend.model.Customer;
import com.example.backend.repository.AddressRepository;
import com.example.backend.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

// Allows the app to recive requests from cross origins (in this case react app at port 5173)
@CrossOrigin(origins = "http://localhost:5173")

@RestController
@RequestMapping("/api/addresses") //Base URI for addresses
@RequiredArgsConstructor
public class AddressController {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private CustomerRepository customerRepository;

    private final AddressMapper addressMapper;

    // Helper to extract constraint name from exception from db
    private String extractConstraintName(DataIntegrityViolationException e) {
        String message = e.getMostSpecificCause().getMessage();
        
        // Try to extract constraint name from error message
        Pattern pattern = Pattern.compile("(?i)(address_hash)");
        Matcher matcher = pattern.matcher(message);
        
        if (matcher.find()) {
            return matcher.group(1).toLowerCase();
        }
        
        return "unknown";
    }


    // Get all addresses for a customer
    @GetMapping("/{customerId}")
    public List<AddressResponse> getAddressesByCustomer(@PathVariable Integer customerId) {
        List<Address> addresses = addressRepository.findByCustomerId(customerId);
        return addresses.stream()
                .map(addressMapper::toResponse)
                .collect(Collectors.toList());
    }

    // Get address by ID 
    @GetMapping("/getAddress/{addressId}")
    public AddressResponse getAddress(@PathVariable Integer addressId) {
        AddressResponse response = new AddressResponse();
        
        try {
            Address address = addressRepository.findById(addressId)
                    .orElseThrow(() -> new RuntimeException("Address not found"));
            response = addressMapper.toResponse(address);
        } catch (Exception e) {
            response.setError("ADDRESS_NOT_FOUND", "Address not found with ID: " + addressId);
        }
        
        return response;
    }

    // Add new address for customer
    @PostMapping("/{customerId}")
    public AddressResponse createAddress(@PathVariable Integer customerId,
                                 @Valid @RequestBody Address address) {
        AddressResponse response = new AddressResponse();
        
        try {
            Customer customer = customerRepository.findById(customerId)
                    .orElseThrow(() -> new RuntimeException("Customer not found"));

            address.setCustomer(customer);
            Address savedAddress = addressRepository.save(address);
            response = addressMapper.toResponse(savedAddress);
            
        } catch (DataIntegrityViolationException e) {
            String constraint = extractConstraintName(e);
            // Check if Address is already taken
            if ("address_hash".equals(constraint)) {
                response.setError("DUPLICATE_ADDRESS", "Address is already associated with a customer");
            } else {
                response.setError("DATA_INTEGRITY_ERROR", "Data integrity violation");
            }
        } catch (Exception e) {
            response.setError("INTERNAL_SERVER_ERROR", "Failed to create address: " + e.getMessage());
        }
        
        return response;
    }

    // Update an address
    @PutMapping("/{addressId}")
    public AddressResponse updateAddress(@PathVariable Integer addressId,
                                                 @Valid @RequestBody Address updatedAddress) {
        AddressResponse response = new AddressResponse();
        
        try {
            Address address = addressRepository.findById(addressId)
                    .orElseThrow(() -> new RuntimeException("Address not found"));

            address.setStreet(updatedAddress.getStreet());
            address.setStreet2(updatedAddress.getStreet2());
            address.setCity(updatedAddress.getCity());
            address.setState(updatedAddress.getState());
            address.setPincode(updatedAddress.getPincode());
            address.setCountry(updatedAddress.getCountry());
            
            Address savedAddress = addressRepository.save(address);
            
            response = addressMapper.toResponse(savedAddress);

        } catch (DataIntegrityViolationException e) {
            String constraint = extractConstraintName(e);
            // Check if Address is already taken
            if ("address_hash".equals(constraint)) {
                response.setError("DUPLICATE_ADDRESS", "Address is already associated with a customer");
            } else {
                response.setError("DATA_INTEGRITY_ERROR", "Data integrity violation");
            }
        } catch (Exception e) {
            response.setError("INTERNAL_SERVER_ERROR", "Failed to update address: " + e.getMessage());
        }
        
        return response;
    }

    // Delete an address
    @DeleteMapping("/{addressId}")
    public AddressResponse deleteAddress(@PathVariable Integer addressId) {
        AddressResponse response = new AddressResponse();
        
        try {
            Address existing = addressRepository.findById(addressId)
                    .orElseThrow(() -> new RuntimeException("Address not found"));
            addressRepository.delete(existing);

        } catch (Exception e) {
            response.setError("DELETE_ERROR", "Failed to delete address: " + e.getMessage());
        }
        
        return response;
    }
}