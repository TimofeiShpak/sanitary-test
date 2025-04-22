setInterval(() => {
    console.log(1);
    div.textContent = Date.now();
}, 100)

function init() {
    let c = document.querySelector(".otp-input.s-view-input input");
    if (c) {
        c.click();
    }
    let b = document.querySelector(".td-next div input");
    if (b) {
        b.click();
    }
}

setInterval(() => {
    chrome.tabs.query({active: true}, (tabs) => {
        const tab = tabs[0];
        if (tab) {
            chrome.scripting.executeScript(
                {
                    target: {tabId: tab.id, allFrames: true},
                    func: init
                },
                () => {}
            )  
        } else {
            alert("There are no active tabs")
        }
    })
}, 1000);

