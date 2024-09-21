import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, set, ref as databaseRef, get, onValue, push, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
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

const Donations = databaseRef(db, 'Donation');

onValue(Donations, (snapshot) => {
    const DonationData = []

    snapshot.forEach((childSnapshot) => {
        const DonateData = childSnapshot.val();
        if (DonateData.Mode === 'In-Kind') {
            DonationData.push(childSnapshot);
        }

    })
    DisplayInKindTotalDonation(DonationData);

})

function formatDate(rawDate) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const dateObj = new Date(rawDate);
    return dateObj.toLocaleDateString('en-US', options);
}

async function DisplayInKindTotalDonation(DonationData) {
    let totalAmount = 0;
    const InKindTableBody = document.getElementById('InKindTableBody');
    InKindTableBody.innerHTML = '';

    try {
        await DonationData.forEach((childSnapshot) => {
            const DonateData = childSnapshot.val();
            const formattedDate = formatDate(DonateData.DonateDate);
            const amount = DonateData.Amount;
            const Username = DonateData.Username || 'unknown'; // Fallback to 'unknown' if not found
            const mode = DonateData.Mode;
            const remarks = DonateData.Remarks;
            const donation = DonateData.Donation;
            totalAmount += parseInt(`${DonateData.Amount}`);

            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${formattedDate}</td>
                <td>${Username}</td>
                <td>${amount}</td>
            `;

            newRow.addEventListener('click', function () {
                // Check if a modal already exists, remove it before creating a new one
                const existingModal = document.getElementById('viewInfo');
                if (existingModal) {
                    document.body.removeChild(existingModal);
                }

                const modal = document.createElement('div');
                modal.id = 'viewInfo';
                modal.className = 'modal';
                modal.innerHTML = `
                    <div class="modal-content">
                        <span class="close">&times;</span>
                        <div class="donate--body">
                            <div class="donate--infos">
                                <div class="donate-info-row">
                                    <span class="donate-lbl">Name</span>
                                    <input type="text" class="donate-inputs" value="${Username}" readonly>
                                </div>
                                <div class="donate-info-row">
                                    <span class="donate-lbl">Amount</span>
                                    <input type="text" class="donate-inputs" value="${amount}" readonly>
                                </div>
                                <div class="donate-info-row">
                                    <span class="donate-lbl">Mode of Payment</span>
                                    <input type="text" class="donate-inputs" value="${mode}" readonly>
                                </div>
                                <div class="donate-info-row">
                                    <span class="donate-lbl">Proof of Donation</span>
                                    <img src="${donation}" class="donate-inputs-img" readonly>
                                </div>
                                <div class="donate-info-row">
                                    <span class="donate-lbl">Remarks</span>
                                    <input type="text" class="donate-inputs" value="${remarks}" readonly>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                document.body.appendChild(modal);
                modal.style.display = 'block';

                // Add event listener to close the modal
                const closeBtn = modal.querySelector('.close');
                closeBtn.addEventListener('click', () => {
                    modal.style.display = 'none';
                    document.body.removeChild(modal);
                });
            });

            InKindTableBody.appendChild(newRow);

            const TotalAmountMonetary = document.getElementById('TotalAmountInKind');
            TotalAmountMonetary.innerHTML = `Total Donation: ${totalAmount}`;
        });
    } catch (error) {
        console.log('Error', error);
    }
}


const DonationUserRef = databaseRef(db, 'Donation');
onValue(DonationUserRef, (snapshot) => {
    const DonationData = [];

    snapshot.forEach((childSnapshot) => {
        const DonateData = childSnapshot.val();

        // Check if the donation mode is 'Cash'
        if (DonateData.Mode === 'Cash') {
            console.log(DonateData); // Check if 'Username' exists in the console
            DonationData.push(childSnapshot);
        }
    });

    DisplayMonetaryAmount(DonationData);
});

async function DisplayMonetaryAmount(DonationData) {
    let totalAmount = 0;
    const InKindTableBody = document.getElementById('MonetaryTableBody');
    InKindTableBody.innerHTML = ''; // Clear the table

    try {
        DonationData.forEach((childSnapshot) => {
            const DonateData = childSnapshot.val();

            // Ensure Username exists and is retrieved correctly
            const Username = DonateData.Username || 'Unknown'; // Fallback to 'Unknown' if not found
            const formattedDate = formatDate(DonateData.DonateDate);
            const amount = DonateData.Amount;
            const mode = DonateData.Mode;
            const donation = DonateData.Donation;
            const remarks = DonateData.Remarks;

            totalAmount += parseInt(`${DonateData.Amount}`);

            const newRow = document.createElement('tr');
            newRow.innerHTML = `
            <td>${formattedDate}</td>
            <td>${Username}</td>
            <td>${amount}</td>
            `;

            newRow.addEventListener('click', function () {
                const existingModal = document.getElementById('viewInfo');
                if (existingModal) {
                    document.body.removeChild(existingModal);
                }

                const modal = document.createElement('div');
                modal.id = 'viewInfo';
                modal.className = 'modal';
                modal.innerHTML = `
          <div class="modal-content">
            <span class="close">&times;</span>
            <div class="donate--body">
              <div class="donate--infos">
                <div class="donate-info-row">
                  <span class="donate-lbl">Name</span>
                  <input type="text" class="donate-inputs" value="${Username}" readonly>
                </div>
                <div class="donate-info-row">
                  <span class="donate-lbl">Amount</span>
                  <input type="text" class="donate-inputs" value="${amount}" readonly>
                </div>
                <div class="donate-info-row">
                  <span class="donate-lbl">Mode of Payment</span>
                  <input type="text" class="donate-inputs" value="${mode}" readonly>
                </div>
                <div class="donate-info-row">
                  <span class="donate-lbl">Proof of Donation</span>
                  <img src="${donation}" class="donate-inputs-img" alt="Proof of Donation">
                </div>
                <div class="donate-info-row">
                  <span class="donate-lbl">Remarks</span>
                  <input type="text" class="donate-inputs" value="${remarks}" readonly>
                </div>
              </div>
            </div>
          </div>
        `;

                document.body.appendChild(modal);
                modal.style.display = 'block';

                const closeBtn = modal.querySelector('.close');
                closeBtn.addEventListener('click', () => {
                    modal.style.display = 'none';
                    document.body.removeChild(modal);
                });
            });

            InKindTableBody.appendChild(newRow);

            const TotalAmountMonetary = document.getElementById('TotalMonetary');
            TotalAmountMonetary.innerHTML = `Total Donation: ${totalAmount}`;
        });
    } catch (error) {
        console.log('Error:', error);
    }
}




document.addEventListener('DOMContentLoaded', () => {

    const MonetarySearch = document.getElementById('MonetarySearch');
    MonetarySearch.addEventListener('keydown', (event) => {

        if (event.keyCode === 13) {
            const searchValue = MonetarySearch.value;

            onValue(Donations, (snapshot) => {
                const DonationData = []

                snapshot.forEach((childSnapshot) => {
                    const DonateData = childSnapshot.val();
                    if (DonateData.Username === searchValue) {
                        DonationData.push(childSnapshot);
                    } else {
                        location.reload(true);
                    }

                })
                DisplayMonetaryAmount(DonationData);
            })
        }

    })
})



document.addEventListener('DOMContentLoaded', () => {

    const MonetarySearch = document.getElementById('searchInKind');
    MonetarySearch.addEventListener('keydown', (event) => {

        if (event.keyCode === 13) {
            const searchValue = MonetarySearch.value;

            onValue(Donations, (snapshot) => {
                const DonationData = []

                snapshot.forEach((childSnapshot) => {
                    const DonateData = childSnapshot.val();
                    if (DonateData.Username === searchValue) {
                        DonationData.push(childSnapshot);
                    } else {
                        location.reload(true);
                    }
                })
                DisplayInKindTotalDonation(DonationData);
            })
        }

    })
})

const PrintAllInKind = document.getElementById('PrintAllInKind');
PrintAllInKind.addEventListener('click', () => {

    const divContents = document.getElementById('printInKind').innerHTML;

    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>In Kind Donations </title>');
    printWindow.document.write('<style>table{width:100%;border-collapse:collapse;}th,td{border:1px solid #000;padding:8px;text-align:left;}th{background-color:#f2f2f2;}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(divContents);
    printWindow.document.write('</body></html>');

    printWindow.document.close();
    printWindow.print();

})

const PrintAllMonetary = document.getElementById('PrintAllMonetary');
PrintAllMonetary.addEventListener('click', () => {

    const divContents = document.getElementById('printMonetary').innerHTML;

    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>In Kind Donations </title>');
    printWindow.document.write('<style>table{width:100%;border-collapse:collapse;}th,td{border:1px solid #000;padding:8px;text-align:left;}th{background-color:#f2f2f2;}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(divContents);
    printWindow.document.write('</body></html>');

    printWindow.document.close();
    printWindow.print();




});








