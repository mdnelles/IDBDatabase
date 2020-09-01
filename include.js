// include this file to add data to browser database
// the name 'masterDB' is arbitrary
const dbPromise = createIndexedDB('masterDB');

function createIndexedDB(dbName) {
   if (!("indexedDB" in window)) {
      return null;
   }
   //JSMART db created browserDB
   return idb.open(dbName, 1, function (upgradeDb) {
      if (!upgradeDb.objectStoreNames.contains(dbName)) {
         const eventsOS = upgradeDb.createObjectStore("events", {
            keyPath: "id",
         });
      }
   });
}


// add data
function saveDataLocally(data, dataHandle) {
   if (!("indexedDB" in window)) {
      return null;
   }
   return dbPromise.then((db) => {
      const tx = db.transaction(dataHandle, "readwrite");
      const store = tx.objectStore(dataHandle);
      return Promise.all(data.map((adata) => store.put(adata))).catch(() => {
         tx.abort();
         throw Error("Events were not added to the store");
      });
   });
}

// retrieve data
function getLocalData(dataHandle) {
   if (!("indexedDB" in window)) {
      return null;
   }
   return dbPromise.then((db) => {
      const tx = db.transaction(dataHandle, "readonly");
      const store = tx.objectStore("events");
      return store.getAll();
   });
}
