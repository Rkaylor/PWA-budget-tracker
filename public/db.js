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
  
    // adds the record with the store method
    store.add(record);
  }

  

  