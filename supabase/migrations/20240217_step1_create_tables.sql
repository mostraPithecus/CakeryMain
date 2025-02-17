-- Create categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "name" text NOT NULL,
    "slug" text NOT NULL,
    "description" text,
    "created_at" timestamptz DEFAULT now()
);

-- Create unique constraint on slug
ALTER TABLE "public"."categories" 
    ADD CONSTRAINT "categories_slug_unique" UNIQUE ("slug");

-- Create tags table if it doesn't exist
CREATE TABLE IF NOT EXISTS "public"."tags" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "name" text NOT NULL,
    "slug" text NOT NULL,
    "created_at" timestamptz DEFAULT now()
);

-- Create unique constraint on slug
ALTER TABLE "public"."tags" 
    ADD CONSTRAINT "tags_slug_unique" UNIQUE ("slug");

-- Create product_categories junction table if it doesn't exist
CREATE TABLE IF NOT EXISTS "public"."product_categories" (
    "product_id" uuid REFERENCES "public"."products" ON DELETE CASCADE,
    "category_id" uuid REFERENCES "public"."categories" ON DELETE CASCADE,
    PRIMARY KEY ("product_id", "category_id")
);

-- Create product_tags junction table if it doesn't exist
CREATE TABLE IF NOT EXISTS "public"."product_tags" (
    "product_id" uuid REFERENCES "public"."products" ON DELETE CASCADE,
    "tag_id" uuid REFERENCES "public"."tags" ON DELETE CASCADE,
    PRIMARY KEY ("product_id", "tag_id")
);

-- Enable RLS
ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."tags" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."product_categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."product_tags" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for all users" ON "public"."categories"
    FOR SELECT TO public USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."tags"
    FOR SELECT TO public USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."product_categories"
    FOR SELECT TO public USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."product_tags"
    FOR SELECT TO public USING (true);
