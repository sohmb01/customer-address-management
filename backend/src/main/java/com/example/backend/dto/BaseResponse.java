package com.example.backend.dto;

import lombok.Data;

@Data
public class BaseResponse {
    private String errorCode;
    private String errorMessage;
    
    public void setError(String errorCode, String errorMessage) {
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
    }
}