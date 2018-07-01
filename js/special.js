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