import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase,set ,ref as databaseRef, get,onValue,push } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {getStorage, ref as storageRef, uploadBytes, getDownloadURL } from   "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js"
import { getAuth, createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyB166FWoQ8GfPHEVtKVy-KmI9jeWul6Pbg",
    authDomain: "pawsitive-368b1.firebaseapp.com",
    databaseURL: "https://pawsitive-368b1-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "pawsitive-368b1",
    storageBucket: "pawsitive-368b1.appspot.com",
    messagingSenderId: "59441375746",
    appId: "1:59441375746:web:16d10d687aced65786d51b",
    measurementId: "G-CDSTB89PGK"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  const storage = getStorage(app);

  const EmployeeRef = databaseRef(db,'Logs');

  onValue(EmployeeRef, (snapshot) => {
    const EmployeeData = [];
    snapshot.forEach((childSnapshot) => {
      EmployeeData.push({
        key: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    
    // Sort the EmployeeData array by Date in descending order
    EmployeeData.sort((a, b) => {
      return new Date(b.Date) - new Date(a.Date);
    });
    
    DisplayEmployee(EmployeeData);
  });
  
  async function DisplayEmployee(EmployeeData) {
    const EmployeeMonitoringTable = document.getElementById('EmployeeMonitoringTable');
    EmployeeMonitoringTable.innerHTML = '';
  
    try {
      EmployeeData.forEach((DataEmployee) => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
          <td>${DataEmployee.key}</td>
          <td>${DataEmployee.Username}</td>
          <td>${DataEmployee.Position}</td>
          <td>${DataEmployee.Date}</td>
          <td>${DataEmployee.Status}</td>
        `;
        EmployeeMonitoringTable.appendChild(newRow);
      });
    } catch (error) {
      console.log('Error:', error);
    }
  }