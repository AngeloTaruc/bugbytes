import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, set, ref as databaseRef, get, onValue, push, update,remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
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


  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  const storage = getStorage(app);

  const MerchRef = databaseRef(db,'Merchandise');

  async function PushMerchandise(){

    const merchName = document.getElementById('merchName');
    const merchLink = document.getElementById('merchLink');
    const merchMsg = document.getElementById('merchMsg');
    const merchPhoto = document.getElementById('merchPhoto');

    const MerchNamePhoto = merchPhoto.files[0];

    const UniqueId = Date.now().toString();

    try{

        const snapShotUpload = await storageRef(storage, 'Photo/Mechadise/' + MerchNamePhoto.name);
        const uploadsnapshot = await uploadBytes(snapShotUpload,MerchNamePhoto);
        const getUrlSnapshot = await getDownloadURL(uploadsnapshot.ref);


        set(databaseRef(db,`Merchandise/${UniqueId}`),{
            MerchName: merchName.value,
            MerchLink: merchLink.value,
            MerchMsg: merchMsg,
            MerchPhoto:getUrlSnapshot 

        }).then(()=>{
            alert('Merchandise Added Successfully')

             // Hide the modal
            const addModal = document.getElementById('addModal');
            addModal.style.display = 'none';
            
            // Reset fields
            merchName.value = '';
            merchLink.value = '';
            merchMsg.value = '';
            merchPhoto.value = '';

        }).catch((error)=>{
            alert(error.message);
        })

    }catch(error){
        console.log(error.message);
    }

  }

  //push

  const buttonAdd = document.getElementById('submit');
  buttonAdd.addEventListener('click',PushMerchandise);

  //Display merchadise
  onValue(MerchRef, (snapshot) => {
    const merchData = [];
    snapshot.forEach((childSnapshot) => {
        merchData.push(childSnapshot);
    });
    DisplayMerchadise(merchData);
});

function DisplayMerchadise(merchData) {
    const MerchadiseTableBody = document.getElementById('MerchadiseTableBody');
    MerchadiseTableBody.innerHTML = '';

    merchData.map((childSnapshot) => {
        const MerchData = childSnapshot.val();
        const merchKey = childSnapshot.key;
        const merchPhoto = MerchData.MerchPhoto;
        const merchName = MerchData?.MerchName || 'N/A';
        const merchLink = MerchData?.MerchLink || 'N/A';

        const formattedLink  = merchLink.startsWith('http://') 
        || merchLink.startsWith('https://')
        ? merchLink : `http://${merchLink}`
 
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
        <td>${merchKey}</td>
        <td>${merchName}</td>
        <td><img src="${merchPhoto}" alt="${merchName}" style="max-width: 100px; max-height: 100px;"></td>
        <td><a href="${formattedLink}" class="merch-link" target="_blank">${merchLink}</a></td>
        <td>
            <div class="d-flex justify-content-end action-btns">
            <button class="final-buttons mr-2 edit" edit-data-set="${merchKey}"s>
                <img src="./assets/img/pen-to-square-solid.png" alt="" width="15" height="15"> Edit
            </button>
            <button class="final-buttons archive" data-set="${merchKey}">
                <img src="./assets/img/box-archive-solid.png" alt="" width="15" height="15"> Archive
            </button>
            </div>
        </td>
        `;
        MerchadiseTableBody.appendChild(newRow);
    });
}

const MerchadiseTableBody = document.getElementById('MerchadiseTableBody');
MerchadiseTableBody.addEventListener('click',(event)=>{
    if(event.target.classList.contains('archive')){
        const key = event.target.getAttribute('data-set');

        const RemovekeyRef = databaseRef(db,`Merchandise/${key}`);
        const keyRef = databaseRef(db,`Archived/Merchandise/${key}`);


      get(RemovekeyRef).then((snapshot)=>{
        if(snapshot.exists()){
            const MerchKey = snapshot.val();


            const merchPhoto = MerchKey.MerchPhoto;
            const merchName = MerchKey?.MerchName || 'N/A';
            const merchLink = MerchKey?.MerchLink || 'N/A';

            set(keyRef,{

                MerchLink:merchLink,
                MerchName:merchName,
                MerchPhoto:merchPhoto
                
            }).then(()=>{
                remove(RemovekeyRef).then(()=>{
                    console.log('Archived Successfully');
                    alert('Merchandise Archived Successfully');
                }).catch((error)=>{
                    console.error(error);
                })

            }).catch((error)=>{
                console.error(error);

            })
        }
      }).catch((error)=>{
        console.error(error.message);
      })

    }else if (event.target.classList.contains('edit')){
        const key = event.target.getAttribute('edit-data-set');

        const viewInfo = document.getElementById('viewInfo');
        viewInfo.style.display = "block";

        
        const editbtn = document.getElementById('editbtn');
        editbtn.setAttribute('EditMerch', key);


        
       

    }
})

const editbtn = document.getElementById('editbtn');
editbtn.addEventListener('click',async (event)=>{

    try{
        const merchKey = event.target.getAttribute('EditMerch');
    

        const NewMerchname = document.getElementById('EditmerchName').value;
        const NewPhoto = document.getElementById('EditPhoto');
        const NewLink = document.getElementById('EditmerchMsg').value;
        
        const EditUpload = NewPhoto.files[0];
    
        const newUploadStorage = storageRef(storage, 'Photos/Mechandise' + EditUpload?.name);

        
        if(!EditUpload){

            await update(databaseRef(db,`Merchandise/${merchKey}`),{
                MerchName: NewMerchname,
                MerchLink:NewLink
            }).then(()=>{
                console.log('updated')
                const viewInfo = document.getElementById('viewInfo');
                viewInfo.style.display = "none";

            }).catch((error)=>{
                console.error(error);
            })
            

        }else{

            const uploadSnapShot = await uploadBytes(newUploadStorage,EditUpload);
            const ProgramUrl = await getDownloadURL(uploadSnapShot.ref);
            await update(databaseRef(db,`Merchandise/${merchKey}`),{
                MerchName: NewMerchname,
                MerchPhoto: ProgramUrl,
                MerchLink: NewLink


            }).then(()=>{
                alert('Merchandise Updated');

                const viewInfo = document.getElementById('viewInfo');
                viewInfo.style.display = "none";

                location.reload(true);

            }).catch((error)=>{
                console.log(error.message);
            });
            


        }


    }catch(error){
        console.error(error.message);
    }

})







document.addEventListener('DOMContentLoaded',()=>{
    const inputElement = document.getElementById('search');
    inputElement.addEventListener('keydown',(event) =>{
        if(event.keyCode === 13){
            const searchinput = inputElement.value;

            onValue(MerchRef,(snapshot)=>{
                const merchData = [];
                snapshot.forEach((childSnapshot) => {
                    const DataMerch = childSnapshot.val();
                    if(DataMerch.MerchName === searchinput){
                        merchData.push(childSnapshot);
                    }else if (!searchinput){
                        location.reload(true);
                    }
                 
                    });
                    DisplayMerchadise(merchData)
            })
        }
    })


})


const archiveRef = databaseRef(db, 'Archived/Merchandise');

const ArchivesButton = document.getElementById('Archives');
ArchivesButton.addEventListener('click', ()=>{

  const search = document.getElementById('search');
  search.style.display = "none"
 

  const merchData = [];
  onValue(archiveRef,(snapshot)=>{
    snapshot.forEach((childSnapshot) => {
        merchData.push(childSnapshot);
    });
    ArchivesMerchandise(merchData);
  })


});


async function ArchivesMerchandise (merchData){
    const MerchadiseTableBody = document.getElementById('MerchadiseTableBody');
    MerchadiseTableBody.innerHTML = '';

    merchData.map((childSnapshot) => {
        const MerchData = childSnapshot.val();
        const merchKey = childSnapshot.key;
        const merchPhoto = MerchData.MerchPhoto;
        const merchName = MerchData?.MerchName || 'N/A';
        const merchLink = MerchData?.MerchLink || 'N/A';

        const formattedLink  = merchLink.startsWith('http://') 
        || merchLink.startsWith('https://')
        ? merchLink : `http://${merchLink}`
 
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
        <td>${merchKey}</td>
        <td>${merchName}</td>
        <td><img src="${merchPhoto}" alt="${merchName}" style="max-width: 100px; max-height: 100px;"></td>
        <td><a href="${formattedLink}" class="merch-link" target="_blank">${merchLink}</a></td>
        <td>
            <div class="d-flex justify-content-end action-btns">
           
            <button class="final-buttons unarchive" data-archived-set="${merchKey}">
                <img src="./assets/img/box-archive-solid.png" alt="" width="15" height="15"> Unarchive
            </button>
            </div>
        </td>
        `;
        MerchadiseTableBody.appendChild(newRow);
    });


}


document.getElementById('MerchadiseTableBody').addEventListener('click', event =>{

    if(event.target.classList.contains('unarchive')){
        const merchKey = event.target.getAttribute('data-archived-set');



        const merchref = databaseRef(db,(`Archived/Merchandise/${merchKey}`))
        get(merchref).then((snapshot)=>{

             const data = snapshot.val();
             
              const merchLink = data.MerchLink;
              const merchName = data.MerchName;
              const merchPhoto = data.MerchPhoto;
             
              
              set(databaseRef(db,`Merchandise/${merchKey}`),{
                MerchLink: merchLink,
                MerchName: merchName,
                MerchPhoto: merchPhoto
              }).then(()=>{

                remove(merchref).then(()=>{
                    console.log('Merchandise unarchived')

                }).catch((error)=>{
                    console.error(error);
                })
              }).catch((error)=>{
                console.error(error);
              })



        })
    }




})