//Created database : test-db version 1 with object store with name 'keyval' and in it are key and values
var dbPromise = idb.open('test-db', 1, function(upgradeDb) {
    var keyValStore = upgradeDb.createObjectStore('keyval');
    keyValStore.put('world', 'hello');
});




//adding more key and values to the database: test-db version 1 and object store keyval
dbPromise
    .then(function(db) {
        var tx = db.transaction('keyval', 'readwrite');
        var keyValStore = tx.objectStore('keyval');
        keyValStore.put('X', 'favoriteAnimal');
        return tx.complete;
    })
    .then(function() {
        console.log('Added favoriteAnimal:X to keyval');
    })
    .catch(function(error) {
        console.error('Transaction failed:', error);
    });

//get hello from the test db version 1 boject store:'keyval'
dbPromise
    .then(function(db) {
        var tx = db.transaction('keyval');
        var keyValStore = tx.objectStore('keyval');
        return keyValStore.get('hello');
    })
    .then(function(val) {
        console.log('The value of "hello" is:', val);
    })
    .catch(function(error) {
        console.error('Transaction failed:', error);
    });


//Create new object store: people as version 2 in the database with name as the key of the object store
var dbPromise = idb.open('test-db', 2, function(upgradeDb) {
    switch (upgradeDb.oldVersion) {
        case 0:
            var keyValStore = upgradeDb.createObjectStore('keyval');
            keyValStore.put('world', 'hello');
        case 1:
            upgradeDb.createObjectStore('people', {
                keyPath: 'name'
            });
    }
});

//Add contents people in the Object store: people in the test db version 2
dbPromise
    .then(function(db) {
        var tx = db.transaction('people', 'readwrite');
        var peopleStore = tx.objectStore('people');

        peopleStore.put({
            name: 'Sam Munoz',
            age: 25,
            favoriteAnimal: 'dog'
        });

        peopleStore.put({
            name: 'Susan Keller',
            age: 34,
            favoriteAnimal: 'cat'
        });

        peopleStore.put({
            name: 'Lillie Wolfe',
            age: 28,
            favoriteAnimal: 'dog'
        });

        peopleStore.put({
            name: 'Marc Stone',
            age: 39,
            favoriteAnimal: 'cat'
        });

        return tx.complete;
    })
    .then(function() {
        console.log('People added!');
    });

//Read all the people storeed in the people object store in version 2 of the test-db database

dbPromise
    .then(function(db) {
        var tx = db.transaction('people');
        var peopleStore = tx.objectStore('people');
        return peopleStore.getAll();
    })
    .then(function(people) {
        console.log('People:', people);
    });

//Read people according to their favourite animal
var dbPromise = idb.open('test-db', 3, function(upgradeDb) {
    switch (upgradeDb.oldVersion) {
        case 0:
            var keyValStore = upgradeDb.createObjectStore('keyval');
            keyValStore.put('world', 'hello');
        case 1:
            upgradeDb.createObjectStore('people', {
                keyPath: 'name'
            });
        case 2:
            var peopleStore = upgradeDb.transaction.objectStore('people');
            peopleStore.createIndex('animal', 'favoriteAnimal');
    }
});

//read and get all stored people with the animal index created above
dbPromise
    .then(function(db) {
        var tx = db.transaction('people');
        var peopleStore = tx.objectStore('people');
        var animalIndex = peopleStore.index('animal');

        return animalIndex.getAll();
    })
    .then(function(people) {
        console.log('People:', people);
    });

//read all people with cat as their favourite animal

dbPromise
    .then(function(db) {
        var tx = db.transaction('people');
        var peopleStore = tx.objectStore('people');
        var animalIndex = peopleStore.index('animal');

        return animalIndex.getAll('cat');
    })
    .then(function(people) {
        console.log('People:', people);
    });

//Real all people with age as index, that is according to their age.
var dbPromise = idb.open('test-db', 4, function(upgradeDb) {
    switch (upgradeDb.oldVersion) {
        case 0:
            var keyValStore = upgradeDb.createObjectStore('keyval');
            keyValStore.put('world', 'hello');
        case 1:
            upgradeDb.createObjectStore('people', { keyPath: 'name' });
        case 2:
            var peopleStore = upgradeDb.transaction.objectStore('people');
            peopleStore.createIndex('animal', 'favoriteAnimal');
        case 3:
            peopleStore = upgradeDb.transaction.objectStore('people');
            peopleStore.createIndex('age', 'age');
    }
});

//get all people according to age from the people object store
dbPromise
    .then(function(db) {
        var tx = db.transaction('people');
        var peopleStore = tx.objectStore('people');
        var ageIndex = peopleStore.index('age');

        return ageIndex.getAll();
    })
    .then(function(people) {
        console.log('People by age:', people);
    });

//get according to specific age
dbPromise
    .then(function(db) {
        var tx = db.transaction('people');
        var peopleStore = tx.objectStore('people');
        var ageIndex = peopleStore.index('age');

        return ageIndex.getAll(25);
    })
    .then(function(people) {
        console.log('People by age:', people);
    });


//instead of getting all at the same time i can loop through the contents starting from the first index
//and continuing to others contained in the object store
//
dbPromise
    .then(function(db) {
        var tx = db.transaction('people');
        var peopleStore = tx.objectStore('people');
        var ageIndex = peopleStore.index('age');

        return ageIndex.openCursor();
    })
    .then(function(cursor) {
        if (!cursor) return;
        console.log('Cursored at:', cursor.value.name);
        return cursor.continue();
    });

///better way to using cursor lopping through each of them at the same time
// dbPromise
//     .then(function(db) {
//         var tx = db.transaction('people');
//         var peopleStore = tx.objectStore('people');
//         var ageIndex = peopleStore.index('age');

//         return ageIndex.openCursor();
//     })
//     .then(function logPerson(cursor) {
//         if (!cursor) return;
//         console.log('Cursored at:', cursor.value.name);
//         return cursor.continue().then(logPerson);
//     })
//     .then(function() {
//         console.log('Done cursoring');
//     });

//advance using cursor '2' here causes the items to be skipped twice

dbPromise
    .then(function(db) {
        var tx = db.transaction('people');
        var peopleStore = tx.objectStore('people');
        var ageIndex = peopleStore.index('age');

        return ageIndex.openCursor();
    })
    .then(function(cursor) {
        if (!cursor) return;
        return cursor.advance(2);
    })
    .then(function logPerson(cursor) {
        if (!cursor) return;
        console.log('Cursored at:', cursor.value.name);
        return cursor.continue().then(logPerson);
    })
    .then(function() {
        console.log('Done cursoring');
    });