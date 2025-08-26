package com.example.backend.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDateTime;
import java.util.List;

// Response Entity for Customer
@Data
@EqualsAndHashCode(callSuper = true)
public class CustomerResponse extends BaseResponse{
    private Integer id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private LocalDateTime createdAt;
    private List<AddressResponse> addresses;
    private Integer numAddresses; 
}