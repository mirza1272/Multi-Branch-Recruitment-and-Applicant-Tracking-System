# HRConnect - Advanced Multi-Branch Recruitment & ATS 🚀

**HRConnect** is a premium, full-stack Applicant Tracking System (ATS) designed to streamline recruitment across multiple branches. It provides a seamless experience for both recruiters (HR) and candidates, featuring real-time notifications, automated status updates, and a responsive modern UI.

---

## 🌐 Live Demo
- **Frontend:** [https://hrconnect-ats.vercel.app](https://hrconnect-ats.vercel.app)
- **Backend URL:** [https://multi-branch-recruitment-and-applicant.onrender.com](https://multi-branch-recruitment-and-applicant.onrender.com)

---

## ✨ Key Features

### 👤 For Candidates
- **Dynamic Job Directory:** Browse and filter jobs by location, department, and type.
- **Seamless Application:** Easy application process with resume upload and cover letter.
- **Application Tracking:** Real-time dashboard to monitor application status (Shortlisted, Accepted, Rejected).
- **Automated Emails:** Instant OTP verification and status change notifications.

### 💼 For Recruiters / Admin
- **Multi-Branch Management:** Manage jobs and applications across different office branches.
- **Job Lifecycle Management:** Create, update, and close job postings.
- **Smart Screening:** Efficiently review applications and change candidate statuses.
- **Interview Scheduling:** Integrated interview scheduler with automated email invites.
- **Advanced Dashboard:** Real-time stats on hiring progress and branch performance.

### 🤖 Intelligent Features
- **Smart Recommendation System:** Advanced scoring algorithm that suggests relevant jobs based on department matching and branch proximity.
- **Live Search Engine:** Real-time, case-insensitive search matching across Titles, Companies, and Departments.

### 🛡️ Core Infrastructure
- **Secure Authentication:** JWT-based auth with OTP verification.
- **Bulletproof Emailing:** Integrated with **SendGrid API** for high-deliverability notifications.
- **Responsive Design:** Fully optimized for Mobile, Tablet, and Desktop screens (< 768px specialized layouts).

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (Functional Components, Hooks)
- **Vanilla CSS** (Premium Glassmorphism & Custom Animations)
- **React Router** (Client-side Routing)

### Backend
- **Node.js & Express.js**
- **MongoDB & Mongoose** (Database & Schema Design)
- **JWT (JSON Web Tokens)** (Secure Auth)
- **SendGrid API** (Production-grade Emailing)
- **Multer** (File Upload Handling)
- **Supabase** (File Store)

---

## 📂 Project Structure

```bash
Multi-Branch-Recruitment-ATS/
├── WebBackend/           # Node.js Express API
│   ├── src/
│   │   ├── controllers/  # Business Logic
│   │   ├── models/       # MongoDB Schemas
│   │   ├── routes/       # API Endpoints
│   │   ├── utils/        # Mailer, OTP, Error Handlers
│   │   └── app.js        # Express Configuration
│   └── .env              # Environment Variables
├── frontend/             # React Application
│   ├── src/
│   │   ├── Components/   # UI Components (Auth, Dashboard, Jobs)
│   │   ├── api/          # Axios Instance & API Calls
│   │   ├── context/      # Auth Context
│   │   └── App.jsx       # Main Routing
│   └── .env              # Frontend Environment Variables
└── README.md             # Project Documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v16+)
- MongoDB Atlas Account
- SendGrid API Key

### 2. Backend Setup
```bash
cd WebBackend
npm install
# Create a .env file and add:
# MONGO_URI, JWT_SECRET, SENDGRID_API, EMAIL_USER
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Create a .env file and add:
# VITE_API_URL=http://localhost:4000
npm run dev
```

---

## 🤝 Contributors

Special thanks to the team behind HRConnect:

- **Haseeb ur Rahman** (23F-0566) - *Lead MERN Stack Developer & System Architect*
- **Areeba Majeed** (23F-0651) - *MERN Stack Developer*
- **Maheen Fatima** (23F-0595) - *MERN Stack Developer*

---

## 🔖 Release Versions

### [v2.0] - Latest Release
- **Enhanced Application Tracking:** Resolved critical issues where application statuses were not correctly synchronizing in real-time.
- **Role-Aware Restrictions:** Candidates are now prevented from re-applying to jobs they have already submitted for.
- **Mobile UI Polish:** Optimized dashboard views for devices under 768px.

### [v1.0] - Initial Launch
- Basic recruitment workflow and multi-branch support.

---

## 📄 Detailed Documentation
For complete system architecture, implementation details, testing, workflows, and deployment information, check:

[PROJECT_REPORT.md](./PROJECT_REPORT.md)

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

---

### 📬 Contact & Support
For any inquiries, reach out via the **Contact Us** page on the platform or email at [mirzahaseeb0566@gmail.com](mailto:mirzahaseeb0566@gmail.com).

> **Note:** If you don't receive emails (OTPs/Status updates), please **Check your Spam Folder**.
