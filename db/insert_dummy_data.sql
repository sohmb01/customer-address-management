INSERT INTO `customers` (`id`, `first_name`, `last_name`, `phone`, `email`, `created_at`) VALUES
(2, 'Leo', 'Messi', '9876543210', 'lm10@example.com', '2025-08-22 22:38:50'),
(7, 'Pedri', 'Potter', '9876543212', 'pedri.potter@example.com', '2025-08-22 22:38:50'),
(9, 'Robert', 'Lewangoalski', '9765432099', 'robert.lewandowski.updated@example.com', '2025-08-22 22:38:50');

-- Insert addresses for these players
INSERT INTO `addresses` (`customer_id`, `street`, `street2`, `city`, `state`, `pincode`, `country`, `address_hash`) VALUES
-- Leo Messi addresses
(2, '789 Market St', NULL, 'San Francisco', 'CA', '94103', 'USA', '978692f8231766df892de0188240698b565d5d144b58f066de0155bc7deff4cd'),

-- Pedri Potter addresses
(7, '99 Greeky row fr updated', 'apt 2', 'Barcelona', 'TX', '12345', 'USA', '55293f8b9dd85345adef9e42803e446294ba823fa7920097651f1e6f2d72ecea'),
(7, '999 Greeky row fr', NULL, 'Barcelona', 'TX', '12345', 'USA', '6af2fa5f992c548b10394dc3e62b246153644a0c5944e276951951f4b3242dc6'),

-- Robert Lewangoalski addresses
(9, '090 Market St', NULL, 'Barcelona', 'VA', '69879', 'USA', 'b5fee00567b07ea56894f3cc8782a49bcc641dada0bac66d117fe01f71e63de3'),
(9, '99 Greeky row fr', '', 'Nagpur', 'TX', '12345', 'USA', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');