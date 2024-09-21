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


  const userRef = databaseRef(db,'Users');

  onValue(userRef,(snapshot)=>{
    const UserData = [];
    snapshot.forEach((childSnapshot)=>{
        UserData.push(childSnapshot);
    })

    users(UserData)
  })

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
        // If the date is invalid, return the original string
        return dateStr;
    }
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

  async function users(UserData) {
    const userTable = document.getElementById('UserTableBody');
    userTable.innerHTML = '';

    if (UserData.length === 0) {
        userTable.innerHTML = `<tr><td colspan="4"><p>Not Found</p></td></tr>`;
    } else {
        for (const childSnapshot of UserData) {
            const userData = childSnapshot.val();
            const name = userData.username;
            const status = userData.status;
            const RegisterDate = userData.registrationDate;
            const PetsAdopted = 0;
            const formattedRegisteredDate = formatDate(RegisterDate);

            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${name}</td>
                <td>${PetsAdopted}</td>
                <td>${status}</td>
                <td>${formattedRegisteredDate}</td>
            `;
            
            newRow.addEventListener('click', async () => {
                document.getElementById('MName').innerHTML = `Name: ${userData.firstName}`;
                document.getElementById('MUsername').innerHTML = `Username: ${name}`;
                document.getElementById('MPhone').innerHTML = `Contact: ${userData.phoneNumber}`;

                const userDonationRef = databaseRef(db, 'Donation');
                const userDonationsSnapshot = await get(userDonationRef); // Use appropriate method to get data
                
                const UserDonation = document.getElementById('UserDonation');
                UserDonation.innerHTML = '';

                userDonationsSnapshot.forEach((donationSnapshot) => {
                    const donationData = donationSnapshot.val();
                    if (donationData.UserId === userData.userid) {
                        const newRow1 = document.createElement('tr');
                        newRow1.innerHTML = `
                            <td>${donationData.DonateDate}</td>
                            <td>${donationData.Mode}</td>
                            <td>${donationData.Amount}</td>
                        `;
                        UserDonation.appendChild(newRow1);
                    }
                });
            });

            userTable.appendChild(newRow);
        }
    }
}


  const searchUser = document.getElementById('searchUser');
  searchUser.addEventListener('keydown',(event)=>{

    onValue(userRef,(snapshot)=>{
      const UserData = [];
      snapshot.forEach((childSnapshot)=>{
        const DataUser = childSnapshot.val();
        if(DataUser.username === searchUser.value){
          UserData.push(childSnapshot);
        }else if (searchUser.value === ''){
            location.reload(true);
        }
          
      })
  
      users(UserData)
    })


  })
  