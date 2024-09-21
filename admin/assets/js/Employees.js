import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase,set ,ref as databaseRef, get,onValue,push } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {getStorage, ref as storageRef, uploadBytes, getDownloadURL } from   "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js"
import { getAuth, createUserWithEmailAndPassword,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



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
  const auth = getAuth(app);




const addEmployeeBtn = document.getElementById('submitEmployee');
addEmployeeBtn.addEventListener('click',AddEmployee)



function AddEmployee(){

 const name = document.getElementById('staffName').value;
 const phone = document.getElementById('staffPhone').value;
 const BDate = document.getElementById('staffBirthday').value;
 const email =document.getElementById('staffEmail').value;
 const password = document.getElementById('staffPassword').value;
 const position = document.getElementById('staffPosition').value;
 const username = document.getElementById('staffUserName').value;
 const DateCreated = new Date();
  const uniqueId = Date.now().toString();

  const EmployeeId =  "Emp"+`${uniqueId}` 

    
        createUserWithEmailAndPassword(auth,email,password).then((userCredentials)=>{
            const users = userCredentials.user;
            
            set(databaseRef(db,`Employee/${users.uid}`),{
                EmployeeId:EmployeeId,
                Name:name,
                Phone:phone,
                Username:username,
                Position:position,
                BirthDate:BDate,
                Email:email,
                EmailId:users.uid,
                Status:"Inactive",
                DateCreated:DateCreated,
                Date:""
                
            }).then(()=>{
              alert('Employee added Succesfully')
            }).catch((error)=>{
              alert(`${error.message}`)
            })
        
        }).catch((error)=>{
          alert(`${error.message}`);
        }) 

}
const EmployeeRef = databaseRef(db,'Employee');

onValue(EmployeeRef,(snapshot)=>{
    const EmployeeData  = [];
    snapshot.forEach((childSnapshot)=>{
        EmployeeData.push(childSnapshot);
    })
    DisplayEmployee(EmployeeData);

});

async function DisplayEmployee (EmployeeData){
 const EmpTable = document.getElementById('EmployeeTableBody');
 EmpTable.innerHTML = '';

 if(EmployeeData.length === 0){
  EmpTable.innerHTML = '<p> Not Found </p>'
 }else{
  EmployeeData.forEach((childSnapshot)=>{
    const Employees =  childSnapshot.val();
    const EmpId = Employees.EmployeeId;
    const username = Employees.Username;
    const position = Employees.Position;
    const status = Employees.Status;

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>${EmpId} </td>
      <td>${username} </td>
      <td>${position} </td>
      <td>${status} </td>
    `
    newRow.addEventListener('click', () =>{
      document.getElementById('viewInfo').style.display = 'block'
      const profile = document.getElementById('ad-profile');
      profile.innerHTML = `

       <span>Name: <b>${name}</b></span>
       <span>Email: ${Employees.Email} </span>
       <span>Position: ${position} </span>
       <span>Phone Number: ${Employees.Phone} </span>
       <span>Birthday: ${Employees.BirthDate}</span>
      `
    })

    EmpTable.appendChild(newRow);
})

 }

 

}
document.addEventListener('DOMContentLoaded',()=>{

  const searchEmployee = document.getElementById('searchEmployee');
searchEmployee.addEventListener('keydown',(event)=>{
      if(event.keyCode === 13){

        onValue(EmployeeRef,(snapshot)=>{
          const EmployeeData  = [];
          snapshot.forEach((childSnapshot)=>{
              const DataEmployee = childSnapshot.val()
              if(DataEmployee.Username === searchEmployee.value){
                EmployeeData.push(childSnapshot);
              }else if(searchEmployee.value === ''){
                location.reload(true);
              }
          })
          DisplayEmployee(EmployeeData);
      
      });

      }
});

});










