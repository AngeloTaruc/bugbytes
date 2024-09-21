document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('abtMe-modal');
    const modalImage = document.getElementById('abtMe-modal-image');
    const modalName = document.getElementById('abtMe-modal-name');
    const modalGender = document.getElementById('abtMe-modal-gender');
    const modalAge = document.getElementById('abtMe-modal-age');
    const modalColour = document.getElementById('abtMe-modal-colour');
    const modalDescription = document.getElementById('abtMe-modal-description');
    const closeBtn = modal.querySelector('.abtMe-close');

    function openModal(petData) {
        modalImage.src = petData.image;
        modalName.textContent = petData.name;
        modalGender.textContent = petData.gender;
        modalAge.textContent = petData.age;
        modalColour.textContent = petData.colour;
        modalDescription.textContent = petData.description;
        modal.style.display = 'block';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    document.querySelectorAll('.abtMe-btn').forEach(button => {
        button.addEventListener('click', function() {
            const petData = {
                name: 'Polly',
                image: './assets/img/logo.png',
                gender: 'Female',
                age: 'Approximately 2 years old',
                colour: 'Brown',
                description: 'lorem ipsum,.....'
            };
            openModal(petData);
        });
    });

    closeBtn.addEventListener('click', closeModal);

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
});