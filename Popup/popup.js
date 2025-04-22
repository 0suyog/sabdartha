let text;

const URI = "https://api.dictionaryapi.dev/api/v2/entries/en/";
// API stuff
const getMeaning = async (word) => {
    let requestUrl = `${URI}${word}`;
    const response = await fetch(requestUrl);
    const data = await response.json();
    return data;
};

let getSelectionText = () => {
    let text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    }
    return text;
};

document.addEventListener("mouseup", async (e) => {
    text = getSelectionText();
    console.log(e);
    if (text) {
        let searchText = text.split(" ")[0];
        let response = await getMeaning(searchText);
        console.log(response);
        createPopUp(response[0], e.clientX, e.clientY);
    }
});

function createPopUp(data, x, y) {
    let popupBox = document.createElement("div");
    let wordSpan = document.createElement("span");
    let sound = document.createElement("span");
    let meaningBox = document.createElement("meanings");
    let partOfSpeechLiteralSpan = document.createElement("span");
    partOfSpeechLiteralSpan.innerText = "Part Of Speech: ";
    let partOfSpeechSpan = document.createElement("span");
    console.log(data);
    partOfSpeechSpan.innerText = data.meanings[0].partOfSpeech;
    wordSpan.innerText = data.word;
    for (let i of data.meanings[0].definitions) {
        let definitionContainer = document.createElement("div");
        let definitionLiteralSpan = document.createElement("span");
        definitionLiteralSpan.innerText = "Definition: ";
        let definitionSpan = document.createElement("span");
        definitionSpan.innerText = i.definition;
        let exampleLiteralSpan = document.createElement("span");
        exampleLiteralSpan.innerText = "Example: ";
        let exampleSpan = document.createElement("span");
        exampleSpan.innerText = i.example;

        definitionContainer.appendChild(definitionLiteralSpan);
        definitionContainer.appendChild(definitionSpan);
        definitionContainer.appendChild(exampleLiteralSpan);
        definitionContainer.appendChild(exampleSpan);
        meaningBox.appendChild(definitionContainer);
    }
    popupBox.appendChild(wordSpan);
    popupBox.appendChild(partOfSpeechLiteralSpan);
    popupBox.appendChild(partOfSpeechSpan);
    popupBox.style.position = "fixed";
    popupBox.style.top = `${y}px`;
    popupBox.style.left = `${x}px`;
    popupBox.classList.add("sabdartha-container");
    document.body.appendChild(popupBox);
}

browser.tabs.insertCss({ file: "./popup.css" });
