package com.example.backend.repository;
import com.example.backend.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {

    // Search by name, email, or phone with pagination
    @Query("SELECT DISTINCT c FROM Customer c WHERE " +
           "LOWER(c.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "c.phone LIKE CONCAT('%', :query, '%')")
    Page<Customer> searchCustomers(@Param("query") String query, Pageable pageable);
    
    // Advanced search by address fields with pagination
    @Query("SELECT DISTINCT c FROM Customer c JOIN c.addresses a WHERE " +
           "(:city IS NULL OR LOWER(a.city) LIKE LOWER(CONCAT('%', :city, '%'))) AND " +
           "(:state IS NULL OR LOWER(a.state) LIKE LOWER(CONCAT('%', :state, '%'))) AND " +
           "(:pincode IS NULL OR a.pincode LIKE CONCAT('%', :pincode, '%'))")
    Page<Customer> findByAddressAttributes(@Param("city") String city, 
                                          @Param("state") String state, 
                                          @Param("pincode") String pincode, 
                                          Pageable pageable);
}
