// add data
function saveEventDataLocally(events) {
    if (!("indexedDB" in window)) {
       return null;
    }
    return dbPromise.then((db) => {
       const tx = db.transaction("events", "readwrite");
       const store = tx.objectStore("events");
       return Promise.all(events.map((event) => store.put(event))).catch(() => {
          tx.abort();
          throw Error("Events were not added to the store");
       });
    });
 }
 // retrieve data
 function getLocalEventData() {
    if (!("indexedDB" in window)) {
       return null;
    }
    return dbPromise.then((db) => {
       const tx = db.transaction("events", "readonly");
       const store = tx.objectStore("events");
       return store.getAll();
    });
 }
