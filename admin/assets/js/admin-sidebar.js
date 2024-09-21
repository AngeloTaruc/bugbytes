document.addEventListener('DOMContentLoaded', function() {
    fetch('../admin/includes/admin-sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidebar-placeholder').innerHTML = data;
        });
});

function confirmLogout() {
    var confirmation = confirm("Logout\nAre you sure you want to logout?");
    if (confirmation) {
        window.location.href = "http://127.0.0.1:5500/login-emp.html";
    }
}

var currentUrl = window.location.pathname;
var menuItems = document.querySelectorAll('.menu li a');

menuItems.forEach(function(item) {
    if (item.pathname === currentUrl) {
        item.parentNode.classList.add('active');
    }
});

document.querySelectorAll('.submenu-toggle').forEach(function(item) {
    item.addEventListener('click', function(event) {
        event.preventDefault();
        item.nextElementSibling.classList.toggle('submenu-open');
    });
});