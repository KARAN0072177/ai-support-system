# AI Support System 🧠💬  
A modern AI-powered customer support SaaS built using the **MERN stack**.  
This platform enables organizations and users to manage customer queries efficiently using automation, AI, and real-time communication.

---

# ✨ Features (Current)

## 🔐 Authentication System
- User **signup** with:
  - Username, email, password  
  - Server-side validation  
  - Unique username & email checks  
- **Email OTP verification** (6-digit OTP valid for 10 minutes)  
- Converts `PendingUser` → `User` after OTP verification  
- Sends **welcome email** after account creation  
- Login with:
  - Username **or** email  
  - Password (bcrypt-hashed)  
  - Returns **JWT token** (7-day expiry)  
- Logout includes:
  - Session clearing on frontend  
  - Confirmation modal for better UX  

---

## 👤 Profile System
- Shows:
  - Username  
  - Masked email (e.g., `ka********om`)  
  - Toggle to reveal actual email  
  - Login method displayed with icon  
- Redirects automatically if user is not authenticated  

---

## 🧭 Navbar Session Awareness
- Shows **Login** button when user is not logged in  
- Shows **Logout** button when session exists  
- Logout uses a **confirmation popup**  
- Built using:
  - React Router DOM  
  - Framer Motion animations  
  - Lucide Icons  

---

# 🧱 Tech Stack

## Frontend
- React (Vite)
- React Router DOM  
- Tailwind CSS  
- Framer Motion  
- Lucide Icons  

## Backend
- Node.js + Express  
- MongoDB + Mongoose  
- Nodemailer (Gmail integration)  
- bcryptjs  
- jsonwebtoken  
- dotenv  

---

## ⚙️ Backend Setup

### 1️⃣ Navigate to the server folder  
Open your terminal and move into the `server` directory inside the project.

### 2️⃣ Install backend dependencies  
Install all required Node.js packages listed in `server/package.json`.  
The backend uses technologies such as Express, Mongoose, CORS, Dotenv, Nodemailer, Bcryptjs, and JSON Web Token.

### 3️⃣ Create a `.env` file inside the `server` directory  
Add the following environment variables:

- MONGO_URI → Your MongoDB connection string  
- PORT → The port where your backend will run (example: 5000)  
- JWT_SECRET → A strong secret key used for signing JWT tokens  
- EMAIL_USER → Your Gmail address (used to send OTP emails)  
- EMAIL_PASS → Your Gmail App Password  

**Important Notes:**  
- Gmail App Password requires turning on Google 2-Step Verification.  
- Never commit your `.env` file to GitHub.

### 4️⃣ Start the backend server  
Use the npm script defined in `package.json` to start the backend locally.  
Once running, your backend will be available on your configured port (for example: http://localhost:5000).


---

## 🎨 Frontend Setup

### 1️⃣ Navigate to the client folder  
Open your terminal and move into the `client` directory of the project.

### 2️⃣ Install frontend dependencies  
Install all required packages listed in `client/package.json`.  
The frontend uses technologies such as React, Vite, Tailwind CSS, React Router DOM, Framer Motion, and Lucide Icons.

### 3️⃣ Start the development server  
Use the npm script defined in `client/package.json` to run the development server.  
Once running, the frontend will be available locally in your browser at the development URL provided by Vite (for example: http://localhost:5173).

### 4️⃣ Tailwind CSS integration  
Tailwind is pre-configured for utility-based styling across components.  
You can customize global styles through `tailwind.config.js` if needed.

### 5️⃣ Environment variables (optional)  
If the frontend requires environment variables in the future, create a `.env` file inside the `client` folder.  
Do not commit this file to GitHub.

---

## 🗺️ Roadmap

The AI Support System is an evolving SaaS platform.  
Below is the planned roadmap outlining upcoming features and improvements:

### 🔹 Authentication & User Management
- Add organization (company) signup and multi-tenant architecture  
- Role-based access (User, Agent, Organization Admin)  
- Password reset via email  

### 🔹 Ticket System (Core Feature)
- User can create support tickets  
- Ticket categories and priority levels  
- Agent dashboard to manage and respond to tickets  
- Ticket filters: Open, Pending, Resolved  
- Ticket history and activity timeline  

### 🔹 Messaging & Real-Time Communication
- Real-time chat between user and support agent  
- Typing indicators and message seen status  
- Unread message count badges  
- WebSockets using Socket.IO  

### 🔹 AI Features
- Automatic ticket classification  
- AI-generated ticket summaries  
- Suggested AI responses for agents  
- Sentiment analysis for customer messages  

### 🔹 Dashboard & Analytics
- Organization analytics panel  
- Response time statistics  
- Ticket volume trends  
- Agent performance metrics  

### 🔹 UI/UX Enhancements
- Dark mode  
- Fully responsive dashboard layout  
- Improved navigation and sidebar design  

### 🔹 Deployment & DevOps
- Deploy backend to Render, Railway, or AWS  
- Deploy frontend to Vercel  
- Use MongoDB Atlas for production database  
- CI/CD pipeline for automated builds  

### 🔹 Future Expansion
- Customer knowledge base system  
- Email-to-ticket conversion  
- Multi-language support  
- Mobile-friendly PWA version  

---

## 🤝 Contributing

Contributions, ideas, and improvements are welcome!  
This project is actively evolving, and community involvement helps it grow stronger.

### 🔹 How to Contribute
- Fork the repository  
- Create a new feature branch  
- Make your changes  
- Commit with clear and descriptive messages  
- Open a pull request for review  

### 🔹 Contribution Guidelines
- Keep your code clean and readable  
- Follow existing file structure and naming conventions  
- Write meaningful commit messages  
- Avoid pushing sensitive data such as `.env` files  
- Ensure your changes do not break existing functionality  

### 🔹 Good First Contribution Ideas
- Improve UI components  
- Add frontend validation  
- Write documentation sections  
- Create reusable React components  
- Refactor backend controllers or routes  
- Add comments or improve error messages  

### 🔹 Feature Requests
If you have a feature idea, feel free to open an issue and describe it.  
Bug reports, enhancement suggestions, and UI/UX improvements are encouraged.

We appreciate all contributors who help make this project better!  

---

## 🎉 Final Notes

Thank you for exploring the AI Support System project!  
This platform is actively being developed with the goal of becoming a full-featured, AI-powered customer support SaaS.

Your feedback, ideas, and contributions are always welcome.  
Whether you're here to learn, contribute, or get inspired, we appreciate your interest in this project.

If you find this repository helpful, consider giving it a ⭐ on GitHub — it motivates further development and helps others discover the project.

Stay tuned for exciting updates, new features, and continuous improvements!

