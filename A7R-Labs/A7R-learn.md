# 🎓 Programming Tutorial: Understanding the Anytype Codebase

> **Welcome to your journey of learning programming through real-world code!**
> 
> This guide will walk you through the Anytype application codebase, explaining every concept from the ground up. No prior programming experience required!

---

## 📚 Table of Contents

1. [What is this application?](#what-is-this-application)
2. [Where Does Everything Start?](#where-does-everything-start)
3. [Understanding main.ts - The Desktop Side](#understanding-maints---the-desktop-side)
4. [Basic Programming Concepts](#basic-programming-concepts)
5. [Next Steps](#next-steps)

---

## 🎯 What is this application?

This is **Anytype**, a desktop productivity app (similar to Notion or Obsidian) built using modern programming tools:

### **Core Technologies:**

1. **Electron** 
   - Makes desktop apps using web technologies (HTML, CSS, JavaScript)
   - Think of it as a web browser that runs your app instead of websites
   
2. **React**
   - A library for building user interfaces (UI)
   - Makes it easy to create interactive buttons, menus, pages, etc.
   
3. **TypeScript**
   - A "safer" version of JavaScript
   - Adds extra checks to catch bugs before the app runs
   
4. **MobX**
   - A state management system
   - Keeps track of app data and updates the UI when data changes

### **Real-World Analogy:**

Think of building an app like building a house:
- **Electron** = The foundation and walls (desktop framework)
- **React** = The interior design and furniture (UI components)
- **MobX** = The plumbing and electrical system (data flow)
- **TypeScript** = Building codes and inspections (safety checks)

---

## 🔍 Where Does Everything Start?

Every application has an **entry point** - the first piece of code that runs when you open it.

### **The Architecture:**

```
When you click the Anytype icon:
    ↓
1. Main Process (main.ts) - Desktop side code
    ↓
2. Renderer Process (entry.tsx, app.tsx) - UI side code
    ↓
3. User sees the application window
```

### **Two Parts of Electron:**

1. **Main Process** - Runs on your computer (desktop side)
   - Manages windows
   - Handles system events
   - Communicates with the operating system

2. **Renderer Process** - Runs inside the app window (web side)
   - Displays the user interface
   - Handles user interactions
   - Shows content to users

---

## 📖 Understanding main.ts - The Desktop Side

**File Location:** `/electron/ts/main.ts`  
**Lines:** 413 lines  
**Purpose:** Handles all desktop-level functionality

### **Line 1: Strict Mode**

```typescript
'use strict';
```

**What it does:** Enables "strict mode" - makes JavaScript catch more bugs by being stricter about errors.

**Simple explanation:** It's like turning on extra safety checks in your code.

**Example without strict mode:**
```javascript
x = 5;  // This works (creates global variable)
console.log(x);
```

**Example with strict mode:**
```javascript
'use strict';
x = 5;  // This ERROR - must declare variable first
```

---

### **Lines 3-5: Global Variables**

```typescript
declare global {
	var serverAddress: string;
}
```

**What it does:** Declares a global variable that can be used anywhere in the app.

**Vocabulary:**
- `declare` - "I'm telling TypeScript this exists"
- `global` - Available everywhere in the app
- `var` - A variable (container to store data)
- `: string` - This variable holds text

**Simple explanation:** Imagine a global bulletin board where any part of the app can post and read information.

**Real-world analogy:** Like a shared Google Doc that everyone in a company can access.

---

### **Lines 7-9: Error Suppression**

```typescript
// Suppress EPIPE errors when parent pipe closes during shutdown
process.stdout?.on?.('error', () => {});
process.stderr?.on?.('error', () => {});
```

**What it does:** Ignores certain errors that happen when the app is shutting down.

**Explanation:**
- `process.stdout` - The standard output (where console.log writes to)
- `process.stderr` - The standard error output
- `?.on?.('error', ...)` - Listen for errors, but if something is undefined, don't crash
- `() => {}` - An empty function (do nothing)

**Simple explanation:** When you close the app, sometimes the computer tries to write to a pipe that doesn't exist anymore. This tells the app to ignore that error.

---

### **Line 11: Import Statements (The Building Blocks)**

```typescript
import { app, BrowserWindow, session, nativeTheme, ipcMain, powerMonitor, dialog } from 'electron';
```

**What it does:** Loads functionality from the Electron library.

**Let me explain each part:**

| Part | Meaning |
|------|---------|
| `import` | "I want to use some code from another file" |
| `{ app, BrowserWindow, ... }` | List of specific things we want to use |
| `from 'electron'` | Where to find them |

**Think of it like this:**
```
import { eggs, flour, sugar } from 'supermarket';
```
You go to the supermarket and pick specific items from the shelf.

**What each imported item does:**

| Item | Purpose |
|------|---------|
| `app` | Controls the app lifecycle (start, quit, etc.) |
| `BrowserWindow` | Creates and manages app windows |
| `session` | Manages browser sessions |
| `nativeTheme` | Detects system theme (dark/light mode) |
| `ipcMain` | Handles communication from renderer to main |
| `powerMonitor` | Detects sleep/wake events |
| `dialog` | Shows system dialogs (file picker, etc.) |

---

### **Lines 12-25: More Imports**

```typescript
import { is, fixPathForAsarUnpack } from 'electron-util';
import path from 'path';
import storage from 'electron-json-storage';
import * as remote from '@electron/remote/main';
import Api from './api';
import ConfigManager from './config';
import UpdateManager from './update';
import MenuManager from './menu';
import WindowManager from './window';
import Server from './server';
import Util from './util';
```

**What it does:** Loads all the other pieces needed to make the app work.

**Each import is like a different department in a company:**

| Import | Department | Purpose |
|--------|------------|---------|
| `electron-util` | Utilities | Helper functions for Electron |
| `path` | Path Handler | Works with file paths |
| `electron-json-storage` | Storage | Saves data to files |
| `Api` | API Department | Handles communication with backend |
| `ConfigManager` | Settings Department | Manages app settings |
| `UpdateManager` | Update Department | Handles app updates |
| `MenuManager` | Menu Department | Creates menus |
| `WindowManager` | Window Department | Creates and manages windows |
| `Server` | Server Department | Manages the local server |
| `Util` | Utilities Department | General helper functions |

---

### **Line 29-31: Constants and Setup**

```typescript
const protocol = 'anytype';
const binPath = fixPathForAsarUnpack(path.join(__dirname, 'dist', `anytypeHelper${is.windows ? '.exe' : ''}`));
const store = getSafeStorage();
```

**What each line does:**

**Line 1:**
```typescript
const protocol = 'anytype';
```
- `const` - A variable that CANNOT be changed after setting it
- `protocol` - The variable name
- `'anytype'` - The value (text string)
- **Purpose:** Creates a constant for deep linking (like `anytype://object/123`)

**Line 2:**
```typescript
const binPath = fixPathForAsarUnpack(path.join(__dirname, 'dist', `anytypeHelper${is.windows ? '.exe' : ''}`));
```
- Creates the path to the helper executable file
- `path.join()` - Combines path parts
- `__dirname` - The current folder
- `${is.windows ? '.exe' : ''}` - If Windows, use `.exe`, otherwise use nothing

**Line 3:**
```typescript
const store = getSafeStorage();
```
- Gets access to secure storage for sensitive data

---

### **Understanding Variables: const, let, and var**

**Three ways to create variables:**

```typescript
const PI = 3.14159;  // Cannot be changed
let counter = 0;     // Can be changed
var oldStyle = '...'; // Old way (avoid using)
```

**When to use each:**

| Keyword | Use When | Can Change? |
|---------|----------|-------------|
| `const` | Value never changes | ❌ No |
| `let` | Value will change | ✅ Yes |
| `var` | Old JavaScript | ✅ Yes (avoid) |

**Example:**
```typescript
const appName = 'Anytype';  // App name doesn't change
let windowCount = 1;        // Number of windows can change
windowCount = 2;            // This is allowed!
```

---

### **Lines 35-41: App Configuration**

```typescript
// Fix notifications app name
if (is.windows) {
	app.setAppUserModelId(app.name);
};

storage.setDataPath(app.getPath('userData'));
```

**What it does:**

1. **Lines 35-38:** If on Windows, set the app ID for notifications
   ```typescript
   if (is.windows) {
       app.setAppUserModelId(app.name);
   }
   ```
   - `if (condition) { code }` - Only runs code if condition is true
   - `is.windows` - Is the user on Windows?
   - `app.setAppUserModelId()` - Tells Windows "This is Anytype"

2. **Line 41:** Set where the app stores user data
   ```typescript
   storage.setDataPath(app.getPath('userData'));
   ```
   - Gets the standard user data folder
   - Sets that as where Anytype stores its data

---

### **Lines 43-49: Variables for Tracking State**

```typescript
const csp: string[] = [];

let deeplinkingUrl: string = '';
let waitLibraryPromise: Promise<any> | null = null;
let mainWindow: AppWindow | null = null;
let lastPowerEvent: string = 'suspend';
let isReady: boolean = false;
```

**What each variable tracks:**

| Variable | Type | Purpose |
|----------|------|---------|
| `csp` | string[] (array of text) | Content Security Policy rules |
| `deeplinkingUrl` | string (text) | Stores URLs like `anytype://...` |
| `waitLibraryPromise` | Promise or null | Tracks if library server is ready |
| `mainWindow` | AppWindow or null | The main application window |
| `lastPowerEvent` | string (text) | Tracks sleep/wake state |
| `isReady` | boolean (true/false) | Has the app finished loading? |

**Understanding Types:**

```typescript
: string      // This holds text
: boolean     // This is true or false
: number      // This is a number
: any         // This can be anything
: string[]    // This is an array of text
: null        // This is empty/nothing
```

---

### **Lines 51-53: Content Security Policy**

```typescript
for (const i in Cors) {
	csp.push([ i ].concat((Cors as any)[i]).join(' '));
};
```

**What it does:** Creates a security policy that tells the browser what connections are allowed.

**Simple explanation:** It's like a bouncer at a club - only certain types of connections are allowed.

**Breaking it down:**
- `for (const i in Cors)` - Loop through each item in Cors
- `csp.push(...)` - Add something to the array
- `.concat()` - Combine arrays
- `.join(' ')` - Combine text with spaces

---

### **Lines 55-57: App Settings**

```typescript
app.commandLine.appendSwitch('ignore-connections-limit', 'localhost, 127.0.0.1');
app.commandLine.appendSwitch('gtk-version', '3');
app.commandLine.appendSwitch('js-flags', '--max-old-space-size=4096');
```

**What it does:** Configures advanced settings for the app.

**These are like command-line arguments:**

| Setting | Purpose |
|---------|---------|
| `ignore-connections-limit` | Allow many connections to localhost |
| `gtk-version` | Use GTK version 3 (for Linux) |
| `js-flags` | Give JavaScript 4GB of memory |

---

### **Lines 64-72: Hardware Acceleration Control**

```typescript
const disableGpu = process.argv.includes('--disable-gpu') || (store.get('hardwareAcceleration') === false);

if (disableGpu) {
	app.disableHardwareAcceleration();
	app.commandLine.appendSwitch('disable-gpu');
	app.commandLine.appendSwitch('disable-gpu-compositing');

	console.log('[GPU] Hardware acceleration disabled');
};
```

**What it does:** Checks if user wants to disable GPU (graphics processing) and disables it if needed.

**Breaking it down:**

```typescript
const disableGpu = process.argv.includes('--disable-gpu') || (store.get('hardwareAcceleration') === false);
```
- Check if `--disable-gpu` flag exists OR if setting says to disable GPU

```typescript
if (disableGpu) {
    app.disableHardwareAcceleration();
    // ... disable GPU settings
}
```
- If we should disable GPU, turn it off

**Why disable GPU?** Some computers have issues with hardware acceleration, so users can disable it for better compatibility.

---

### **Lines 74-90: Protocol Handler (Deep Linking)**

```typescript
// On Linux, protocol registration is handled by registerLinuxProtocolHandler()
// which checks for an existing .desktop file before writing. Electron's built-in
// setAsDefaultProtocolClient would overwrite .desktop files on every launch.
if (!is.linux) {
	app.removeAsDefaultProtocolClient(protocol);

	if (!process.defaultApp) {
		app.setAsDefaultProtocolClient(protocol);
	};
};

if (!is.macos && (process.argv.length >= 2)) {
	if (process.defaultApp && !is.linux) {
		app.setAsDefaultProtocolClient(protocol, process.execPath, [ path.resolve(process.argv[1]) ]);
	};
	deeplinkingUrl = process.argv.find(arg => arg.startsWith(`${protocol}://`));
};
```

**What it does:** Registers the app to handle `anytype://` URLs, so clicking such links opens the app.

**Simple explanation:** When you click a link like `anytype://object/abc123`, your computer knows to open Anytype.

**Deep linking example:**
- You receive a link: `anytype://object/123`
- You click it
- Your computer opens Anytype and navigates to object 123

---

### **Lines 92-133: Power Monitor (Sleep/Wake Handling)**

```typescript
powerMonitor.on('suspend', () => {
	if (lastPowerEvent == 'suspend') {
		return;
	};

	const firstWindow = WindowManager.getFirstWindow();
	if (firstWindow) {
		Util.send(firstWindow, 'power-event', 'suspend');
		lastPowerEvent = 'suspend';
	};
});

powerMonitor.on('resume', () => {
	if (lastPowerEvent == 'resume') {
		return;
	};

	lastPowerEvent = 'resume';
	Util.log('info', '[PowerMonitor] resume');

	// Notify middleware immediately so it can transition to foreground state
	const firstWindow = WindowManager.getFirstWindow();
	if (firstWindow) {
		Util.send(firstWindow, 'power-event', 'resume');
	};

	// Delay reload to give GPU process time to recover from suspend.
	// Directly reload all tabs — route is preserved in view.data from initial load.
	setTimeout(() => {
		for (const win of WindowManager.list) {
			if (!win || win.isDestroyed() || !win.views) {
				continue;
			};

			for (const view of win.views) {
				if (view && view.webContents && !view.webContents.isDestroyed()) {
					view.webContents.reload();
				};
			};
		};
	}, 1500);
});
```

**What it does:** Listens for when the computer goes to sleep or wakes up, and handles these events.

**Breaking it down:**

```typescript
powerMonitor.on('suspend', () => {
    // ... code to run when computer sleeps
})
```
- `powerMonitor.on()` - Listen for events
- `'suspend'` - Event name (computer sleeping)
- `() => { }` - Function to run when event happens

```typescript
setTimeout(() => {
    // ... code to run later
}, 1500);
```
- `setTimeout()` - Run code after a delay
- `1500` - Wait 1500 milliseconds (1.5 seconds)
- `() => { }` - The code to run

---

### **Lines 135-140: IPC Handlers (Communication)**

```typescript
ipcMain.on('storeGet', (e: Electron.IpcMainEvent, key: string) => { e.returnValue = store.get(key); });
ipcMain.on('storeSet', (e: Electron.IpcMainEvent, key: string, value: any) => { e.returnValue = store.set(key, value); });
ipcMain.on('storeDelete', (e: Electron.IpcMainEvent, key: string) => { e.returnValue = store.delete(key); });
ipcMain.on('getTheme', (e: Electron.IpcMainEvent) => { e.returnValue = Util.getTheme(); });
ipcMain.on('getBgColor', (e: Electron.IpcMainEvent) => { e.returnValue = Util.getBgColor(Util.getTheme()); });
ipcMain.on('getConfig', (e: Electron.IpcMainEvent) => { e.returnValue = ConfigManager.config || {}; });
```

**What it does:** Sets up communication channels between the main process and renderer (web content).

**IPC = Inter-Process Communication**

**Simple explanation:** The main process can receive messages and respond:

| Channel | Purpose |
|---------|---------|
| `storeGet` | Get a value from storage |
| `storeSet` | Save a value to storage |
| `storeDelete` | Delete a value from storage |
| `getTheme` | Get the current theme (dark/light) |
| `getConfig` | Get app configuration |

**Example:**
```typescript
// Renderer asks: "Hey, what's the theme?"
ipcMain.on('getTheme', (e) => { 
    e.returnValue = Util.getTheme(); 
});
// Main responds: "It's dark mode"
```

---

### **Understanding Functions**

**What is a function?** A reusable block of code that performs a specific task.

**Function anatomy:**
```typescript
function functionName(parameter1, parameter2) {
    // Code to execute
    return result;
}
```

**Example from the code:**
```typescript
const handleSignal = (signal: string) => {
    Util.log('info', `Received ${signal}`);

    if ((app as any).isQuiting) {
        app.exit(0);
    } else {
        Api.exit(mainWindow, signal, false, false);
    };
};
```

- **Function name:** `handleSignal`
- **Parameter:** `signal` (type: string)
- **Body:** The code between `{` and `}`
- **Purpose:** Handle shutdown signals gracefully

---

### **Understanding Arrow Functions**

**Arrow functions** are a shorter way to write functions:

```typescript
// Traditional function
function add(a, b) {
    return a + b;
}

// Arrow function
const add = (a, b) => {
    return a + b;
}

// Even shorter (for single expressions)
const add = (a, b) => a + b;
```

**Why use arrow functions?**
- Shorter syntax
- Don't have their own `this` (avoids confusion)
- Very common in React and modern JavaScript

---

### **Lines 142-145: Single Instance Lock**

```typescript
if (!is.development && !app.requestSingleInstanceLock()) {
	Api.exit(mainWindow, '', false, false);
	process.exit(0);
};
```

**What it does:** Ensures only one instance of the app runs at a time.

**Simple explanation:** If you try to open Anytype while it's already running, this makes the existing window come to the front instead of opening a second window.

**Breaking it down:**
```typescript
if (!is.development && !app.requestSingleInstanceLock()) {
    // If we can't get the lock (app already running)
    Api.exit(mainWindow, '', false, false);
    process.exit(0);  // Exit the app
}
```

---

### **Lines 147-148: Initialize Remote Module**

```typescript
remote.initialize();
Util.setAppPath(path.join(__dirname));
```

**What it does:** 
- `remote.initialize()` - Initialize the remote module (allows renderer to access main process APIs)
- `Util.setAppPath(...)` - Set the app path for utilities

---

### **Lines 150-178: Wait for Library and Create Windows**

```typescript
function waitForLibraryAndCreateWindows () {
	const { userDataPath } = ConfigManager.config;

	Util.setNativeThemeSource();

	let currentPath = app.getPath('userData');
	if (userDataPath && (userDataPath != currentPath)) {
		currentPath = userDataPath;
		app.setPath('userData', userDataPath);
	};

	if (process.env.ANYTYPE_USE_SIDE_SERVER) {
		// use the grpc server started from the outside
		Server.setAddress(process.env.ANYTYPE_USE_SIDE_SERVER);
		waitLibraryPromise = Promise.resolve();
	} else {
		waitLibraryPromise = Server.start(binPath, currentPath);
	};

	Util.mkDir(Util.logPath());

	waitLibraryPromise.then(() => {
		global.serverAddress = Server.getAddress();
		createWindow();
		isReady = true;
	}, (err: Error) => {
		dialog.showErrorBox('Error: failed to run server', err.toString());
	});
};
```

**What it does:** 
1. Gets the data path from config
2. Starts the local library server
3. Creates the main window when ready
4. Shows an error dialog if the server fails

**The server:** Anytype runs a local gRPC server alongside the app to handle data operations.

**Understanding Promises:**
```typescript
waitLibraryPromise.then(() => {
    // This runs when the promise succeeds
    createWindow();
}, (err: Error) => {
    // This runs if there's an error
    dialog.showErrorBox('Error: failed to run server', err.toString());
});
```

---

### **Lines 181-189: Theme Change Listener**

```typescript
nativeTheme.on('updated', () => {
	const isDark = Util.isDarkTheme();

	MenuManager.updateTrayIcon();
	Api.setBackground(null, Util.getTheme());

	WindowManager.sendToAll('native-theme', isDark);
	WindowManager.sendToAllTabs('native-theme', isDark);
});
```

**What it does:** When the system theme changes (dark/light mode), update the app accordingly.

**Flow:**
1. System theme changes (user toggles dark mode)
2. `nativeTheme.on('updated')` fires
3. App detects if new theme is dark
4. Updates tray icon
5. Sends theme change to all windows

---

### **Lines 191-259: Create Window Function**

```typescript
function createWindow () {
	mainWindow = WindowManager.createMain({ route: Util.getRouteFromUrl(deeplinkingUrl), isChild: false });

	mainWindow.on('close', (e: Electron.Event) => {
		Util.log('info', 'closeMain: ' + (app as any).isQuiting);

		if ((app as any).isQuiting) {
			return;
		};

		e.preventDefault();

		const onClose = () => {
			const { config } = ConfigManager;

			if (config.hideTray && (WindowManager.list.size <= 1)) {
				Api.exit(mainWindow, '', false, false);
			} else {
				mainWindow.hide();
			};
		};

		if (mainWindow.isFullScreen()) {
			mainWindow.setFullScreen(false);
			mainWindow.once('leave-full-screen', () => onClose());
		} else {
			onClose();
		};
		return false;
	});

	UpdateManager.setWindow(mainWindow);
	UpdateManager.init();

	MenuManager.setWindow(mainWindow);
	MenuManager.initMenu();
	MenuManager.initTray();
	MenuManager.initDock();

	installNativeMessagingHost();
	Util.registerLinuxProtocolHandler();

	ipcMain.handle('Api', (e: Electron.IpcMainInvokeEvent, id: number, cmd: string, args: any[]) => {
		const win = BrowserWindow.fromId(id) as AppWindow | null;

		if (!win) {
			console.error('[Api] window is not defined', cmd, id);
			return;
		};

		if (Api.activeTabOnly?.has(cmd)) {
			const activeView = Util.getActiveView(win);

			if (!activeView || (e.sender.id !== activeView.webContents.id)) {
				return;
			};
		};

		if (Api[cmd]) {
			return Api[cmd].apply(Api, [ win ].concat(args || []));
		} else {
			console.error('[Api] method not defined:', cmd);
			return null;
		};
	});
};
```

**What it does:** Creates the main application window with all its features:

1. **Create the window** - `WindowManager.createMain()`
2. **Handle close events** - Minimize to tray or quit
3. **Initialize managers:**
   - `UpdateManager` - Handles app updates
   - `MenuManager` - Creates menus, tray, dock
   - `Server` - Manages the local server
4. **Install native messaging** - Allows communication with native apps
5. **Set up API handlers** - Handle communication with renderer

---

### **Lines 261-312: App Ready Event**

```typescript
app.on('ready', async () => {
	session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
		callback({
			responseHeaders: {
				...details.responseHeaders,
				'Content-Security-Policy': [ csp.join('; ') ]
			}
		});
	});

	// Intercept requests and add referrer/origin for YouTube only
	session.defaultSession.webRequest.onBeforeSendHeaders({
		urls: [
			'*://www.youtube.com/*',
			'*://www.youtube-nocookie.com/*',
		],
	}, (details, callBack) => {
		const headers = details.requestHeaders;

		// Detect missing or file:// origin
		const currentOrigin = headers['Origin'];
		const isFileOrigin =
			!currentOrigin ||
			(currentOrigin === 'null') ||
			currentOrigin.startsWith('file://');

		if (isFileOrigin) {
			details.requestHeaders['Referer'] = 'https://localhost/';
			details.requestHeaders['Origin'] = 'https://localhost';
		};

		callBack({ requestHeaders: details.requestHeaders });
	});

	// Load gRPC DevTools extension in development mode
	if (is.development) {
		try {
			await installExtension(GRPC_DEVTOOLS_ID, {
				loadExtensionOptions: {
					allowFileAccess: true
				}
			});

			console.log(`gRPC DevTools extension installed`);
		} catch (e) {
			console.error('Failed to install gRPC DevTools extension:', e.message);
		};
	};

	ConfigManager.init(waitForLibraryAndCreateWindows);
});
```

**What it does:** When the app is ready to start:

1. **Set up content security policy** - Security rules for the app
2. **Handle YouTube referrer headers** - Fix for YouTube embeds
3. **Install DevTools in development mode** - Tools for debugging
4. **Initialize config and start creating windows** - Launch the app

---

### **Lines 314-342: Second Instance Handler**

```typescript
app.on('second-instance', (event, argv) => {
	Util.log('info', 'second-instance');

	if (!mainWindow) {
		return;
	};

	if (!is.macos) {
		deeplinkingUrl = argv.find(arg => arg.startsWith(`${protocol}://`));
	};

	if (deeplinkingUrl) {
		Util.send(mainWindow, 'route', Util.getRouteFromUrl(deeplinkingUrl));
	};

	if (mainWindow.isMinimized()) {
		mainWindow.restore();
	};
	if (!mainWindow.isVisible()) {
		mainWindow.show();
	};

	mainWindow.focus();

	if (is.macos) {
		app.focus({ steal: true });
	};
});
```

**What it does:** Handles when user tries to open app a second time while it's already running.

**What happens:**
1. User tries to open Anytype again
2. App detects it's already running
3. Brings existing window to front
4. If there was a deep link, navigates to it

---

### **Lines 344-358: Before Quit Handler**

```typescript
app.on('before-quit', (e) => {
	Util.log('info', 'before-quit, isRelaunching: ' + UpdateManager.isRelaunching);

	if (UpdateManager.isRelaunching) {
		return;
	};

	if ((app as any).isQuiting) {
		app.exit(0);
	} else {
		e.preventDefault();
		Api.exit(mainWindow, '', false, false);
	};
});
```

**What it does:** Handles cleanup when the app is about to quit.

**Why prevent quit?**
- Need to clean up resources
- Save any unsaved data
- Notify other parts of the app

---

### **Lines 361-372: Signal Handlers**

```typescript
const handleSignal = (signal: string) => {
	Util.log('info', `Received ${signal}`);

	if ((app as any).isQuiting) {
		app.exit(0);
	} else {
		Api.exit(mainWindow, signal, false, false);
	};
};

process.on('SIGINT', () => handleSignal('SIGINT'));
process.on('SIGTERM', () => handleSignal('SIGTERM'));
```

**What it does:** Handle system signals (like Ctrl+C) gracefully instead of abrupt shutdown.

**What are signals?**
- `SIGINT` - Interrupt signal (Ctrl+C)
- `SIGTERM` - Termination request
- These tell the app "Please stop gracefully"

---

### **Lines 374-386: App Activate (macOS)**

```typescript
app.on('activate', () => {
	if (WindowManager.list.size && mainWindow) {
		mainWindow.show();
		mainWindow.focus();

		if (is.macos) {
			app.focus({ steal: true });
		};
	} else
	if (isReady) {
		createWindow();
	};
});
```

**What it does:** When clicking the app icon in the dock (macOS), show/focus the window.

**macOS behavior:**
- Apps don't close when you click the X
- They minimize to dock
- Clicking dock icon should show the window

---

### **Lines 388-412: Open URL Handler**

```typescript
app.on('open-url', (e, url) => {
	e.preventDefault();

	deeplinkingUrl = url;

	if (!mainWindow) {
		return;
	};

	Util.send(mainWindow, 'route', Util.getRouteFromUrl(url));

	if (mainWindow.isMinimized()) {
		mainWindow.restore();
	};

	if (!mainWindow.isVisible()) {
		mainWindow.show();
	};

	mainWindow.focus();

	if (is.macos) {
		app.focus({ steal: true });
	};
});
```

**What it does:** Handle `anytype://` URL opens by navigating to the appropriate route.

---

## 🎯 Summary: What We've Learned

### **Main Process Responsibilities:**

✅ **Initialization** - Load all necessary libraries  
✅ **Configuration** - Set up app settings  
✅ **Window Management** - Create and manage windows  
✅ **System Events** - Handle sleep/wake, signals, quit  
✅ **Deep Linking** - Handle `anytype://` URLs  
✅ **IPC Communication** - Communicate with renderer  
✅ **Power Management** - Detect power state changes  
✅ **Updates** - Handle app updates  

---

## 📝 Quiz Time!

Test your understanding with these questions:

### **Question 1: What does `import` do?**
<details>
<summary>Click to reveal answer</summary>

`import` loads code from other files or libraries. It's like going to a supermarket and picking specific items you need.

```typescript
import { item1, item2 } from 'library';
```

</details>

### **Question 2: What's the difference between `const` and `let`?**
<details>
<summary>Click to reveal answer</summary>

- **`const`** = Cannot be changed after setting (constant)
- **`let`** = Can be changed later (variable)

```typescript
const PI = 3.14;      // Can't change this
let score = 0;        // Can change this
score = 10;           // Valid!
```

</details>

### **Question 3: Why do we need IPC?**
<details>
<summary>Click to reveal answer</summary>

Because the **main process** and **renderer process** are separate. They need to communicate to:
- Send data between them
- Call functions in the other process
- Coordinate actions

</details>

### **Question 4: What is deep linking?**
<details>
<summary>Click to reveal answer</summary>

Deep linking allows URLs like `anytype://object/123` to open the app and navigate to a specific location. It's how external links open specific parts of the app.

</details>

---

## 🚀 Next Steps

In the next lesson, we'll learn about:

1. **React Entry Point (entry.tsx)** - How the UI starts
2. **App Component (app.tsx)** - The main React component
3. **Understanding Components** - Building blocks of the UI
4. **State Management** - How data flows through the app

---

## 💡 Key Takeaways

1. **Every app has an entry point** - Where it starts executing
2. **Main process vs Renderer process** - Desktop side vs Web side
3. **IPC is essential** - The two processes must communicate
4. **Event-driven programming** - App responds to events (clicks, sleeps, etc.)
5. **Modules and imports** - Code is organized into reusable pieces

---

## 📚 Additional Resources

Want to learn more? Here are some topics to explore:

- **JavaScript Basics:** https://javascript.info/
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/
- **React Documentation:** https://react.dev/
- **Electron Guide:** https://www.electronjs.org/docs/latest/

---

**🎓 Congratulations! You've completed the first lesson!**

*This tutorial will be updated with more content as we progress through the codebase.*
