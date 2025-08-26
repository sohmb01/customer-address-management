package com.example.backend.repository;

import com.example.backend.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Integer> {

    // Get all addresses for a specific customer id
    List<Address> findByCustomerId(Integer customerId);

    // Optional: find by city/state/pincode
    List<Address> findByCityContainingIgnoreCase(String city);
    List<Address> findByStateContainingIgnoreCase(String state);
    List<Address> findByPincode(String pincode);
}