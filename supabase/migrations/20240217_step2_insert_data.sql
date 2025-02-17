-- Insert categories if they don't exist
INSERT INTO "public"."categories" (name, slug, description)
SELECT 'Birthday Cakes', 'birthday-cakes', 'Special cakes for birthday celebrations'
WHERE NOT EXISTS (SELECT 1 FROM "public"."categories" WHERE slug = 'birthday-cakes');

INSERT INTO "public"."categories" (name, slug, description)
SELECT 'Wedding Cakes', 'wedding-cakes', 'Elegant cakes for your special day'
WHERE NOT EXISTS (SELECT 1 FROM "public"."categories" WHERE slug = 'wedding-cakes');

INSERT INTO "public"."categories" (name, slug, description)
SELECT 'Custom Cakes', 'custom-cakes', 'Personalized cakes designed to your specifications'
WHERE NOT EXISTS (SELECT 1 FROM "public"."categories" WHERE slug = 'custom-cakes');

INSERT INTO "public"."categories" (name, slug, description)
SELECT 'Cupcakes', 'cupcakes', 'Individual-sized cakes perfect for any occasion'
WHERE NOT EXISTS (SELECT 1 FROM "public"."categories" WHERE slug = 'cupcakes');

INSERT INTO "public"."categories" (name, slug, description)
SELECT 'Holiday Specials', 'holiday-specials', 'Seasonal and holiday-themed cakes'
WHERE NOT EXISTS (SELECT 1 FROM "public"."categories" WHERE slug = 'holiday-specials');

-- Insert tags if they don't exist
INSERT INTO "public"."tags" (name, slug)
SELECT 'Chocolate', 'chocolate'
WHERE NOT EXISTS (SELECT 1 FROM "public"."tags" WHERE slug = 'chocolate');

INSERT INTO "public"."tags" (name, slug)
SELECT 'Vanilla', 'vanilla'
WHERE NOT EXISTS (SELECT 1 FROM "public"."tags" WHERE slug = 'vanilla');

INSERT INTO "public"."tags" (name, slug)
SELECT 'Fruit', 'fruit'
WHERE NOT EXISTS (SELECT 1 FROM "public"."tags" WHERE slug = 'fruit');

INSERT INTO "public"."tags" (name, slug)
SELECT 'Berries', 'berries'
WHERE NOT EXISTS (SELECT 1 FROM "public"."tags" WHERE slug = 'berries');

INSERT INTO "public"."tags" (name, slug)
SELECT 'Buttercream', 'buttercream'
WHERE NOT EXISTS (SELECT 1 FROM "public"."tags" WHERE slug = 'buttercream');

INSERT INTO "public"."tags" (name, slug)
SELECT 'Fondant', 'fondant'
WHERE NOT EXISTS (SELECT 1 FROM "public"."tags" WHERE slug = 'fondant');

INSERT INTO "public"."tags" (name, slug)
SELECT 'Gluten-Free', 'gluten-free'
WHERE NOT EXISTS (SELECT 1 FROM "public"."tags" WHERE slug = 'gluten-free');

INSERT INTO "public"."tags" (name, slug)
SELECT 'Vegan', 'vegan'
WHERE NOT EXISTS (SELECT 1 FROM "public"."tags" WHERE slug = 'vegan');
