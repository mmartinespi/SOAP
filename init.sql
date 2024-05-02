CREATE TABLE products {
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    about VARCHAR(500),
    price FLOAT
};

INSERT INTO products (name, about, price) VALUES
    ('Product 1', 'About product 1', 100.0);