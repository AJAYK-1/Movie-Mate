# 🎬 Movie Mate – Emotion-Based Movie Recommendation and Ticket Booking System

**Movie Mate** is a full-stack MERN web application that allows users to receive movie recommendations based on emotional input and book tickets for movies currently playing in theaters. The platform enhances the user experience by integrating emotion-driven suggestions and a complete ticket booking workflow.

## 🚀 Features

- 🎭 Emotion-based movie recommendation using sentiment analysis
- 🎟 Book movie tickets from the list of currently running shows
- 👤 User authentication and account creation
- ⭐ View movie details and submit reviews
- 📊 Admin panel for managing users, movies, and theaters
- 💻 Responsive design with React.js and MaterialUI

## 🛠 Tech Stack

**Frontend**  
- React.js  
- Bootstrap  

**Backend**  
- Node.js  
- Express.js

**DataABse**
- MongoDB (Mongoose ODM)  

**Tools**  
- Git & GitHub  
- Postman  
- MongoDB Compass
- JWT Authentication  
- Sentiment Analysis (NLP)


## ⚙️ Installation

### Prerequisites
- Node.js and npm
- MongoDB (local or Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/AJAYK-1/Movie-Mate.git
cd Movie-Mate
```

### 2. Install dependencies for backend
```bash
cd backend
npm install express
```

### 3. Install dependencies for frontend
```bash
cd ../frontend
npm install react vite@latest
```

### 4. Environment Setup

Create a `.env` file in the `backend/` folder with the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 5. Run the app

#### Backend
```bash
cd backend
npm start
```

#### Frontend
```bash
cd ../frontend
npm run dev
```

App runs at: `http://localhost:9000`

## 📂 Folder Structure

```
Movie-Mate/
│
├── backend/       # Express API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── frontend/      # React application
│   ├── components/
│   ├── pages/
│   └── App.js
```

## ✅ To-Do / Enhancements

- [ ] Improve NLP model or integrate external sentiment APIs
- [ ] Deploy on cloud (Render/Netlify/Heroku)

## 👨‍💻 Author

**Ajay Kumar T P**  
📧 ajaykumartp10@gmail.com  
🔗 [LinkedIn](https://linkedin.com/in/ajaykumartp) | [GitHub](https://github.com/AJAYK-1)

---

> If you find this project interesting, feel free to fork, star ⭐, or contribute!
