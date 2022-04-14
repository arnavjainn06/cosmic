const { ipcRenderer } = require("electron");

const main = document.getElementById("main");

main.addEventListener("keypress", (e) => {
    if (e.which === 13 || e.keyCode === 13) {
        ipcRenderer.send("msg", "increase potential");
    }
});
