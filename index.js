const { ipcRenderer } = require("electron");

const main = document.getElementById("main"),
    definition = document.getElementById("definition"),
    synonymsDiv = document.getElementById("synonyms");

main.addEventListener("keypress", (e) => {
    if (e.which === 13 || e.keyCode === 13) {
        ipcRenderer.send("expand", "increase potential");
    }
});

function displayRes(res) {
    console.log(res);
    let term = res[0]?.word;
    let definitionExp = res[0].meanings[0].definitions[0].definition;

    let synonymsArray = res[0].meanings[0].definitions[0].synonyms;
    console.log(synonymsArray);

    definition.innerHTML = `
    <div class="definition" id="definition">
        <h2 align="center">Definitions</h2>
        <h1>${term}</h1>
        <span>${definitionExp}</span>
        <div class="synonyms" id="synonyms">
        </div>
    </div>
    `;

    if (synonymsArray.length > 0) {
        console.log("ye!!!");
        for (let x = 0; x < synonymsArray.length; x++) {
            synonymsDiv.innerHTML += `
            <div class="syn">${synonymsArray[x]}</div>
            `;
        }
    } else {
        synonymsDiv.innerHTML = `
        <span>No synonyms found.</span>
        `;
    }
}

function focusDictionary(term, definition_offline) {
    definition.innerHTML = `
    <div class="definition" id="definition">
        <h2 align="center">Definitions</h2>
        <h1>${term}</h1>
        <span>${definition_offline}</span>
        <div class="synonyms" id="synonyms">
        </div>
    </div>
    `;
}

function defineValue(data) {
    if (!navigator.onLine) {
        // Mapping through the JSON dictionary
        Object.keys(definitions).map((key, index) => {
            // Another free dictionary API: https://api.dictionaryapi.dev/api/v2/entries/en_US/hello

            if (key == cadbury.value) {
                focusDictionary(key, definitions[key]);
            }
        });
    } else {
        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${data}`)
            .then((unformatted) => {
                return unformatted.json();
            })
            .then((res) => {
                displayRes(res);
            });
    }
}

const intervalShrinkingTransmission = () => {
    let timer;
    const waitTime = 500;

    if (main.value === "") {
        ipcRenderer.send("shrink", "decrease potential");
    } else {
        // main.addEventListener("keypress", () => {
        //     window.clearTimeout(timer);
        // });
        main.addEventListener("keyup", (e) => {
            window.clearTimeout(timer); // prevent errant multiple timeouts from being generated
            timer = window.setTimeout(() => {
                defineValue(main.value);
                ipcRenderer.send("expand", "increase potential");
            }, waitTime);
        });
    }
};

setInterval(intervalShrinkingTransmission, 500);
