function closeModal(modalId) {
    console.log(`Closing modal: ${modalId}`);
    document.getElementById(modalId).style.display = 'none';
}

function showAddModal() {
    console.log('Showing add modal');
    document.getElementById('addModal').style.display = 'block';
}

function showInfo() {
    console.log('Showing info modal');
    document.getElementById('viewInfo').style.display = 'block';
}

function editModal() {
    console.log('Showing edit modal');
    document.getElementById('editInfo').style.display = 'block';
}


window.onclick = function(event) {
    var modals = ['addModal', 'viewInfo', 'editInfo'];
    modals.forEach(function(modalId) {
        var modal = document.getElementById(modalId);
        if (modal && event.target == modal) {
            console.log(`Closing modal due to outside click: ${modalId}`);
            modal.style.display = 'none';
        }
    });
}

function showAddTimeslot() {
    console.log('Showing add modal');
    document.getElementById('addTimeslotModal').style.display = 'block';
}

// for adoption applications
function showForm() {
    document.getElementById('applicationsTable').style.display = 'none';
    document.getElementById('viewForm').style.display = 'block';
}

function hideForm() {
    document.getElementById('applicationsTable').style.display = 'block';
    document.getElementById('viewForm').style.display = 'none';
}


//  for programs tabs
document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('.prog-tab');
    const tabContents = document.querySelectorAll('.table-container > div');

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.style.display = 'none');

            tab.classList.add('active');
            tabContents[index].style.display = 'block';
        });
    });

    tabs[0].classList.add('active');
    tabContents[0].style.display = 'block';
});

// for adoption applications tabs
document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('.tab');
    const tableRows = document.querySelectorAll('tbody tr');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const status = tab.getAttribute('data-status');

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            tableRows.forEach(row => {
                const rowStatus = row.cells[2].textContent;
                if (status === 'all' || rowStatus === status) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    });

    tabs[0].classList.add('active');
    tableRows.forEach(row => row.style.display = '');
});

// EDIT announcemetns 
  function openModal(editInfo) {
    const modal = document.getElementById(editInfo);
    modal.style.display = "block";
  }

  function closeModal(editInfo) {
    const modal = document.getElementById(editInfo);
    modal.style.display = "none";
  }