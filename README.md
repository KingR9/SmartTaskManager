Smart Task Manager (React Native)

A **React Native task management application** built with **TypeScript** and **Firebase**, featuring intelligent task prioritization, clean architecture, and scalable state management.

---

## Overview

Smart Task Manager goes beyond a basic to-do list by using a **dynamic urgency scoring system** that automatically prioritizes tasks based on deadlines and importance — helping users focus on what truly matters.

---

## Key Highlights

 **Smart Task Sorting** based on urgency, not static order
 **Deadline-aware UI** with human-readable time labels
 **Focus Modes** (Today / High Priority)
 **Firebase Authentication** (Email/Password)
 **Real-time Firestore Sync**
 **Clean, modular React Native architecture**
 **Centralized design system** (colors, spacing, typography)

---

## Core Features

### Authentication

* Secure email/password login & registration
* Session persistence
* Graceful error handling

### Task Management

* Create tasks with title, description, deadline, and priority
* Mark tasks complete / incomplete
* Delete tasks with confirmation
* Real-time updates via Firestore listeners

### Smart Sorting Engine

Tasks are ordered using a calculated **urgency score**:

```
urgencyScore = priorityWeight × (1 / hoursRemaining)
```

* Higher priority → higher urgency
* Near deadlines → float to top
* Overdue tasks → highest urgency
* Completed tasks → always pushed to bottom

### Focus Modes

* **All Tasks**
* **Today**
* **High Priority**

### UI / UX

* Modern dark theme
* Smooth transitions & loading states
* Touch-friendly components
* Empty states with helpful messaging

---

## Project Architecture

```
src/
├── components/    # Reusable UI components
├── screens/       # App screens
├── context/       # Auth & Task state management
├── navigation/    # React Navigation setup
├── services/      # Firebase logic
├── utils/         # Sorting, dates, constants
├── types/         # TypeScript interfaces
```

**Architecture Principles**

* Separation of concerns
* Context API for global state
* Business logic isolated from UI
* Reusable design system

---

## 🛠️ Tech Stack

* **React Native (CLI)**
* **TypeScript**
* **Firebase Authentication**
* **Firebase Firestore**
* **React Navigation**
* **Context API**
* **date-fns**

---

## Firebase Setup (Required)

Firebase configuration files are intentionally **not committed** for security reasons.

### Steps

1. Create a Firebase project
2. Enable **Email/Password Authentication**
3. Create a Firestore database

### Android

* Add `google-services.json` to:

  ```
  android/app/google-services.json
  ```

### iOS

* Add `GoogleService-Info.plist` to:

  ```
  ios/GoogleService-Info.plist
  ```

### Firestore Security Rules

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/tasks/{taskId} {
      allow read, write: if request.auth != null
        && request.auth.uid == userId;
    }
  }
}
```

---

## Running the App

```bash
git clone https://github.com/KingR9/SmartTaskManager.git
cd SmartTaskManager
npm install
npx react-native start
npx react-native run-android
```

---

## Notes

Due to local hardware constraints, running the Android emulator was slow on my system.
The project follows standard **React Native CLI practices** and is fully runnable on any properly configured environment.

I’m happy to walk through the code, architecture, and design decisions.

---

## Security Considerations

* Firebase credentials are not committed
* Per-user Firestore access rules
* No sensitive data stored locally
* HTTPS-only Firebase communication

---

## Future Improvements

* Task categories / tags
* Recurring tasks
* Push notifications
* Offline-first support
* Calendar integration
* Light / Dark theme toggle

---

## License

MIT License

---

**Built with ❤️ using React Native + TypeScript + Firebase**
