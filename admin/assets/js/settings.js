import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase,set ,ref as databaseRef, get,onValue,push,update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {getStorage, ref as storageRef, uploadBytes, getDownloadURL } from   "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js"
import { getAuth, createUserWithEmailAndPassword,reauthenticateWithCredential,onAuthStateChanged,signOut,EmailAuthProvider,updatePassword} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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


  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  const storage = getStorage(app);
  const auth = getAuth(app);

  

  let userid;

  onAuthStateChanged(auth,(user)=>{
    if(user){
        userid = user.uid;
        AuthenticateThruDb(userid);
    }else{
        signOut(auth).then(()=>{
            alert('You Are Forced To SignOut')
            window.location.href= 'http://127.0.0.1:5500/login-emp.html';
        }).catch((error)=>{
            console.log(error);
        })
    }
  });


  function AuthenticateThruDb(userid){

    const EmployeeRef = databaseRef(db,`Employee/${userid}`);

    const InputUser = document.getElementById('InputUser');
    const InputName = document.getElementById('InputName');
    const InputPhone = document.getElementById('InputPhone');
    const inputAddress = document.getElementById('InputAddress');


    get(EmployeeRef).then((snapshot)=>{
        const EmployeeData = snapshot.val()
        InputUser.value = EmployeeData?.Username || "N/A";
       InputName.value = EmployeeData.Name;
       InputPhone.value = EmployeeData.Phone;
       inputAddress.value = EmployeeData?.Address || "N/A";


    }).catch((error)=>{
        console.log(error);
    })

  }

const userUpdate = document.getElementById('updateUser');
userUpdate.addEventListener('click',()=>{
    updateProfile(userid);
})
 

  async function updateProfile(userid){

    const EmployeeRef = databaseRef(db,`Employee/${userid}`);

    const InputUser = document.getElementById('InputUser');
    const InputName = document.getElementById('InputName');
    const InputPhone = document.getElementById('InputPhone');
    const inputAddress = document.getElementById('InputAddress');

    update(databaseRef(db,`Employee/${userid}`),{
        User: InputUser.value,
        Name: InputName.value,
        Phone: InputPhone.value,
        Address: inputAddress.value

    }).then(()=>{
            alert('Profile Updated Successfully');
    }).catch((error)=>{
        console.log(error);
    })


  }
 

const updatePass = document.getElementById('UpdatePass');
  
updatePass.addEventListener('click', (event) => {

event.preventDefault;

  const user = auth.currentUser;
  const currentPassword = document.getElementById('currentPassword').value;
  
  
  const newPassword = document.getElementById('newPassword').value;
  const repeatNewPassword = document.getElementById('repeatNewPassword').value;

  const credential = EmailAuthProvider.credential(user.email,currentPassword)

if(newPassword === repeatNewPassword){

    reauthenticateWithCredential(user,credential).then(()=>{

        return updatePassword(user,newPassword).then(()=>{
             alert('Password Updated Successfully');
         }).catch((error)=>{
             console.log(error);
         })
     
     }).catch((error)=>{
         console.log(error);
     })

}else{
    alert('Password does not match')
}
  
});





