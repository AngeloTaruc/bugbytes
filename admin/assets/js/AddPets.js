import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, set, ref as databaseRef, get, onValue, push, update,remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firebase configuration
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

const addPets = document.getElementById('addPets');
addPets.addEventListener('click', uploadPhotos);

// Function to upload photos and details of the pet
async function uploadPhotos() {
  const beforeImageInput = document.getElementById('imageBefore');
  const afterImageInput = document.getElementById('imageAfter');

  const beforeFile = beforeImageInput.files[0];
  const afterFile = afterImageInput.files[0];

  // If file is empty, pop up alert
  if (!beforeFile || !afterFile) {
    alert('Please select both Before and After images');
    return;
  }

  const uniqueId = Date.now().toString();

  const BstorageRef = storageRef(storage, 'photos/before/' + beforeFile.name);
  const AstorageRef = storageRef(storage, 'photos/after/' + afterFile.name);

  try {
    const beforeSnapshot = await uploadBytes(BstorageRef, beforeFile);
    const BDownloadUrl = await getDownloadURL(beforeSnapshot.ref);

    const afterSnapshot = await uploadBytes(AstorageRef, afterFile);
    const ADownloadUrl = await getDownloadURL(afterSnapshot.ref);

    const petName = document.getElementById('pet-name').value;
    const petGender = document.getElementById('petGender').value;
    const petAge = document.getElementById('petAge').value;
    const petColor = document.getElementById('petColor').value;
    const petKapon = document.getElementById('petKapon').value;
    const petVacc = document.getElementById('petVacc').value;
    const petDesc = document.getElementById('petdesc').value;
    const petCategory = document.getElementById('petClass').value;

    await set(databaseRef(db, `Pets/${uniqueId}`), {
      BeforeUrl: BDownloadUrl,
      AfterUrl: ADownloadUrl,
      PetName: petName,
      Gender: petGender,
      Age: petAge,
      Color: petColor,
      Kapon: petKapon,
      Vaccine: petVacc,
      Description: petDesc,
      PetId: uniqueId,
      Status: 'Available',
      Category: petCategory
    });

    alert('Rescue Added successfully');
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}



const petRef = databaseRef(db, 'Pets');

let petData = [];

onValue(petRef, (snapshot) => {
  petData = [];
  snapshot.forEach((childSnapshot) => {
    petData.push(childSnapshot);
  });
  displayPetDetails(petData);
});

function displayPetDetails(petData) {
  const petDetails = document.getElementById('PetTableBody');
  petDetails.innerHTML = '';

  if (petData.length === 0) {
    petDetails.innerHTML = '<tr><td colspan="7">No pets available</td></tr>';
  } else {
    petData.map((childSnapshot) => {
      const pets = childSnapshot.val();
      const id = childSnapshot.key;
      const PetId = pets.PetId;
      const name = pets.PetName;
      const gender = pets.Gender;
      const status = pets.Status;

      // Set status color based on the current status
      let statusColor = '';
      if (status === 'Available') {
        statusColor = 'green';
      } else if (status === 'In-Progress') {
        statusColor = 'blue';
      } else if (status === 'Adopted') {
        statusColor = 'red';
      }

      const newRow = document.createElement('tr');

      newRow.innerHTML = `
        <td>${PetId}</td>
        <td>${name}</td>
        <td style="color: ${statusColor}; font-weight: 600;">${status}</td>
        <td class="action-btns">
          <button class="View-btn" data-pet-id="${id}"><img src="../admin/assets/img/eye-solid.png" width="15" height="15">View</button>
          <button class="Edit-btn" data-pet-id="${id}"><img src="../admin/assets/img/pen-to-square-solid.png" width="15" height="15">Edit</button> 
          <button class="Archive-btn" data-pet-id="${id}"><img src="../admin/assets/img/box-archive-solid.png" width="15" height="15">Archive</button>
        </td>
      `;

      const viewButton = newRow.querySelector('.View-btn');
      viewButton.addEventListener('click', () => ViewPetDetails(id));

      petDetails.appendChild(newRow);
    });
  }
}





// VIEW PET DETAILS
async function ViewPetDetails(id) {
  const pageContent = document.getElementById('pageContent');
  const viewPetContainer = document.getElementById('viewPet-container');

  pageContent.style.display = 'none';
  viewPetContainer.style.display = 'block';

  
    const petReference = databaseRef(db, `Pets/${id}`);
    const childSnapshot = await get(petReference);
    const pets = childSnapshot.val();
    const beforeImg = document.getElementById('viewBeforeImg').src = pets.BeforeUrl;
    const afterImg = document.getElementById('viewAfterImg').src = pets.AfterUrl;

    document.getElementById('viewPetName').textContent = pets.PetName;
    document.getElementById('viewPetDesc').textContent = pets.Description;
    document.getElementById('viewPetGender').textContent = pets.Gender;
    document.getElementById('viewPetAge').textContent = pets.Age;
    document.getElementById('viewPetVaccine').textContent = pets.Vaccine;
    document.getElementById('viewPetSpayNeut').textContent = pets.Kapon;
}

// Function to close the modal
function closeViewPet() {
  document.getElementById('viewPet-container').style.display = 'none';
}



document.getElementById('PetTableBody').addEventListener('click', (event) => {
  const target = event.target;

  if (target.classList.contains('Edit-btn')) {
    const petId = target.getAttribute('data-pet-id');
    ShowPets(petId);
  }else if (target.classList.contains('Archive-btn')){
    const petId = target.getAttribute('data-pet-id');

    const petReference = databaseRef(db,`Pets/${petId}`);

    get(petReference).then((snapshot)=>{
        const petData = snapshot.val();

        const PetId = petData.PetId;
        const name = petData.PetName;
        const gender = petData.Gender;
        const status = petData.Status;
        const age = petData.Age;
        const color = petData.Color;
        const after = petData.AfterUrl;
        const before = petData.BeforeUrl;
        const kapon = petData.Kapon;
        const  description = petData.Description
        const vaccine = petData.Vaccine;
        const category = petData.Category;

        set(databaseRef(db,`Archived/Pets/${petId}`),{

          BeforeUrl: before,
          AfterUrl: after,
          PetName: name,
          Gender:gender ,
          Age: age,
          Color: color,
          Kapon: kapon,
          Vaccine: vaccine,
          Description: description,
          PetId:PetId ,
          Status: status,
          Category:category
    
        }).then(()=>{
          alert('Archived');

          remove(petReference).then(()=>{
              console.log('Removed');
          }).catch((error)=>{
            console.error(error);
          })

        }).catch((error)=>{
          console.error(error);
        })


        

    }).catch((error)=>{
      console.error(error.message);
    })



  }
});

async function ShowPets(id) {
  document.getElementById('viewInfo').style.display = 'block';

  const petReference = databaseRef(db, `Pets/${id}`);

  const childSnapshot = await get(petReference);
  const pets = childSnapshot.val();
  const name = pets.PetName;
  const gender = pets.Gender;

  document.getElementById('Editpet-name').value = name;
  document.getElementById('Editpetdesc').value = pets.Description;
  document.getElementById('EditpetGender').value = gender;
  document.getElementById('EditpetAge').value = pets.Age;
  document.getElementById('EditpetColor').value = pets.Color;
  document.getElementById('EditpetKapon').value = pets.Kapon;
  document.getElementById('EditpetVacc').value = pets.Vaccine;
  document.getElementById('EditpetClass').value = pets.Category;

  // Remove existing event listener before adding a new one
  const EditButton = document.getElementById('EditButton');
  const newEditButton = EditButton.cloneNode(true);
  EditButton.parentNode.replaceChild(newEditButton, EditButton);

  newEditButton.addEventListener('click', () => {
    UpdatePets(id);
  });
}

function UpdatePets(PetId) {
  
  const EditName = document.getElementById('Editpet-name').value;
  const EditPetDesc = document.getElementById('Editpetdesc').value;
  const EditGender = document.getElementById('EditpetGender').value;
  const EditPetAge = document.getElementById('EditpetAge').value;
  const EditPetColor = document.getElementById('EditpetColor').value;
  const EditPetKapon = document.getElementById('EditpetKapon').value;
  const EditpetVacc = document.getElementById('EditpetVacc').value;
  const EditPetClass = document.getElementById('EditpetClass').value;

  update(databaseRef(db, `Pets/${PetId}`), {
    PetName: EditName,
    Gender: EditGender,
    Age: EditPetAge,
    Color: EditPetColor,
    Kapon: EditPetKapon,
    Vaccine: EditpetVacc,
    Description: EditPetDesc,
    Category: EditPetClass
  }).then(() => {
    alert('Updated Successfully');
    // Reload the data and update the table
    displayPetDetails(petData);
  }).catch((error) => {
    alert(error.message);
  });
}


const searchRescue = document.getElementById('searchRescue');
searchRescue.addEventListener('keydown',(event)=>{
  if(event.key === 'Enter'){
  
    onValue(petRef, (snapshot) => {
      petData = [];
      snapshot.forEach((childSnapshot) => {
        const DataPet = childSnapshot.val()
        if(DataPet.PetName === searchRescue.value){
          petData.push(childSnapshot);
        }else if(searchRescue.value === ''){
          location.reload(true);
        }
        
      });
      displayPetDetails(petData);
    });
  }
})
const archiveRef = databaseRef(db, 'Archived/Pets');

const ArchivesButton = document.getElementById('Archives-Button');
ArchivesButton.addEventListener('click', ()=>{

  const searchRescue = document.getElementById('searchRescue');
  searchRescue.style.display = "none"
 

  const ArchivedPets = [];
  onValue(archiveRef,(snapshot)=>{
    snapshot.forEach((childSnapshot) => {
      ArchivedPets.push(childSnapshot);
    });
    ArchivesPets(ArchivedPets);
  })


});


async function ArchivesPets (ArchivedPets){
  
  const petDetails = document.getElementById('PetTableBody');
  petDetails.innerHTML = '';

  if(ArchivedPets === 0){
      petDetails.innerHTML = '<p> No Pet Archived </p>'
  }

  ArchivedPets.map((childSnapshot)=>{
     const ArchivePet =  childSnapshot.val()

     const PetId = ArchivePet.PetId;
    const name = ArchivePet.PetName;
    const gender = ArchivePet.Gender;
    const status = ArchivePet.Status;

     const newRow = document.createElement('tr');
     newRow.innerHTML = `
      <td>${PetId}</td>
      <td>${name}</td>
      <td>${status}</td>
      <td>
      <button class="final-buttons unarchivepet" data-pet="${PetId}">
       <img src="./assets/img/box-archive-solid.png" class="svg-icon" alt="" width="15"
                                height="15">
                            <span class="actions-lbl">Unarchived</span>
      </button> </td>
     `
     petDetails.appendChild(newRow);
  })
  
}

document.getElementById('PetTableBody').addEventListener('click',event =>{
  if(event.target.classList.contains('unarchivepet')){
    const PetId = event.target.getAttribute('data-pet');


    const petReference = databaseRef(db,`Archived/Pets/${PetId}`);

    get(petReference).then((snapshot)=>{
        const petData = snapshot.val();

        const PetId = petData.PetId;
        const name = petData.PetName;
        const gender = petData.Gender;
        const status = petData.Status;
        const age = petData.Age;
        const color = petData.Color;
        const after = petData.AfterUrl;
        const before = petData.BeforeUrl;
        const kapon = petData.Kapon;
        const  description = petData.Description
        const vaccine = petData.Vaccine;
        const category = petData.Category;

        set(databaseRef(db,`Pets/${PetId}`),{

          BeforeUrl: before,
          AfterUrl: after,
          PetName: name,
          Gender:gender ,
          Age: age,
          Color: color,
          Kapon: kapon,
          Vaccine: vaccine,
          Description: description,
          PetId:PetId ,
          Status: status,
          Category:category
    
        }).then(()=>{
          alert('Archived');

          remove(petReference).then(()=>{
              console.log('Removed');
          }).catch((error)=>{
            console.error(error);
          })

        }).catch((error)=>{
          console.error(error);
        })


        

    }).catch((error)=>{
      console.error(error.message);
    })


    


    
  }

})

  
     
  





