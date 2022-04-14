const {
    app,
    BrowserWindow,
    globalShortcut,
    Tray,
    systemPreferences,
    shell,
    Menu,
    ipcMain,
} = require("electron");
const open = require("open");
// const { platform } = require("os");
const path = require("path");
// const { electron } = require("process");
const assetsDirectory = path.join(__dirname, "assets");

let window;
let tray;

let prefs;

let contextMenu;

const openPrefs = () => {
    prefs = new BrowserWindow({
        height: 400,
        width: 360,
        // transparent: true,
        // center: true,
        fullscreenable: false,
        vibrancy: "popover",
        minimizable: true,
        // movable: true,
        // frame: false,
        resizable: false,
        roundedCorners: true,
        titleBarStyle: "hidden",
        titleBarOverlay: true,
        trafficLightPosition: { x: 10, y: 15 },
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // trigger require isolation
            backgroundThrottling: false,
            devTools: true,
        },
    });

    prefs.loadURL(`file://${path.join(__dirname, "prefs.html")}`);

    if (process.platform == "darwin") {
        // Don't show the app in the dock for macOS
        app.dock.hide();
    } else {
        // To hide the app in the dock for windows and linux
        window.setSkipTaskbar(true);
    }
};

app.on("ready", () => {
    initializeApp();
    initializeTray();

    contextMenu = Menu.buildFromTemplate([
        { label: "Item1", type: "radio" },
        { label: "Item2", type: "radio" },
        { label: "Item3", type: "radio", checked: true },
        { label: "Item4", type: "radio" },
    ]);
});

app.on("window-all-closed", () => {
    app.quit();
});

const initializeTray = () => {
    if (process.platform == "win32") {
        tray = new Tray(path.join(assetsDirectory, "tray_icon_win.png"));
    } else {
        tray = new Tray(path.join(assetsDirectory, "cosmicicon@2x.png"));
    }

    tray.on("right-click", () => {
        const menu = [
            {
                label: "Preferences",
                role: "preferences",
                accelerator: "Cmd+,",
                click: openPrefs,
            },
            {
                label: "Toggle Cosmic",
                accelerator: "Ctrl+Space",
                click: toggleCadburyVisibility,
            },
            {
                label: "Refresh on exit",
                type: "radio",
                checked: true,
            },
            {
                role: "quit",
                accelerator: "Command+Q",
            },
        ];
        tray.popUpContextMenu(Menu.buildFromTemplate(menu));
    });
    tray.on("double-click", toggleCadburyVisibility);
    tray.on("click", function (event) {
        toggleCadburyVisibility();
    });
    tray.setToolTip("Cosmic Search");
};

const initializeApp = () => {
    window = new BrowserWindow({
        height: 56,
        width: 680,
        transparent: true,
        center: true,
        fullscreenable: false,
        vibrancy: "popover",
        minimizable: false,
        frame: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // trigger require isolation
            backgroundThrottling: false,
            devTools: true,
        },
    });
    // window.webContents.toggleDevTools();

    window.loadURL(`file://${path.join(__dirname, "index.html")}`);

    globalShortcut.register("Control + Space", () => {
        toggleCadburyVisibility();
    });

    window.webContents.on("before-input-event", (event, input) => {
        if (input.key === "Escape") {
            destroyCadbury();
            // event.preventDefault()
        }
    });

    window.on("blur", () => {
        destroyCadbury();
    });

    // window.webContents.on('new-window', function (event, url) {
    //     event.preventDefault()
    //     shell.openExternal(url);
    // });

    window.webContents.on("new-window", function (e, url) {
        e.preventDefault();
        require("electron").shell.openExternal(url);
    });

    if (process.platform == "darwin") {
        // Don't show the app in the dock for macOS
        app.dock.hide();
    } else {
        // To hide the app in the dock for windows and linux
        window.setSkipTaskbar(true);
    }
};

const toggleCadburyVisibility = () => {
    if (window.isVisible()) {
        destroyCadbury();
    } else {
        launchCadbury();
    }
};

const launchCadbury = () => {
    // window.setVisibleOnAllWorkspaces(true); // put the window on all screens
    window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    window.reload();
    window.setSize(680, 56);
    // setTimeout(() => {
    // window.show();
    // }, 280);
    window.show();
};

const destroyCadbury = () => {
    if (process.platform == "darwin") {
        app.hide();
        window.hide();
        window.reload();
    } else {
        window.minimize();
        window.hide();
        window.reload();
    }
};

ipcMain.on("expand", (event, data) => {
    console.log(data);
    window.setSize(680, 430);
});

ipcMain.on("shrink", (event, data) => {
    console.log(data);
    window.setSize(680, 56);
});

// This returns the same result is ls
fs = require("fs");

fs.readdir(process.cwd(), function (err, files) {
    if (err) {
        console.log(err);
        return;
    }
    console.log(files);
});
