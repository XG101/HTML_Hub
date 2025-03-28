//This is from Max's Code for forms
    function dispTxt(){
        document.getElementById("output").textContent = "Recieved, Thank You for filling out the form."
    }

    function playdrums(){
        document.getElementById("badum").play();
    }


    function scrollToRSVP() {
        document.getElementById("RSVP").scrollIntoView({ behavior: 'smooth' });
    }


    function scrollToSection() {
        document.getElementById("YT").scrollIntoView({ behavior: 'smooth' });
    }

    function scrollToSection() {
        document.getElementById("badum").scrollIntoView({ behavior: 'smooth' });
    }
    function toggleMute() 
    {
    var video = document.getElementById("video");
    video.muted = !video.muted;
    }

    document.addEventListener("DOMContentLoaded", function () {
        let currentIndex = localStorage.getItem('currentIndex') ? parseInt(localStorage.getItem('currentIndex')) : 0; // Get saved index from localStorage, default to 0 if not found
        let videoElement = document.getElementById("video");
        let videoContainer = document.getElementById("videoContainer");
        let mediaContainer = document.getElementById("imageContainer");
    
        // Fetch the media.json file and load the images and videos
        fetch('media.json')
            .then(response => response.json())
            .then(data => {
                console.log(data); // Log the data to check its structure
    
                if (!data.myDiffVideos || data.myDiffVideos.length === 0) {
                    console.error("No images or videos found in media.json");
                    return;
                }
    
                // Loop through the data and populate the media container
                data.myDiffVideos.forEach((item, index) => {
                    let mediaElement;
    
                    if (item.type === "image") {
                        mediaElement = document.createElement("img");
                        mediaElement.src = item.src;
                        mediaElement.alt = item.alt;
                        mediaElement.dataset.index = index;
                        mediaElement.classList.add("carousel-media");
    
                        // Event listener for clicking an image
                        mediaElement.addEventListener("click", () => {
                            showVideo(item.videoSrc, index); // Show the corresponding video
                            localStorage.setItem('currentIndex', index); // Save the index of the image in localStorage
                        });
    
                        // Add 'active' class to the image that should be visible when the page loads
                        if (index === currentIndex) {
                            mediaElement.classList.add("active");
                        }
    
                        mediaContainer.appendChild(mediaElement);
                    }
                });
    
                // Event listeners for navigation arrows
                document.getElementById("leftArrow").addEventListener("click", () => {
                    if (currentIndex > 0) {
                        currentIndex--;
                        updateCarousel();
                    }
                });
    
                document.getElementById("rightArrow").addEventListener("click", () => {
                    if (currentIndex < data.myDiffVideos.length - 1) {
                        currentIndex++;
                        updateCarousel();
                    }
                });
    
                // Function to show video based on the image clicked
                function showVideo(videoSrc, index) {
                    // Hide images
                    const allImages = document.querySelectorAll("#imageContainer img");
                    allImages.forEach(img => img.classList.remove("active"));
    
                    // Show the clicked image
                    const clickedImage = allImages[index];
                    clickedImage.classList.add("active");
    
                    // Set the video source and make sure the video plays in the background
                    videoElement.src = videoSrc;
                    videoElement.load();
                    videoElement.play();
    
                    // Show the video container (without making it visible to the user)
                    videoContainer.style.display = "block"; // Show video container
                }
    
                // Function to update the carousel and show the correct image
                function updateCarousel() {
                    // Hide all images
                    const allImages = document.querySelectorAll("#imageContainer img");
                    allImages.forEach(img => img.classList.remove("active"));
    
                    // Show the current image
                    const currentImage = allImages[currentIndex];
                    currentImage.classList.add("active");
    
                    // Stop and reset the video
                    videoElement.pause();
                    videoElement.currentTime = 0;
                    videoContainer.style.display = "none"; // Hide the video container
    
                    // Save the current index to localStorage
                    localStorage.setItem('currentIndex', currentIndex);
                }
    
                // Initialize the carousel by showing the first image (or the saved one)
                updateCarousel();
    
                // Collapsible video block toggle functionality
                const toggleButton = document.getElementById("toggleVideoButton");
                toggleButton.addEventListener("click", function () {
                    if (videoContainer.style.display === "none") {
                        videoContainer.style.display = "block"; // Show the video container
                        toggleButton.textContent = "Hide Video"; // Change button text
                    } else {
                        videoContainer.style.display = "none"; // Hide the video container but keep the video playing
                        toggleButton.textContent = "Show Video"; // Change button text
                    }
                });
            })
            .catch(error => {
                console.error('Error loading media.json:', error);
            });
    });
    