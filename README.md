# MockMate - AI-Powered Mock Interview Platform

An intelligent mock interview platform that enables users to practice interviews using their resume and receive detailed AI-generated analysis reports. The platform supports both text and voice-based interactions with AI-powered feedback.

---

## 📁 Project Structure

```
mockMate/
├── Backend/
│   ├── db.js                      # MongoDB connection configuration
│   ├── server.js                  # Application entry point
│   ├── package.json               # Dependencies and scripts
│   ├── controllers/
│   │   ├── auth.controller.js     # Authentication logic
│   │   ├── resume.controller.js   # Resume processing and parsing
│   │   ├── interview.controller.js # Interview session management
│   │   └── analysis.controller.js # AI-powered analysis generation
│   ├── middleware/
│   │   ├── auth.middleware.js     # JWT authentication verification
│   │   └── upload.middleware.js   # File upload handling (Multer)
│   ├── models/
│   │   ├── user.model.js          # User schema definition
│   │   └── interview.model.js     # Interview session schema
│   ├── routes/
│   │   ├── auth.routes.js         # Authentication endpoints
│   │   ├── resume.routes.js       # Resume management endpoints
│   │   ├── interview.routes.js    # Interview session endpoints
│   │   └── analysis.routes.js     # Analysis report endpoints
│   └── uploads/                   # Resume file storage directory
│
└── Frontend/
    ├── index.html                 # Authentication page
    ├── js/
    │   ├── config.js              # API configuration
    │   └── api.js                 # API communication layer
    └── pages/
        ├── dashboard.html         # User dashboard
        ├── interview.html         # Interview interface
        └── analysis.html          # Analysis report display
```

---

## � Prerequisites

Before setting up the project, ensure the following software is installed:

### Node.js & npm
- Download LTS version from [nodejs.org](https://nodejs.org)
- Verify installation:
  ```bash
  node --version    # Should be v18 or higher
  npm --version
  ```

### MongoDB
Choose one of the following options:

**Option 1: Local MongoDB**
- Download from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
- For Windows: Download and run the `.msi` installer
- MongoDB Compass (GUI tool) will be installed automatically

**Option 2: MongoDB Atlas (Cloud)**
- Create free account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
- Set up a free cluster
- Obtain connection string from Atlas dashboard

### Development Tools
- **VS Code**: [code.visualstudio.com](https://code.visualstudio.com)
- **Required Extensions**:
  - Live Server (ritwickdey.LiveServer)
  - Thunder Client (optional, for API testing)

### OpenAI API Key
1. Visit [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create a new account or log in
3. Generate a new secret key
4. Add credit to your account (minimum $5 recommended)

---

## 🚀 Installation & Setup

### Step 1: Backend Configuration

Navigate to the Backend directory and install dependencies:

```bash
cd Backend
npm install
```

Create a `.env` file in the Backend directory with the following configuration:

```env
PORT=5000
NODE_ENV=development

# MongoDB Connection (choose one)
# Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/mock_interview

# MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mock_interview

JWT_SECRET=your_secret_key_here_12345
JWT_EXPIRE=7d

OPENAI_API_KEY=sk-proj-your-api-key-here

MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
FRONTEND_URL=http://127.0.0.1:5500
```

Start the backend server:

```bash
npm run dev
```

Expected output:
```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:5000
```

### Step 2: Frontend Setup

1. Open the `Frontend` folder in VS Code
2. Right-click on `index.html`
3. Select **"Open with Live Server"**
4. The application will automatically open in your browser at `http://127.0.0.1:5500`

---

## 📋 Usage Guide

1. **Register**: Create a new account on the login page
2. **Upload Resume**: Upload your resume (PDF format) from the dashboard
3. **Configure Interview**: Select job role and interview mode (text or voice)
4. **Start Interview**: Begin the mock interview session
5. **Answer Questions**: Respond to AI-generated questions
6. **Generate Report**: Receive detailed performance analysis and feedback

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new user account |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user information |
| POST | `/api/resume/upload` | Upload resume document |
| GET | `/api/resume/info` | Retrieve resume information |
| POST | `/api/interview/start` | Initialize interview session |
| POST | `/api/interview/:id/answer` | Submit interview answer |
| GET | `/api/interview/history` | Retrieve interview history |
| POST | `/api/analysis/:id` | Generate analysis report |
| GET | `/api/analysis/:id` | Retrieve analysis report |

---

### Backend Deployment (Railway)

1. Visit [railway.app](https://railway.app)
2. Sign in with GitHub account
3. Create new project → Deploy from GitHub repository
4. Select the `Backend` folder
5. Add environment variables (same as `.env`)
6. Deploy and obtain the API URL

### Frontend Deployment (Netlify)

1. Visit [netlify.com](https://netlify.com)
2. Sign in with GitHub account
3. Update `Frontend/js/config.js` with deployed backend API URL:
   ```js
   API_URL: "https://your-deployed-backend.com/api"
   ```
4. Drag and drop the `Frontend` folder to Netlify
5. Deployment will complete automatically

---

## 🔍 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB service is running
- On Windows: Open Services → Locate MongoDB → Start service
- Verify connection string in `.env` file

### npm Installation Failures
- Delete `node_modules` folder
- Clear npm cache: `npm cache clean --force`
- Run `npm install` again

### OpenAI API Errors
- Verify API key is correct in `.env`
- Confirm account has available credits
- Check API key permissions in OpenAI dashboard

### CORS Errors
- Verify `FRONTEND_URL` in `.env` matches actual frontend address
- Example: `http://127.0.0.1:5500`

### Voice Mode Not Working
- Use Chrome browser (recommended for Web Speech API)
- Ensure HTTPS is used in production
- Check browser microphone permissions

---

## 📝 Technology Stack

- **Frontend**: HTML5, JavaScript, CSS3
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **AI Integration**: OpenAI API
- **File Upload**: Multer
- **Hosting**: Railway (Backend), Netlify (Frontend)

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👥 Support

For issues, questions, or contributions, please open an issue in the repository or contact the development team.

---

**Last Updated**: April 2026