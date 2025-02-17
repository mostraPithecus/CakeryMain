-- Create categories table
CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "name" text NOT NULL,
    "slug" text NOT NULL,
    "description" text,
    "created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()),
    CONSTRAINT "categories_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "categories_slug_key" UNIQUE ("slug")
);

-- Create tags table
CREATE TABLE IF NOT EXISTS "public"."tags" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "name" text NOT NULL,
    "slug" text NOT NULL,
    "created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()),
    CONSTRAINT "tags_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "tags_slug_key" UNIQUE ("slug")
);

-- Create product_categories junction table
CREATE TABLE IF NOT EXISTS "public"."product_categories" (
    "product_id" uuid NOT NULL,
    "category_id" uuid NOT NULL,
    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("product_id", "category_id"),
    CONSTRAINT "product_categories_product_id_fkey" FOREIGN KEY ("product_id") 
        REFERENCES "public"."products"("id") ON DELETE CASCADE,
    CONSTRAINT "product_categories_category_id_fkey" FOREIGN KEY ("category_id") 
        REFERENCES "public"."categories"("id") ON DELETE CASCADE
);

-- Create product_tags junction table
CREATE TABLE IF NOT EXISTS "public"."product_tags" (
    "product_id" uuid NOT NULL,
    "tag_id" uuid NOT NULL,
    CONSTRAINT "product_tags_pkey" PRIMARY KEY ("product_id", "tag_id"),
    CONSTRAINT "product_tags_product_id_fkey" FOREIGN KEY ("product_id") 
        REFERENCES "public"."products"("id") ON DELETE CASCADE,
    CONSTRAINT "product_tags_tag_id_fkey" FOREIGN KEY ("tag_id") 
        REFERENCES "public"."tags"("id") ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."tags" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."product_categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."product_tags" ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Enable read access for all users" ON "public"."categories"
    FOR SELECT TO public USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."tags"
    FOR SELECT TO public USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."product_categories"
    FOR SELECT TO public USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."product_tags"
    FOR SELECT TO public USING (true);
