import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, set, ref as databaseRef, get, onValue, push, update, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js"
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";





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

const adaptionApplicantsRef = databaseRef(db, 'Adoption_Applicants');



// FETCH APPLICATIONS
onValue(adaptionApplicantsRef, (childSnapshot) => {

  const ApplicationData = [];
  childSnapshot.forEach((childSnapshot) => {
    ApplicationData.push(childSnapshot)
  })
  Applicants(ApplicationData);
})


// UNDER REVIEW TAB
const underReview = document.getElementById('underReview-tab');
underReview.addEventListener('click', () => {

  const searchHide = document.querySelector('.search-and-actions');
  searchHide.style.display = 'none';

  onValue(adaptionApplicantsRef, (childSnapshot) => {
    const ApplicationData = [];
    childSnapshot.forEach((childSnapshot) => {
      const DataApplication = childSnapshot.val();
      if (DataApplication.Status === 'Under Review') {
        ApplicationData.push(childSnapshot)
      }
    })
    if (ApplicationData.length === 0) {
      displayNoResults();
    } else {
      Applicants(ApplicationData);
    }
  })
})

// APPROVAL DECISION TAB
const Decision = document.getElementById('approvalDecision-tab');
Decision.addEventListener('click', () => {

  const searchHide = document.querySelector('.search-and-actions');
  searchHide.style.display = 'none';

  onValue(adaptionApplicantsRef, (childSnapshot) => {
    const ApplicationData = [];
    childSnapshot.forEach((childSnapshot) => {
      const DataApplication = childSnapshot.val();
      if (DataApplication.Status === 'Accepted' || DataApplication.Status === 'Rejected') {
        ApplicationData.push(childSnapshot)
      }
    })
    if (ApplicationData.length === 0) {
      displayNoResults();
    } else {
      Applicants(ApplicationData);
    }
  })
})

// DONE INTERVIEW TAB
const DoneInterview = document.getElementById('doneInterview-tab');
DoneInterview.addEventListener('click', () => {
  const searchHide = document.querySelector('.search-and-actions');
  searchHide.style.display = 'none';

  onValue(adaptionApplicantsRef, (childSnapshot) => {
    const ApplicationData = [];
    childSnapshot.forEach((childSnapshot) => {
      const DataApplication = childSnapshot.val();
      if (DataApplication.Status === 'Done Interview' || DataApplication.Status === 'Rejected') {
        ApplicationData.push(childSnapshot)
      }
    })
    if (ApplicationData.length === 0) {
      displayNoResults();
    } else {
      Applicants(ApplicationData);
    }
  })
})



// ALL TABS
const alltab = document.getElementById('all-tab');
alltab.addEventListener('click', () => {
  const searchHide = document.querySelector('.search-and-actions');
  searchHide.style.display = 'flex';


  onValue(adaptionApplicantsRef, (childSnapshot) => {
    const ApplicationData = [];
    childSnapshot.forEach((childSnapshot) => {
      ApplicationData.push(childSnapshot)
    })
    if (ApplicationData.length === 0) {
      displayNoResults();
    } else {
      Applicants(ApplicationData);
    }
  })

})

// INTERVIEW SCHEDULED TAB
const Interview = document.getElementById('interviewScheduled-tab');
Interview.addEventListener('click', () => {
  const searchHide = document.querySelector('.search-and-actions');
  searchHide.style.display = 'none';


  onValue(adaptionApplicantsRef, (childSnapshot) => {
    const ApplicationData = [];
    childSnapshot.forEach((childSnapshot) => {
      const DataApplication = childSnapshot.val()
      if (DataApplication.Status === 'For Interview') {
        ApplicationData.push(childSnapshot)
      }

    })
    if (ApplicationData.length === 0) {
      displayNoResults();
    } else {
      Applicants(ApplicationData);
    }
  })
})

function displayNoResults() {
  const ApplicationTableBody = document.getElementById('ApplicationTableBody');
  ApplicationTableBody.innerHTML = `
    <tr>
      <td colspan="4" style="text-align: center; padding: 20px;">No Results Found</td>
    </tr>
  `;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}


// DISPLAY VIEW APPLICATIONS
async function Applicants(ApplicationData) {
  const ApplicationTableBody = document.getElementById('ApplicationTableBody');
  const Applications = document.getElementById('applicationsTable');
  ApplicationTableBody.innerHTML = '';

  await ApplicationData.forEach((childSnapshot) => {
    const ApplicationData = childSnapshot.val();
    const key = childSnapshot.key;
    const PetId = ApplicationData.PetId;
    const userId = ApplicationData.UserId;

    const PetRef = databaseRef(db, `Pets/${PetId}`);
    const userRef = databaseRef(db, `Users/${userId}`);

    get(PetRef).then((childSnapshot) => {
      const PetData = childSnapshot.val();

      const innerRow = document.createElement('tr');
      innerRow.className = 'Applicants';

      // Conditionally change the color of 'Under Review' status
      let statusColor = '';
      if (ApplicationData.Status === 'Under Review') {
        statusColor = 'orange';
      }
      if (ApplicationData.Status === 'For Interview') {
        statusColor = 'blue';
      }
      if (ApplicationData.Status === 'Done Interview') {
        statusColor = 'pink';
      }
      if (ApplicationData.Status === 'Accepted') {
        statusColor = 'green';
      }
      if (ApplicationData.Status === 'Rejected') {
        statusColor = 'red';
      }

      innerRow.innerHTML = `
        <td>${key}</td>
        <td>${PetData?.PetName || "N/A"}</td>
        <td style="color: ${statusColor}; font-weight: 600;">${ApplicationData.Status}</td>
        <td>${ApplicationData?.Application_Date ? formatDate(ApplicationData.Application_Date) : 'N/A'}</td>
      `;

      innerRow.addEventListener('click', () => {
        Applications.style.display = 'none';
        viewForm.style.display = 'block';

        get(userRef).then((childSnapshot) => {
          const userData = childSnapshot.val();

          document.getElementById('adoptPetName').value = `${PetData?.PetName}`;
          document.getElementById('name').value = `${userData.username}`;
          document.getElementById('email').value = `${userData.email}`;
          document.getElementById('phone').value = `${userData?.Phone || "N/A"}`;
          document.getElementById('address').value = `${userData?.address || "N/A"}`;

          document.getElementById('why-adopt').value = `${ApplicationData.Why_Do_Want_A_Pet}`;
          document.getElementById('previous-pets').value = `${ApplicationData.Have_You_Pets_Before}`;
          document.getElementById('pets-move').value = `${ApplicationData.When_you_move_out}`;

          document.getElementById('zoom-date').value = `${ApplicationData.Available_Date}`;
          document.getElementById('zoom-time').value = `${ApplicationData.Available_Time}`;

          document.getElementById('InterviewProceed').setAttribute('applicant-id', key);
          document.getElementById('InterviewProceed').setAttribute('Petkey', ApplicationData.PetId);
        });
      });

      ApplicationTableBody.appendChild(innerRow);
    });
  });
}



const sendmeet = document.getElementById('SendMeet');
sendmeet.addEventListener('click', () => {
  const applicantId = document.getElementById('InterviewProceed').getAttribute('applicant-id');

  const meetLink = document.getElementById('meet-link').value;

  update(databaseRef(db, `Adoption_Applicants/${applicantId}`), {
    MeetLink: meetLink,
    Status: 'For Interview',
  }).then(() => {
    alert('Scheduled for Interview!')
    location.reload(true)
  }).catch((error) => {
    alert(error.message);
  })







})

const InterviewDone = document.getElementById('InterviewDone');
InterviewDone.addEventListener('click', () => {

  const applicantId = document.getElementById('InterviewProceed').getAttribute('applicant-id');


  update(databaseRef(db, `Adoption_Applicants/${applicantId}`), {
    Status: 'Done Interview',
  }).then(() => {
    alert('Done Interview')
    location.reload(true)
  }).catch((error) => {
    alert(error.message);
  })

})


const InterviewDecision = document.getElementById('InterviewDecision');
InterviewDecision.addEventListener('click', () => {

  const applicantId = document.getElementById('InterviewProceed').getAttribute('applicant-id');
  const Petkey = document.getElementById('InterviewProceed').getAttribute('Petkey')

  update(databaseRef(db, `Adoption_Applicants/${applicantId}`), {
    Status: 'Accepted',
  }).then(() => {
    alert('Accepted')

    update(databaseRef(db, `Pets/${Petkey}`), {
      Status: 'Adopted'
    }).then(() => {
      console.log("This Pet is Adopted");
      location.reload(true)
    }).catch((error) => {
      console.log(error.message);
    })

  }).catch((error) => {
    alert(error.message);
  })

})


const InterviewDecision1 = document.getElementById('InterviewDecision1');
InterviewDecision1.addEventListener('click', () => {

  const applicantId = document.getElementById('InterviewProceed').getAttribute('applicant-id');
  const Petkey = document.getElementById('InterviewProceed').getAttribute('Petkey')

  update(databaseRef(db, `Adoption_Applicants/${applicantId}`), {
    Status: 'Rejected',
  }).then(() => {
    alert('Rejected')
    update(databaseRef(db, `Pets/${Petkey}`), {
      Status: 'Available'
      // Status: 'Available for Adoption'
    })
    location.reload(true)

  }).catch((error) => {
    alert(error.message);
  })

})






// const proceedButton = document.getElementById('TimeSlotBtn');
// proceedButton.addEventListener('click', ()=>{
//   proceed();
// });

// async function proceed() {
//   const uniqueId = Date.now().toString();

//   const setDate = document.getElementById('date-interview').value;
//   const setTime = document.getElementById('time-interview').value;

//   try {
//     await set(databaseRef(db, `Time-Slot/${uniqueId}`), {
//       SetTime: setTime
//     });
//     console.log('Successfully added time.');

//     await set(databaseRef(db, `Date-Slot/${uniqueId}`), {
//       SetDate: setDate
//     });
//     console.log('Successfully added date.');

//   } catch (error) {
//     console.error('Error adding to database:', error);
//   }
// }

const proceedButton = document.getElementById('TimeSlotBtn');
proceedButton.addEventListener('click', () => {
  proceed();
});

async function proceed() {
  const uniqueId = Date.now().toString(); // This generates a unique ID based on the current timestamp.

  const setDate = document.getElementById('date-interview').value; // Get the selected date.
  const setTime = document.getElementById('time-interview').value; // Get the selected time.

  try {
    // Save both date and time in the same record
    await set(databaseRef(db, `Interview-Slot/${uniqueId}`), {
      SetDate: setDate,  // Store the selected date
      SetTime: setTime   // Store the selected time
    });

    console.log('Successfully added date and time.');
    alert('Successfully added date and time!');

    document.getElementById('date-interview').value = '';
    document.getElementById('time-interview').value = '';

  } catch (error) {
    console.error('Error adding to database:', error);
  }
}



const Search = document.getElementById('searchInput');
Search.addEventListener('keydown', (event) => {
  event.preventDefault();

  const SearchValue = Search.value;
  if (event.key === 'Enter') {

    onValue(adaptionApplicantsRef, (childSnapshot) => {
      const ApplicationData = [];
      childSnapshot.forEach((childSnapshot) => {
        const DataApplication = childSnapshot.val()
        if (DataApplication.PetName === SearchValue) {
          ApplicationData.push(childSnapshot)
        } else {

        }
      })
      Applicants(ApplicationData);
    })

  }
})