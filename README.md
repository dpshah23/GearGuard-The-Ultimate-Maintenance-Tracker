# GearGuard: The Ultimate Maintenance Tracker

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Database & Migrations](#database--migrations)
- [Running](#running)
- [API Surface (Current)](#api-surface-current)
<!-- - [Roadmap / Gaps](#roadmap--gaps) -->

## Overview
GearGuard is a maintenance management system to track equipment, maintenance requests, and teams. The backend is a Django/DRF service exposing JSON endpoints; the goal is to link equipment (what), teams (who), and requests (work).

## Features
- Equipment CRUD with department, assignment, maintenance team, and lifecycle fields.
- Maintenance requests with role-based filtering and assignment action via DRF ViewSet.
- Maintenance teams with members (technicians) management.
- User signup/login using the custom user model (roles: admin, manager, technician).

## Architecture
- apps:
	- `equipment`: equipment models and CRUD JSON endpoints.
	- `maintenance`: maintenance request model + DRF ViewSet/assign action.
	- `teams`: maintenance teams and membership endpoints.
	- `users`: custom `GearguardUser` (extends `AbstractUser`) and auth views.
- settings: PostgreSQL via `.env`; CORS enabled; Jazzmin admin.

## Tech Stack
- Python 3.12, Django 5.1, Django REST Framework
- PostgreSQL

## Setup
```bash
cd gearguard_backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

## Environment Variables
Create `.env` in `gearguard_backend/` (already referenced in settings):
```
databasename=...
databaseuser=...
password=...
host=...
port=...
sslmode=...
```

## Database & Migrations
```bash
cd gearguard_backend
python manage.py migrate
python manage.py createsuperuser
```

## Running
```bash
cd gearguard_backend
python manage.py runserver
```

## API Surface (Current)
- `users/`
	- `POST /users/signup/` – create user (username, email, password, first_name, last_name, role)
	- `POST /users/login/` – authenticate; returns user info
- `equipment/`
	- `POST /equipment/create/`
	- `GET /equipment/list/`
	- `GET /equipment/<id>/`
	- `POST /equipment/<id>/update/`
	- `POST /equipment/<id>/delete/`
	- `GET /equipment/<id>/maintenancerequests/`
- `maintenance/`
	- DRF router: `/maintenance/requests/` (list/create/retrieve/update/delete)
	- `POST /maintenance/requests/{id}/assign/` – set team/technician, status to in_progress
	- `GET /maintenance/list/` – list all (plain JsonResponse)
- `teams/`
	- `GET /teams/` – list teams
	- `GET /teams/<id>/` – team detail
	- `POST /teams/create/` – create team with members

