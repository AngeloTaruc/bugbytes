import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { createUserWithEmailAndPassword,getAuth, onAuthStateChanged,signOut} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { ref as databaseRef, get,getDatabase,onValue,push,remove,set ,update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {getDownloadURL, getStorage, ref as storageRef, uploadBytes } from   "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js"

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
  const auth = getAuth(app);

  const VolunteerRef = databaseRef(db,'Volunteers')

  onValue(VolunteerRef,(snapshot)=>{
    const volunteerData = []

    snapshot.forEach((childSnapshot) => {
        const DataVolunteer = childSnapshot.val();
        if(DataVolunteer.Status === 'Pending'){
            volunteerData.push(childSnapshot);
        }
 
    });
    volunteers(volunteerData);
  })



  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

  async function volunteers(volunteerData){
        const VolunteerTableBody = document.getElementById('VolunteerTableBody');
        VolunteerTableBody.innerHTML = '';

        try{
            await volunteerData.map((childSnapshot) =>{
                const DataVolunteer = childSnapshot.val();
                const id = childSnapshot.key;
    
                const newRow = document.createElement('tr');
                newRow.innerHTML = ` 


                  <td>${DataVolunteer.Question2}</td>
                <td>${DataVolunteer.Status}</td>
                 <td>${DataVolunteer?.RegistrationDate ? formatDate(DataVolunteer.RegistrationDate) : 'N/A'}</td>
                 <td>
                <button id="viewButton"  data-attribute="${id}" class="vol-actions viewApplicants" onclick="showViewModal()">
                 <img src="./assets/img/eye-solid.png" alt="View" height="15" width="15" />  View
                  </button>
                 </td>
             <td class="vol-actions-container">
                                  
             <button class="vol-actions UserApproved" type="button" id="approve" approved-form-attribute=${id}
              onclick="showModal('approve')">
              <img src="../admin/assets/img/thumbs-up-regular.png" alt="" height="15"
                                                width="15" /> Approve
             </button>
                                 
                                    
                                 
                                      
              <button class="vol-actions Rejection" form-attribute=${id} type="button" name="reject" onclick="showModal('reject')">
            <img src="../admin/assets/img/ban-solid.png" alt="" height="15" width="15" /> Reject </button>
                                 </td>

                `
                VolunteerTableBody.appendChild(newRow);
    
            })

        }catch{
            console.log('Error')
        }
      
    

  } 


const VolunteerTableBody = document.getElementById('VolunteerTableBody');
VolunteerTableBody.addEventListener('click', (event)=>{
    if(event.target.classList.contains('viewApplicants')){
        const id = event.target.getAttribute('data-attribute');
       
        const ApplicationRef = databaseRef(db, `Volunteers/${id}`);

        get(ApplicationRef).then((childSnapshot)=>{
            const data = childSnapshot.val();

            document.getElementById('Qe1').value = data.Question1;
            document.getElementById('Q2').value = data.Question2;
            document.getElementById('Q3').value = data.Question3;
            document.getElementById('Q4').value = data.Question4;
            document.getElementById('Q5').value = data.Question5;
            document.getElementById('Q6').value = data.Question6;
            document.getElementById('Q7').value = data.Question7;
            document.getElementById('Q8').value = data.Question8;
            document.getElementById('Q9').value = data.Question9;
            document.getElementById('Q10').value = data.Question10;
            document.getElementById('Q11').value = data.Question11;
            document.getElementById('Q12').value = data.Question12;
            document.getElementById('Q13').value = data.Question13;
            document.getElementById('Q14').value = data.Question14;
            document.getElementById('Q15').value = data.Question15;
            document.getElementById('Q16').value = data.Question16;
            document.getElementById('Q17').value = data.Question17;
            document.getElementById('Q18').value = data.Question18;
            document.getElementById('Q19').value = data.Question19;
        

        }).catch((error)=>{
            console.log(error);
        })

    }else if (event.target.classList.contains('Rejection')){
        const id = event.target.getAttribute('form-attribute');
        document.getElementById('rejectBtn').setAttribute('data-updatereject', id);

    }else if (event.target.classList.contains('UserApproved')){
        const id = event.target.getAttribute('approved-form-attribute');
        document.getElementById('ApproveVolunteer').setAttribute('Approved-id', id);
        const VolunteerRef = databaseRef(db,`Volunteers/${id}`)

        get(VolunteerRef).then((snapshot)=>{
            const data = snapshot.val()

            document.getElementById('email').value = data.Question6;
        }).catch((error)=>{

            console.log(error)
        })
    }
})


document.getElementById('rejectBtn').addEventListener('click', (event) => {
    const id = event.target.getAttribute('data-updatereject');
    const rejectRef = databaseRef(db, `Volunteers/${id}`);

    const reason = document.getElementById('reason').value;

    update(rejectRef,{
        Status: 'Rejected',
        Reasons:reason
    }).then(()=>{
        console.log('Rejected');
    }).catch((error)=>{
        console.log(error);
    })

});


document.getElementById('ApproveVolunteer').addEventListener('click', (event) => {
    const id = event.target.getAttribute('Approved-id');
   
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
            const userId = userCredentials.user.uid;

            // Save the volunteer account information in the database
            return set(databaseRef(db, `Volunteer-Account/${userId}`), {
                Username: username, 
                Email: email,
            });
        })
        .then(() => {
            alert('Volunteer Account Created');

            // Update the volunteer status to "Approved"
            const volunteerRef = databaseRef(db, `Volunteers/${id}`);
            return update(volunteerRef, {
                Status: 'Approved',
            });
        })
        .then(() => {
            console.log('Volunteer Status Updated');
        })
        .catch((error) => {
            console.error('Error:', error.message);
            alert('Email is already used.')
        });
});



const volunteerRef= databaseRef(db,'Volunteer-Account');

onValue(volunteerRef,(snapshot)=>{
    const volunteers = []
    snapshot.forEach((childSnapshot)=>{
        volunteers.push(childSnapshot);
    })
    DisplayVolunnters(volunteers);
})


async  function DisplayVolunnters (volunteers) { 
        const VolunteerTablebody = document.getElementById('VolunteerTablebody');
        VolunteerTablebody.innerHTML = '';

        volunteers.map((childSnapshot)=>{
            
            const VolunteerAccount = childSnapshot.val();
            const  name = VolunteerAccount.Username;

            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${name} </td>
            `
            VolunteerTablebody.appendChild(newRow);

        })
}
   


document.getElementById('rejectbutton').addEventListener('click',()=>{


    const volunteerRef= databaseRef(db,'Volunteers');

    onValue(volunteerRef,(snapshot)=>{
        const volunteers = []
        snapshot.forEach((childSnapshot)=>{
            const volunteer = childSnapshot.val();
            if(volunteer.Status === 'Rejected'){
                volunteers.push(childSnapshot);
            }
           
        })
        DisplayVolunnters(volunteers);
    })
    
    
    async  function DisplayVolunnters (volunteers) { 
            const VolunteerTablebody = document.getElementById('VolunteerTablebody');
            VolunteerTablebody.innerHTML = '';
    
            volunteers.map((childSnapshot)=>{
                
                const Volunteer = childSnapshot.val();
                const  name = Volunteer.Question2;
    
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${name} </td>
                `
                VolunteerTablebody.appendChild(newRow);
    
            })
    }
       






})








