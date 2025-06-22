// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  let scrollToTopButton = null;
  let isButtonVisible = false;

  // Function to create the scroll-to-top button
  function createScrollButton() {
    if (scrollToTopButton) return; // Prevent creating multiple buttons
    
    scrollToTopButton = document.createElement("button");
    scrollToTopButton.classList.add("arrow-up");
    scrollToTopButton.innerHTML = "↑";
    scrollToTopButton.setAttribute('aria-label', 'Scroll to top');
    scrollToTopButton.setAttribute('title', 'Back to top');
    
    // Add click event listener
    scrollToTopButton.addEventListener("click", () => {
      // Add active animation class
      scrollToTopButton.classList.add('arrow-up-active');
      
      // Scroll to top smoothly
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      
      // Remove active class after animation
      setTimeout(() => {
        if (scrollToTopButton) {
          scrollToTopButton.classList.remove('arrow-up-active');
        }
      }, 300);
    });
    
    document.body.appendChild(scrollToTopButton);
  }

  // Function to show the button
  function showButton() {
    if (!isButtonVisible) {
      createScrollButton();
      scrollToTopButton.style.display = 'block';
      // Trigger animation
      setTimeout(() => {
        scrollToTopButton.classList.add('arrow-up-visible');
      }, 10);
      isButtonVisible = true;
    }
  }

  // Function to hide the button
  function hideButton() {
    if (isButtonVisible && scrollToTopButton) {
      scrollToTopButton.classList.remove('arrow-up-visible');
      setTimeout(() => {
        if (scrollToTopButton) {
          scrollToTopButton.style.display = 'none';
        }
      }, 300);
      isButtonVisible = false;
    }
  }

  // Listen for scroll events
  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      showButton();
    } else {
      hideButton();
    }
  });
});
