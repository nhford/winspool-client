# Wins Pool Tracker

## Check it Out!

[winspool-client.vercel.app](winspool-client.vercel.app)

## Overview

Wins Pool Tracker is a full-stack application built to track and analyze team performance in my friends fantasy-style competition of Winspool. The dashboard leverages data from Basketball Reference and Pro Football Reference to provide up-to-date insights and engaging visualizations of league standings, head to head records, and more. The project utilizes a fully-piped backend-to-frontend architecture, with daily data updates via cron jobs, a python backend in Jupyter Notebook, and a SQL-powered database hosted on CockroachDB.

## Key Features:

Real-time team performance data fetched from external sources (Basketball Reference & Pro Football Reference)
Fully integrated frontend and backend: SQL queries and API calls for fetching and displaying data
Hosted frontend on Vercel for quick and easy access
CockroachDB used as the free, reliable database solution for data persistence

### Technologies Used

#### Frontend:

- ReactJS
- CSS for styling
- Deployed via Vercel

#### Backend:

- Jupyter Notebooks (Python)
- Web scraping from Basketball Reference and Pro Football Reference
- SQL queries using CockroachDB to store, retrieve, and manage data
- Cron tasks for daily automated updates

#### Database:

- CockroachDB (Free-tier hosting for easy, distributed SQL storage)

## Architecture

The application consists of two main parts:

### Backend:

Jupyter notebooks that scrape the necessary data (team standings, statistics, etc.) from Basketball Reference and Pro Football Reference.
SQL queries are used to insert, update, and manage the data in the CockroachDB database.
Cron tasks are scheduled to run daily, ensuring the data is pulled and updated automatically.

### Frontend:

The React-based dashboard is deployed on Vercel, where users can interact with the data, view statistics, and track team performance in real-time.
The frontend is integrated with the backend through fetch requests to the backend API, allowing seamless interaction with the live data stored in the database.

## How It Works

### Data Collection:

Every day, cron tasks trigger Python scripts running in Jupyter notebooks. These notebooks scrape relevant team data from Basketball Reference and Pro Football Reference, clean it, and push it to the CockroachDB database.

### Database:

The data is stored in a SQL-based database on CockroachDB. SQL queries are used to fetch the data, which is then displayed on the frontend.

### Frontend Display:

The React frontend makes fetch requests to the backend to retrieve the latest data. This data is displayed in an easy-to-understand format, helping users quickly view key insights and statistics.

### Cron Jobs:

Set up using cron tasks, these jobs make daily API requests and ensure that the database is continuously updated with the latest information. The cron jobs are scheduled to run at specific times to minimize the impact on performance.

## Deployment

The frontend is deployed to Vercel, making it accessible from any browser. The backend processes are managed through Jupyter Notebooks and the database is hosted on CockroachDB, which provides a free-tier for easy hosting and scaling.
