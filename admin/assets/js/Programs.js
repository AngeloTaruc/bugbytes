import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { ref as databaseRef, get, getDatabase, onValue, push, remove, set, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js"

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

const FutureCurrent = new Date();

const LocalDate = new Date();

const year = LocalDate.getFullYear();
const month = LocalDate.getMonth() + 1;
const day = LocalDate.getDate();

const FullDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;


function formatDate(dateStr) {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
        // If the date is invalid, return the original string
        return dateStr;
    }
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}


// ADD PROGRAMS 

async function InputPrograms() {

    const programPoster = document.getElementById('programPoster');

    const programPhoto = programPoster.files[0];

    const PStorageRef = storageRef(storage, 'Photos/Programs/' + programPhoto.name);

    const setTitle = document.getElementById('programTitle');
    const setDate = document.getElementById('programDate');
    const setMsg = document.getElementById('programMsg');

    const id = Date.now().toString();


    try {
        const UploadSnapshot = await uploadBytes(PStorageRef, programPhoto);
        const ProgramUrl = await getDownloadURL(UploadSnapshot.ref);

        const title = setTitle.value;
        const Date = setDate.value;
        const msg = setMsg.value;


        await set(databaseRef(db, `Programs/${id}`), {
            title: title,
            Date: Date,
            Msg: msg,
            Poster: ProgramUrl,
            Posted: FullDate,



        }).then(() => {
            console.log('Upload Successsfully')
            alert('Program Posted Succesfully');

            // Hide the modal
            const addModal = document.getElementById('addModal');
            addModal.style.display = 'none';

            // Reset fields
            setTitle.value = '';
            setDate.value = '';
            setMsg.value = '';
            programPoster.value = '';
        }).catch((error) => {
            alert(error.message);
        })

    } catch (error) {
        alert(`${error}`);
    }


}

const addBtn = document.getElementById('btn-add');
addBtn.addEventListener('click', InputPrograms);





// DISPLAY ALL PROGRAMS

const AllProgramsRef = databaseRef(db, 'Programs');

onValue(AllProgramsRef, (snapshot) => {
    const AllPrograms = [];
    snapshot.forEach((childSnapshot) => {
        AllPrograms.push(childSnapshot);
    })

    // Sort the programs by the program date from most recent to oldest
    AllPrograms.sort((a, b) => {
        const dateA = new Date(a.val().Date);
        const dateB = new Date(b.val().Date);
        return dateB - dateA; // Most recent first
    });
    DisplayAllPrograms(AllPrograms);
})

document.addEventListener('DOMContentLoaded', () => {
    const inputElement = document.getElementById('searchInput');

    inputElement.addEventListener('keydown', (event) => {
        if (event.keyCode === 13) {
            const inputValue = inputElement.value;

            const AllProgramsRef = databaseRef(db, 'Programs');

            onValue(AllProgramsRef, (snapshot) => {
                const AllPrograms = [];
                snapshot.forEach((childSnapshot) => {
                    const programData = childSnapshot.val();
                    if (programData.title === inputValue) {
                        AllPrograms.push(childSnapshot);

                    } else if (!inputValue) {
                        location.reload(true);
                    }

                })
                DisplayAllPrograms(AllPrograms);
                DisplayCurrentUpComingPrograms(AllPrograms);
                DisplayPastPrograms(AllPrograms);
            })

        } else {

        }
    })
})



function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}

function DisplayAllPrograms(AllPrograms) {
    const AllTableProgramBody = document.getElementById('AllTableProgramBody');
    AllTableProgramBody.innerHTML = '';

    AllPrograms.forEach((childSnapshot) => {
        const AllProgramData = childSnapshot.val();
        const programKey = childSnapshot.key;
        const truncatedMsg = truncateText(AllProgramData.Msg, 50); // Limit to 50 characters
        const formattedDatePosted = formatDate(AllProgramData.Posted);
        const formattedDateProg = formatDate(AllProgramData.Date);

        const newRow = document.createElement('tr');
        newRow.className = 'TableRow';
        newRow.setAttribute('Program-id', programKey);

        // Fetch the number of volunteers for the current program
        const VolunteerRef = databaseRef(db, `Programs/${programKey}/Volunteers`);
        get(VolunteerRef).then((snapshot) => {
            const volunteerCount = snapshot.size; // Count the number of volunteers

            newRow.innerHTML = `
                <td><img src="../admin/assets/img/paw-solid.png" alt="" height="15" width="15"></td>
                <td>${formattedDatePosted}</td> 
                <td>${AllProgramData.title}</td>
                <td>${truncatedMsg}</td>
                <td>${volunteerCount}</td> 
                <td>${formattedDateProg}</td>
            `;

            AllTableProgramBody.appendChild(newRow);
        }).catch((error) => {
            console.log(error.message);
        });
    });
}



// SEARCH PROGRAMS
document.getElementById('AllTableProgramBody').addEventListener('click', (event) => {
    const target = event.target.closest('.TableRow');
    if (target) {
        const programId = target.getAttribute('Program-id');
        ArchiveProgram(programId)
    }
})

function ArchiveProgram(programId) {
    const programInfo = document.getElementById('programInfo');
    programInfo.style.display = 'block';

    const ProgramRef = databaseRef(db, `Programs/${programId}`);

    get(ProgramRef).then((snapshot) => {
        const AllProgramData = snapshot.val();

        const title = document.getElementById('ProTitle').innerText = `${AllProgramData.title}`;
        const Date = document.getElementById('ProDate').innerText = `${AllProgramData.Date}`;
        const Msg = document.getElementById('ProContent').innerText = `${AllProgramData.Msg}`;
        const Poster = document.getElementById('ProgramPoster').src = `${AllProgramData.Poster}`;
        const Posted = document.getElementById('Posted').innerText = `${AllProgramData.Posted}`;
        const Archive = document.getElementById('Archive');
        const EditBtn = document.getElementById('edit');

        EditBtn.setAttribute('Program-id', programId);
        Archive.setAttribute('Program-id', programId);

    }).catch((error) => {
        console.log(error.message);
    })


    //Fetch Data
    const VolunteerRef = databaseRef(db, `Programs/${programId}/Volunteers`);
    onValue(VolunteerRef, (snapshot) => {
        const volunteerProgram = []

        // biome-ignore lint/complexity/noForEach: <explanation>
        snapshot.forEach((childSnapshot) => {

            volunteerProgram.push(childSnapshot);

        });
        VolunteerProgram(volunteerProgram);

    });

}


async function VolunteerProgram(volunteerProgram) {
    const volunteers = document.getElementById('volunteers');
    volunteers.innerHTML = '';

    volunteerProgram.map((childSnapshot) => {
        const Volunteer = childSnapshot.val()
        const VolunteerId = childSnapshot.key;

        const VolunteerAcc = databaseRef(db, `Volunteer-Account/${VolunteerId}`);
        get(VolunteerAcc).then((snapshot) => {
            const VolunteerData = snapshot.val();

            const createList = document.createElement('li');
            createList.innerHTML = `
            
                <li>${VolunteerData.Username} </li>
            `
            volunteers.appendChild(createList);

        }).catch((error) => {
            console.log(error.message)
        })

    })
}





const programInfo = document.getElementById('programInfo');
const ArchiveBtn = document.getElementById('Archive');

//Target for AchiveInfo
ArchiveBtn.addEventListener('click', (event) => {
    const target = event.target
    if (target.classList.contains('Archives')) {

        const programArchiveKey = target.getAttribute('Program-id');

        const programRef = databaseRef(db, (`Programs/${programArchiveKey}`));

        get(programRef).then((snapshot) => {
            const programData = snapshot.val();
            const title = programData.title;
            const Message = programData.Msg;
            const Poster = programData.Poster;
            const Posted = programData.Posted;
            const Date = programData.Date;


            set(databaseRef(db, `Archived/Programs/${programArchiveKey}`), {
                title: title,
                Msg: Message,
                Poster: Poster,
                Posted: Posted,
                Date: Date
            }).then(() => {
                console.log('Uploaded to Archive');
                alert('Program Successfully Archived!')

                const modal = document.getElementById('programInfo');
                if (modal) {
                    modal.style.display = 'none';
                }

                remove(programRef).then(() => {

                }).catch((error) => {
                    console.log(error.message);
                });
            }).catch((error) => {
                console.log(error.message);
            })
        }).catch((error) => {
            console.log(error.message);
        })
    }

})

//Target for Edit Program
const EditButton = document.getElementById('edit');
EditButton.addEventListener('click', async (event) => {
    const target = event.target;
    if (target.classList.contains('edit')) {
        const programEditId = target.getAttribute('Program-id');
        const programRef = databaseRef(db, `Programs/${programEditId}`);

        try {
            const snapshot = await get(programRef);
            const programData = snapshot.val();
            const { title, Msg: message, Poster, Date } = programData;

            document.getElementById('progName').value = title;
            document.getElementById('progDate').value = Date;
            document.getElementById('programDesc').value = message;

            const UpdateBtn = document.getElementById('UpdateBtn');
            UpdateBtn.onclick = async () => {
                const EditPosterBtn = document.getElementById('EditPoster');
                const PosterEdit = EditPosterBtn.files[0];

                const progName = document.getElementById('progName').value;
                const progDate = document.getElementById('progDate').value;
                const progMsg = document.getElementById('programDesc').value;

                try {
                    if (!PosterEdit) {
                        await update(programRef, {
                            title: progName,
                            Date: progDate,
                            Msg: progMsg
                        });
                    } else {
                        const newPhotoRef = storageRef(storage, 'Photos/Programs/' + PosterEdit.name);
                        const uploadSnapshot = await uploadBytes(newPhotoRef, PosterEdit);
                        const programUrl = await getDownloadURL(uploadSnapshot.ref);

                        await update(programRef, {
                            title: progName,
                            Date: progDate,
                            Msg: progMsg,
                            Poster: programUrl
                        });
                    }
                    alert('Announcement Updated Successfully');
                } catch (error) {
                    alert(`Error updating program: ${error.message}`);
                }
            };
        } catch (error) {
            console.error(`Error retrieving program: ${error.message}`);
        }
    }
});





// Fetch and display Current & Upcoming Programs with volunteer count
onValue(AllProgramsRef, (snapshot) => {
    const AllPrograms = [];
    snapshot.forEach((childSnapshot) => {
        const AllProgramData = childSnapshot.val();
        const dbDate = new Date(AllProgramData.Date);
        if (dbDate >= FutureCurrent) {
            AllPrograms.push(childSnapshot);
        }
    });

    // Sort the programs by the program date from most recent to oldest
    AllPrograms.sort((a, b) => {
        const dateA = new Date(a.val().Date);
        const dateB = new Date(b.val().Date);
        return dateB - dateA;
    });

    DisplayCurrentUpComingPrograms(AllPrograms);
});

// Display Current & Upcoming Programs with volunteer count
function DisplayCurrentUpComingPrograms(AllPrograms) {
    const CurrentUpComingPrograms = document.getElementById('CurrentUpComingPrograms');
    CurrentUpComingPrograms.innerHTML = '';

    AllPrograms.forEach((childSnapshot) => {
        const AllProgramData = childSnapshot.val();
        const programKey = childSnapshot.key;
        const truncatedMsg = truncateText(AllProgramData.Msg, 50); // Limit to 50 characters
        const formattedDatePosted = formatDate(AllProgramData.Posted);
        const formattedDateProg = formatDate(AllProgramData.Date);

        // Fetch the number of volunteers for the current program
        const VolunteerRef = databaseRef(db, `Programs/${programKey}/Volunteers`);
        get(VolunteerRef).then((snapshot) => {
            const volunteerCount = snapshot.size; // Count the number of volunteers

            const newRow = document.createElement('tr');
            newRow.className = 'TableRow';
            newRow.innerHTML = `
                <td><img src="../admin/assets/img/paw-solid.png" alt="" height="15" width="15"></td>
                <td>${formattedDatePosted}</td>
                <td>${AllProgramData.title}</td>
                <td>${truncatedMsg}</td>
                <td>${volunteerCount}</td> <!-- Display volunteer count -->
                <td>${formattedDateProg}</td>
            `;

            CurrentUpComingPrograms.appendChild(newRow);
        }).catch((error) => {
            console.log(error.message);
        });
    });
}

// Fetch and display Past Programs with volunteer count
onValue(AllProgramsRef, (snapshot) => {
    const AllPrograms = [];
    snapshot.forEach((childSnapshot) => {
        const AllProgramData = childSnapshot.val();
        const dbDate = new Date(AllProgramData.Date);
        if (dbDate < FutureCurrent) {
            AllPrograms.push(childSnapshot);
        }
    });

    // Sort the programs by the program date from most recent to oldest
    AllPrograms.sort((a, b) => {
        const dateA = new Date(a.val().Date);
        const dateB = new Date(b.val().Date);
        return dateB - dateA; // Most recent first
    });

    DisplayPastPrograms(AllPrograms);
});

// Display Past Programs with volunteer count
function DisplayPastPrograms(AllPrograms) {
    const PastTableBody = document.getElementById('PastTableBody');
    PastTableBody.innerHTML = '';

    AllPrograms.forEach((childSnapshot) => {
        const AllProgramData = childSnapshot.val();
        const programKey = childSnapshot.key;
        const truncatedMsg = truncateText(AllProgramData.Msg, 50); // Limit to 50 characters
        const formattedDatePosted = formatDate(AllProgramData.Posted);
        const formattedDateProg = formatDate(AllProgramData.Date);

        // Fetch the number of volunteers for the current program
        const VolunteerRef = databaseRef(db, `Programs/${programKey}/Volunteers`);
        get(VolunteerRef).then((snapshot) => {
            const volunteerCount = snapshot.size; // Count the number of volunteers

            const newRow = document.createElement('tr');
            newRow.className = 'TableRow';
            newRow.innerHTML = `
                <td><img src="../admin/assets/img/paw-solid.png" alt="" height="15" width="15"></td>
                <td>${formattedDatePosted}</td>
                <td>${AllProgramData.title}</td>
                <td>${truncatedMsg}</td>
                <td>${volunteerCount}</td> <!-- Display volunteer count -->
                <td>${formattedDateProg}</td>
            `;

            PastTableBody.appendChild(newRow);
        }).catch((error) => {
            console.log(error.message);
        });
    });
}


//Create a function to open modal 

const archiveRef = databaseRef(db, 'Archived/Programs');

const ArchivesButton = document.getElementById('Archives');
ArchivesButton.addEventListener('click', () => {

    //Displaytab

    const search = document.getElementById('searchInput');
    search.style.display = "none"


    const Displaytab = document.getElementById('Displaytab');
    Displaytab.style.display = "none"

    const action = document.getElementById('action');
    action.style.display = "block"


    onValue(archiveRef, (snapshot) => {
        const AllPrograms = [];
        snapshot.forEach((childSnapshot) => {
            AllPrograms.push(childSnapshot);
        })

        // Sort the programs by the program date from most recent to oldest
        AllPrograms.sort((a, b) => {
            const dateA = new Date(a.val().Date);
            const dateB = new Date(b.val().Date);
            return dateB - dateA; // Most recent first
        });
        DisplayArchivedAllPrograms(AllPrograms);
    })


});


function DisplayArchivedAllPrograms(AllPrograms) {
    const AllTableProgramBody = document.getElementById('AllTableProgramBody');
    AllTableProgramBody.innerHTML = '';

    AllPrograms.forEach((childSnapshot) => {
        const AllProgramData = childSnapshot.val();
        const programKey = childSnapshot.key;
        const truncatedMsg = truncateText(AllProgramData.Msg, 50); // Limit to 50 characters
        const formattedDatePosted = formatDate(AllProgramData.Posted);
        const formattedDateProg = formatDate(AllProgramData.Date);

        const newRow = document.createElement('tr');


        newRow.innerHTML = `
            <td><img src="../admin/assets/img/paw-solid.png" alt="" height="15" width="15"></td>
            <td>${AllProgramData.title}</td>
            <td>${truncatedMsg}</td>
            <td>${formattedDateProg}</td>
            <td>${formattedDatePosted}</td> 
            <td> <buttom class="final-buttons unarchive" data-set-key="${programKey}">Unarchive </button> </td>
        `;

        AllTableProgramBody.appendChild(newRow);
    });
}



document.getElementById('AllTableProgramBody').addEventListener('click', (event) => {
    if (event.target.classList.contains('unarchive')) {
        const programkey = event.target.getAttribute('data-set-key');

        const programref = databaseRef(db, `Archived/Programs/${programkey}`)

        get(programref).then((snapshot) => {

            const data = snapshot.val();
            const Date = data.Date;
            const Msg = data.Msg;
            const Posted = data.Posted;
            const title = data.title;
            const poster = data.Poster;

            set(databaseRef(db, `Programs/${programkey}`), {
                Date: Date,
                Msg: Msg,
                Posted: Posted,
                title: title,
                Poster: poster
            }).then(() => {

                remove(programref).then(() => {
                    console.log('Program Unarchived');
                    alert('Program Unarchived Successfully!')
                }).catch((error) => {
                    console.log(error);
                })

            }).catch((error) => {
                console.log(error);
            })


        }).catch((error) => {
            console.error(error);
        })



    }
})


// For programs tabs
document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('.prog-tab');
    const tabContents = document.querySelectorAll('.table-container > div');

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            // If programInfo is open, close it before switching tabs
            if (document.getElementById('programInfo').style.display === 'block') {
                closeModal();
            }

            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.style.display = 'none');

            tab.classList.add('active');
            tabContents[index].style.display = 'block';
        });
    });

    // Initialize the first tab
    tabs[0].classList.add('active');
    tabContents[0].style.display = 'block';
});

// Function to show program info and hide other elements
function showProgramInfo(programId) {
    console.log('Fetching data for:', programId);
    const programRef = databaseRef(db, `Programs/${programId}`);
    const modal = document.getElementById('programInfo');
    const closeButton = document.querySelector('.back-btn');
    const pageContent = document.getElementById('pageContent');

    get(programRef).then((snapshot) => {
        if (!snapshot.exists()) {
            console.error("Program not found");
            return;
        }

        const programData = snapshot.val();
        document.getElementById('ProTitle').textContent = programData.title;
        document.getElementById('ProDate').textContent = formatDate(programData.Date);
        document.getElementById('ProContent').textContent = programData.Msg;
        document.getElementById('ProgramPoster').src = programData.Poster;
        document.getElementById('Posted').textContent = `Posted on: ${formatDate(programData.Posted)}`;
        populateVolunteers(programId);

        modal.style.display = 'block';
        pageContent.style.display = 'none'; 

        closeButton.addEventListener('click', closeModal, { once: true });
    }).catch((error) => {
        console.error("Error fetching program data:", error);
    });
}

// Function to close the program info modal
function closeModal() {
    const modal = document.getElementById('programInfo');
    const pageContent = document.getElementById('pageContent');

    modal.style.display = 'none'; // Hide program info modal
    pageContent.style.display = 'block'; // Show page content
    console.log("Page content shown");
}

// Attach event listeners to program items
document.querySelectorAll('.program-item').forEach(item => {
    item.addEventListener('click', (event) => {
        const programId = event.currentTarget.dataset.programId; // Assuming you store the programId in a data attribute
        showProgramInfo(programId);
    });
});

// To close program info when clicking outside it
document.getElementById('programInfo').addEventListener('click', (e) => {
    if (e.target === document.getElementById('programInfo')) {
        closeModal();
    }
});






// Populate volunteers function remains unchanged
function populateVolunteers(programId) {
    const volunteersRef = databaseRef(db, `Programs/${programId}/Volunteers`);
    get(volunteersRef).then((volunteerSnapshot) => {
        const volunteersList = document.getElementById('volunteers');
        volunteersList.innerHTML = '';
        volunteerSnapshot.forEach((volunteerChildSnapshot) => {
            const volunteerId = volunteerChildSnapshot.key;
            get(databaseRef(db, `Volunteer-Account/${volunteerId}`))
            .then((volunteerDataSnapshot) => {
                const volunteerData = volunteerDataSnapshot.val();
                const listItem = document.createElement('li');
                listItem.textContent = volunteerData.Username;
                volunteersList.appendChild(listItem);
            });
        });
    }).catch((error) => {
        console.error("Error fetching volunteers:", error);
    });
}