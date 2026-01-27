WITH new_admin AS (
    INSERT INTO users (email, password_hash, is_active)
    VALUES ('admin@kooick.com', 'argon2_hash_secure_x99', TRUE)
    RETURNING user_id
)
INSERT INTO user_permissions (
    user_id, role, 
    can_manage_users, can_view_audit_logs, 
    can_upload_media, can_delete_any_media, can_view_private_media,
    storage_limit_mb
)
SELECT 
    user_id, 'admin', 
    TRUE, TRUE,          -- Admin Ops
    TRUE, TRUE, TRUE,    -- Media Ops
    10240                -- 10GB Limit
FROM new_admin;


WITH new_user AS (
    INSERT INTO users (email, password_hash, is_active)
    VALUES ('renaldo.dev@kooick.com', 'argon2_hash_user_y22', TRUE)
    RETURNING user_id
)
INSERT INTO user_permissions (
    user_id, role, 
    can_manage_users, can_view_audit_logs, 
    can_upload_media, can_delete_any_media, can_view_private_media,
    storage_limit_mb
)
SELECT 
    user_id, 'editor', 
    FALSE, FALSE,        -- No Admin Ops
    TRUE, FALSE, FALSE,  -- Restricted Media Ops
    500                  -- 500MB Limit
FROM new_user;


