package com.example.backend.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

// Response Entity for Address
@Data
@EqualsAndHashCode(callSuper = true)
public class AddressResponse extends BaseResponse{
    private Integer id;
    private String street;
    private String street2;
    private String city;
    private String state;
    private String pincode;
    private String country;
    private Integer customerId; 
}