CREATE DATABASE jobProtal;

CREATE TABLE users(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
CREATE TABLE job_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon TEXT,
	image_url TEXT, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255),
	image_url TEXT, 
    description TEXT,
    category_id INT REFERENCES job_categories(id),
    location VARCHAR(100),
    salary_range VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO job_categories (name, image_url)
VALUES 
  ('Software & IT', 'https://images.unsplash.com/photo-1581092910063-52f8af08f6c8?fit=crop&w=800&q=80'),
  ('Marketing', 'https://images.unsplash.com/photo-1601933471669-1a9a63f44985?fit=crop&w=800&q=80'),
  ('Sales', 'https://images.unsplash.com/photo-1521791136064-7986c2920216?fit=crop&w=800&q=80'),
  ('Finance', 'https://images.unsplash.com/photo-1556742031-c6961e8560b0?fit=crop&w=800&q=80'),
  ('Healthcare', 'https://images.unsplash.com/photo-1588776814546-ec7c8b88ceba?fit=crop&w=800&q=80'),
  ('Education', 'https://images.unsplash.com/photo-1584697964402-c64b19f36d9a?fit=crop&w=800&q=80');
INSERT INTO jobs (title, company, image_url, description, category_id, location, salary_range)
VALUES 
  ('Frontend Developer', 'TechSoft Ltd',
    'https://images.unsplash.com/photo-1587620962725-abab7fe55159?fit=crop&w=800&q=80',
    'Develop modern UI using React and Tailwind.', 1, 'Dhaka', '40,000 - 60,000 BDT'),

  ('Backend Engineer', 'CodeBase Inc.',
    'https://images.unsplash.com/photo-1581091012184-1f1d9e582e2f?fit=crop&w=800&q=80',
    'Build REST APIs with Node.js and PostgreSQL.', 1, 'Remote', '60,000 - 90,000 BDT'),

  ('Digital Marketing Executive', 'AdLab',
    'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?fit=crop&w=800&q=80',
    'Manage SEO, SMM and run campaigns.', 2, 'Dhaka', '30,000 - 45,000 BDT'),

  ('Sales Executive', 'RetailHub',
    'https://images.unsplash.com/photo-1515169067865-5387ec356754?fit=crop&w=800&q=80',
    'Conduct product demos and client follow-ups.', 3, 'Chattogram', '25,000 - 35,000 BDT'),

  ('Financial Analyst', 'FinCore',
    'https://images.unsplash.com/photo-1605902711622-cfb43c4437f3?fit=crop&w=800&q=80',
    'Prepare reports and financial models.', 4, 'Dhaka', '50,000 - 75,000 BDT'),

  ('Nurse', 'City Hospital',
    'https://images.unsplash.com/photo-1588776814546-ec7c8b88ceba?fit=crop&w=800&q=80',
    'Provide patient care and assist in operations.', 5, 'Khulna', '30,000 - 50,000 BDT'),

  ('School Teacher', 'Green Leaf School',
    'https://images.unsplash.com/photo-1584697964402-c64b19f36d9a?fit=crop&w=800&q=80',
    'Teach math and science at the high school level.', 6, 'Rajshahi', '20,000 - 30,000 BDT');
