# GearGuard Database Schema

This document reflects the current Django models and migration state. Table names follow Django defaults (app_label + model) unless noted.

## Overview
- Custom user model: `users.GearguardUser` (AUTH_USER_MODEL).
- Department app label: `departements` (note the spelling).
- All FKs to users point to the custom user; teams use a ManyToMany join table.

## Tables

### users_gearguarduser
- id: bigint PK
- password: varchar
- last_login: datetime (null)
- is_superuser: bool
- username: varchar (unique)
- first_name: varchar
- last_name: varchar
- email: varchar
- is_staff: bool
- is_active: bool
- date_joined: datetime
- role: varchar (choices: admin | manager | technician)

### departements_department
- id: bigint PK
- name: varchar
- description: text (blank allowed)
- created_at: datetime (auto add)
- updated_at: datetime (auto now)

### teams_maintenanceteam
- id: bigint PK
- name: varchar
- description: text (blank allowed)
- created_at: datetime (auto add)

### teams_maintenanceteam_members (auto M2M join)
- id: bigint PK
- maintenanceteam_id: FK → teams_maintenanceteam
- gearguarduser_id: FK → users_gearguarduser

### equipment_equipment
- id: bigint PK
- name: varchar
- serial_number: varchar (unique)
- department_id: FK → departements_department
- assigned_to_id: FK → users_gearguarduser (null, blank)
- maintenance_team_id: FK → teams_maintenanceteam (null)
- location: varchar
- purchase_date: date
- warranty_expiry: date
- is_scrapped: bool (default False)
- created_at: datetime (auto add)

### maintenance_maintenancerequest
- id: bigint PK
- subject: varchar
- description: text (blank allowed)
- request_type: varchar (choices: corrective | preventive)
- status: varchar (choices: new | in_progress | repaired | scrap; default new)
- equipment_id: FK → equipment_equipment
- assigned_to_id: FK → users_gearguarduser (null, blank)
- assigned_team_id: FK → teams_maintenanceteam (null)
- scheduled_date: date (null, blank)
- duration_hours: float (null, blank)
- created_by_id: FK → users_gearguarduser (null)
- created_at: datetime (auto add)

### maintenance_maintenancelog
- id: bigint PK
- maintenance_request_id: FK → maintenance_maintenancerequest
- action: varchar
- performed_by_id: FK → users_gearguarduser (null)
- timestamp: datetime (auto add)

## Relationships summary
- User ↔ Team: many-to-many via `teams_maintenanceteam_members`.
- Department ↔ Equipment: one-to-many (department has many equipment).
- Team ↔ Equipment: many-to-one (equipment has one maintenance team).
- User ↔ Equipment: many-to-one (equipment optionally assigned to one user).
- Equipment ↔ MaintenanceRequest: one-to-many.
- User ↔ MaintenanceRequest: many-to-one for `assigned_to` and `created_by`.
- Team ↔ MaintenanceRequest: many-to-one for `assigned_team`.
- MaintenanceRequest ↔ MaintenanceLog: one-to-many.
- User ↔ MaintenanceLog: many-to-one for `performed_by`.
