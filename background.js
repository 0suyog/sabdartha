// browser.tabs
//     .insertCSS({ file: "Popup/popup.css" })
//     .then(null, (m) => console.log(m));
// console.log(browser.browserAction.onClicked);
// browser.browserAction.onClicked.addListener((e) => {
//     console.log(e);
// });

// browser.tabs.query({}).then(data=>console.log(data))

browser.runtime.onMessage.addListener((message) => {
    if ((message = "meow")) {
        browser.tabs.insertCSS({ file: "Popup/popup.css" });
    }
});
