package com.example.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(
    name = "addresses",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_address_hash", columnNames = {"address_hash"})
    }
)
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "Street is required")
    private String street;

    // Optional field
    private String street2;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Pincode is required")
    private String pincode;

    @NotBlank(message = "Country is required")
    private String country;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    // Hash to ensure the uniqueness of addresses
    @Column(name = "address_hash", nullable = false, length = 64, unique = true)
    private String addressHash;

    // Compute hash when object is created and updated
    @PrePersist
    @PreUpdate
    public void computeHash() {
        String streetValue2 = (street2 != null) ? street2:"";
        String raw = street + "|" + streetValue2 + city + "|" + state + "|" + country + "|" + pincode;
        this.addressHash = org.apache.commons.codec.digest.DigestUtils.sha256Hex(raw);
    }
}
