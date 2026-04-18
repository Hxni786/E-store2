-- ============================================================
--  HXNI ECOMMERCE STORE — MySQL Schema & Seed Data
--  Run: mysql -u root -p < db/schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS hxni_store
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE hxni_store;

-- ─────────────────────────────────────────────
--  TABLE: products
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id          INT           NOT NULL AUTO_INCREMENT,
  name        VARCHAR(255)  NOT NULL,
  price       DECIMAL(10,2) NOT NULL,
  description TEXT          NOT NULL,
  image_url   VARCHAR(512)  NOT NULL,
  category    VARCHAR(100)  NOT NULL,
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
--  SEED DATA
-- ─────────────────────────────────────────────
INSERT INTO products (name, price, description, image_url, category) VALUES

-- OUTERWEAR
('Obsidian Wool Overcoat',
 649.00,
 'Cut from a double-faced Italian wool, this overcoat embodies restrained luxury. The structured silhouette falls to mid-calf, with a hidden placket, hand-stitched lapels, and a subtle chalk-stripe woven into the fabric. Dry clean only. Made in Naples.',
 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=90',
 'Outerwear'),

('Cognac Leather Moto Jacket',
 895.00,
 'Sourced from a fourth-generation tannery in Córdoba, this full-grain cowhide develops a rich patina over time. The asymmetric zip closure, quilted lining, and ribbed cuffs are finished with antique brass hardware. A jacket built to outlast decades.',
 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=90',
 'Outerwear'),

-- KNITWEAR
('Ecru Cashmere Turtleneck',
 385.00,
 'Woven from Grade-A Mongolian cashmere in a 2-ply construction for exceptional warmth without bulk. The elongated body, folded turtleneck, and ribbed hem make this the definitive cold-weather foundation piece. Available in ecru and midnight.',
 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=90',
 'Knitwear'),

('Merino Cable-Knit Cardigan',
 295.00,
 'An heirloom-quality cardigan in superfine merino, featuring a traditional Aran cable pattern updated with a boxy, relaxed fit. Mother-of-pearl buttons and a split hem complete the considered construction. Hand wash cold.',
 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=90',
 'Knitwear'),

-- FOOTWEAR
('Black Derby Oxford',
 450.00,
 'Goodyear-welted construction on a Dainite rubber sole means this shoe resolves indefinitely. The upper is cut from a single piece of smooth calfskin, with a sleek cap-toe and hand-burnished heel. Last crafted in collaboration with a Portuguese cobbler since 1932.',
 'https://images.unsplash.com/photo-1614252234316-b1a6b8d5f4f8?w=800&q=90',
 'Footwear'),

('Suede Chelsea Boot',
 520.00,
 'The Chelsea silhouette, perfected. Spanish nubuck suede sits over a leather-wrapped block heel, with elasticated side gussets for a precise fit. The leather insole molds to the foot over time, making each pair uniquely yours.',
 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=90',
 'Footwear'),

-- ACCESSORIES
('Silk Twill Pocket Square',
 125.00,
 'A 33cm square of hand-rolled silk twill, printed with an abstract topographical map of the Atlas Mountains. Each colourway is produced in a limited run of 200. Arrives in a hand-stamped kraft envelope with a wax seal.',
 'https://images.unsplash.com/photo-1594938298603-c8148c4b4a4a?w=800&q=90',
 'Accessories'),

('Burnished Leather Bifold Wallet',
 185.00,
 'Slim profile, full substance. Eight card slots, a full-length bill compartment, and an ID window are organized in vegetable-tanned calf leather. The wallet arrives flat and softens with use. Embossed with the Hxni wordmark on the interior.',
 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=90',
 'Accessories'),

-- SHIRTS
('Poplin Bib-Front Dress Shirt',
 210.00,
 'Two-ply Egyptian cotton poplin with a bib-front panel for clean structure under a suit jacket. The spread collar and barrel cuffs are fused with a soft interlining for shape retention. Machine wash at 30°C, iron while damp.',
 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&q=90',
 'Shirts'),

('Indigo Chambray Work Shirt',
 175.00,
 'Japanese selvedge chambray in a vintage indigo that fades beautifully with wash. Patch chest pocket, single-needle stitching, and a slightly oversized fit designed to be worn tucked or untucked. A workhorse piece with a refined finish.',
 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&q=90',
 'Shirts');
