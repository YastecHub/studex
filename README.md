<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# StuDex Desktop App 🚀

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

A powerful desktop application for students to post jobs, find freelancers, and gain experience while earning. Built with React, TypeScript, and Electron.

## ✨ Features

- **Modern Desktop UI**: Beautiful, responsive design optimized for desktop
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Real-time Updates**: Live notifications and updates
- **Secure**: Built with security best practices
- **Fast Performance**: Optimized for speed and efficiency

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Open `.env.local`
   - Replace `your_gemini_api_key_here` with your actual Gemini API key

3. **Run the desktop app:**
   ```bash
   npm run electron
   ```
   
   Or double-click `start-desktop.bat` on Windows

## 📱 Available Scripts

- `npm run dev` - Start web development server
- `npm run electron` - Start desktop app in development mode
- `npm run build` - Build for production
- `npm run electron-pack` - Build desktop app for distribution
- `npm run dist` - Create distributable desktop app

## 🏗️ Build for Distribution

```bash
npm run dist
```

This will create platform-specific installers in the `dist-electron` folder:
- Windows: `.exe` installer
- macOS: `.dmg` file
- Linux: `.AppImage` file

## 🎨 Desktop Features

- **Sidebar Navigation**: Easy access to all features
- **Modern Design**: Glass morphism and gradient effects
- **Responsive Layout**: Adapts to different screen sizes
- **Native Menus**: Platform-specific menu bars
- **System Integration**: Native notifications and system tray

## 🔧 Development

The app is built with:
- **Frontend**: React 19 + TypeScript
- **Desktop**: Electron
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router
- **Build Tool**: Vite

## 📦 Project Structure

```
studex/
├── electron/          # Electron main process
├── components/        # React components
├── pages/            # Application pages
├── dist/             # Web build output
├── dist-electron/    # Desktop build output
└── package.json      # Dependencies and scripts
```

## 🌟 Original AI Studio App

View the original web version: https://ai.studio/apps/drive/164dZsdK8RKuqt88G5YCUm_7_C90_h2QC
