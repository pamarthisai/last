document.addEventListener('DOMContentLoaded', () => {
    const videoButton = document.getElementById('video-btn');
    
    if (videoButton) {
        videoButton.addEventListener('click', () => {
            window.location.href = '/video';
        });
    }
});
