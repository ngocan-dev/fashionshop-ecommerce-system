-- Backup/restore verification for FashionShop.
-- Run the same script against the source (Railway `railway`) and the restored
-- copy (`fashionshop_restore_test`); every row must be identical.
-- Select the target schema first (double-click it in Workbench, or USE <schema>;).

SELECT DATABASE() AS checked_schema, NOW() AS checked_at;

SELECT 'banners' AS table_name, COUNT(*) AS row_count FROM banners
UNION ALL SELECT 'blacklisted_tokens', COUNT(*) FROM blacklisted_tokens
UNION ALL SELECT 'cart_items',  COUNT(*) FROM cart_items
UNION ALL SELECT 'carts',       COUNT(*) FROM carts
UNION ALL SELECT 'categories',  COUNT(*) FROM categories
UNION ALL SELECT 'invoices',    COUNT(*) FROM invoices
UNION ALL SELECT 'order_items', COUNT(*) FROM order_items
UNION ALL SELECT 'orders',      COUNT(*) FROM orders
UNION ALL SELECT 'payments',    COUNT(*) FROM payments
UNION ALL SELECT 'products',    COUNT(*) FROM products
UNION ALL SELECT 'users',       COUNT(*) FROM users
UNION ALL SELECT 'wishlists',   COUNT(*) FROM wishlists;

-- Content fingerprints: a sum of per-row CRC32 over business columns.
SELECT 'products' AS table_name,
       SUM(CRC32(CONCAT_WS('|', id, category_id, name, price, stock_quantity, is_active + 0))) AS fingerprint
FROM products
UNION ALL
SELECT 'users',
       SUM(CRC32(CONCAT_WS('|', id, email, role, is_active + 0)))
FROM users
UNION ALL
SELECT 'orders',
       SUM(CRC32(CONCAT_WS('|', id, user_id, status, total_price)))
FROM orders
UNION ALL
SELECT 'order_items',
       SUM(CRC32(CONCAT_WS('|', id, order_id, product_id, quantity, price)))
FROM order_items
UNION ALL
SELECT 'payments',
       SUM(CRC32(CONCAT_WS('|', id, order_id, payment_status, paid_amount)))
FROM payments;
