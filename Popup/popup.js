let text;
let events = ["click", "keydown", "keyup", "mousedown", "mouseup", "wheel"];
const URI = "https://api.dictionaryapi.dev/api/v2/entries/en/";
// API stuff
const getMeaning = async (word) => {
    let requestUrl = `${URI}${word}`;
    const response = await fetch(requestUrl);
    if (response.ok) {
        const data = await response.json();
        return data;
    }
    return 0;
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
    // console.log(e);
    if (text) {
        let searchText = text.split(" ")[0];
        let response = await getMeaning(searchText);
        // console.log(response);
        if (response) createPopUp(response[0], e.clientX, e.clientY);
        else notFoundPopUp(text, e.clientX, e.clientY);
    }
});

function createPopUp(data, x, y) {
    let previousBox = document.getElementById("popupBox");
    if (previousBox) {
        document.body.removeChild(previousBox);
    }
    let popupBox = document.createElement("div");
    popupBox.id = "popupBox";
    let wordSpan = document.createElement("span");
    let sound = document.createElement("span");
    let meaningBox = document.createElement("div");
    wordSpan.innerText = data.word;
    popupBox.appendChild(wordSpan);
    let fourMeanings = getFourMeanings(data.meanings);
    let partOfSpeechesDivs = {};
    for (let partOfSpeech of fourMeanings.partOfSpeechs) {
        let container = document.createElement("div");
        let partOfSpeechLiteralSpan = document.createElement("span");
        partOfSpeechLiteralSpan.innerText = "Part Of Speech";
        let partOfSpeechSpan = document.createElement("span");
        partOfSpeechSpan.innerText = partOfSpeech;
        container.appendChild(partOfSpeechLiteralSpan);
        container.appendChild(partOfSpeechSpan);
        partOfSpeechesDivs[partOfSpeech] = container;
    }
    for (let meaning of fourMeanings.selected) {
        let definitionContainer = document.createElement("div");
        let definitionLiteralSpan = document.createElement("span");
        definitionLiteralSpan.innerText = "Definition: ";
        let definitionSpan = document.createElement("span");
        definitionSpan.innerText = meaning.definition;
        let exampleLiteralSpan = document.createElement("span");
        exampleLiteralSpan.innerText = "Example: ";
        let exampleSpan = document.createElement("span");
        exampleSpan.innerText = meaning.example;
        definitionContainer.appendChild(definitionLiteralSpan);
        definitionContainer.appendChild(definitionSpan);
        // console.log(meaning);
        if (meaning.example !== undefined) {
            definitionContainer.appendChild(exampleLiteralSpan);
            definitionContainer.appendChild(exampleSpan);
        }
        partOfSpeechesDivs[meaning.partOfSpeech].appendChild(
            definitionContainer
        );
    }
    for (let i of data.meanings[0].definitions) {
    }

    for (let pos in partOfSpeechesDivs) {
        popupBox.appendChild(partOfSpeechesDivs[pos]);
    }

    popupBox.style.position = "fixed";
    popupBox.style.top = `${y}px`;
    popupBox.style.left = `${x}px`;
    popupBox.classList.add("sabdartha-container");
    events.forEach((event) => {
        // console.log(event);
        popupBox.addEventListener(event, (e) => {
            e.stopPropagation();
            e.preventDefault();
        });
    });
    document.body.appendChild(popupBox);
    browser.runtime.sendMessage({ message: "meow" });
}

events.forEach((event) => {
    document.addEventListener(event, (e) => {
        let previousBox = document.getElementById("popupBox");
        if (previousBox) {
            document.body.removeChild(previousBox);
        }
    });
});

function getFourMeanings(_meanings) {
    let meanings = {};
    meanings.selected = [];
    meanings.partOfSpeechs = new Set();

    // First, try to take one definition from each meaning
    for (const meaning of _meanings) {
        meanings.partOfSpeechs.add(meaning.partOfSpeech);
        if (meaning.definitions && meaning.definitions.length > 0) {
            meanings.selected.push({
                partOfSpeech: meaning.partOfSpeech,
                definition: meaning.definitions[0].definition,
                example: meaning.definitions[0].example,
            });
        }
        if (meanings.selected.length === 4) break;
    }

    // If we still have less than 4, fill in from remaining definitions
    if (meanings.selected.length < 4) {
        for (const meaning of _meanings) {
            for (let i = 1; i < meaning.definitions.length; i++) {
                meanings.selected.push({
                    partOfSpeech: meaning.partOfSpeech,
                    definition: meaning.definitions[i].definition,
                    example: meaning.definitions[i].example,
                });
                if (meanings.selected.length === 4) break;
            }
            if (meanings.selected.length === 4) break;
        }
    }

    return meanings;
}

function notFoundPopUp(word, x, y) {
    let notFoundParagraph = document.createElement("p");
    let notFoundText = `Couldn't find the word "${word}". Try googling? `;
    notFoundParagraph.id = "popupBox";
    notFoundParagraph.innerText = notFoundText;
    notFoundParagraph.style.position = "fixed";
    notFoundParagraph.style.top = `${y}px`;
    notFoundParagraph.style.left = `${x}px`;
    notFoundParagraph.classList.add("sabdartha-container");
    document.body.appendChild(notFoundParagraph);
    browser.runtime.sendMessage({ message: "meow" });
}
