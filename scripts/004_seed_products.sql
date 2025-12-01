-- Insert sample products
INSERT INTO products (sku, name, description, image_url, price_cents, currency, active) VALUES
('HOODIE-BLACK', 'Black Hoodie', 'Premium cotton hoodie in classic black', '/placeholder.svg?height=300&width=300', 4999, 'USD', true),
('TSHIRT-WHITE', 'White T-Shirt', 'Comfortable cotton t-shirt in white', '/placeholder.svg?height=300&width=300', 2499, 'USD', true),
('CAP-NAVY', 'Navy Cap', 'Adjustable navy baseball cap', '/placeholder.svg?height=300&width=300', 1999, 'USD', true),
('SNEAKERS-RED', 'Red Sneakers', 'Stylish red sneakers for everyday wear', '/placeholder.svg?height=300&width=300', 7999, 'USD', true),
('JACKET-BLUE', 'Blue Jacket', 'Water-resistant blue jacket', '/placeholder.svg?height=300&width=300', 8999, 'USD', true),
('SOCKS-PACK', '3-Pack Socks', 'Comfortable cotton sock pack', '/placeholder.svg?height=300&width=300', 1499, 'USD', true)
ON CONFLICT (sku) DO NOTHING;

-- Link products to shows
-- Get show IDs and product IDs, then create show_products entries
INSERT INTO show_products (show_id, product_id, sort_order, featured)
SELECT 
  ls.id as show_id,
  p.id as product_id,
  CASE p.sku
    WHEN 'HOODIE-BLACK' THEN 1
    WHEN 'TSHIRT-WHITE' THEN 2
    WHEN 'CAP-NAVY' THEN 3
    ELSE 4
  END as sort_order,
  CASE p.sku
    WHEN 'HOODIE-BLACK' THEN true
    ELSE false
  END as featured
FROM live_shows ls
CROSS JOIN products p
WHERE ls.slug = 'summer-drop' AND p.sku IN ('HOODIE-BLACK', 'TSHIRT-WHITE', 'CAP-NAVY')
ON CONFLICT (show_id, product_id) DO NOTHING;

INSERT INTO show_products (show_id, product_id, sort_order, featured)
SELECT 
  ls.id as show_id,
  p.id as product_id,
  CASE p.sku
    WHEN 'SNEAKERS-RED' THEN 1
    WHEN 'JACKET-BLUE' THEN 2
    WHEN 'SOCKS-PACK' THEN 3
    ELSE 4
  END as sort_order,
  CASE p.sku
    WHEN 'SNEAKERS-RED' THEN true
    ELSE false
  END as featured
FROM live_shows ls
CROSS JOIN products p
WHERE ls.slug = 'tech-gear-reveal' AND p.sku IN ('SNEAKERS-RED', 'JACKET-BLUE', 'SOCKS-PACK')
ON CONFLICT (show_id, product_id) DO NOTHING;

INSERT INTO show_products (show_id, product_id, sort_order, featured)
SELECT 
  ls.id as show_id,
  p.id as product_id,
  CASE p.sku
    WHEN 'HOODIE-BLACK' THEN 1
    WHEN 'CAP-NAVY' THEN 2
    WHEN 'JACKET-BLUE' THEN 3
    ELSE 4
  END as sort_order,
  CASE p.sku
    WHEN 'JACKET-BLUE' THEN true
    ELSE false
  END as featured
FROM live_shows ls
CROSS JOIN products p
WHERE ls.slug = 'holiday-special' AND p.sku IN ('HOODIE-BLACK', 'CAP-NAVY', 'JACKET-BLUE')
ON CONFLICT (show_id, product_id) DO NOTHING;
