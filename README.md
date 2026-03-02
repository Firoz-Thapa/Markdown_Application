# 📝 Markdown Application

> A modern, feature-rich markdown editor with real-time preview and mathematical equation support.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://markdown-application.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)

## ✨ Features

### 🎨 **Rich Editor Experience**
- **Real-time Preview** - See your markdown rendered instantly
- **Syntax Highlighting** - CodeMirror-powered editor with markdown syntax highlighting
- **Split View** - Side-by-side editor and preview panes
- **Mobile Responsive** - Toggle between editor and preview on mobile devices

### 🧮 **Mathematical Support**
- **LaTeX Integration** - MathJax-powered mathematical equation rendering
- **Inline & Display Math** - Support for both `$inline$` and `$$display$$` equations
- **Math Toolbar** - Quick insertion of common mathematical expressions
- **Real-time Rendering** - Equations render as you type


### 🛠️ **Productivity Tools**
- **Auto-save** - Automatic content saving with recovery
- **Export Options** - Save as Markdown, HTML, or PDF
- **Document Statistics** - Real-time word count, character count, and reading time
- **Dark Mode** - Eye-friendly dark theme
- **Keyboard Shortcuts** - Efficient editing with hotkeys

### 📊 **Advanced Formatting**
- **Tables** - Visual table creation and editing
- **Task Lists** - Interactive checkboxes
- **Code Blocks** - Syntax-highlighted code snippets
- **Links & Images** - Easy media insertion
- **Typography** - Bold, italic, strikethrough, headings, and more

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/markdown-application.git
   cd markdown-application
   ```

2. **Set up environment variables**
   ```bash
   # Copy environment templates
   cp frontend/.env.template frontend/.env
   cp Backend/.env.template Backend/.env
   # If you're deploying Netlify functions, also add variables in Netlify dashboard
   
   # Edit with your actual values
   nano frontend/.env  # Add any frontend config
   nano Backend/.env   # Add your JWT secret or other server configs
   # Set OPENAI_API_KEY (or GROQ_API_KEY) in the environment where the Netlify function runs
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

4. **Install backend dependencies** (optional)
   ```bash
   cd ../Backend
   npm install
   ```

5. **Start the development server**
   ```bash
   # Frontend only
   cd frontend
   npm start
   
   # Or with backend
   cd Backend
   npm run dev
   ```

6. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🏗️ Architecture

### Frontend Stack
- **React 18.3.1** - Modern React with hooks and concurrent features
- **CodeMirror 6** - Advanced code editor with syntax highlighting
- **MathJax 3** - Mathematical notation rendering
- **Showdown** - Markdown to HTML conversion

### Backend Stack (Optional)
- **Node.js & Express** - RESTful API server
- **Sequelize ORM** - Database abstraction layer
- **JWT Authentication** - Secure user authentication
- **bcrypt** - Password hashing

### Development Tools
- **ESLint** - Code linting and formatting
- **GitHub Actions** - CI/CD pipeline
- **Vercel** - Frontend deployment
- **Auto-save** - Local storage backup

## 📖 Usage Guide

### Basic Editing
```markdown
# Heading 1
## Heading 2

**Bold text** and *italic text*

- Bullet points
- [Links](https://example.com)
- ![Images](image-url.jpg)

`Inline code` and code blocks:
```javascript
console.log('Hello, World!');
```
```

### Mathematical Equations
```latex
Inline math: $E = mc^2$

Display math:
$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$

Complex equations:
$$\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$
```

### AI Assistant Commands
- **"Give me a markdown template for a README"**
- **"How do I create tables in markdown?"**
- **"Show me examples of mathematical equations"**

## 🛠️ Development

### Project Structure
```
markdown-application/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API and external services
│   │   └── utils/           # Utility functions
│   └── package.json
├── Backend/                  # Express.js backend (optional)
│   ├── config/              # Database and app configuration
│   ├── middleware/          # Express middleware
│   ├── models/              # Database models
│   ├── routes/              # API endpoints
│   └── package.json
├── .github/workflows/       # CI/CD pipelines
└── docs/                    # Documentation
```

### Available Scripts

**Frontend:**
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run test suite
npm run eject      # Eject from Create React App
```

**Backend:**
```bash
npm run dev        # Start with nodemon
npm start          # Start production server
npm run migrate    # Run database migrations
npm run seed       # Seed database with sample data
```

### Environment Variables

**Frontend (.env):**
```bash
REACT_APP_API_URL=http://localhost:5000/api  # Optional
```

**Backend (.env):**
```bash
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
```
**Frontend (.env):**
```bash
REACT_APP_API_URL=http://localhost:5000/api  # Optional
# (no API key needed here; requests go through the serverless function)
```

**Backend (.env):**
```bash
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
```

## 🚀 Deployment

### Vercel (Recommended for Frontend)

1. **Connect your GitHub repository to Vercel**
2. **Configure build settings:**
   - Framework: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`

3. **Add environment variables in Vercel dashboard:**
   - `REACT_APP_GEMINI_API_KEY`

4. **Deploy automatically on every push to main branch**

### Alternative Deployment Options

- **Netlify** - Frontend static hosting
- **Railway** - Full-stack deployment
- **Docker** - Containerized deployment
- **GitHub Pages** - Static site hosting

### CI/CD Pipeline

The project includes GitHub Actions for:
- ✅ Automated testing
- ✅ Code quality checks
- ✅ Automated deployments
- ✅ Security scanning

## 🧪 Testing

```bash
# Run frontend tests
cd frontend
npm test

# Run backend tests (when available)
cd Backend
npm test

# Run E2E tests
npm run test:e2e
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages
- Add tests for new features


## 🐛 Troubleshooting

### Common Issues

**1. MathJax not loading:**
```bash
# Clear browser cache and reload
# Check internet connection
# Verify CDN availability
```

**2. Environment variables not working:**
```bash
# Ensure .env files are in correct locations
# Restart development server
# Check Vercel environment variables
```

**3. Build failures:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **CodeMirror** - Excellent code editor component
- **MathJax** - Mathematical notation rendering
- **Google Gemini** - AI-powered assistance
- **React Community** - Amazing ecosystem and support
- **Vercel** - Seamless deployment platform

## 🔗 Links

- **Live Demo:** https://markdown-application.vercel.app

---