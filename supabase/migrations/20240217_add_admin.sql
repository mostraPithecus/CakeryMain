-- Add admin if they don't exist
INSERT INTO "public"."telegram_admins" (telegram_id, username, is_active)
SELECT 537190136, 'admin', true
WHERE NOT EXISTS (
    SELECT 1 FROM "public"."telegram_admins"
    WHERE telegram_id = 537190136
);
