-- Clear existing products and relationships (optional - for testing)
DELETE FROM show_products;
DELETE FROM cart_items;
DELETE FROM products;

-- Insert enhanced mockup products with realistic details
INSERT INTO products (sku, name, description, image_url, price_cents, currency, active) VALUES
-- Fashion Items
('HOODIE-PREMIUM-BLK', 'Premium Black Hoodie', 'Ultra-soft premium cotton blend hoodie with embroidered logo. Perfect for any season.', '/placeholder.svg?height=400&width=400', 6999, 'USD', true),
('TSHIRT-GRAPHIC-WHT', 'Limited Edition Graphic Tee', 'Exclusive graphic design on premium cotton. Limited stock available!', '/placeholder.svg?height=400&width=400', 3499, 'USD', true),
('JEANS-SLIM-BLUE', 'Slim Fit Denim Jeans', 'Classic blue slim-fit jeans with stretch comfort. Versatile and durable.', '/placeholder.svg?height=400&width=400', 7999, 'USD', true),
('JACKET-BOMBER-GRN', 'Vintage Bomber Jacket', 'Retro-inspired bomber jacket in olive green. Water-resistant finish.', '/placeholder.svg?height=400&width=400', 12999, 'USD', true),
('DRESS-SUMMER-RED', 'Summer Floral Dress', 'Lightweight floral print dress perfect for warm weather. Breathable fabric.', '/placeholder.svg?height=400&width=400', 8999, 'USD', true),

-- Accessories
('SNEAKERS-SPORT-WHT', 'Sport Sneakers Pro', 'High-performance athletic sneakers with cushioned sole. Available in white.', '/placeholder.svg?height=400&width=400', 9999, 'USD', true),
('CAP-SNAPBACK-BLK', 'Classic Snapback Cap', 'Adjustable snapback with embroidered front logo. One size fits all.', '/placeholder.svg?height=400&width=400', 2499, 'USD', true),
('BACKPACK-TRAVEL-GRY', 'Urban Travel Backpack', 'Spacious 25L backpack with laptop compartment. Perfect for daily commute.', '/placeholder.svg?height=400&width=400', 5999, 'USD', true),
('SUNGLASSES-AVIATOR', 'Classic Aviator Sunglasses', 'UV400 protection with polarized lenses. Timeless style.', '/placeholder.svg?height=400&width=400', 4999, 'USD', true),
('WATCH-SMART-BLK', 'Fitness Smart Watch', 'Track your fitness goals with heart rate monitor and GPS. 7-day battery life.', '/placeholder.svg?height=400&width=400', 19999, 'USD', true),

-- Tech & Gadgets
('EARBUDS-WIRELESS', 'Wireless Earbuds Pro', 'Premium sound quality with active noise cancellation. 24hr battery with case.', '/placeholder.svg?height=400&width=400', 14999, 'USD', true),
('PHONE-CASE-TOUGH', 'Rugged Phone Case', 'Military-grade drop protection. Compatible with wireless charging.', '/placeholder.svg?height=400&width=400', 3999, 'USD', true),
('CHARGER-FAST-USB', 'Fast Charge Power Bank', '20000mAh portable charger with dual USB-C ports. Charge multiple devices.', '/placeholder.svg?height=400&width=400', 4499, 'USD', true),

-- Home & Lifestyle
('BOTTLE-WATER-INSL', 'Insulated Water Bottle', 'Keep drinks cold for 24hrs or hot for 12hrs. 32oz stainless steel.', '/placeholder.svg?height=400&width=400', 3499, 'USD', true),
('MUG-COFFEE-TRVL', 'Travel Coffee Mug', 'Leak-proof travel mug with one-hand operation. Fits most cup holders.', '/placeholder.svg?height=400&width=400', 2999, 'USD', true),
('TOWEL-MICROFIBER', 'Quick-Dry Gym Towel', 'Ultra-absorbent microfiber towel. Compact and lightweight for travel.', '/placeholder.svg?height=400&width=400', 1999, 'USD', true)
ON CONFLICT (sku) DO NOTHING;

-- Link products to "summer-drop" show (Fashion-focused)
INSERT INTO show_products (show_id, product_id, sort_order, featured)
SELECT 
  ls.id as show_id,
  p.id as product_id,
  CASE p.sku
    WHEN 'HOODIE-PREMIUM-BLK' THEN 1
    WHEN 'TSHIRT-GRAPHIC-WHT' THEN 2
    WHEN 'JEANS-SLIM-BLUE' THEN 3
    WHEN 'DRESS-SUMMER-RED' THEN 4
    WHEN 'SNEAKERS-SPORT-WHT' THEN 5
    WHEN 'CAP-SNAPBACK-BLK' THEN 6
    ELSE 7
  END as sort_order,
  CASE p.sku
    WHEN 'HOODIE-PREMIUM-BLK' THEN true
    WHEN 'DRESS-SUMMER-RED' THEN true
    ELSE false
  END as featured
FROM live_shows ls
CROSS JOIN products p
WHERE ls.slug = 'summer-drop' 
  AND p.sku IN ('HOODIE-PREMIUM-BLK', 'TSHIRT-GRAPHIC-WHT', 'JEANS-SLIM-BLUE', 'DRESS-SUMMER-RED', 'SNEAKERS-SPORT-WHT', 'CAP-SNAPBACK-BLK')
ON CONFLICT (show_id, product_id) DO NOTHING;

-- Link products to "tech-gear-reveal" show (Tech & Accessories)
INSERT INTO show_products (show_id, product_id, sort_order, featured)
SELECT 
  ls.id as show_id,
  p.id as product_id,
  CASE p.sku
    WHEN 'WATCH-SMART-BLK' THEN 1
    WHEN 'EARBUDS-WIRELESS' THEN 2
    WHEN 'CHARGER-FAST-USB' THEN 3
    WHEN 'PHONE-CASE-TOUGH' THEN 4
    WHEN 'BACKPACK-TRAVEL-GRY' THEN 5
    WHEN 'SUNGLASSES-AVIATOR' THEN 6
    ELSE 7
  END as sort_order,
  CASE p.sku
    WHEN 'WATCH-SMART-BLK' THEN true
    WHEN 'EARBUDS-WIRELESS' THEN true
    ELSE false
  END as featured
FROM live_shows ls
CROSS JOIN products p
WHERE ls.slug = 'tech-gear-reveal' 
  AND p.sku IN ('WATCH-SMART-BLK', 'EARBUDS-WIRELESS', 'CHARGER-FAST-USB', 'PHONE-CASE-TOUGH', 'BACKPACK-TRAVEL-GRY', 'SUNGLASSES-AVIATOR')
ON CONFLICT (show_id, product_id) DO NOTHING;

-- Link products to "holiday-special" show (Mix of everything)
INSERT INTO show_products (show_id, product_id, sort_order, featured)
SELECT 
  ls.id as show_id,
  p.id as product_id,
  CASE p.sku
    WHEN 'JACKET-BOMBER-GRN' THEN 1
    WHEN 'WATCH-SMART-BLK' THEN 2
    WHEN 'BACKPACK-TRAVEL-GRY' THEN 3
    WHEN 'BOTTLE-WATER-INSL' THEN 4
    WHEN 'MUG-COFFEE-TRVL' THEN 5
    WHEN 'HOODIE-PREMIUM-BLK' THEN 6
    ELSE 7
  END as sort_order,
  CASE p.sku
    WHEN 'JACKET-BOMBER-GRN' THEN true
    WHEN 'WATCH-SMART-BLK' THEN true
    ELSE false
  END as featured
FROM live_shows ls
CROSS JOIN products p
WHERE ls.slug = 'holiday-special' 
  AND p.sku IN ('JACKET-BOMBER-GRN', 'WATCH-SMART-BLK', 'BACKPACK-TRAVEL-GRY', 'BOTTLE-WATER-INSL', 'MUG-COFFEE-TRVL', 'HOODIE-PREMIUM-BLK')
ON CONFLICT (show_id, product_id) DO NOTHING;
