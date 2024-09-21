import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref as databaseRef, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


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
    let totalInKindDonations = 0;
    let totalMonetaryDonations = 0;

    snapshot.forEach((childSnapshot) => {
        const DonateData = childSnapshot.val();
        const amount = parseInt(DonateData.Amount) || 0;

        if (DonateData.Mode === 'In-Kind') {
            totalInKindDonations += amount;
        } else if (DonateData.Mode === 'Cash') {
            totalMonetaryDonations += amount;
        }
    });

    updateDonationDisplay(totalMonetaryDonations, totalInKindDonations);
});

function updateDonationDisplay(monetaryTotal, inKindTotal) {
    const monetaryElement = document.getElementById('Tmoney');
    const inKindElement = document.getElementById('Tinkind');

    if (monetaryElement) {
        monetaryElement.textContent = `P ${monetaryTotal.toLocaleString()}`;
    }

    if (inKindElement) {
        inKindElement.textContent = `P ${inKindTotal.toLocaleString()}`;
    }
}


const Rescues = databaseRef(db, 'Pets');

onValue(Rescues, (snapshot) => {
    let totalRescues = 0;
    let totalAvailable = 0;
    let totalAdopted = 0;

    snapshot.forEach((childSnapshot) => {
        const RescueData = childSnapshot.val();

        // Count total rescues
        totalRescues++;

        // Check if the pet has been adopted
        if (RescueData.Status === 'Adopted') {
            totalAdopted++;
        }

        // Check if the pet is available
        if (RescueData.Status === 'Available') {
            totalAvailable++;
        }
    });

    // Update the display for rescues, available, and adopted pets
    updateRescueDisplay(totalRescues, totalAdopted, totalAvailable);
});

// Make sure to accept totalAvailable as a parameter
function updateRescueDisplay(totalRescues, totalAdopted, totalAvailable) {
    const rescuesElement = document.getElementById('Trescues');
    const availableElement = document.getElementById('Tavailable');
    const adoptedElement = document.getElementById('Tadopted');

    rescuesElement.textContent = totalRescues;
    adoptedElement.textContent = totalAdopted;
    availableElement.textContent = totalAvailable;  // This is where the error was
}





// CHART

const Applicants = databaseRef(db, 'Adoption_Applicants');

// Function to get the adoption applications grouped by month
async function getApplicationByMonth() {
    const snapshot = await new Promise((resolve) => onValue(Applicants, resolve));
    const applicants = snapshot.val();
    const applicationData = {};

    // Loop through the applicants to collect the count of applications per month
    for (let key in applicants) {
        const applicant = applicants[key];
        const status = applicant.Status;

        // Only consider applications with these statuses
        if (status === 'Under Review' || status === 'For Interview' || status === 'Done Interview' || status === 'Accepted' || status === 'Rejected') {
            const applicationDate = new Date(applicant.Application_Date);
            const month = applicationDate.getMonth(); // Get month as 0 (Jan) to 11 (Dec)
            
            if (applicationData[month]) {
                applicationData[month]++;
            } else {
                applicationData[month] = 1;
            }
        }
    }
    return applicationData;
}

async function prepareChartData() {
    const applicationData = await getApplicationByMonth();
    console.log("Fetched application data: ", applicationData); // Debugging

    // Initialize months from January until the current month (inclusive)
    const currentMonth = new Date().getMonth(); // Current month (0 = Jan, 8 = Sep for September)
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const months = monthNames.slice(0, currentMonth + 1); // From Jan to the current month

    // Prepare application counts for each month
    const applicationCounts = months.map((_, index) => applicationData[index] || 0);

    generateApplicationChart(months, applicationCounts);
}

// Function to generate the chart using Chart.js
function generateApplicationChart(months, applicationCounts) {
    const ctx = document.getElementById('adoptionChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,  // X-axis labels
            datasets: [{
                label: 'Adoption Applications per Month',
                data: applicationCounts,  // Data points
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Prepare chart when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    prepareChartData();
});



function getLocalDate() {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().split('T')[0];  // Return date in YYYY-MM-DD format
}

function getTodaysInterviews() {
    const today = getLocalDate();  // Use local date instead of UTC date
    console.log("Today's Date (Local Timezone): ", today);  // Debugging

    onValue(Applicants, (snapshot) => {
        const applicants = snapshot.val();
        const todayInterviews = [];

        if (!applicants) {
            console.log("No applicants found.");
            return;
        }

        // Loop through all applicants
        for (let key in applicants) {
            const applicant = applicants[key];

            // Debugging: Log the applicant's Available_Date and Status
            console.log(`Applicant Available Date: ${applicant.Available_Date}, Status: ${applicant.Status}`);

            // Check if interview is scheduled for today based on 'Available_Date'
            if (applicant.Available_Date === today) {
                const userId = applicant.UserId || null; // Get the userId from the applicant object

                if (userId) {
                    // Fetch the username based on the userId
                    getUsernameByUserId(userId, (username) => {
                        todayInterviews.push({
                            name: username || 'No Name',  // Use the fetched username
                            time: applicant.Available_Time || 'No Time', // Use 'Available_Time' as the interview time
                            link: applicant.MeetLink || 'No Link Yet' // Use 'MeetLink' for the interview link
                        });

                        // Debugging: Check if interviews are being updated
                        console.log("Today's Interviews Array: ", todayInterviews);

                        // Update the table after fetching the name
                        updateInterviewTable(todayInterviews);
                    });
                }
            }
        }
    });
}


// Function to get the username by UserId
function getUsernameByUserId(userId, callback) {
    const userRef = databaseRef(db, `Users/${userId}`); // Reference to the user node based on the userId

    onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        if (userData) {
            const username = userData.username || 'Unknown User'; // Access the username field
            console.log(`Fetched Username for UserId ${userId}: ${username}`);
            callback(username); // Return the username via callback
        } else {
            console.log(`User not found for UserId: ${userId}`);
            callback('Unknown User'); // If user not found, return 'Unknown User'
        }
    }, (error) => {
        console.error('Error fetching user data:', error);
        callback('Unknown User'); // Return 'Unknown User' in case of error
    });
}


function updateInterviewTable(interviews) {
    const tableBody = document.querySelector('.today--interview tbody');

    // Clear the current rows
    tableBody.innerHTML = '';

    if (interviews.length > 0) {
        // Populate the table with today's interviews
        interviews.forEach(interview => {
            const row = document.createElement('tr');
            const linkCell = interview.link === 'No Link Yet' 
                ? `<td>${interview.link}</td>` 
                : `<td><a href="${interview.link}" target="_blank">${interview.link}</a></td>`; // Add anchor tag for valid link
            
            row.innerHTML = `
                <td>${interview.name}</td>
                <td>${interview.time}</td>
                ${linkCell}
            `;
            tableBody.appendChild(row);
        });
    } else {
        // If no interviews are scheduled for today, show a default message
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="3">No interviews scheduled for today</td> <!-- Updated colspan to 3 -->
        `;
        tableBody.appendChild(row);
    }
}


// Call the function to get today's interviews when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    getTodaysInterviews();
});
