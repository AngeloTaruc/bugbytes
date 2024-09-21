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
const AdoptionRef = databaseRef(db, "Adoption_Applicants");



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

    const userRef = databaseRef(db, `Users/${userId}`);
    get(userRef).then((snapshot) => {
      username.innerHTML = "Hello " + snapshot.val().username;
    })

  } else {

  }
})

// LOGOUT
const logout = document.getElementById('logout-button');
logout.addEventListener('click', () => {
  signOut(auth).then(() => {
    alert('Logged out succesfully');
    window.location.href = 'login.html';
    update(databaseRef(db, `Users/${userId}`), {
      status: "Log out"
    }).then(() => {
      console.log('User logged out');
    }).catch(() => {
      console.error('Error logging out user');
    })

  }).catch((error) => {
    alert(error.message);
  });
});






//Fetch the Pets
onValue(dbRef, (snapshot) => {
  const PetData = [];

  snapshot.forEach((childSnapshot) => {
    PetData.push(childSnapshot);
  })
  displayPets(PetData);


});



//Display Pets
function displayPets(PetData) {
  const gridPets = document.getElementById('adoptPet-container');
  gridPets.innerHTML = '';

  PetData.map((childSnapshot) => {
    const pet = childSnapshot.val();
    const petId = childSnapshot.key;

    if (pet.Status === "Available") {
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

  const viewPetbuttons = document.querySelectorAll('.viewPet-btn');
  viewPetbuttons.forEach(button => {
    button.addEventListener('click', (event) => {
      document.getElementById('viewPet-container').style.display = 'block';
      document.getElementById('adoptPet-container').style.display = 'none';

      const petId = event.target.getAttribute('pet-key');
      PetInfo(petId);


    })

  })

  async function PetInfo(petId) {

    const PetRef = databaseRef(db, (`Pets/${petId}`));

    get(PetRef).then((snapshot) => {
      const pet = snapshot.val();
      const petkey = snapshot.key;

      const petName = pet.PetName;
      const petAge = pet.Age;
      const petGender = pet.Gender;
      const petCategory = pet.Category;
      const petKapon = pet.Kapon;
      const petVacc = pet.Vaccine;
      const petColor = pet.Color;
      const petAfter = pet.AfterUrl;
      const petBefore = pet.BeforeUrl;
      const petDescr = pet.Description;

      document.getElementById('petName').innerText = petName;
      document.getElementById('petAge').innerText = petAge
      document.getElementById('petGender').innerText = petGender
      document.getElementById('petVaccine').innerText = petVacc
      document.getElementById('petSpayNeut').innerText = petKapon
      document.getElementById('petDesc').innerText = petDescr
      document.getElementById('BeforeImg').src = petBefore
      document.getElementById('AfterImg').src = petAfter

      document.getElementById('adoptMe-btn').setAttribute('pet-key', petkey);
      document.getElementById('adoptMe-btn').setAttribute('pet-name', petName);





    }).catch((error) => {
      console.log(error);
    });


  }


  // applciation form == adopt me button


  document.getElementById('adoptMe-btn').addEventListener('click', (event) => {

    document.getElementById('viewPet-container').style.display = 'none';
    document.getElementById('viewAdoptionForm-container').style.display = 'block';

    const target = event.target;
    const petKey = target.getAttribute('pet-key');
    const petName = target.getAttribute('pet-name');

    AdoptPet(petKey, petName);

  });

}





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

//   const Adopt = document.getElementById('submitAdopt-btn')

//   Adopt.addEventListener('click', (event) => {

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

//     set(databaseRef(db, `Adaption_Applicants/${uniqueId}`), {


//       Situation: livingSituationValue,
//       Allergies: membersAllergicValue,
//       Available_Time: interviewTimeValue,
//       Available_Date: interviewDateValue,
//       FamilyMembers: numMembers,
//       ChildUnder12: numChild,
//       Why_Do_Want_A_Pet: AddInfo1,
//       Have_You_Pets_Before: AddInfo2,
//       When_you_move_out: AddInfo3,
//       PetName: petName,
//       PetId: petKey,
//       UserId: userId,
//       Status: "Under Review"

//     }).then(() => {


//       update(databaseRef(db, `Pets/${petKey}`), {
//         Status: "Adopting"
//       }).then(() => {
//         alert(`Adoption Complete`);

//       }).catch((error) => {
//         console.error(error);
//       })

//     }).catch((error) => {
//       console.error(error);
//     })

//   })

// }


// Helper function to format date as yyyy/MM/dd
function formatDateToYYYYMMDD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

// Helper function to format date as Sep 13, 2024
function formatDateForDisplay(date) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Helper function to format time as hh:mm
function formatTimeForStorage(timeString) {
  const time = new Date(`1970-01-01T${timeString}`);
  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Helper function to format time as 4:20 PM
function formatTimeForDisplay(timeString) {
  const time = new Date(`1970-01-01T${timeString}`);
  const hours = time.getHours();
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; // Convert 24-hour to 12-hour format
  return `${formattedHours}:${minutes} ${period}`;
}

// ADOPTION APPLICATIONS 
async function AdoptPet(petKey, petName) {
  // Merge Date and Time into one 'Interview-Slot' reference
  const interviewSlotRef = databaseRef(db, 'Interview-Slot');
  const interviewDate = document.getElementById('interviewDate');
  const interviewTime = document.getElementById('interviewTime');

  // Clear previous options
  interviewDate.innerHTML = '';
  interviewTime.innerHTML = '';

  const dateOptions = new Set();
  const timeOptionsByDate = {};
  const dateFormatMap = {};

  // Query 'Interview-Slot' to get both date and time
  onValue(interviewSlotRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const interviewSlot = childSnapshot.val();
      const date = new Date(interviewSlot.SetDate);

      // Check if the date is valid
      if (!isNaN(date.getTime())) {
        const formattedDate = formatDateToYYYYMMDD(date);
        const displayDate = formatDateForDisplay(date);

        // Add date to dateOptions set to avoid duplicates
        dateOptions.add(displayDate);
        dateFormatMap[displayDate] = formattedDate;

        // Prepare time options for each date
        const timeString = interviewSlot.SetTime;
        const storageTime = formatTimeForStorage(timeString);
        const displayTime = formatTimeForDisplay(timeString);

        if (!timeOptionsByDate[formattedDate]) {
          timeOptionsByDate[formattedDate] = [];
        }
        timeOptionsByDate[formattedDate].push({ storageTime, displayTime });
      }
    });

    // Populate the interviewDate dropdown with available dates
    interviewDate.innerHTML = ''; // Clear previous options
    dateOptions.forEach((displayDate) => {
      const createOption = document.createElement('option');
      createOption.value = displayDate;
      createOption.innerHTML = displayDate;
      interviewDate.appendChild(createOption);
    });
  });

  // Add event listener to the interviewDate dropdown to populate time options when a date is selected
  interviewDate.addEventListener('change', (event) => {
    const selectedDisplayDate = event.target.value;
    interviewTime.innerHTML = ''; // Clear previous time options

    const selectedDate = dateFormatMap[selectedDisplayDate];

    // Populate the interviewTime dropdown with times corresponding to the selected date
    if (timeOptionsByDate[selectedDate]) {
      timeOptionsByDate[selectedDate].forEach(({ storageTime, displayTime }) => {
        const createOption = document.createElement('option');
        createOption.value = storageTime;
        createOption.innerHTML = displayTime;
        interviewTime.appendChild(createOption);
      });
    }
  });

  const Adopt = document.getElementById('submitAdopt-btn');

  // Remove any existing event listener to prevent multiple alerts
  Adopt.removeEventListener('click', handleAdopt);

  function handleAdopt(event) {
    event.preventDefault();

    const livingSituation = document.getElementById('livingSituation');
    const livingSituationValue = livingSituation.options[livingSituation.selectedIndex].value;

    const MembersAllergic = document.getElementById('membersAllergic');
    const membersAllergicValue = MembersAllergic.options[MembersAllergic.selectedIndex].value;

    const interviewTime = document.getElementById('interviewTime');
    const interviewDate = document.getElementById('interviewDate');
    const interviewTimeValue = interviewTime.options[interviewTime.selectedIndex]?.value || '';
    const interviewDateDisplayValue = interviewDate.options[interviewDate.selectedIndex]?.value || '';
    const interviewDateValue = dateFormatMap[interviewDateDisplayValue] || '';

    const numMembers = document.getElementById('numMembers').value;
    const numChild = document.getElementById('numChild').value;
    const AddInfo1 = document.getElementById('AddInfo1').value;
    const AddInfo2 = document.getElementById('AddInfo2').value;
    const AddInfo3 = document.getElementById('AddInfo3').value;

    const uniqueId = Date.now().toString();

    // Get the current date as the application date
    const applicationDate = formatDateToYYYYMMDD(new Date());

    // Store applicant data in 'Adoption_Applicants'
    set(databaseRef(db, `Adoption_Applicants/${uniqueId}`), {
      Situation: livingSituationValue,
      Allergies: membersAllergicValue,
      Available_Time: interviewTimeValue,
      Available_Date: interviewDateValue,
      FamilyMembers: numMembers,
      ChildUnder12: numChild,
      Why_Do_Want_A_Pet: AddInfo1,
      Have_You_Pets_Before: AddInfo2,
      When_you_move_out: AddInfo3,
      PetName: petName,
      PetId: petKey,
      UserId: userId,
      Status: "Under Review",
      Application_Date: applicationDate  // Add the application date here
    }).then(() => {
      // Update the pet status to 'In-Progress'
      update(databaseRef(db, `Pets/${petKey}`), {
        Status: "In-Progress"
      }).then(() => {
        alert(`Adoption Form Submitted!`);
      }).catch((error) => {
        console.error(error);
      });
    }).catch((error) => {
      console.error(error);
    });
  }

  // Add the event listener to handle adoption submission
  Adopt.addEventListener('click', handleAdopt);
}





// asynchronize functions for UploadDonation Features
async function UploadDonation() {
  const file = document.getElementById('proofPhoto-upload');
  const photoDonation = file.files[0];

  if (!photoDonation) {
    alert('Please select a photo');
    return; // Exit if no photo is selected
  }

  try {
    const PhotoStorage = storeRef(storage, 'Photos/Donations/' + photoDonation.name);
    const uploadTask = await uploadBytes(PhotoStorage, photoDonation);
    const photoUrl = await getDownloadURL(uploadTask.ref);
    const Date = `${Year}-${month}-${day}`; // Ensure Year, month, and day are properly defined in your code

    const CreateId = Math.random().toString(36).substring(2, 7);

    const amount = document.getElementById('amount').value;
    const mod = document.getElementById('mod').value; // Corrected: Use .value to get the selected option
    const remarks = document.getElementById('remarks').value;

    // Capture the username of the user (make sure you have the username stored or available in your frontend code)
    const username = document.getElementById('username').value; // Get username from an input field or other source

    // Build the donation object with all the necessary fields, including Username and DateTime
    const donation = {
      Amount: amount,
      DonateDate: Date,
      Donation: photoUrl,
      Mode: mod, // This will now correctly save the selected mode (either "Cash" or "In-Kind")
      Remarks: remarks,
      UserId: userId, // Ensure userId is properly defined in your code
      Username: username
    };

    const donationRef = databaseRef(db, `Donation/${CreateId}`);

    await set(donationRef, donation)
      .then(() => {
        alert('Donation Sent Successfully!');
      })
      .catch((error) => {
        alert(error.message);
      });

  } catch (error) {
    alert(error.message);
  }
}

const SaveDonation = document.getElementById('submit');
SaveDonation.addEventListener('click', UploadDonation);



//Fetch Programs
onValue(programRef, (snapshot) => {
  const programData = []
  snapshot.forEach((childSnapshot) => {
    programData.push(childSnapshot);
  })
  DisplayProgram(programData);
})


//Fetch Announcements
onValue(announcementRef, (snapshot) => {
  const announcementData = []
  snapshot.forEach((childSnapshot) => {
    announcementData.push(childSnapshot);
  })
  DisplayAnnouncement(announcementData);
});

//Function to display programs;
function DisplayProgram(programData) {
  const CardContainer = document.getElementById('prog-contents');
  CardContainer.innerHTML = '';

  programData.map((childSnapshot) => {
    const program = childSnapshot.val();
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

    });
    CardContainer.appendChild(notification);
  })

}


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

//Display Your Donations

const DonationUserRef = databaseRef(db, 'Donation');

onValue(DonationUserRef, (snapshot) => {
  const DonationData = [];
  snapshot.forEach((childSnapshot) => {
    DonationData.push(childSnapshot);
  });

  DonationHistory(DonationData);
});

function DonationHistory(DonationData) {
  const DonationHistoryBody = document.getElementById('DonationHistoryBody');
  DonationHistoryBody.innerHTML = ''; // Clear previous rows

  DonationData.map((childSnapshot) => {
    const DonationData = childSnapshot.val();

    if (DonationData.UserId === userId) {
      // Format the date
      const donationDate = new Date(DonationData.DonateDate);
      const formattedDate = donationDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      // Create new row with formatted date
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td>${formattedDate} </td>
        <td>${DonationData.Amount} </td>
        <td>${DonationData.Mode} </td>
      `;

      DonationHistoryBody.appendChild(newRow);
    }
  });
}


//Display User Account
function DisplayUserInfo(userId) {

  const userRef = databaseRef(db, `Users/${userId}`);
  get(userRef).then((snapshot) => {
    const userData = snapshot.val();

    const userFirstName = userData.firstName;
    const midname = userData.middleInitial;
    const lastname = userData.lastName;
    const username = userData.username;
    const phoneNumber = userData.phoneNumber;
    const userAddress = userData.address;
    const userImage = userData.UserProfile

    document.getElementById('firstname').value = userFirstName;
    document.getElementById('middleInitial').value = midname;
    document.getElementById('lastname').value = lastname;
    document.getElementById('username').value = username;
    document.getElementById('mobileNumber').value = phoneNumber;
    document.getElementById('address').value = userAddress
    document.getElementById('profileImage').src = userImage;


  }).catch((error) => {

    signOut(auth).then(() => {
      window.location.href = 'login.html'
      alert('User cannot be find you are force to log out')
    }).error((error) => {
      alert(error.message)
    });
    alert(error.message)
  })
}





// VIEW ADOPTION APPLICATION STATUS
onValue(AdoptionRef, (snapshot) => {
  const adaptionStatus = [];

  // biome-ignore lint/complexity/noForEach: <explanation>
  snapshot.forEach((childSnapshot) => {
    const adaptData = childSnapshot.val()
    if (adaptData.UserId === userId) {
      adaptionStatus.push(childSnapshot);

    }
  })
  FetchAdaption(adaptionStatus);
})

// FETCH ADOPTION APPLICATIONS
function FetchAdaption(adaptionStatus) {
  const StatusTableContent = document.getElementById('StatusTableContent');
  StatusTableContent.innerHTML = '';


  adaptionStatus.map((childSnapshot) => {
    const AdaptionStat = childSnapshot.val();
    const AdaptionKey = childSnapshot.key;

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>${AdaptionStat.PetName}</td>
      <td>${AdaptionKey}</td>
      <td>${AdaptionStat.Status}</td>
    `;

    newRow.addEventListener('click', () => showAdoptionDetails(AdaptionStat, AdaptionKey));
    StatusTableContent.appendChild(newRow);
  });
}

function showAdoptionDetails(AdaptionStat, AdaptionKey) {
  const modal = document.createElement('div');
  modal.className = 'modal';

  // Format date and time
  const formattedDate = new Date(AdaptionStat?.Available_Date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const formattedTime = new Date(`1970-01-01T${AdaptionStat?.Available_Time}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });

  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">×</span>
      <h2>Application Details</h2>
      <p><strong>Pet Name:</strong> ${AdaptionStat.PetName}</p>
      <p><strong>Application ID:</strong> ${AdaptionKey}</p>
      <p><strong>Status:</strong> ${AdaptionStat.Status}</p>
      <br>
      <p><strong>Schedule for Interview</strong> </p>
      <p><strong>Date:</strong> ${formattedDate || 'N/A'} </p>
      <p><strong>Time:</strong> ${formattedTime || 'N/A'} </p>
      <p style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 400px;">
        <strong>Gmeet Link:</strong> <a href="${AdaptionStat?.MeetLink || 'N/A'}">${AdaptionStat?.MeetLink || 'N/A'}</a>
      </p>
    </div>
  `;

  document.body.appendChild(modal);

  const closeBtn = modal.querySelector('.close');
  closeBtn.onclick = () => {
    document.body.removeChild(modal);
  };

  window.onclick = (event) => {
    if (event.target == modal) {
      document.body.removeChild(modal);
    }
  };
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




