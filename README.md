# 🤖 AI Study Planner

An AI-powered full-stack web application that helps students manage subjects, organize study tasks, create study schedules, track progress, and receive personalized study recommendations using Gemini AI.

---

## 📌 Problem Statement

Students often find it difficult to organize their subjects, manage study tasks, set priorities, follow a study schedule, and track their study progress.

The AI Study Planner provides a simple platform where students can manage their academic tasks and receive AI-based study recommendations according to their tasks, priorities, dates, and completion status.

---

## 🎯 Assigned Feature Set

### Feature Set B

The project implements the following required features:

- Add, edit, and delete subjects and tasks
- Set priority for tasks
- Set study schedule
- Track completed and pending tasks
- Display study progress

---

## ✅ Implemented Features

### 🔐 Authentication
- Student registration
- Student login
- Logout
- Protected application routes
- Firebase Authentication

### 📚 Subject Management
- Add subjects
- Edit subjects
- Delete subjects
- Store subjects in Cloud Firestore

### 📝 Task Management
- Add study tasks
- Edit study tasks
- Delete study tasks
- Assign tasks to subjects
- Set task priority
- Set study date
- Set start and end time
- Mark tasks as completed or pending

### 📅 Study Schedule
- Display scheduled study tasks
- Show study date and time
- Display task priority
- Show completed/pending status

### 📊 Dashboard
- Total subjects
- Total tasks
- Completed tasks
- Pending tasks
- Overall completion percentage
- Today's scheduled tasks

### 🤖 AI Study Recommendations
- Uses Gemini AI
- Analyzes current study tasks
- Considers task priority
- Considers study dates and times
- Considers completed and pending tasks
- Generates a personalized study plan
- Provides study tips and break suggestions

---

## 🛠️ Technology Stack

### Frontend
- React
- Vite
- JavaScript
- Tailwind CSS

### Backend Services
- Firebase Authentication
- Cloud Firestore

### AI
- Google Gemini API
- `@google/genai`

### Development Tools
- Visual Studio Code
- Git
- GitHub
- Google Antigravity
- ChatGPT

---

## 🏗️ Application Architecture

```text
                    AI Study Planner
                           |
              +------------+------------+
              |                         |
        React + Vite              Gemini AI
              |                         |
       Firebase SDK              Gemini API
              |
       +------+------+
       |             |
 Firebase Auth   Firestore