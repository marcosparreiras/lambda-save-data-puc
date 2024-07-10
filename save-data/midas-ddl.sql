-- URL: postgresql://admin:y6gCSq5jLqOWKHWknvu4I8UZTK9lRL5z@dpg-cq78iu5ds78s738sn5f0-a.ohio-postgres.render.com/midas
-- PSQL: PGPASSWORD=y6gCSq5jLqOWKHWknvu4I8UZTK9lRL5z psql -h dpg-cq78iu5ds78s738sn5f0-a.ohio-postgres.render.com -U admin midas

CREATE TABLE IF NOT EXISTS supermarkets (
  cnpj TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS price_history (
  id TEXT PRIMARY KEY,
  nfe_id TEXT NOT NULL,
  price DECIMAL NOT NULL,
  date TIMESTAMP NOT NULL,
  supermarket_id TEXT NOT NULL,
  product_id TEXT NOT NULL,

  CONSTRAINT fk_supermarket FOREIGN KEY (supermarket_id) REFERENCES supermarkets (cnpj),
  CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products (code)
);