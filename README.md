# Smart Public Grievance Redressal System

A modern, AI‑enabled civic grievance management platform designed to improve transparency, accountability, and efficiency in public complaint handling.

---

## 📌 Project Overview

The Smart Public Grievance Redressal System is a web‑based platform that allows citizens to:

- Submit civic complaints
- Track complaint status in real time
- View resolution progress transparently
- Communicate with administrative authorities

The system integrates AI‑based classification, priority detection, and structured resolution workflows to ensure accountability and efficiency.

This repository currently contains the **frontend implementation** of the project.

---

## 🏗 System Architecture

The system follows a layered architecture:

Frontend (Single Page Application)  
⬇  
Backend API (Spring Boot – In Progress)  
⬇  
AI Microservice (Python NLP – In Progress)  
⬇  
MySQL Database  

---

## 💻 Tech Stack (Frontend)

- HTML5
- CSS3 (Custom Styling)
- Vanilla JavaScript
- Chart.js (via CDN)
- Google Fonts
- SPA-based page switching logic
- Dynamic dashboard rendering

---

## 📂 Project Structure

smart-grievance-portal/
│
├── index.html # Main Single Page Application (SPA)
│
├── css/
│ └── style.css # Extracted styling
│
├── js/
│ └── script.js # Extracted JavaScript logic

---

## 🚀 Features Implemented (Frontend)

### ✅ Landing Page
- Animated hero section
- Scroll-based multi-section layout
- System highlights
- Dashboard preview
- Responsive navigation

### ✅ Authentication (Demo Mode)
- User login
- Admin login
- Registration
- Role toggle (User / Admin)

### ✅ User Portal
- Dashboard with dynamic stats
- Complaint submission form
- AI suggestion simulation
- Complaint history table
- Complaint tracking stepper
- Profile management

### ✅ Admin Portal
- Complaint management dashboard
- Complaint approval / rejection
- Status updates
- User management view
- Reports & analytics charts
- CSV export feature

### ✅ AI Simulation
Currently implemented as frontend simulation:
- Category detection
- Priority detection
- Department suggestion

This will be replaced with backend NLP integration.

🎓 Academic Context
Developed as part of BCA Final Year Project
D Y Patil International University
Session 2025–2026
