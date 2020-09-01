app.get("/api/getAll", (req, res) => {
   let options = {
      root: __dirname + "/server-data/",
   };

   const fileName = "events.json";
   // sends back contents of events.json
   res.sendFile(fileName, options, (err) => {
      if (err) {
         res.sendStatus(500);
         return;
      }
   });
});

function getServerData() {
   return fetch("api/getAll").then((response) => {
      if (!response.ok) {
         throw Error(response.statusText);
      }
      return response.json();
   });
}

function loadContentNetworkFirst() {
   getServerData()
      .then((dataFromNetwork) => {
         updateUI(dataFromNetwork);
         saveEventDataLocally(dataFromNetwork)
            .then(() => {
               setLastUpdated(new Date());
               messageDataSaved();
            })
            .catch((err) => {
               messageSaveError();
               console.warn(err);
            });
      })
      .catch((err) => {
         console.log(
            "Network requests have failed, this is expected if offline"
         );
         getLocalEventData().then((offlineData) => {
            if (!offlineData.length) {
               messageNoData();
            } else {
               messageOffline();
               updateUI(offlineData);
            }
         });
      });
}
function createIndexedDB() {
    if (!("indexedDB" in window)) {
       return null;
    }
    //JSMART db created browserDB
    return idb.open("browserDB", 1, function (upgradeDb) {
       if (!upgradeDb.objectStoreNames.contains("events")) {
          const eventsOS = upgradeDb.createObjectStore("events", {
             keyPath: "id",
          });
       }
    });
 }
const dbPromise = createIndexedDB();
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
