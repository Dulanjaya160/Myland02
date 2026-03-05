# Quick Start - Building Your Desktop Application

## 🚀 Ready to Build?

Follow these steps to create your Windows desktop installer:

### Step 1: Add an Application Icon (Required)

The build will fail without an icon. You need to create or obtain an `.ico` file.

**Quick option:**
1. Find any PNG image (your logo or a food-related icon)
2. Go to https://convertio.co/png-ico/
3. Convert to ICO format
4. Save as `electron/icon.ico`

See `electron/ICON_README.md` for detailed specifications.

---

### Step 2: Run the Build Script

Open PowerShell in the project root and run:

```powershell
.\build-desktop.bat
```

This will:
- ✅ Build the backend JAR
- ✅ Create a minimal Java runtime (~50MB)
- ✅ Copy files to Electron resources
- ✅ Install Electron dependencies
- ✅ Build the Windows installer

**Build time:** ~5-10 minutes (first time)

---

### Step 3: Find Your Installer

The installer will be created at:
```
electron\dist\Myland Food Management-Setup-1.0.0.exe
```

**Installer size:** ~250MB (includes everything - no Java needed on customer machines)

---

## 📋 Prerequisites

Make sure you have these installed:

- ✅ **JDK 17 or higher** (for jlink tool)
  - Download: https://adoptium.net/
  - Verify: `java -version` should show 17+
  
- ✅ **Maven**
  - Verify: `mvn -version`
  
- ✅ **Node.js 18+**
  - Download: https://nodejs.org/
  - Verify: `node -v` should show v18+

---

## 🧪 Testing Before Building

Want to test the Electron app before building the installer?

```powershell
# First, build the backend JAR and create JRE
mvn clean package -DskipTests
jlink --add-modules java.base,java.sql,java.naming,java.desktop,java.management,java.instrument,java.xml,jdk.unsupported,jdk.crypto.ec --output electron\resources\jre --strip-debug --no-header-files --no-man-pages --compress=2
copy target\myland-system-1.0.0.jar electron\resources\backend.jar

# Then test in development mode
cd electron
npm install
npm start
```

---

## ❓ Troubleshooting

### "jlink is not recognized"
- Install JDK 17 (not just JRE)
- Add JDK bin directory to PATH
- Example: `C:\Program Files\Eclipse Adoptium\jdk-17.0.x\bin`

### "Cannot find icon.ico"
- Create an icon file as described in Step 1
- Place it at `electron/icon.ico`

### Build fails at npm install
- Delete `electron/node_modules` folder
- Run `npm install` again

---

## 📖 More Information

- **Detailed Build Instructions:** See `electron/BUILD.md`
- **Desktop App Overview:** See `DESKTOP_README.md`
- **Implementation Details:** See the walkthrough artifact

---

## ✨ What You Get

After building, you'll have a professional Windows installer that:

- ✅ Installs like any Windows application
- ✅ Creates desktop and start menu shortcuts
- ✅ Requires **no Java installation** on customer machines
- ✅ Stores data in user directory (persists across updates)
- ✅ Prevents multiple instances from running
- ✅ Starts backend automatically
- ✅ Works completely offline

**Ready to distribute to non-technical users!**
