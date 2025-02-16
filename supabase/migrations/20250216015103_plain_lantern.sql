/*
  # Bakery E-commerce Schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `slug` (text, unique)
      - `created_at` (timestamp)
    
    - `tags`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `slug` (text, unique)
      - `created_at` (timestamp)
    
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `slug` (text, unique)
      - `description` (text)
      - `price` (numeric)
      - `image_url` (text)
      - `category_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `product_tags`
      - `product_id` (uuid, foreign key)
      - `tag_id` (uuid, foreign key)
    
    - `orders`
      - `id` (uuid, primary key)
      - `customer_name` (text)
      - `email` (text)
      - `phone` (text)
      - `whatsapp` (text)
      - `instagram` (text)
      - `facebook` (text)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key)
      - `product_id` (uuid, foreign key)
      - `quantity` (integer)
      - `price` (numeric)
      - `notes` (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated admin users to manage products
    - Add policies for public access to view products
    - Add policies for order creation and management
*/

-- Create enum for order status
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

-- Create categories table
CREATE TABLE categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    slug text NOT NULL UNIQUE,
    created_at timestamptz DEFAULT now()
);

-- Create tags table
CREATE TABLE tags (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    slug text NOT NULL UNIQUE,
    created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    description text,
    price numeric NOT NULL CHECK (price >= 0),
    image_url text NOT NULL,
    category_id uuid REFERENCES categories(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create product_tags junction table
CREATE TABLE product_tags (
    product_id uuid REFERENCES products(id) ON DELETE CASCADE,
    tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, tag_id)
);

-- Create orders table
CREATE TABLE orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name text NOT NULL,
    email text,
    phone text NOT NULL,
    whatsapp text,
    instagram text,
    facebook text,
    status order_status NOT NULL DEFAULT 'pending',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE order_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
    product_id uuid REFERENCES products(id),
    quantity integer NOT NULL CHECK (quantity > 0),
    price numeric NOT NULL CHECK (price >= 0),
    notes text,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
CREATE POLICY "Categories are viewable by everyone" 
    ON categories FOR SELECT 
    TO PUBLIC 
    USING (true);

CREATE POLICY "Categories are manageable by authenticated users" 
    ON categories FOR ALL 
    TO authenticated 
    USING (true)
    WITH CHECK (true);

-- Create policies for tags
CREATE POLICY "Tags are viewable by everyone" 
    ON tags FOR SELECT 
    TO PUBLIC 
    USING (true);

CREATE POLICY "Tags are manageable by authenticated users" 
    ON tags FOR ALL 
    TO authenticated 
    USING (true)
    WITH CHECK (true);

-- Create policies for products
CREATE POLICY "Products are viewable by everyone" 
    ON products FOR SELECT 
    TO PUBLIC 
    USING (true);

CREATE POLICY "Products are manageable by authenticated users" 
    ON products FOR ALL 
    TO authenticated 
    USING (true)
    WITH CHECK (true);

-- Create policies for product_tags
CREATE POLICY "Product tags are viewable by everyone" 
    ON product_tags FOR SELECT 
    TO PUBLIC 
    USING (true);

CREATE POLICY "Product tags are manageable by authenticated users" 
    ON product_tags FOR ALL 
    TO authenticated 
    USING (true)
    WITH CHECK (true);

-- Create policies for orders
CREATE POLICY "Orders are viewable by authenticated users" 
    ON orders FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Orders can be created by anyone" 
    ON orders FOR INSERT 
    TO PUBLIC 
    WITH CHECK (true);

CREATE POLICY "Orders are manageable by authenticated users" 
    ON orders FOR UPDATE 
    TO authenticated 
    USING (true)
    WITH CHECK (true);

-- Create policies for order_items
CREATE POLICY "Order items are viewable by authenticated users" 
    ON order_items FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Order items can be created by anyone" 
    ON order_items FOR INSERT 
    TO PUBLIC 
    WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();