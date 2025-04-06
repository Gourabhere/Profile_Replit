# TCS Talent Finder Mobile Application

A mobile application for TCS (Tata Consultancy Services) talent management that enables browsing, searching, and managing candidate profiles with a mobile-friendly interface.

## Features

- Browse and search candidates
- Advanced filtering by skills, experience, and availability
- View detailed candidate profiles
- Save favorites for quick access
- Upload candidate data via CSV
- Mobile-optimized interface

## Web Application

The web application is already set up and running. To start it:

1. Click on the "Start application" workflow in the Replit interface.
2. The application will start and be accessible via the Replit webview.

## Building an Android APK

The project has been set up with Capacitor to enable Android APK building. Due to Replit's environment limitations (Java/Android SDK requirements), the APK needs to be built locally:

```bash
# Run the build script which handles the entire process
./build-apk.sh
```

The script will:
1. Build the web application
2. Fix the dist directory structure
3. Sync with Capacitor
4. Build the Android APK (on a local machine)

### Requirements for local building:

- Node.js and npm
- Java Development Kit (JDK) 11 or newer
- Android SDK
- Android Studio (recommended for easier setup)

### Alternative for quick testing

For quick testing without building the APK, you can:

1. Open the web application on your mobile browser
2. Use the "Add to Home Screen" option in your browser settings
3. This will create a Progressive Web App (PWA) shortcut on your home screen

## Development

The application is built with:
- React.js for the frontend
- Express.js for the backend
- Capacitor for Android wrapping
- Shadcn UI components
- Tailwind CSS for styling

Data is currently stored in memory for demonstration purposes.
