package com.example.backend.mapper;

import com.example.backend.dto.AddressResponse;
import com.example.backend.model.Address;
import org.springframework.stereotype.Component;


@Component
public class AddressMapper {
    // Mapper function to convert Address object to Address Response
    public AddressResponse toResponse(Address address) {
        AddressResponse response = new AddressResponse();
        
        response.setId(address.getId());
        response.setStreet(address.getStreet());
        response.setStreet2(address.getStreet2());
        response.setCity(address.getCity());
        response.setState(address.getState());
        response.setPincode(address.getPincode());
        response.setCountry(address.getCountry());
        response.setCustomerId(address.getCustomer().getId());
        response.setErrorCode("SUCCESS");
        return response;
    }
}

