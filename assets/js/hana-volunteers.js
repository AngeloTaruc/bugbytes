import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { EmailAuthProvider, getAuth, onAuthStateChanged, reauthenticateWithCredential, signInWithEmailAndPassword, signOut, updateEmail, updatePassword } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { ref as databaseRef, get, getDatabase, onValue, set, update } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import { getDownloadURL, getStorage, ref as storeRef, uploadBytes } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";
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
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

const dbRef = databaseRef(db, "Pets");
const announcementRef = databaseRef(db, "Announcements")
const programRef = databaseRef(db, "Programs")
const AdaptionRef = databaseRef(db, "Adaption_Applicants");


const LocalDate = new Date();

const Year = LocalDate.getFullYear();
const month = LocalDate.getMonth();
const day = LocalDate.getDate();




const username = document.getElementById('UsernameHome');

// LOGIN

let userId;
onAuthStateChanged(auth, (user) => {
  if (user) {
    userId = user.uid;

    //Display Current Email in Change Email Settings
    document.getElementById('currentEmail').value = user.email;

    //Display UserInfo in profile Settings
    DisplayUserInfo(userId);


    const userRef = databaseRef(db, `Volunteer-Account/${userId}`);
    get(userRef).then((snapshot) => {
      username.innerHTML = "Hello " + snapshot.val().Username;
    })

  } else {

  }


  // LOGOUT
  const logout = document.getElementById('logout-button');
  logout.addEventListener('click', () => {
    signOut(auth).then(() => {
      alert('Logged out succesfully');
      window.location.href = 'volunteer-login.html';

    }).catch((error) => {
      alert(error.message);
    });
  });



  //Fetch Programs
  onValue(programRef, (snapshot) => {
    const programData = []
    snapshot.forEach((childSnapshot) => {
      programData.push(childSnapshot);
    })
    DisplayProgram(programData);
  })

  //Function to display programs;
  function DisplayProgram(programData) {
    const CardContainer = document.getElementById('prog-contents');
    CardContainer.innerHTML = '';

    programData.map((childSnapshot) => {
      const program = childSnapshot.val();
      const programKey = childSnapshot.key;
      const notification = document.createElement('div');
      const truncatedMsg = truncateText(program.Msg, 50);
      notification.classList.add('notification');
      const date = new Date(program.Posted);
      const formattedProgDate = date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });

      function truncateText(text, maxLength) {
        if (text.length > maxLength) {
          return text.substring(0, maxLength) + '...';
        }
        return text;
      }


      notification.innerHTML = `
   <div class="notiglow"> </div>
        <div class="notiborderglow"></div>
        <div class="notititle">${program.title} </div> 
        <div class="notibody"> 
        <p>${truncatedMsg} </p>
        <p>${formattedProgDate} </p>
    `
      notification.addEventListener('click', () => {

        const programContents = notification.parentNode;
        programContents.style.display = "none";
        const notificationContent = programContents.nextElementSibling;
        notificationContent.style.display = "block";

        document.getElementById('Ptitle').innerHTML = program.title;
        document.getElementById('Pbody').innerHTML = program.Msg
        document.getElementById('Pposted').innerHTML = formattedProgDate
        document.getElementById('PcontentImg').innerHTML = `<img style="max-width:500px;" src=${program.Poster} />`
        document.getElementById('GetProgram').setAttribute('Program-key', programKey);

      });
      CardContainer.appendChild(notification);
    })

  }

  //Fetch Announcements
  onValue(announcementRef, (snapshot) => {
    const announcementData = []
    snapshot.forEach((childSnapshot) => {
      announcementData.push(childSnapshot);
    })
    DisplayAnnouncement(announcementData);
  });


  //Display Announcements 
  function DisplayAnnouncement(announcementData) {
    const CardContainer = document.getElementById('prog-ann-contents');
    CardContainer.innerHTML = '';

    announcementData.map((childSnapshot) => {
      const announcement = childSnapshot.val();
      const notification = document.createElement('div')
      notification.classList.add('notification')
      const truncatedMsg = truncateText(announcement.msg, 50);
      const date = new Date(announcement.posted);
      const formattedAnnDate = date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });

      function truncateText(text, maxLength) {
        if (text.length > maxLength) {
          return text.substring(0, maxLength) + '...';
        }
        return text;
      }
      notification.innerHTML = `
        <div class="notiglow"> </div>
        <div class="notiborderglow"></div>
        <div class="notititle">${announcement.title} </div> 
        <div class="notibody"> 
        <p>${truncatedMsg} </p>
        <p>${formattedAnnDate} </p>

        `
      //Click to show the fulldetails of the item
      notification.addEventListener('click', () => {

        var progAnnContents = notification.parentNode;
        progAnnContents.style.display = "none";
        var notificationContent = progAnnContents.nextElementSibling;
        notificationContent.style.display = "block";

        document.getElementById('Atitle').innerHTML = announcement.title;
        document.getElementById('Abody').innerHTML = announcement.msg;
        document.getElementById('APosted').innerHTML = formattedAnnDate;
        document.getElementById('DivImg').innerHTML = `<img src=${announcement.image} />`


      })
      CardContainer.appendChild(notification);
    })

  }

  // Function to apply for volunteer

  document.getElementById('GetProgram').addEventListener('click', (event) => {
    const programKey = event.target.getAttribute('Program-key');

    // Reference to the specific program
    const programRef = databaseRef(db, `Programs/${programKey}`);

    // Retrieve the program details
    get(programRef).then((snapshot) => {
      const ProgramData = snapshot.val();
      const date = ProgramData.Date;
      const Msg = ProgramData.Msg;
      const Posted = ProgramData.Posted;
      const title = ProgramData.title;

      // Store the program details under the user's volunteer account
      set(databaseRef(db, `Volunteer-Account/${userId}/Program/${programKey}`), {
        Date: date,
        Msg: Msg,
        Posted: Posted,
        title: title
      }).then(() => {
        alert('Successfully Volunteered for this Program');
      }).catch((error) => {
        alert(`Error: ${error.message}`);
      });

      // Update the program's volunteers list
      update(databaseRef(db, `Programs/${programKey}/Volunteers/${userId}`), {
        userId: userId
      }).then(() => {
        console.log("Volunteer added successfully to the program.");
      }).catch((error) => {
        alert(`Error: ${error.message}`);
      });

    }).catch((error) => {
      console.log(`Error: ${error.message}`);
    });
  });




  const VoluProgram = databaseRef(db, `Volunteer-Account/${userId}/Program`);

  onValue(VoluProgram, (snapshot) => {
    const data = [];
    snapshot.forEach((childSnapshot) => {
      data.push(childSnapshot.val());
    });
  
    console.log(data); // Check the data being fetched
    DisplayProgramApplied(data);
  });
  

  function DisplayProgramApplied(data) {
    // Target the <tbody> of the table
    const ProgramTableBody = document.getElementById('ProgramTable').querySelector('tbody');
    ProgramTableBody.innerHTML = ''; // Clear the existing rows
  
    // Loop through the data and create rows
    data.forEach((program) => {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td>${program.title}</td>
        <td>${program.Date}</td>
      `;
      ProgramTableBody.appendChild(newRow); // Append the row to the tbody
    });
  }
  
  


  //Update Password
  const UpdatePass = document.getElementById('updatepass');

  UpdatePass.addEventListener('click', () => {

    const user = auth.currentUser;
    const currentPassword = document.getElementById('currentPassword').value;
    const credential = EmailAuthProvider.credential(user.email, currentPassword);

    reauthenticateWithCredential(user, credential).then(() => {
      const newPassword = document.getElementById('newPassword').value;
      const ReTypenewPassword = document.getElementById('ReTypenewPassword').value;
      if (newPassword === ReTypenewPassword) {
        user.updatePassword(newPassword).then(() => {
          alert(" Update Password Successfully ")

        }).catch((error) => {
          console.log(error);
        })

      } else {
        alert('Passwords do not match');
      }

    }).catch((error) => {
      alert('Error: ' + error.message);
    });

  })

  //Update Email
  const UpdateEmail = document.getElementById('UpdateEmail');
  UpdateEmail.addEventListener('click', () => {

    const user = auth.currentUser;

    const newEmail = document.getElementById('newEmail').value;
    const currentPasswordEmail = document.getElementById('currentPasswordEmail').value;

    const credential = EmailAuthProvider.credential(user.email, currentPasswordEmail);
    reauthenticateWithCredential(user, credential).then(() => {
      updateEmail(user, newEmail).then(() => {
        alert(" Update Email Successfully Please Check Email To Confirm")
      }).catch(() => {
        alert('Error: ' + error.message);
      })
    }).catch(() => {
      alert('Error: ' + error.message);
    })

  })

  const NewProfile = document.getElementById('NewProfile');
  NewProfile.addEventListener('click', async () => {

    const profilePhoto = document.getElementById('profilePhoto-upload');
    const uploadname = profilePhoto.files[0];


    try {
      const uploadref = storeRef(storage, 'Photo/Profile', uploadname.name);
      const newProfile = await uploadBytes(uploadref, uploadname);
      const newUrl = await getDownloadURL(newProfile.ref);

      await update(databaseRef(db, `Users/${userId}`), {
        UserProfile: newUrl
      }).then(() => {
        alert('Profile Updated Successfully');
        location.reload(true);
      }).catch((error) => {
        alert('Error: ' + error.message);
      })
    } catch {
      alert(`${error.message}`);
    }

  })

  const UpdateInfo = document.getElementById('UpdateInfo');
  UpdateInfo.addEventListener('click', () => {

    const fname = document.getElementById('firstname').value;
    const Mname = document.getElementById('middleInitial').value;
    const lname = document.getElementById('lastname').value;
    const uname = document.getElementById('username').value;
    const mobileNum = document.getElementById('mobileNumber').value;
    const userAddress = document.getElementById('address').value;

    update(databaseRef(db, `Users/${userId}`), {
      firstName: fname,
      middleInitial: Mname,
      lastName: lname,
      username: uname,
      phoneNumber: mobileNum,
      address: userAddress
    }).then(() => {
      alert('Update Info Successfully')
    }).catch((error) => {
      alert('Error: ' + error.message);
    })

  })




  //Display User Account
  function DisplayUserInfo(userId) {

    const userRef = databaseRef(db, `Volunteer-account/${userId}`);
    get(userRef).then((snapshot) => {
      const userData = snapshot.val();

    }).catch((error) => {

      /**signOut(auth).then(()=>{
          window.location.href = 'volunteer-login.html'
          alert('User cannot be find you are force to log out')
      }).error((error)=>{
          alert(error.message)
      }); */
      alert(error.message)
    })
  }


})





/*
  //Fetch the Pets
  onValue(dbRef,(snapshot)=>{
    const PetData = [];

    snapshot.forEach((childSnapshot) => {
        PetData.push(childSnapshot);
  })
  displayPets(PetData);


});



//Display Pets
function displayPets(PetData){
    const gridPets = document.getElementById('adoptPet-container');
    gridPets.innerHTML='';

    PetData.map((childSnapshot)=>{
        const pet = childSnapshot.val();
        const petId = childSnapshot.key;

        if(pet.Status === "Available"){
            const gridItem = document.createElement('div');
            gridItem.className = 'adopt-card'
            gridItem.innerHTML = `

                <img class="adopt-card-image" src=${pet.AfterUrl} />
                <p class="adopt-card-header"> ${pet.PetName} </p>
                <button class="adoptMe-btn viewPet-btn" pet-name=${pet.PetName} pet-key="${petId}">About Me</button>
            `;
            gridPets.appendChild(gridItem);
        }
    });

// view pet == about me button
/*
const viewPetbuttons = document.querySelectorAll('.viewPet-btn');
viewPetbuttons.forEach(button =>{
  button.addEventListener('click',(event)=>{
    document.getElementById('viewPet-container').style.display = 'block';
    document.getElementById('adoptPet-container').style.display = 'none';

    const petId = event.target.getAttribute('pet-key');
    PetInfo(petId);


  })

}) */


//   const VoluProgram = databaseRef(db, `Volunteer-Account/${userId}/Program`);

// onValue(VoluProgram, (snapshot) => {
//   const data = [];

//   snapshot.forEach((childSnapshot) => {
//     data.push(childSnapshot.val()); // Store the actual values
//   });

//   DisplayProgramApplied(data);
// });

// function DisplayProgramApplied(data) {
//   const ProgramTable = document.getElementById('ProgramTable');
//   ProgramTable.innerHTML = ''; // Clear the table before adding new rows

//   data.forEach((program) => {
//     const newRow = document.createElement('tr');
//     newRow.innerHTML = `
//       <td>${program.title}</td>
//       <td>${program.Posted}</td>
//       <td>${program.Date}</td>
//     `;
//     ProgramTable.appendChild(newRow);
//   });
// }






// async function PetInfo(petId){

//   const PetRef = databaseRef(db,(`Pets/${petId}`));

//   get(PetRef).then((snapshot)=>{
//     const pet = snapshot.val();
//     const petkey = snapshot.key;

//     const petName = pet.PetName;
//     const petAge = pet.Age;
//     const petGender = pet.Gender;
//     const petCategory = pet.Category;
//     const petKapon = pet.Kapon;
//     const petVacc = pet.Vaccine;
//     const petColor = pet.Color;
//     const petAfter = pet.AfterUrl;
//     const petBefore = pet.BeforeUrl;
//     const petDescr = pet.Description;

//     document.getElementById('petName').innerText = petName;
//     document.getElementById('petAge').innerText = petAge
//     document.getElementById('petGender').innerText = petGender
//     document.getElementById('petVaccine').innerText = petVacc
//     document.getElementById('petSpayNeut').innerText = petKapon
//     document.getElementById('petDesc').innerText= petDescr
//     document.getElementById('BeforeImg').src = petBefore
//     document.getElementById('AfterImg').src = petAfter

//     document.getElementById('adoptMe-btn').setAttribute('pet-key', petkey);
//     document.getElementById('adoptMe-btn').setAttribute('pet-name', petName);





//   }).catch((error)=>{
//       console.log(error);
//   });


// }


// applciation form == adopt me button


// document.getElementById('adoptMe-btn').addEventListener('click', (event)=>{

//   document.getElementById('viewPet-container').style.display = 'none';
//   document.getElementById('viewAdoptionForm-container').style.display = 'block';

//   const target = event.target;
//   const petKey = target.getAttribute('pet-key');
//   const petName = target.getAttribute('pet-name');

//   AdoptPet(petKey,petName);

//  });







// async function AdoptPet(petKey, petName) {
//   const DateRef = databaseRef(db, 'Date-Slot');
//   const TimeRef = databaseRef(db, 'Time-Slot');
//   const interviewDate = document.getElementById('interviewDate');

//   onValue(DateRef, (snapshot) => {
//     snapshot.forEach((childSnapshot) => {
//       const DateSlot = childSnapshot.val();
//       const date = new Date(DateSlot.SetDate);
//       if (!isNaN(date.getTime())) {
//         const formattedDate = date.toLocaleDateString('en-US', {
//           month: 'short',
//           day: 'numeric',
//           year: 'numeric'
//         });
//         const createOption = document.createElement('option');
//         createOption.value = formattedDate;
//         createOption.innerHTML = formattedDate;
//         interviewDate.appendChild(createOption);
//       }
//     });
//   });


//   const interviewTime = document.getElementById('interviewTime');

//   onValue(TimeRef, (snapshot) => {
//     snapshot.forEach((childSnapshot) => {

//       const TimeSlot = childSnapshot.val();
//       const time = new Date(`1970-01-01T${TimeSlot.SetTime}`);
//       if (!isNaN(time.getTime())) {
//         const formattedTime = time.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
//         const createOption = document.createElement('option');
//         createOption.value = formattedTime;
//         createOption.innerHTML = formattedTime;
//         interviewTime.appendChild(createOption);
//       }
//     });
//   });







//  const Adopt = document.getElementById('submitAdopt-btn')

//   Adopt.addEventListener('click',(event)=>{

//     event.preventDefault;

//     const livingSituation = document.getElementById('livingSituation');

//     const livingSituationValue = livingSituation.options[livingSituation.selectedIndex].value;

//     const MembersAllergic = document.getElementById('membersAllergic');

//     const membersAllergicValue = MembersAllergic.options[MembersAllergic.selectedIndex].value;

//     const interviewTimeValue = interviewTime.options[interviewTime.selectedIndex].value;
//     const interviewDateValue = interviewDate.options[interviewDate.selectedIndex].value;

//     const numMembers = document.getElementById('numMembers').value;
//     const numChild = document.getElementById('numChild').value;
//     const AddInfo1 = document.getElementById('AddInfo1').value;
//     const AddInfo2 = document.getElementById('AddInfo2').value;
//     const AddInfo3 = document.getElementById('AddInfo3').value;

//     const uniqueId = Date.now().toString();

//     set(databaseRef(db,`Adaption_Applicants/${uniqueId}`),{


//       Situation:livingSituationValue,
//       Allergies:membersAllergicValue,
//       Available_Time:interviewTimeValue,
//       Available_Date:interviewDateValue,
//       FamilyMembers:numMembers,
//       ChildUnder12:numChild,
//       Why_Do_Want_A_Pet:AddInfo1,
//       Have_You_Pets_Before:AddInfo2,
//       When_you_move_out:AddInfo3,
//       PetName:petName,
//       PetId:petKey,
//       UserId:userId,
//       Status:"Under Review"

//     }).then(()=>{


//         update(databaseRef(db,`Pets/${petKey}`),{
//           Status:"Adopting"
//         }).then(()=>{
//           alert(`Adoption Complete`);

//         }).catch((error)=>{
//           console.error(error);
//         })

//     }).catch((error)=>{
//       console.error(error);
//     })

//   })

// }






// asynchronize functions for UploadDonation Features
// async function UploadDonation(){


//   const file = document.getElementById('proofPhoto-upload');
//   const photoDonation = file.files[0];

//   if(!photoDonation){
//     alert('Please Select a photo');
//   }

//   try{

//     const PhotoStorage = storeRef(storage,'Photos/Donations/' + photoDonation.name);
//     const uploadTask = await uploadBytes(PhotoStorage,photoDonation);
//     const photoUrl = await getDownloadURL(uploadTask.ref);



//     const Date = `${Year}-${month}-${day}`;


//     const CreateId = Math.random().toString(36).substring(2,7);

//   const amount = document.getElementById('amount').value;
//   const mod = document.getElementById('mod').innerText;

//   const remarks = document.getElementById('remarks').value;


//     const donation = {

//         Amount:amount,
//         DonateDate:Date,
//         Donation:photoUrl,
//         Mode:mod,
//         Remarks:remarks,
//         UserId:userId

//     };


//     const donationRef = databaseRef(db,`Donation/${CreateId}`);

//     await set(donationRef,donation).then(()=>{
//       alert('Donation Uploaded Successfully');
//     }).catch((error) =>{
//       alert(error.message);
//     })

//   }catch(error){
//     alert(error.message);
//   }
// }

// const SaveDonation = document.getElementById('submit');
// SaveDonation.addEventListener('click', UploadDonation);

//Display Your Donations

// const DonationUserRef = databaseRef(db, 'Donation')
// onValue(DonationUserRef,(snapshot)=>{
//   const DonationData = [];
//   snapshot.forEach((childSnapshot)=>{
//     DonationData.push(childSnapshot);
//   });

//   DonationHistory(DonationData);

// })
// function DonationHistory(DonationData){

//   const DonationHistoryBody = document.getElementById('DonationHistoryBody');
//   DonationHistoryBody.innerHTML = '';

//   DonationData.map((childSnapshot)=>{
//     const DonationData = childSnapshot.val();
//     if(DonationData.UserId === userId){
//       const newRow = document.createElement('tr')
//       newRow.innerHTML = `
//         <td>${DonationData.DonateDate} </td>
//         <td>${DonationData.Amount} </td>
//         <td>${DonationData.Mode} </td>
//       `
//       DonationHistoryBody.appendChild(newRow);
//     }
//   })
// }



//Fetch the Adaption Status
// onValue(AdaptionRef,(snapshot)=>{
//    const AdaptionStatus = [];

//    snapshot.forEach((childSnapshot)=>{
//     const AdaptionStatus = childSnapshot.val()
//     if(AdaptionStatus.UserId === userId){
//     AdaptionStatus.push(childSnapshot);
//   }
//    })
//    FetchAdaption(AdaptionStatus);
// })

//Display Fetch
// function FetchAdaption(AdaptionStatus) {
//   const StatusTableContent = document.getElementById('StatusTableContent');
//   StatusTableContent.innerHTML = '';

//   AdaptionStatus.forEach((childSnapshot) => {
//     const AdaptionStat = childSnapshot.val();
//     const AdaptionKey = childSnapshot.key;

//     const newRow = document.createElement('tr');
//     newRow.innerHTML = `
//       <td>${AdaptionStat.PetName}</td>
//       <td>${AdaptionKey}</td>
//       <td>${AdaptionStat.Status}</td>
//     `;

//     newRow.addEventListener('click', () => showAdoptionDetails(AdaptionStat, AdaptionKey));
//     StatusTableContent.appendChild(newRow);
//   });
// }

// function showAdoptionDetails(AdaptionStat, AdaptionKey) {
//   const modal = document.createElement('div');
//   modal.className = 'modal';
//   modal.innerHTML = `
//     <div class="modal-content">
//       <span class="close">&times;</span>
//       <h2>Application Details</h2>
//       <p><strong>Pet Name:</strong> ${AdaptionStat.PetName}</p>
//       <p><strong>Application ID:</strong> ${AdaptionKey}</p>
//       <p><strong>Status:</strong> ${AdaptionStat.Status}</p>
//       <br>
//       <p><strong>Schedule for Interview</strong> </p>
//       <p><strong>Date:</strong> </p>
//       <p><strong>Time:</strong> </p>
//       <p><strong>Gmeet Link:</strong> </p>

//     </div>
//   `;

//   document.body.appendChild(modal);

//   const closeBtn = modal.querySelector('.close');
//   closeBtn.onclick = () => {
//     document.body.removeChild(modal);
//   };

//   window.onclick = (event) => {
//     if (event.target == modal) {
//       document.body.removeChild(modal);
//     }
//   };
// }
