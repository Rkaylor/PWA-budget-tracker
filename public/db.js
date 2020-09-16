let db;
//new db request for a budget.
const request = indexedDB.open("budget", 1);

//Create a function to store an object while Auto-Incrementing the object
request.onupgradeneeded = function(event) {
  const db = event.target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

