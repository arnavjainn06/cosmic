const {
    app,
    BrowserWindow,
    globalShortcut,
    Tray,
    systemPreferences,
    shell,
    ipcMain,
} = require("electron");
const open = require("open");
// const { platform } = require("os");
const path = require("path");
// const { electron } = require("process");
const assetsDirectory = path.join(__dirname, "assets");

let window;
let tray;

app.on("ready", () => {
    initializeApp();
    initializeTray();
});

app.on("window-all-closed", () => {
    app.quit();
});

const initializeTray = () => {
    if (process.platform == "win32") {
        tray = new Tray(path.join(assetsDirectory, "tray_icon_win.png"));
    } else {
        tray = new Tray(path.join(assetsDirectory, "tray_icon.png"));
    }

    tray.on("right-click", toggleCadburyVisibility);
    tray.on("double-click", toggleCadburyVisibility);
    tray.on("click", function (event) {
        toggleCadburyVisibility();
    });
    tray.setToolTip("Cadbury Search");
};

const initializeApp = () => {
    window = new BrowserWindow({
        height: 56,
        width: 680,
        transparent: true,
        // thickFrame: false,
        // hasShadow: true,
        // show: false,
        // alwaysOnTop: true,
        // focusable: true,
        center: true,
        fullscreenable: false,
        vibrancy: "dark",
        type: "textured",
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

ipcMain.on("msg", (event, data) => {
    console.log(data);
    window.setSize(680, 430);
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
