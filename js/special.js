window.addEventListener('load', () => {
    // populate the `select` elements
    const selectElements = document.getElementsByTagName('select');
    // Fetch all the currencies from currencyconverterapi
    fetch('https://free.currencyconverterapi.com/api/v5/currencies')
        .then(currennciesResp => currennciesResp.json())
        .then(currencies => {
            let currencyName;
            let currencyCode;
            let option;
            for (const currency in currencies.results) {
                currencyName = currencies.results[currency].currencyName;
                currencyCode = currencies.results[currency].id;
                option = document.createElement('option');
                option.innerText = `${currencyCode} | ${currencyName}`;
                option.id = currencyCode;
                selectElements[0].appendChild(option.cloneNode(true));
                selectElements[1].appendChild(option);
            }
        });
});

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    btnAdd.style.display = 'block';
    btnAdd.addEventListener('click', (e) => {
        // hide our user interface that shows our A2HS button
        btnAdd.style.display = 'none';
        // Show the prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice
            .then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                } else {
                    console.log('User dismissed the A2HS prompt');
                }
                deferredPrompt = null;
            });
    });
});

window.addEventListener('appinstalled', (evt) => {
    app.logEvent('a2hs', 'installed');
});