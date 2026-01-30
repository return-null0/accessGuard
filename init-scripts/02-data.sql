WITH new_admin AS (
    INSERT INTO users (email, password_hash, is_active)
    VALUES ('admin@email.com', '$2a$12$r4TmCnAxT1qF0fQSwVblbe9Ln1dmBsqJP.cv778sa4ZHXXCmi/NeS', TRUE)
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
    VALUES ('renaldo.dev@email.com', '$2a$12$Xgq3KKvVmL3ELnw/TKa/leQK.iKTc7GOUl883PxsEOLI9dR1Az0su', TRUE)
    RETURNING user_id
)
INSERT INTO user_permissions (
    user_id, role, 
    can_manage_users, can_view_audit_logs, 
    can_upload_media, can_delete_any_media, can_view_private_media,
    storage_limit_mb
)
SELECT 
    user_id, 'user', 
    FALSE, FALSE,        -- No Admin Ops
    TRUE, FALSE, FALSE,  -- Restricted Media Ops
    500                  -- 500MB Limit
FROM new_user;


