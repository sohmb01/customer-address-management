package com.example.backend.controller;

import com.example.backend.model.Customer;
import com.example.backend.dto.CustomerDetailsResponse;
import com.example.backend.dto.CustomerResponse;
import com.example.backend.mapper.CustomerMapper;
import com.example.backend.repository.CustomerRepository;
import com.example.backend.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

// Allows the app to recive requests from cross origins (in this case react app at port 5173)
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/customers") //Base URI for customers
@RequiredArgsConstructor
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private AddressRepository addressRepository;

    private final CustomerMapper customerMapper;

    // Helper method to update numAddresses
    // private void updateCustomerAddressCount(Customer customer) {
    //     int count = addressRepository.findByCustomerId(customer.getId()).size();
    //     customer.setNumAddresses(count);
    //     customerRepository.save(customer);
    // }

    // Helper method to extract constraint name from database exception
    private String extractConstraintName(DataIntegrityViolationException e) {
        String message = e.getMostSpecificCause().getMessage();
        
        Pattern pattern = Pattern.compile("(?i)(email|phone|address_hash)");
        Matcher matcher = pattern.matcher(message);
        
        if (matcher.find()) {
            return matcher.group(1).toLowerCase();
        }
        
        return "unknown";
    }

    // Get all customers with pagination and sorting
    @GetMapping
    public Page<CustomerDetailsResponse> getAllCustomers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "firstName") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? 
                Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        Page<Customer> customerPage = customerRepository.findAll(pageable);
        
        // Map the page content to CustomerDetailsResponse (without addresses)
        return customerPage.map(customerMapper::toDetailsResponse);
    }
    // Get customer by ID
    @GetMapping("/{id}")
    public CustomerResponse getCustomerById(@PathVariable Integer id) {
        CustomerResponse response = new CustomerResponse();
        
        try {
            Customer customer = customerRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Customer not found"));
            response = customerMapper.toResponse(customer);
        } catch (Exception e) {
            response.setError("CUSTOMER_NOT_FOUND", "Customer not found with ID: " + id);
        }
        
        return response;
    }

    // Create new customer
    @PostMapping
    public CustomerResponse createCustomer(@Valid @RequestBody Customer customer) {
        CustomerResponse response = new CustomerResponse();
        
        try {
            customer.getAddresses().get(0).setCustomer(customer);
            Customer savedCustomer = customerRepository.save(customer);
            response = customerMapper.toResponse(savedCustomer);
            // updateCustomerAddressCount(savedCustomer);
            response.setErrorMessage("New Customer Created Successfully");;
        } catch (DataIntegrityViolationException e) {
            String constraint = extractConstraintName(e);
            
            switch (constraint) {
                case "email":
                    response.setError("DUPLICATE_EMAIL", "Email address is already in use");
                    break;
                case "phone":
                    response.setError("DUPLICATE_PHONE", "Phone number is already in use");
                    break;
                case "address_hash":
                    response.setError("DUPLICATE_ADDRESS", "Address is already associated with a customer");
                    break;
                default:
                    response.setError("DATA_INTEGRITY_ERROR", "Data integrity violation");
            }
        } catch (Exception e) {
            response.setError("INTERNAL_SERVER_ERROR", "Failed to create customer: " + e.getMessage());
        }
        
        return response;
    }

    // Update Customer Details
    @PutMapping
    public CustomerResponse updateCustomer(@Valid @RequestBody Customer updatedCustomer) {
        CustomerResponse response = new CustomerResponse();
        
        try {
            Customer existing = customerRepository.findById(updatedCustomer.getId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

            existing.setFirstName(updatedCustomer.getFirstName());
            existing.setLastName(updatedCustomer.getLastName());
            existing.setEmail(updatedCustomer.getEmail());
            existing.setPhone(updatedCustomer.getPhone());

            Customer savedCustomer = customerRepository.save(existing);
            response = customerMapper.toResponse(savedCustomer);
            response.setErrorMessage("Customer Updated Successfully");
        } catch (DataIntegrityViolationException e) {
            String constraint = extractConstraintName(e);
            
            switch (constraint) {
                case "email":
                    response.setError("DUPLICATE_EMAIL", "Email address is already in use");
                    break;
                case "phone":
                    response.setError("DUPLICATE_PHONE", "Phone number is already in use");
                    break;
                default:
                    response.setError("DATA_INTEGRITY_ERROR", "Data integrity violation");
            }
        } catch (Exception e) {
            response.setError("INTERNAL_SERVER_ERROR", "Failed to update customer: " + e.getMessage());
        }
        
        return response;
    }

    // Delete customer
    @DeleteMapping("/{id}")
    public CustomerResponse deleteCustomer(@PathVariable Integer id) {
        CustomerResponse response = new CustomerResponse();
        
        try {
            Customer customer = customerRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Customer not found"));
            customerRepository.delete(customer);
            response.setErrorMessage("Customer Deleted Successfully!");
        } catch (Exception e) {
            response.setError("DELETE_ERROR", "Failed to delete customer: " + e.getMessage());
        }
        
        return response;
    }

    // Search customers by name, email, or phone with pagination
    @GetMapping("/search")
    public Page<CustomerDetailsResponse> searchCustomers(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "firstName") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? 
                Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        Page<Customer> customerPage = customerRepository.searchCustomers(query, pageable);
        
        // Map the page content to CustomerResponse
        return customerPage.map(customerMapper::toDetailsResponse);
    }

    // Advanced search by address fields with pagination
    @GetMapping("/search/advanced")
    public Page<CustomerDetailsResponse> advancedSearchCustomers(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String pincode,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "firstName") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? 
                Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        Page<Customer> customerPage = customerRepository.findByAddressAttributes(city, state, pincode, pageable);
        
        // Map the page content to CustomerResponse
        return customerPage.map(customerMapper::toDetailsResponse);
    }
}