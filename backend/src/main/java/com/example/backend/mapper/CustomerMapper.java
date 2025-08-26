package com.example.backend.mapper;

import com.example.backend.dto.CustomerDetailsResponse;
import com.example.backend.dto.CustomerResponse;
import com.example.backend.model.Customer;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class CustomerMapper {
    
    private final AddressMapper addressMapper;
    
    public CustomerMapper(AddressMapper addressMapper) {
        this.addressMapper = addressMapper;
    }
    
    // Mapper function to convert Customer object to Customer Response
    public CustomerResponse toResponse(Customer customer) {
        CustomerResponse response = new CustomerResponse();
        
        response.setId(customer.getId());
        response.setFirstName(customer.getFirstName());
        response.setLastName(customer.getLastName());
        response.setEmail(customer.getEmail());
        response.setPhone(customer.getPhone());
        response.setCreatedAt(customer.getCreatedAt());
        response.setNumAddresses(customer.getAddresses().size());
        
        // Map addresses using AddressMapper
        if (customer.getAddresses() != null) {
            response.setAddresses(
                customer.getAddresses().stream()
                    .map(addressMapper::toResponse)
                    .collect(Collectors.toList())
            );
        }
        response.setErrorCode("SUCCESS");
        return response;
    }

    // Mapper function to convert Customer object to CustomerDetails Response
    public CustomerDetailsResponse toDetailsResponse(Customer customer) {
        CustomerDetailsResponse response = new CustomerDetailsResponse();
        
        response.setId(customer.getId());
        response.setFirstName(customer.getFirstName());
        response.setLastName(customer.getLastName());
        response.setEmail(customer.getEmail());
        response.setPhone(customer.getPhone());
        response.setCreatedAt(customer.getCreatedAt());
        response.setNumAddresses(customer.getAddresses().size());
        // Set success to true by default
        response.setErrorCode("SUCCESS");
        
        return response;
    }
}