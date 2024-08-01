document.addEventListener('DOMContentLoaded', () => {
    const landingButton = document.getElementById('landing-btn');
    
    if (landingButton) {
        landingButton.addEventListener('click', () => {
            window.location.href = '/';
        });
    }
});
