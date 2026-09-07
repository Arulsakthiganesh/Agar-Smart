/* ==================== LANDING PAGE PORTAL INTERACTIONS ==================== */
document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initDemoModal();
});

/* Mobile navigation drawer toggle in Landing */
function initMobileMenu() {
  const mobileToggle = document.querySelector(".mobile-menu-toggle");
  const mobileDrawer = document.querySelector(".mobile-nav-drawer");
  
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener("click", () => {
      mobileDrawer.classList.toggle("active");
    });

    // Close drawer when clicking link
    const drawerLinks = mobileDrawer.querySelectorAll("a, button");
    drawerLinks.forEach(link => {
      link.addEventListener("click", () => {
        mobileDrawer.classList.remove("active");
      });
    });
  }
}

/* PRODUCT VIDEO MODAL (Watch Demo) */
function initDemoModal() {
  const modal = document.getElementById("demo-modal");
  const watchDemoBtn = document.getElementById("btn-watch-demo");
  const closeModal = document.querySelector(".close-modal");
  
  if (!modal || !watchDemoBtn) return;

  watchDemoBtn.addEventListener("click", () => {
    modal.style.display = "block";
  });

  if (closeModal) {
    closeModal.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Video playback simulation
  const videoPlaceholder = document.querySelector(".video-placeholder");
  const sliderScreen = document.querySelector(".demo-screen-slider");
  
  if (videoPlaceholder && sliderScreen) {
    videoPlaceholder.addEventListener("click", () => {
      sliderScreen.style.display = "flex";
      
      let currentSlide = 1;
      const interval = setInterval(() => {
        currentSlide++;
        const slide = document.querySelector(".slider-slide");
        if (!slide) {
          clearInterval(interval);
          return;
        }
        
        if (currentSlide === 2) {
          slide.innerHTML = '<i class="fa-solid fa-route"></i><p>2. Rerouting comparison avoids Connaught Lane area due to safety report</p>';
        } else if (currentSlide === 3) {
          slide.innerHTML = '<i class="fa-solid fa-users-viewfinder"></i><p>3. Dynamic incident verified by city. Citizen notified.</p>';
        } else {
          clearInterval(interval);
          sliderScreen.style.display = "none";
          slide.innerHTML = '<i class="fa-solid fa-map-location-dot"></i><p>1. Route computation between Rajiv Chowk and Mandi House in New Delhi</p>';
        }
      }, 3000);
    });
  }
}
