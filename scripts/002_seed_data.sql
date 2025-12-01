-- Insert host user
INSERT INTO users (name, email) 
VALUES ('John Doe', 'john@liveshop.com')
ON CONFLICT (email) DO NOTHING;

-- Insert sample live shows
INSERT INTO live_shows (title, slug, description, scheduled_at, status, host_id, thumbnail_url)
VALUES 
  (
    'Fashion Forward Spring Collection',
    'fashion-forward-spring',
    'Discover the latest spring fashion trends with exclusive discounts!',
    NOW() + INTERVAL '1 hour',
    'LIVE',
    (SELECT id FROM users WHERE email = 'john@liveshop.com' LIMIT 1),
    '/placeholder.svg?height=400&width=600'
  ),
  (
    'Tech Gadgets Showcase',
    'tech-gadgets-showcase',
    'Explore cutting-edge tech gadgets and get amazing deals.',
    NOW() + INTERVAL '2 days',
    'PLANNED',
    (SELECT id FROM users WHERE email = 'john@liveshop.com' LIMIT 1),
    '/placeholder.svg?height=400&width=600'
  ),
  (
    'Home Decor Essentials',
    'home-decor-essentials',
    'Transform your space with beautiful home decor items.',
    NOW() - INTERVAL '1 day',
    'ENDED',
    (SELECT id FROM users WHERE email = 'john@liveshop.com' LIMIT 1),
    '/placeholder.svg?height=400&width=600'
  ),
  (
    'Fitness & Wellness Live',
    'fitness-wellness-live',
    'Get fit with our exclusive fitness equipment and wellness products.',
    NOW() + INTERVAL '5 days',
    'PLANNED',
    (SELECT id FROM users WHERE email = 'john@liveshop.com' LIMIT 1),
    '/placeholder.svg?height=400&width=600'
  )
ON CONFLICT (slug) DO NOTHING;
