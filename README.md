# 🎯 AI-Powered Resume Analyzer & Job Matcher

A **full-stack web application** that analyzes resumes against job descriptions using **classical NLP techniques** to provide match scores, skill gaps, ATS compatibility checks, and improvement suggestions — **100% free, private, and runs locally**.

![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![React](https://img.shields.io/badge/react-18-blue)
![MongoDB](https://img.shields.io/badge/mongodb-latest-green)

---

## 🚀 Overview

This project compares a **resume PDF** with a **job description** and instantly generates:

* Resume–Job match score
* Skill match & missing skills
* ATS compatibility score
* Actionable improvement suggestions

🔒 No paid AI APIs
⚡ Fast (3–5 seconds)
🧠 Uses classical NLP (not GPT)
📂 Runs fully on your system

---

## ✨ Features

* 📄 PDF resume text extraction
* 🧠 Resume–JD similarity scoring
* 🛠 Skill gap analysis (500+ skills)
* 📊 ATS compliance checking
* 📈 Analysis history & statistics
* 🔐 JWT-based authentication
* 📥 PDF report export
* 📱 Fully responsive UI

---

## 🧠 AI / NLP Techniques Used

> ⚠️ **No Deep Learning, No GPT, No Paid APIs**

* **TF-IDF** – Text vectorization
* **Cosine Similarity** – Resume vs Job matching
* **Jaccard Similarity** – Keyword overlap
* **Regex-based Skill Extraction**
* **Rule-based ATS Scoring**
* **Template-based Suggestions**

✅ Fully **free**, **transparent**, and **educational**

---

## 🛠 Tech Stack

### Frontend

* React 18 + Vite
* Tailwind CSS
* Axios
* jsPDF

### Backend

* Node.js + Express
* MongoDB + Mongoose
* JWT Authentication
* Multer (file uploads)
* pdf-parse
* Natural (NLP library)

---

## 📦 Prerequisites

* Node.js v18+
* npm
* MongoDB (Local or Atlas)
* Git

---

## ⚙️ Installation

```bash
git clone https://github.com/Darshan-Ramagade/Resume-AI.git
cd ai-resume-analyzer
```

### Backend Setup

```bash
cd server
npm install
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## 🔐 Environment Variables

### `server/.env`

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/resume-analyzer
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

### `client/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📁 Project Structure

```
resume-analyzer/
├── client/      # React frontend
└── server/      # Node.js backend
```

---

## 🔄 How It Works

1. Upload resume PDF
2. Paste job description
3. Extract & preprocess text
4. Calculate similarity scores
5. Check ATS rules
6. Generate suggestions
7. Save results & show dashboard

---

## 📡 API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Resume Analysis

```http
POST   /api/analyze
GET    /api/analyze/history
GET    /api/analyze/stats
GET    /api/analyze/:id
DELETE /api/analyze/:id
```

---

## 🐛 Troubleshooting

* **Zero score?** → Resume is scanned (image-based PDF)
* **MongoDB error?** → Check URI & IP whitelist
* **No skills detected?** → Add a clear SKILLS section

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Commit changes
4. Push and open a Pull Request

---

## 👨‍💻 Author

**Your Name**
GitHub: [https://github.com/Darshan-Ramagade](https://github.com/Darshan-Ramagade)
LinkedIn: [https://linkedin.com/in/Darshan Ramagade](https://shorturl.at/le329)

---

⭐ **Star this repository if you found it useful!**
