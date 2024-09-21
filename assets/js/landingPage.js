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
const db = getDatabase(app);


const showPets = databaseRef(db, 'Pets');

onValue(showPets, (snapshot) => {
    const petData = [];
    snapshot.forEach((childSnapshot) => {
        petData.push(childSnapshot);
    })
    DisplayPets(petData);
})

function DisplayPets(petData) {

    const SectionAdopt = document.getElementById('adopt-section');
    SectionAdopt.innerHTML = '';

    petData.map((childSnapshot) => {
        const pet = childSnapshot.val();
        const key = childSnapshot.key;
        const petName = pet.PetName;
        const petPhoto = pet.AfterUrl;

        const newArticle = document.createElement('article')
        newArticle.className = "adopt-card";
        newArticle.innerHTML = `


            <figure class="adopt-card-image">
                            <img src='${petPhoto}'/>
                        </figure>
                        <div class="adopt-card-header"> ${petName} </div>
                        <div class="adopt-card-footer">
                            <button class="abtMe-btn" id="viewPet-btn" petkey="${key}">About Me</button>
                        </div>
        
        
        `

        SectionAdopt.appendChild(newArticle);

    })
}


document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('abtMe-modal');
    const modalImage = document.getElementById('abtMe-modal-image');
    const modalName = document.getElementById('abtMe-modal-name');
    const modalGender = document.getElementById('abtMe-modal-gender');
    const modalAge = document.getElementById('abtMe-modal-age');
    const modalColour = document.getElementById('abtMe-modal-colour');
    const modalDescription = document.getElementById('abtMe-modal-description');
    const closeBtn = modal.querySelector('.abtMe-close');

    function openModal(petData) {
        modalImage.src = petData.AfterUrl;
        modalName.textContent = petData.PetName;
        modalGender.textContent = petData.Gender;
        modalAge.textContent = petData.Age;
        modalColour.textContent = petData.Color;
        modalDescription.textContent = petData.Description;
        modal.style.display = 'block';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    document.getElementById('adopt-section').addEventListener('click', (event) => {
        if (event.target.classList.contains('abtMe-btn')) {
            const petKey = event.target.getAttribute('petkey');
            
            const petRef = databaseRef(db, `Pets/${petKey}`);
            
            get(petRef).then((childSnapshot) => {
                const petData = childSnapshot.val();
                openModal(petData);
            }).catch((error) => {
                console.error(error);
            });
        }
    });

    closeBtn.addEventListener('click', closeModal);

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
});

// DISPLAY HOME TRENDS
// Firebase reference to Pets data
const countPets = databaseRef(db, 'Pets');

onValue(countPets, (snapshot) => {
    const countData = [];
    snapshot.forEach((childSnapshot) => {
        countData.push(childSnapshot.val()); // Push the actual data, not the snapshot
    });
    CountPets(countData); // Call the counting function
});

function CountPets(countData) {
    let shelteredCount = 0;
    let rescuedCount = 0;
    let spayedNeuteredCount = 0;
    let rehomedCount = 0;

    // Iterate through each pet data and apply counting logic
    countData.forEach(pet => {
        // Counting "Available" pets for "Sheltered" and "Rescued"
        if (pet.Status === "Available" || "In-Progress") {
            shelteredCount++;
            rescuedCount++;
        }

        // Counting "Adopted" pets for Rehomed"
        if (pet.Status === "Adopted") {
            rehomedCount++;
        }

        // Counting pets with "Spayed" or "Neutered" in the "Kapon" field for "Spayed & Neutered"
        if (pet.Kapon === "Spayed" || pet.Kapon === "Neutered") {
            spayedNeuteredCount++;
        }
    });

    // Update the counts in the UI
    updateCounts(shelteredCount, rescuedCount, spayedNeuteredCount, rehomedCount);
}

// Function to update the counts in the UI
function updateCounts(sheltered, rescued, spayedNeutered, rehomed) {
    document.getElementById('shelteredCount').textContent = sheltered;
    document.getElementById('rescuedCount').textContent = rescued;
    document.getElementById('kaponCount').textContent = spayedNeutered;
    document.getElementById('rehomedCount').textContent = rehomed;
}




//Fetch Merchandise
const MerchRef = databaseRef(db, 'Merchandise');

onValue(MerchRef, (snapshot) => {
    const MerchData = []
    snapshot.forEach((childSnapshot) => {
        MerchData.push(childSnapshot);


    });
    DisplayMerch(MerchData);
})

//Display function Merchandise

function DisplayMerch(MerchData) {
    const MerchContent = document.getElementById('merchandise-section');
    MerchContent.innerHTML = '';

    MerchData.map((childSnapshot) => {
        const Merch = childSnapshot.val();

        const newArticle = document.createElement('article');
        newArticle.classList.add('merchandise-card');
        newArticle.innerHTML = `
            <figure class="card-image">
                <img src="${Merch.MerchPhoto}" alt="drescue" />
            </figure>
            <div class="merchandise-card-header">
                <p>${Merch.MerchName}</p>
            </div>
            <div class="merchandise-card-footer">
                <button class="merch-btn" id="viewMerch-btn">
                    <a href="${Merch.MerchLink}" target="_blank" rel="noopener noreferrer"> View </a>
                </button>
            </div>
        `;
        MerchContent.appendChild(newArticle);
    });
}



const EmployeeRef = databaseRef(db, 'Employee')
onValue(EmployeeRef, (snapshot) => {
    const EmployeeData = []
    snapshot.forEach((childSnapshot) => {
        EmployeeData.push(childSnapshot);

    });

    DisplayEmployees(EmployeeData);

})

async function DisplayEmployees(EmployeeData) {
    const TeamContent = document.getElementById('Team-Content');
    TeamContent.innerHTML = '';

    try {
        await EmployeeData.map((childSnapshot) => {
            const Employee = childSnapshot.val();

            const TeamMember = document.createElement('div')
            TeamMember.classList.add('team-member');
            TeamMember.innerHTML = `

            <img src="./assets/img/logo.png" alt=""> 
            <h3>${Employee.Name}</h3>
            <p>${Employee.Position}</p>
            
            `
            TeamContent.appendChild(TeamMember);

        })
    } catch {
        console.log('Error')
    }

}

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const submitButton = document.getElementById('ApplicationSubmit');

    // Function to save form data to localStorage
    function saveFormData() {
        const formData = {};
        for (let i = 1; i <= 19; i++) {
            const element = document.getElementById(`formQ${i}`);
            if (element) {
                formData[`q${i}`] = element.value;
            }
        }
        localStorage.setItem('volunteerFormData', JSON.stringify(formData));
    }

    // Function to load form data from localStorage
    function loadFormData() {
        const savedData = localStorage.getItem('volunteerFormData');
        if (savedData) {
            const formData = JSON.parse(savedData);
            for (let i = 1; i <= 19; i++) {
                const element = document.getElementById(`formQ${i}`);
                if (element && formData[`q${i}`]) {
                    element.value = formData[`q${i}`];
                }
            }
        }
    }

    // Load saved form data when the page loads
    loadFormData();

    // Save form data whenever an input changes
    form.addEventListener('input', saveFormData);

    submitButton.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent form submission

        const emptyFields = [];
        let allFilled = true;

        for (let i = 1; i <= 19; i++) {
            const element = document.getElementById(`formQ${i}`);
            if (element && !element.value.trim()) {
                allFilled = false;
                emptyFields.push(i);
            }
        }

        if (!allFilled) {
            alert(`Please fill in all fields. Empty fields: ${emptyFields.join(', ')}`);
            return;
        }

        // Get the current date and time for the registration date
        const registrationDate = new Date().toISOString();

        // If all fields are filled, proceed with form submission
        const id = Math.random().toString(36).substring(2, 10);

        const formData = {};
        for (let i = 1; i <= 19; i++) {
            formData[`Question${i}`] = document.getElementById(`formQ${i}`).value;
        }
        formData['Status'] = 'Pending';
        formData['RegistrationDate'] = registrationDate; // Add registration date

        set(databaseRef(db, `Volunteers/${id}`), formData)
            .then(() => {
                alert("Your application has been submitted");
                localStorage.removeItem('volunteerFormData'); // Clear saved form data
                location.reload(true);
            })
            .catch((error) => {
                alert("Error submitting application: " + error.message);
            });
    });
});

// Fetch Programs
const ProgRef = databaseRef(db, 'Programs');

onValue(ProgRef, (snapshot) => {
    const ProgData = [];
    snapshot.forEach((childSnapshot) => {
        const program = childSnapshot.val();
        ProgData.push(program);
    });
    DisplayProg(ProgData); // Display the fetched programs
});

// Function to display programs dynamically
function DisplayProg(programs) {
    const newsfeedContainer = document.querySelector('.home-newsfeed');
    newsfeedContainer.innerHTML = ''; // Clear previous content if any

    programs.forEach((program, index) => {
        const card = document.createElement('div');
        card.classList.add('newsfeed-card');
        if (index >= 3) card.classList.add('hidden'); // Initially hide extra cards

        // Add inner HTML for the card
        card.innerHTML = `
            <img class="news-image" src="${program.Poster || ''}" alt="Program Image">
            <div class="news-heading" data-index="${index}">${program.title || 'TITLE OF PROGRAM'}</div>
        `;

        newsfeedContainer.appendChild(card);
    });

    // Add click event to open modal when the title is clicked
    document.querySelectorAll('.news-heading').forEach(heading => {
        heading.addEventListener('click', function() {
            const programIndex = this.getAttribute('data-index');
            openProgramModal(programs[programIndex]); // Pass the program details to the modal function
        });
    });

    addViewAllFunctionality(); // Re-apply the view all functionality
}

// Function to open the modal with program details
function openProgramModal(program) {
    const modal = document.querySelector('.program-modal');
    modal.querySelector('.modal-title').innerText = program.title || 'Program Title';
    modal.querySelector('.modal-description').innerText = program.Msg || 'Program Description';
    modal.querySelector('.modal-image').src = program.Poster || '';
    modal.style.display = 'block'; // Show the modal

    // Close the modal when the overlay outside of the modal content is clicked
    modal.addEventListener('click', function(event) {
        if (event.target === modal) closeProgramModal();
    });
}

// Function to close the modal
function closeProgramModal() {
    const modal = document.querySelector('.program-modal');
    modal.style.display = 'none'; // Hide the modal
}


// Function to handle the "View All" functionality
function addViewAllFunctionality() {
    const viewAllBtn = document.getElementById('viewAllBtn');
    const newsfeedCards = document.querySelectorAll('.newsfeed-card');
    const visibleCardsCount = 3; // Number of cards to show initially
    let isExpanded = false;

    // Add event listener to the "View All" button
    viewAllBtn.addEventListener('click', function () {
        if (isExpanded) {
            // If expanded, hide extra cards and change button text
            newsfeedCards.forEach((card, index) => {
                if (index >= visibleCardsCount) {
                    card.classList.add('hidden');
                }
            });
            viewAllBtn.textContent = 'View All Programs';
        } else {
            // If not expanded, show all cards and change button text
            newsfeedCards.forEach(card => card.classList.remove('hidden'));
            viewAllBtn.textContent = 'Show Less Programs';
        }
        isExpanded = !isExpanded; // Toggle the state
    });
}

// Ensure the DOM is loaded before manipulating elements
document.addEventListener('DOMContentLoaded', function () {
    addViewAllFunctionality(); // Set up the view all functionality initially
});

//  Fetch Announcments 
const AnnounceRef = databaseRef(db, 'Announcements');

onValue(AnnounceRef, (snapshot) => {
    const AnnounceData = [];
    snapshot.forEach((childSnapshot) => {
        const program = childSnapshot.val();
        AnnounceData.push(program);
    });
    DisplayAnnounce(AnnounceData); // Display the fetched programs
});

function DisplayAnnounce(announcements) {
    const newsfeedContainer = document.querySelector('.home-donatefeed');
    newsfeedContainer.innerHTML = ''; // Clear previous content if any

    // Filter announcements to include only those with the category 'Transparency'
    const filteredAnnouncements = announcements.filter(announcement => announcement.category === 'Transparency');

    // Check if there are announcements after filtering
    if (filteredAnnouncements.length === 0) {
        // Optionally display a message if no announcements are found
        newsfeedContainer.innerHTML = '<p>No Transparency announcements found.</p>';
        return;
    }

    filteredAnnouncements.forEach((program, index) => {
        const card = document.createElement('div');
        card.classList.add('donatefeed-card');
        if (index >= 3) card.classList.add('hidden'); // Initially hide extra cards

        // Add inner HTML for the card
        card.innerHTML = `
            <img class="donate-image" src="${program.image || ''}" alt="Program Image">
            <div class="donate-heading" data-index="${index}">${program.title || 'TITLE OF PROGRAM'}</div>
        `;

        newsfeedContainer.appendChild(card);
    });
}


// CONTACT US 

// save contact us to database :)
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('customerForm');
    const submitButton = document.getElementById('ContactSubmit');

    // Function to save form data to localStorage
    function saveFormData() {
        const formData = {
            name: document.getElementById('ContactName').value,
            email: document.getElementById('ContactEmail').value,
            subject: document.getElementById('ContactSubj').value,
            message: document.getElementById('cus-msg').value
        };
        localStorage.setItem('customerFormData', JSON.stringify(formData));
    }

    // Function to load form data from localStorage
    function loadFormData() {
        const savedData = localStorage.getItem('customerFormData');
        if (savedData) {
            const formData = JSON.parse(savedData);
            document.getElementById('ContactName').value = formData.name || '';
            document.getElementById('ContactEmail').value = formData.email || '';
            document.getElementById('ContactSubj').value = formData.subject || '';
            document.getElementById('cus-msg').value = formData.message || '';
        }
    }

    // Load saved form data when the page loads
    loadFormData();

    // Save form data whenever an input changes
    form.addEventListener('input', saveFormData);

    submitButton.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent form submission

        const emptyFields = [];
        const fields = ['ContactName', 'ContactEmail', 'ContactSubj', 'cus-msg'];
        let allFilled = true;

        fields.forEach(field => {
            const element = document.getElementById(field);
            if (!element.value.trim()) {
                allFilled = false;
                emptyFields.push(field);
            }
        });

        if (!allFilled) {
            alert(`Please fill in all fields. Empty fields: ${emptyFields.join(', ')}`);
            return;
        }

        // Get the current date and time for the submission date
        const submissionDate = new Date().toISOString();

        // If all fields are filled, proceed with form submission
        const id = Math.random().toString(36).substring(2, 10);

        const formData = {
            name: document.getElementById('ContactName').value,
            email: document.getElementById('ContactEmail').value,
            subject: document.getElementById('ContactSubj').value,
            message: document.getElementById('cus-msg').value,
            status: 'Pending',
            submissionDate: submissionDate
        };

        set(databaseRef(db, `CustomerForms/${id}`), formData)
            .then(() => {
                alert("Your form has been submitted");
                localStorage.removeItem('customerFormData'); // Clear saved form data
                form.reset(); // Reset the form
            })
            .catch((error) => {
                alert("Error submitting form: " + error.message);
            });
    });
});
