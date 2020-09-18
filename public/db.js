let db;
//new db request for a budget.
const request = indexedDB.open("budget", 1);

//Create a function to store an object while Auto-Incrementing the object
request.onupgradeneeded = function(event) {
  const db = event.target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

//create a function to target the database and check that it is online. 
request.onsuccess = function(event) {
    db = event.target.result;
      if (navigator.onLine) {
      checkDatabase();
    }
  };
  // Create function to determine if the event has any error occurences 
  request.onerror = function(event) {
    console.log("Error " + event.target.errorCode);
  };
  //create  funcion "record" to store to db on pending with readwrite 
  function saveRecord(record) {
    const transaction = db.transaction(["pending"], "readwrite");
  
    // object store for pending db data to be accessed
    const store = transaction.objectStore("pending");
    console.log("store")
    // adds the record with the store
    store.add(record);
  }
  //function to go through the stored database
  function checkDatabase() {
    // opens pending db transaction
    const transaction = db.transaction(["pending"], "readwrite");
    // view stored pending db's
    const store = transaction.objectStore("pending");
    // retrieves all records and stringifies the data.
    const getAll = store.getAll();
    
    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
          fetch("/api/transaction/bulk", {
            method: "POST",
            body: JSON.stringify(getAll.result),
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json"
            }
          })
          .then(response => response.json())
      .then(() => {
        // if successful, open a transaction on your pending db
        const transaction = db.transaction(["pending"], "readwrite");

        // access your pending object store
        const store = transaction.objectStore("pending");

        // clear all items in your store
        store.clear();
      });
    }
  };
}
    window.addEventListener("online", checkDatabase)
