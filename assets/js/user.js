document.addEventListener('DOMContentLoaded', function () {
    var menuItems = document.querySelectorAll('.menu li a');
    var sections = document.querySelectorAll('.content-section');
    var sidebarToggle = document.getElementById('sidebar-toggle');
    var sidebar = document.getElementById('sidebar');

    function setActiveMenuItem() {
        var currentHash = window.location.hash || '#home';

        menuItems.forEach(function (item) {
            item.parentNode.classList.remove('active');
            if (item.getAttribute('href') === currentHash) {
                item.parentNode.classList.add('active');
            }
        });

        sections.forEach(function (section) {
            section.style.display = 'none';
        });
        var activeSection = document.querySelector(currentHash);
        if (activeSection) {
            activeSection.style.display = 'block';
        } else if (currentHash === '#home' || currentHash === '') {
            document.querySelector('#home').style.display = 'block';
        }
    }

    setActiveMenuItem();

    menuItems.forEach(function (item) {
        item.addEventListener('click', function (event) {
            event.preventDefault();
            menuItems.forEach(function (menuItem) {
                menuItem.parentNode.classList.remove('active');
            });
            this.parentNode.classList.add('active');
            var targetHash = this.getAttribute('href');
            history.pushState(null, '', targetHash);
            setActiveMenuItem();

            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });

    window.addEventListener('hashchange', setActiveMenuItem);

    document.querySelectorAll('.submenu-toggle').forEach(function (item) {
        item.addEventListener('click', function (event) {
            event.preventDefault();
            item.nextElementSibling.classList.toggle('submenu-open');
        });
    });

    sidebarToggle.addEventListener('click', function () {
        sidebar.classList.toggle('active');
    });

    document.addEventListener('click', function (event) {
        var isClickInsideSidebar = sidebar.contains(event.target);
        var isClickOnToggleButton = sidebarToggle.contains(event.target);

        if (!isClickInsideSidebar && !isClickOnToggleButton && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    });

    sidebarToggle.addEventListener('click', function () {
        if (window.innerWidth <= 768) {
            if (sidebar.classList.contains('active')) {
                sidebar.style.top = '-100%';
                setTimeout(() => {
                    sidebar.classList.remove('active');
                }, 300);
            } else {
                sidebar.classList.add('active');
                setTimeout(() => {
                    sidebar.style.top = '40px';
                }, 10);
            }
        } else {
            sidebar.classList.toggle('active');
        }
    });

    function handleResize() {
        if (window.innerWidth > 768) {
            sidebar.style.top = '0';
            sidebar.classList.remove('active');
        } else if (!sidebar.classList.contains('active')) {
            sidebar.style.top = '-100%';
        }
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    const listItems = document.querySelectorAll('.list-item');
    const contentDivs = document.querySelectorAll('.list-content');

    function setActiveTab(targetId) {
        contentDivs.forEach(div => {
            div.style.display = 'none';
        });
        document.getElementById(targetId).style.display = 'block';

        listItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-target') === targetId) {
                item.classList.add('active');
            }
        });

        localStorage.setItem('activeTab', targetId);
    }

    const savedTab = localStorage.getItem('activeTab');
    if (savedTab) {
        setActiveTab(savedTab);
    } else {
        const firstTabId = listItems[0].getAttribute('data-target');
        setActiveTab(firstTabId);
    }

    listItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');
            setActiveTab(targetId);
        });
    });

    // donation
    document.getElementById('donate-button').addEventListener('click', function () {
        document.getElementById('initial-donation').style.display = 'none';
        document.getElementById('viewDonationForm').style.display = 'block';
    });

    function closeDonationForm() {
        document.getElementById('initial-donation').style.display = 'block';
        document.getElementById('viewDonationForm').style.display = 'none';
    }

    document.querySelector('.back-btn').addEventListener('click', closeDonationForm);
});

// programs and announcements
function openNotification(notification) {
    var progAnnContents = notification.parentNode;
    progAnnContents.style.display = "none";
    var notificationContent = progAnnContents.nextElementSibling;
    notificationContent.style.display = "block";

    localStorage.setItem('notificationOpen', 'true');
}

function closeNotification(event) {
    var backButton = event.target;
    var notificationContent = backButton.closest('.notification-content');
    notificationContent.style.display = "none";
    var progAnnContents = notificationContent.previousElementSibling;
    progAnnContents.style.display = "block";

    localStorage.removeItem('notificationOpen');
}

function closeNotification() {
    document.querySelectorAll('.notification-content').forEach(function (content) {
        content.style.display = 'none';
    });
    document.querySelectorAll('.prog-ann-contents').forEach(function (content) {
        content.style.display = 'block';
    });

    localStorage.removeItem('notificationOpen');
}

document.querySelectorAll('.sidebar a').forEach(function (link) {
    link.addEventListener('click', function () {
        closeNotification();
    });
});

window.addEventListener('load', function () {
    if (localStorage.getItem('notificationOpen') === 'true') {
        document.querySelectorAll('.prog-ann-contents').forEach(function (content) {
            content.style.display = 'none';
        });
        document.querySelectorAll('.notification-content').forEach(function (content) {
            content.style.display = 'block';
        });
    } else {
        document.querySelectorAll('.notification-content').forEach(function (content) {
            content.style.display = 'none';
        });
        document.querySelectorAll('.prog-ann-contents').forEach(function (content) {
            content.style.display = 'block';
        });
    }
});

// view pet == about me button
document.getElementById('viewPet-btn').addEventListener('click', function () {
    document.getElementById('viewPet-container').style.display = 'block';
    document.getElementById('adoptPet-container').style.display = 'none';
});

function closeViewPet() {
    document.getElementById('viewPet-container').style.display = 'none';
    document.getElementById('adoptPet-container').style.display = 'grid';
}

// applciation form == adopt me button
document.getElementById('adoptMe-btn').addEventListener('click', function () {
    document.getElementById('viewPet-container').style.display = 'none';
    document.getElementById('viewAdoptionForm-container').style.display = 'block';
});

function closeAdoptionForm() {
    document.getElementById('viewAdoptionForm-container').style.display = 'none';
    document.getElementById('viewPet-container').style.display = 'block';
}