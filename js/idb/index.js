const dbPromise = idb.open('currencies-db', 1, upgradeDB => {
    upgradeDB.createObjectStore('rates', { keyPath: 'id' });
});







const convertBtn = document.getElementById('convertBtn');
let inputAmount = document.getElementById('inputAmount');
let resultingAmount = document.getElementById('resultingAmount');
const srcSelect = document.getElementsByTagName('select')[0];
const destSelect = document.getElementsByTagName('select')[1];

convertBtn.addEventListener('click', () => {
    const srcSelected = srcSelect.options[srcSelect.selectedIndex];
    const destSelected = destSelect.options[destSelect.selectedIndex];
    const srcCurrency = srcSelected.id;
    const destCurrency = destSelected.id;

    const fetchRate = function(isRateFound) {
        return fetch(
                `https://free.currencyconverterapi.com/api/v5/convert?q=${srcCurrency}_${destCurrency}&compact=ultra`
            )
            .then(rateResp => {
                return rateResp.json();
            })
            .then(rate => {
                const rate_value = rate[`${srcCurrency}_${destCurrency}`];
                // convert using the fetched rate
                //resultingAmount.textContent = `${destCurrency} ${(rate_value * inputAmount.value).toFixed(2)}`;
                // Add the fetched rate to IndexedDB
                dbPromise.then(db => {
                    const tx = db.transaction('rates', 'readwrite');
                    const ratesStore = tx.objectStore('rates');

                    // add it if it doesn't exist, or update it if it already exists
                    ratesStore.put({
                        rate: rate_value,
                        id: `${srcCurrency}_${destCurrency}`
                    });
                    return tx.complete;
                });
                return rate_value;
            })
            .catch(() => {
                if (!isRateFound)
                // if rateStored is true do nothing
                // (because the resulting amount was already shown to the user)
                // otherwise show alert (that says, you're offline, and that rate isn't stored)
                    swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'I cannot convert this while offline'
                });
            });
    };

    if (inputAmount.value === '') {
        // show an alert message if amount field is empty
        swal({
            type: 'error',
            title: 'Oops...',
            text: 'This field cannot be empty'
        });
        return;
    }
    // look for the rate in IDB, if it's not there, fetch it and add it to IDB
    // ALSO update the rates if they've changed
    dbPromise.then(db => {
        const ratesStore = db.transaction('rates').objectStore('rates');
        let storedRate;
        ratesStore
            .openCursor()
            .then(function cursorIterate(cursor) {
                if (!cursor) return;
                storedRate = cursor.value;
                // Once we find the wanted rate, the cursor stops iterating
                return (
                    cursor.value.id === `${srcCurrency}_${destCurrency}` ||
                    cursor.continue().then(cursorIterate)
                );
            })
            .then(isRateFound => {
                // returns undefined if not found, and returns the storedRate if found

                if (isRateFound && storedRate)
                // rate already stored
                    resultingAmount.textContent = `${destCurrency} ${(
            storedRate.rate * inputAmount.value
          ).toFixed(2)}`;

                else
                /*
                rate not found in IDB
                if the client is online the rate will be fetched and added to idb
                if offline the client will be shown an alert
                */
                    return fetchRate(isRateFound).then(
                    fetchedRate =>
                    (resultingAmount.textContent = `${destCurrency} ${(
                fetchedRate * inputAmount.value
              ).toFixed(2)}`)
                );
            });
    });

    inputAmount.focus();
});