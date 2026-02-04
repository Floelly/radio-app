# Radio App – Mobile Software Engineering

This project is a student-built radio app developed as part of the "Mobile Software Engineering" module at the International University Erfurt. The main focus is on the frontend implementation, while the backend is only provided as a stubbed python service that simulate the radio station’s existing systems.

## Project Status

Student project, finished 02/2026 – not maintained.

## Features

- Display of the currently playing track (artist, title, year, etc.)
- Listener playlist ratings
- Song request functionality
- Listener rating of radio hosts to share opinions on moderation
- Live overview of recent ratings for moderators to react quickly


## How To Run

1. Clone this repository:
```bash
git clone <repo-url>
cd <repo-root>
```
2. Build and run backend stub
```bash
docker build -t radio-api ./backend
docker run --rm -p 8080:8080 --name radio-api radio-api
```
3. Install dependencies and run frontend
```bash
cd radio-app-frontend
npm install
npm run dev
```
If you change the backend ip/port, make sure to provide the backend location as environment variable to frontend. (``VITE_BACKEND_BASE_URL``)

## Project Structure

- `backend/` – Backend stub used for local development and testing
- `radio-app-frontend/` – Vite + React application and main codebase of the radio app
- `Gliederung-Projektbericht.md` – Initial outline draft for the accompanying project report
- `LICENSE` – License file for this repository

## Authors
[v277iy](https://github.com/v277iy) & [Floelly](https://github.com/Floelly)  


## Contributing
This is a student project and is not actively accepting contributions or feature requests.

## Project Status
Student project finished 02/2026 - not maintained

## License
The MIT License (MIT): (see LICENSE file)