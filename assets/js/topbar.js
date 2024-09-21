// navbar toggle
const navbarToggle = navbar.querySelector("#navbar-toggle");
const navbarMenu = document.querySelector("#navbar-menu");
const navbarLinksContainer = navbarMenu.querySelector(".navbar-links");
let isNavbarExpanded = navbarToggle.getAttribute("aria-expanded") === "true";

const toggleNavbarVisibility = () => {
    isNavbarExpanded = !isNavbarExpanded;
    navbarToggle.setAttribute("aria-expanded", isNavbarExpanded);
};

navbarToggle.addEventListener("click", toggleNavbarVisibility);

navbarLinksContainer.addEventListener("click", (e) => e.stopPropagation());
navbarMenu.addEventListener("click", toggleNavbarVisibility);


// NAVBAR PAGES LOL
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.navbar-link');

function showSection(sectionId) {
    sections.forEach((section) => {
        section.style.display = 'none';
    });
    const targetSection = document.querySelector(`#${sectionId}`);
    if (targetSection) {
        targetSection.style.display = 'block';
        localStorage.setItem('currentSection', sectionId);

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
        const href = e.target.getAttribute('href');
        if (href === 'roles.html') {
            return;
        }
        e.preventDefault();
        const targetSectionId = href.substring(1);
        showSection(targetSectionId);
    });
});

const savedSection = localStorage.getItem('currentSection');
if (savedSection) {
    showSection(savedSection);
} else {
    showSection('home');
}


// contact us 
var modal = document.getElementById("contactModal");
var btn = document.querySelector(".git-contactus");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function () {
    modal.style.display = "block";
}

span.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// volunteer 
document.addEventListener('DOMContentLoaded', (event) => {
    const openPopup = document.getElementById('open-popup');
    const closePopup = document.getElementById('close-popup');
    const popupBox = document.getElementById('popup-box');

    openPopup.addEventListener('click', function (event) {
        event.preventDefault();
        popupBox.style.display = 'flex';
    });

    closePopup.addEventListener('click', function () {
        popupBox.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target == popupBox) {
            popupBox.style.display = 'none';
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {

    // merch
    const exploreButton = document.querySelector('.mod-button-merch');
    const merchandiseSection = document.getElementById('merchandise-section');

    exploreButton.addEventListener('click', function (e) {
        e.preventDefault();
        merchandiseSection.scrollIntoView({
            behavior: 'smooth'
        });
    });

    
    // donate 
    const donateNowBtn = document.getElementById('donateNowBtn');
    const sponsorDonationContent = document.getElementById('sponsorDonationContent');

    donateNowBtn.addEventListener('click', function () {
        sponsorDonationContent.scrollIntoView({ behavior: 'smooth' });
    });


    // i want to help
    const helpButton = document.querySelector('.mod-button');
    const helpContainer = document.querySelector('.home-help-container');

    helpButton.addEventListener('click', () => {
        helpContainer.scrollIntoView({ behavior: 'smooth' });
    });
});