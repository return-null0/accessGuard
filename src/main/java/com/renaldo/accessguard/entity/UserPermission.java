package com.renaldo.accessguard.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_permissions")
public class UserPermission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "permission_id")
    private Long permissionId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "role", columnDefinition = "TEXT DEFAULT 'viewer'")
    private String role = "viewer";

    @Column(name = "can_manage_users")
    private boolean canManageUsers = false;

    @Column(name = "can_view_audit_logs")
    private boolean canViewAuditLogs = false;

    @Column(name = "can_upload_media")
    private boolean canUploadMedia = false;

    @Column(name = "can_delete_any_media")
    private boolean canDeleteAnyMedia = false;

    @Column(name = "can_view_private_media")
    private boolean canViewPrivateMedia = false;

    @Column(name = "storage_limit_mb")
    private Integer storageLimitMb = 100;

    public UserPermission() {
    }

    public UserPermission(User user, String role, boolean canManageUsers, boolean canViewAuditLogs, 
                          boolean canUploadMedia, boolean canDeleteAnyMedia, boolean canViewPrivateMedia, 
                          Integer storageLimitMb) {
        this.user = user;
        this.role = role;
        this.canManageUsers = canManageUsers;
        this.canViewAuditLogs = canViewAuditLogs;
        this.canUploadMedia = canUploadMedia;
        this.canDeleteAnyMedia = canDeleteAnyMedia;
        this.canViewPrivateMedia = canViewPrivateMedia;
        this.storageLimitMb = storageLimitMb;
    }

    public Long getPermissionId() {
        return permissionId;
    }

    public void setPermissionId(Long permissionId) {
        this.permissionId = permissionId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public boolean isCanManageUsers() {
        return canManageUsers;
    }

    public void setCanManageUsers(boolean canManageUsers) {
        this.canManageUsers = canManageUsers;
    }

    public boolean isCanViewAuditLogs() {
        return canViewAuditLogs;
    }

    public void setCanViewAuditLogs(boolean canViewAuditLogs) {
        this.canViewAuditLogs = canViewAuditLogs;
    }

    public boolean isCanUploadMedia() {
        return canUploadMedia;
    }

    public void setCanUploadMedia(boolean canUploadMedia) {
        this.canUploadMedia = canUploadMedia;
    }

    public boolean isCanDeleteAnyMedia() {
        return canDeleteAnyMedia;
    }

    public void setCanDeleteAnyMedia(boolean canDeleteAnyMedia) {
        this.canDeleteAnyMedia = canDeleteAnyMedia;
    }

    public boolean isCanViewPrivateMedia() {
        return canViewPrivateMedia;
    }

    public void setCanViewPrivateMedia(boolean canViewPrivateMedia) {
        this.canViewPrivateMedia = canViewPrivateMedia;
    }

    public Integer getStorageLimitMb() {
        return storageLimitMb;
    }

    public void setStorageLimitMb(Integer storageLimitMb) {
        this.storageLimitMb = storageLimitMb;
    }

    @Override
    public String toString() {
        return "UserPermission{" +
                "permissionId=" + permissionId +
                ", userId=" + (user != null ? user.getId() : "null") +
                ", role='" + role + '\'' +
                ", canUploadMedia=" + canUploadMedia +
                ", storageLimitMb=" + storageLimitMb +
                '}';
    }
}