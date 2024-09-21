import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, set, ref as databaseRef, get, onValue, push, update, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";


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

const Announcement = databaseRef(db, ('Announcements'));



const Submit = document.getElementById('submit');
Submit.addEventListener('click', addAnnouncement)



async function addAnnouncement() {
  const programeImage = document.getElementById('programeImage');
  const images = programeImage.files[0];

  if (!images) {
      alert('Please select an image');
      return;
  }

  const id = Date.now().toString();
  const imageStore = storageRef(storage, 'images/' + images.name);

  try {
      const upload = await uploadBytes(imageStore, images);
      const url = await getDownloadURL(upload.ref);

      let today = new Date();
      let day = today.getDate();
      let month = today.getMonth() + 1;
      let year = today.getFullYear();
      const formattedDate = `${year}-${month}-${day}`;

      const title = document.getElementById('progName').value;
      const msg = document.getElementById('progMsg').value;

      // Get the selected category from the dropdown
      const category = document.getElementById('progCat').value;

      await set(databaseRef(db, `Announcements/${id}`), {
          title: title,
          msg: msg,
          image: url,
          posted: formattedDate,
          category: category // Add category to the announcement data
      }).then(() => {
          alert('Announcement Posted Successfully');

          // Hide the modal
          const addModal = document.getElementById('addModal');
          addModal.style.display = 'none';

          // Reset fields
          document.getElementById('progName').value = '';
          document.getElementById('progMsg').value = '';
          document.getElementById('programeImage').value = '';
          document.getElementById('progCat').value = 'Announcement'; // Reset category to default
      }).catch((error) => {
          alert(error.message);
      });

  } catch (error) {
      alert(error.message);
  }
}


//Display Announcement Data
async function displayAnnoucement(AnnoucementData) {
  const AnnouncementTable = document.getElementById('tableAnnouncementBody');
  AnnouncementTable.innerHTML = '';

  AnnoucementData.sort((a, b) => {
    const dateA = new Date(a.val().posted);
    const dateB = new Date(b.val().posted);
    return dateB - dateA; 
  });

  AnnoucementData.forEach((childSnapshot) => {
    const data = childSnapshot.val();
    const key = childSnapshot.key;
    const truncatedMsg = truncateText(data.msg, 30);
    const formattedDate = formatDate(data.posted);
    const newRow = document.createElement('tr');

    function truncateText(text, maxLength) {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
      }
      return text;
    }

    function formatDate(dateStr) {
      const options = { month: 'short', day: 'numeric', year: 'numeric' };
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', options);
    }

    newRow.innerHTML = `
        <td>${formattedDate}</td>
        <td>${data.title}</td>
        <td>${truncatedMsg}</td>
        <td class="action-btns">
          <button class="final-buttons view-btn" data-key="${key}">
            <img src="./assets/img/eye-solid.png" alt="" width="15" height="15"> View
          </button>
          <button class="final-buttons edit-btn" data-edit-key="${key}" ">
            <img src="./assets/img/pen-to-square-solid.png" alt="" width="15" height="15"> Edit
          </button>
          <button class="final-buttons archive" data-set="${key}">
            <img src="./assets/img/box-archive-solid.png" alt="" width="15" height="15"> Archive
          </button>
        </td>
      `;

    AnnouncementTable.appendChild(newRow);

    const viewButton = newRow.querySelector('.view-btn');
    viewButton.addEventListener('click', () => {
      displayAnnouncementModal(data, key);
    });
  });
}

document.getElementById('tableAnnouncementBody').addEventListener('click',async (event)=>{
  if(event.target.classList.contains('edit-btn')){
    
    const modal = document.getElementById('editInfo');
    modal.style.display = 'block';

    const editKey = event.target.getAttribute('data-edit-key');

    const ReferenceKey = databaseRef(db,`Announcements/${editKey}`)
    get(ReferenceKey).then((snapshot)=>{

      if(snapshot.exists()){
        const data = snapshot.val();

        document.getElementById('EprogName').value = data.title;
        document.getElementById('EprogMsg').value = data.msg;
        document.getElementById('EprogCat').value = data.category;
     

      }else{
        console.log('No data available');
      }
     
    }).catch((error)=>{
      console.error(error);
    })

   document.getElementById('submitEdit').addEventListener('click',async () =>{

    const EprogrameImage = document.getElementById('EprogrameImage');
    const EprogramePath = EprogrameImage.files[0];

   const progname =   document.getElementById('EprogName').value
    const category =  document.getElementById('EprogCat').value
    const message =  document.getElementById('EprogMsg').value

      try{
           
        if(!EprogramePath){

          update(databaseRef(db,`Announcements/${editKey}`),{
            title: progname,
            msg: message,
            category: category,

          })
  
          
        }else{
          const newPhotoRef = storageRef(storage,'Photos/Programs/' + EprogramePath.name);
          const uploadSnapshot = await uploadBytes(newPhotoRef,EprogramePath);
          const downloadUrl = await getDownloadURL(uploadSnapshot.ref);


          update(databaseRef(db,`Announcements/${editKey}`),{
            title: progname,
            msg: message,
            category: category,
            image:downloadUrl

          })
        }
    
      }
      catch (error ){
        console.error(error);
      }

   });
    

   
    
  }

});





// VIEW ANNOUNCEMTN
function displayAnnouncementModal(data, key) {
  const modal = document.getElementById('announcementModal');
  const modalTitle = document.getElementById('modal-title');
  const modalMessage = document.getElementById('modal-message');
  const modalPosted = document.getElementById('modal-posted');
  const modalImg = document.getElementById('modal-img');
  const closeButton = document.querySelector('.back-btn');
  const pageContent = document.getElementById('pageContent');

  modalTitle.textContent = data.title;
  modalMessage.textContent = data.msg;
  modalPosted.textContent = `Posted: ${data.posted}`;
  modalImg.innerHTML = `<img src="${data.image}" alt="${data.title}" width="100%">`;

  modal.style.display = 'block';
  pageContent.style.display = 'none';

  closeButton.addEventListener('click', closeAnnouncementModal, { once: true });

  window.addEventListener('click', (event) => {
    if (event.target == modal) {
      closeAnnouncementModal();
    }
  });
}

function closeAnnouncementModal() {
  const modal = document.getElementById('announcementModal');
  const pageContent = document.getElementById('pageContent');

  modal.style.display = 'none';
  pageContent.style.display = 'block';
}





//Fetch Announcement Data from firebase
onValue(Announcement, (childSnapshot) => {
  const AnnoucementData = [];
  childSnapshot.forEach((childSnapshot) => {
    AnnoucementData.push(childSnapshot);
  })
  displayAnnoucement(AnnoucementData);
})


const AnnouncementTable = document.getElementById('tableAnnouncementBody');
AnnouncementTable.addEventListener('click', (event) => {
  const target = event.target;

  if (target.closest('.archive')) {
    const id = target.closest('.archive').getAttribute('data-set');
    ArchiveAnnouncement(id);
  }
})

function ArchiveAnnouncement(id) {
  // Ask the user for confirmation before proceeding
  const confirmArchive = confirm("Are you sure you want to archive this announcement?");
  
  if (confirmArchive) {
    const AnnoucementRef = databaseRef(db, `Announcements/${id}`);
    get(AnnoucementRef).then((snapshot) => {
      const data = snapshot.val();
      const title = data.title;
      const msg = data.msg;
      const posted = data.posted;
      const image = data.image;

      // Move the announcement to the archived section
      set(databaseRef(db, `Archived/Announcements/${id}`), {
        title: title,
        msg: msg,
        posted: posted,
        image: image
      }).then(() => {
        // Remove the announcement from the original section
        remove(databaseRef(db, `Announcements/${id}`)).then(() => {
          console.log('Announcement Archived');
          alert('Announcement Successfully Archived!');
        }).catch((error) => {
          console.log(error);
        });
      });
    });
  } else {
    // If the user cancels, do nothing
    console.log("Archive action canceled.");
  }
}


//Search

document.getElementById('search').addEventListener('keydown',event =>{
  if(event.key === 'Enter'){
    
    const search = document.getElementById('search').value
    onValue(Announcement,(snapshot)=>{
      const AnnoucementData = [];
      snapshot.forEach((childSnapshot)=>{
          const announcement = childSnapshot.val();

          if(announcement.title === search ){
            return AnnoucementData.push(childSnapshot)
          }

         
      })
      displayAnnoucement(AnnoucementData);
    })

  }
})



const archiveRef = databaseRef(db, 'Archived/Announcements');

const ArchivesButton = document.getElementById('Archives-Button');
ArchivesButton.addEventListener('click', ()=>{

  const search = document.getElementById('search');
  search.style.display = "none"

 const action= document.getElementById('action');
    action.style.width="15%";
    action.style.textAlign="";   
 

  onValue(archiveRef, (childSnapshot) => {
    const AnnoucementData = [];
    childSnapshot.forEach((childSnapshot) => {
      AnnoucementData.push(childSnapshot);
    })
    displayArchivedAnnoucement(AnnoucementData);
  })



});

//






async function displayArchivedAnnoucement(AnnoucementData) {
  const AnnouncementTable = document.getElementById('tableAnnouncementBody');
  AnnouncementTable.innerHTML = '';

  AnnoucementData.sort((a, b) => {
    const dateA = new Date(a.val().posted);
    const dateB = new Date(b.val().posted);
    return dateB - dateA; 
  });

  AnnoucementData.forEach((childSnapshot) => {
    const data = childSnapshot.val();
    const key = childSnapshot.key;
    const truncatedMsg = truncateText(data.msg, 30);
    const formattedDate = formatDate(data.posted);
    const newRow = document.createElement('tr');

    function truncateText(text, maxLength) {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
      }
      return text;
    }

    function formatDate(dateStr) {
      const options = { month: 'short', day: 'numeric', year: 'numeric' };
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', options);
    }

    newRow.innerHTML = `
        <td>${key}</td>
        <td>${data.title}</td>
        <td>${truncatedMsg}</td>
        <td>${formattedDate}</td>
        <td >
        
          <button class="final-buttons unarchive" data-archive-set="${key}">
            <img src="./assets/img/box-archive-solid.png" alt="" width="15" height="15"> Unarchive
          </button>
        </td>
      `;

    AnnouncementTable.appendChild(newRow);

  });
}

document.getElementById('tableAnnouncementBody').addEventListener('click',event =>{
  if(event.target.classList.contains('unarchive')) {
    const announcementId = event.target.getAttribute('data-archive-set')
 
      const AnnouncementRef = databaseRef(db,(`Archived/Announcements/${announcementId}`));

      get(AnnouncementRef).then((snapshot)=>{

        const data = snapshot.val();
        const image = data.image;
        const msg = data.msg;
        const posted = data.posted;
        const title = data.title;

        set(databaseRef(db,`Announcements/${announcementId}`),{
          image: image,
          msg: msg,
          posted: posted,
          title:title
        }).then(()=>{
          remove(databaseRef(db,`Archived/Announcements/${announcementId}`)).then(() =>{
            console.log('Announcement unarchived');
            alert('Announcement Successfully Unarchived!')
          }).catch((error)=>{
            console.error(error);
          })
        }).catch((error)=>{
          console.error(error);
        })

     


      }).catch((error)=>{
        console.error(error);

      })
  
    
  }
})

/*
function showModal(type, key) {
  if (type === 'editInfo') {
    const modal = document.getElementById('editInfo');
    modal.style.display = 'block';
    
    // Fetch and populate the announcement details
    fetchAnnouncementDetails(key);
  }
  // ... handle other modal types if needed ...
}

// Expose the function to the global scope
window.showModal = showModal;

Wrong implementation 

*/ 