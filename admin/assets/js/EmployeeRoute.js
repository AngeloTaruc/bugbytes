import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase,set ,ref as databaseRef, get,onValue,push,update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {getStorage, ref as storageRef, uploadBytes, getDownloadURL } from   "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js"
import { getAuth, createUserWithEmailAndPassword,onAuthStateChanged,signOut} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



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

  let userid;

  const LocalDate = new Date();
  
const Year = LocalDate.getFullYear();
const month = LocalDate.getMonth();
const day = LocalDate.getDate();


  onAuthStateChanged(auth,(user)=>{
      if(user){
        AuthenticateThruDB(user.uid);
        userid = user.uid;
      }else{
        signOut(auth).then(()=>{
          alert('You Are Forced To SignOut')
          window.location.href= 'http://127.0.0.1:5500/login-emp.html';
      }).catch((error)=>{
        alert('Error Occured');
      });
      }
  })

  function AuthenticateThruDB(userid){
    const date = `${Year}-${month}-${day}`;
    const dbRef = databaseRef(db,`Employee/${userid}`);

    get(dbRef).then((snapshot)=>{
      if(snapshot.exists()){

       
       
        
      }
    }).catch((error)=>{
      signOut(auth).then(()=>{
        alert('You Are Forced To SignOut')
        window.location.href= 'http://127.0.0.1:5500/login-emp.html';
    }).catch((error)=>{
      alert('Error Occured');
    });
    });
    
  }

  const id = Date.now().toString();

  function AuthenticateThruDBLogOut(userid) {
    const dbRef = databaseRef(db, `Employee/${userid}`);
    
    // Get current date
    const today = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[today.getMonth()];
    const day = today.getDate();
    const year = today.getFullYear();
    const hours = today.getHours();
    const minutes = today.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;

    // Format date and time as "Aug 23, 2024 2:30 PM"
    const date = `${month} ${day}, ${year} ${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;


    const id = Date.now().toString(); // Generate a unique ID for the log entry

    get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
            const user = snapshot.val();

            update(databaseRef(db,`Employee/${userid}`),{
                  Status:'Inactive'
            }).then(()=>{

            }).catch((error)=>{
              console.error(error);
            })

      
            set(databaseRef(db, `Logs/${id}`), {
                EmployeeID: userid,
                Username: user.Username,
                Position: user.Position,
                Date: date,
                Status: 'Logged Out'
            }).then(() => {
                alert('Successfully Logged Out');
            }).catch((error) => {
                alert('Error Occurred: ' + error.message);
            });
        } else {
            alert('User not found');
        }
    }).catch((error) => {
        alert('Error fetching user data: ' + error.message);
    });

}


  const logoutButton = document.getElementById('logout-btn');

  logoutButton.addEventListener('click', async () => {
    try{

 
    AuthenticateThruDBLogOut(userid)
   await signOut(auth)
      .then(() => {
        alert('Logout successful');
        
        window.location.href= 'http://127.0.0.1:5500/login-emp.html';
      })
      .catch((error) => {
        alert(`Error occurred: ${error.message}`);
      });
    }catch{
      alert('Error Occured');
    }
  });