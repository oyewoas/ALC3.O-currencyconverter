const dbPromise = idb.open('currencies-db', 1, upgradeDB => {
    upgradeDB.createObjectStore('rates', { keyPath: 'id' });
});