package com.example.backend.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

// Response Entity for CustomerDetails
@Data
@EqualsAndHashCode(callSuper = true)
public class CustomerDetailsResponse extends BaseResponse {
    private Integer id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private LocalDateTime createdAt;
    private Integer numAddresses;
}