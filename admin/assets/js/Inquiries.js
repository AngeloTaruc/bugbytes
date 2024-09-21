import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { ref as databaseRef, getDatabase, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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

const InquiriesRef = databaseRef(db, 'CustomerForms');

onValue(InquiriesRef, (snapshot) => {
    console.log("Fetching CustomerForms data...");
    const inquiriesData = [];

    if (snapshot.exists()) {
        console.log("CustomerForms data found");
        snapshot.forEach((childSnapshot) => {
            const DataInquiries = childSnapshot.val();
            console.log("Inquiry data:", DataInquiries);
            inquiriesData.push({ key: childSnapshot.key, ...DataInquiries });
        });
        console.log("Total inquiries:", inquiriesData.length);
        displayInquiries(inquiriesData);
    } else {
        console.log("No CustomerForms data found");
        displayNoInquiriesMessage();
    }
}, (error) => {
    console.error("Error fetching CustomerForms:", error);
    displayErrorMessage(error);
});

function displayNoInquiriesMessage() {
    const InquiriesTable = document.getElementById('InquiriesTable');
    InquiriesTable.innerHTML = '<tr><td colspan="5">No inquiries found.</td></tr>';
}

function displayErrorMessage(error) {
    const InquiriesTable = document.getElementById('InquiriesTable');
    InquiriesTable.innerHTML = `<tr><td colspan="5">Error fetching inquiries: ${error.message}</td></tr>`;
}

function displayInquiries(inquiriesData) {
    console.log("Displaying inquiries...");
    const InquiriesTable = document.getElementById('InquiriesTable');
    InquiriesTable.innerHTML = '';

    if (inquiriesData.length === 0) {
        InquiriesTable.innerHTML = '<tr><td colspan="5">No pending inquiries found.</td></tr>';
        return;
    }

    inquiriesData.forEach((inquiry) => {
        console.log("Processing inquiry:", inquiry);
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${inquiry.submissionDate ? formatDate(inquiry.submissionDate) : 'N/A'}</td>
            <td>${inquiry.subject || 'N/A'}</td>
            <td style="color:green; font-weight:600;">${inquiry.status || 'N/A'}</td>
            <td>
                <button class="vol-actions" onclick="showViewModal('${inquiry.key}')">
                    <img src="./assets/img/eye-solid.png" alt="View" height="15" width="15" /> View
                </button>
            </td>
            <td>
                <button class="vol-actions" onclick="showModal('reply', '${inquiry.key}')">
                    <img src="../admin/assets/img/thumbs-up-regular.png" alt="Reply" height="15" width="15" /> Reply
                </button>
            </td>
        `;
        InquiriesTable.appendChild(newRow);
    });
}


function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}


// Function to show the view modal
function showViewModal(inquiryKey) {
    const modal = document.getElementById('viewModal');
    modal.style.display = 'block';
    
    // Fetch and display inquiry details
    fetchInquiryDetails(inquiryKey);
}

// Function to close the view modal
function closeViewModal() {
    const modal = document.getElementById('viewModal');
    modal.style.display = 'none';
}

// Function to fetch inquiry details
function fetchInquiryDetails(inquiryKey) {
    console.log("Fetching details for inquiry:", inquiryKey);
    const inquiryRef = databaseRef(db, `CustomerForms/${inquiryKey}`);

    onValue(inquiryRef, (snapshot) => {
        const inquiryData = snapshot.val();
        console.log("Fetched inquiry data:", inquiryData);
        if (inquiryData) {
            const inquiryDetails = {
                senderName: inquiryData.name || 'N/A',
                subject: inquiryData.subject || 'N/A',
                message: inquiryData.message || 'N/A',
                email: inquiryData.email || 'N/A',
                status: inquiryData.status || 'N/A',
                submissionDate: inquiryData.submissionDate ? formatDate(inquiryData.submissionDate) : 'N/A'
            };
            console.log("Processed inquiry details:", inquiryDetails);
            displayInquiryDetails(inquiryDetails);
        } else {
            console.error('Inquiry not found for key:', inquiryKey);
            closeViewModal();
            alert('Inquiry details not found.');
        }
    }, (error) => {
        console.error('Error fetching inquiry details:', error);
        closeViewModal();
        alert('Error fetching inquiry details. Please try again.');
    });
}

function displayInquiryDetails(details) {
    console.log("Displaying inquiry details:", details);
    document.getElementById('senderName').textContent = details.senderName;
    document.getElementById('inquirySubject').textContent = details.subject;
    document.getElementById('inquiryMessage').textContent = details.message;
    document.getElementById('inquiryEmail').textContent = details.email;
    document.getElementById('inquiryStatus').textContent = details.status;
    document.getElementById('inquiryDate').textContent = details.submissionDate;
}

// Function to show the reply modal
function showModal(type, inquiryKey) {
    if (type === 'reply') {
        const modal = document.getElementById('replyModal');
        modal.style.display = 'block';
        
        // Store the inquiryKey in a data attribute of the form for use when sending the reply
        document.getElementById('replyForm').setAttribute('data-inquiry-key', inquiryKey);
    }
}

// Function to close the reply modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

// Function to send reply email (you'll need to implement this)
function sendReplyEmail() {
    let params = {
        name : document.getElementById().value,
    }


    // const replyContent = document.getElementById('replyContent').value;
    // const inquiryKey = document.getElementById('replyForm').getAttribute('data-inquiry-key');
    
    // sendReply(inquiryKey, replyContent).then(() => {
    //     closeModal('replyModal');
    //     alert('sent!')
    // });
}

// Add event listeners to close buttons
document.querySelectorAll('.close').forEach(closeButton => {
    closeButton.addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';
    });
});


window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Expose necessary functions to global scope
window.showViewModal = showViewModal;
window.showModal = showModal;
window.closeViewModal = closeViewModal;
window.closeModal = closeModal;
window.sendReplyEmail = sendReplyEmail;