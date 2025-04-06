#!/bin/bash

# Main script
echo "===== TCS Talent Finder APK Builder ====="

# Running in Replit?
if [ -n "$REPL_ID" ]; then
  echo ""
  echo "===== IMPORTANT: APK BUILDING IN REPLIT ====="
  echo "Building an APK requires Java and Android SDK, which are not available in Replit."
  echo ""
  echo "To build this APK, you need to:"
  echo "1. Clone this repository to your local machine"
  echo "2. Install required dependencies:"
  echo "   - Node.js and npm"
  echo "   - Java Development Kit (JDK) 11 or newer"
  echo "   - Android SDK"
  echo "   - Android Studio (recommended)"
  echo ""
  echo "3. Follow these steps on your local machine:"
  echo "   a. npm install"
  echo "   b. npm run build"
  echo "   c. Fix the dist directory structure:"
  echo "      cp dist/public/index.html dist/"
  echo "      cp -r dist/public/assets dist/"
  echo "      cp -r dist/public/resources dist/"
  echo "      cp dist/public/manifest.json dist/"
  echo "   d. npx cap sync"
  echo "   e. cd android && ./gradlew assembleDebug"
  echo ""
  echo "4. The APK will be available at:"
  echo "   android/app/build/outputs/apk/debug/app-debug.apk"
  echo ""
  echo "Alternatively, you can use the app as a Progressive Web App (PWA):"
  echo "1. Open the web application on your mobile browser"
  echo "2. Use the 'Add to Home Screen' option in your browser"
  echo ""
  exit 0
fi

# If not in Replit, proceed with the full build process
# Function to check for requirements
check_requirements() {
  local missing_requirements=false

  # Check for Java
  if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed or not in PATH"
    echo "   Please install JDK 11 or newer"
    missing_requirements=true
  else
    echo "✅ Java found: $(java -version 2>&1 | head -n 1)"
  fi

  # Check for Android SDK
  if [ -z "$ANDROID_SDK_ROOT" ] && [ -z "$ANDROID_HOME" ]; then
    echo "❌ Android SDK not found (ANDROID_SDK_ROOT or ANDROID_HOME not set)"
    echo "   Please install Android SDK and set environment variables"
    missing_requirements=true
  else
    echo "✅ Android SDK found"
  fi

  if [ "$missing_requirements" = true ]; then
    echo ""
    echo "Missing requirements detected. Please install the required dependencies."
    echo "For detailed instructions, refer to the Capacitor Android documentation:"
    echo "https://capacitorjs.com/docs/android"
    echo ""
    echo "This script will continue, but APK building will likely fail."
    read -p "Press Enter to continue anyway, or Ctrl+C to exit..."
  fi
}

# Check for requirements
check_requirements

# Build the web app
echo "Building web application..."
npm run build

# Fix dist directory structure (copy files to root of dist)
echo "Fixing dist directory structure..."
if [ -d "dist/public" ]; then
  cp dist/public/index.html dist/ 2>/dev/null || :
  cp -r dist/public/assets dist/ 2>/dev/null || :
  cp -r dist/public/resources dist/ 2>/dev/null || :
  cp dist/public/manifest.json dist/ 2>/dev/null || :
  ls -la dist
fi

# Initialize Capacitor if not already done
if [ ! -d "android" ]; then
  echo "Initializing Capacitor..."
  npx cap init "TCS Talent Finder" "com.tcs.talentfinder" --web-dir=dist || true
  
  echo "Adding Android platform..."
  npx cap add android
else
  echo "Syncing changes with Capacitor..."
  npx cap sync
fi

# Copy web assets to Android platform
echo "Copying web assets to Android..."
npx cap copy android

# Build the APK
echo "Building APK..."
cd android && ./gradlew assembleDebug

# Check if build was successful
if [ -f "app/build/outputs/apk/debug/app-debug.apk" ]; then
  echo "✅ APK built successfully!"
  echo "   Location: android/app/build/outputs/apk/debug/app-debug.apk"
  # Copy to project root for easy access
  cp app/build/outputs/apk/debug/app-debug.apk ../tcs-talent-finder.apk
  cd ..
  echo "✅ APK copied to: tcs-talent-finder.apk"
else
  cd ..
  echo "❌ Failed to build APK. Check error messages above."
fi