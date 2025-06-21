document.addEventListener("DOMContentLoaded", () => {
  // Login and Signup Modal Functionality
  const getStartedButton = document.getElementById("get-started-button");
  const loginModal = document.getElementById("login-modal");
  const signupModal = document.getElementById("signup-modal");
  const closeButtons = document.querySelectorAll(".close-modal");
  const switchToSignup = document.getElementById("switch-to-signup");
  const switchToLogin = document.getElementById("switch-to-login");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

  // Initialize Supabase client
  let supabaseClient = null;
  try {
    if (typeof supabase !== "undefined") {
      supabaseClient = supabase.createClient(
        "https://fesnmsacpiwazupqsris.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlc25tc2FjcGl3YXp1cHFzcmlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3ODU3NzgsImV4cCI6MjA2NDM2MTc3OH0.9EyBwhejFKX2T_lNYFINDQQbNDEH1QFf2cqh3VLkUtI"
      );
    } else {
      throw new Error("Supabase library not loaded");
    }
  } catch (error) {
    console.error("Supabase initialization error:", error.message);
  }

  document.addEventListener("DOMContentLoaded", async () => {
    // Check for existing session on page load
    try {
      const {
        data: { session },
        error,
      } = await supabaseClient.auth.getSession();

      if (error) {
        console.error("Error fetching session:", error);
        return;
      }

      if (session && session.user) {
        // User is signed in, update the button with username
        const username = session.user.user_metadata?.username || "User";
        const button = document.getElementById("get-started-button");
        button.innerHTML = username;
        console.log("Session restored, user:", session.user);
      } else {
        console.log("No active session found.");
      }
    } catch (error) {
      console.error("Unexpected error checking session:", error);
    }
  });

  // Function to open modal with animation
  const openModal = (modal) => {
    modal.style.display = "block";
    setTimeout(() => {
      modal.classList.add("active");
    }, 10);
  };

  // Function to close modal with animation
  const closeModal = (modal) => {
    modal.classList.remove("active");
    setTimeout(() => {
      modal.style.display = "none";
    }, 400); // Match the CSS transition time
  };

  // Event listener for opening login modal by default when Get Started is clicked
  getStartedButton.addEventListener("click", (e) => {
    e.preventDefault();
    openModal(loginModal);
  });

  // Event listeners for closing modals
  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      closeModal(loginModal);
      closeModal(signupModal);
    });
  });

  // Close modal when clicking outside of it
  window.addEventListener("click", (e) => {
    if (e.target === loginModal) {
      closeModal(loginModal);
    }
    if (e.target === signupModal) {
      closeModal(signupModal);
    }
  });

  // Switch between login and signup
  switchToSignup.addEventListener("click", (e) => {
    e.preventDefault();
    closeModal(loginModal);
    setTimeout(() => {
      openModal(signupModal);
    }, 400);
  });

  switchToLogin.addEventListener("click", (e) => {
    e.preventDefault();
    closeModal(signupModal);
    setTimeout(() => {
      openModal(loginModal);
    }, 400);
  });

  // Form submission handling
  // Login
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        const errorMessage = document.createElement("div");
        errorMessage.className = "error-message";
        errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> Username Or Password Invalid.  Please try again.`;

        loginForm.appendChild(errorMessage);

        // Remove error message after 3 seconds
        setTimeout(() => {
          if (errorMessage.parentNode) {
            loginForm.removeChild(errorMessage);
          }
        }, 3000);

        console.error("Login error:", error);
        return;
      } else {
        // Show success message only if login is successful
        const successMessage = document.createElement("div");
        successMessage.className = "success-message";
        successMessage.innerHTML = `<i class="fas fa-check-circle"></i> Login successful!`;

        loginForm.appendChild(successMessage);

        const username = data.user.user_metadata?.username || "User";
        const button = document.getElementById("get-started-button");
        button.innerHTML = username;

        console.log("User:", data.user);

        // Close modal after successful login
        setTimeout(() => {
          closeModal(loginModal);
          // Remove success message after modal is closed
          setTimeout(() => {
            if (successMessage.parentNode) {
              loginForm.removeChild(successMessage);
            }
            loginForm.reset();
          }, 500);
        }, 2000);
      }
    } catch (error) {
      const errorMessage = document.createElement("div");
      errorMessage.className = "error-message";
      errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> An unexpected error occurred during login. Please try again.`;

      loginForm.appendChild(errorMessage);

      // Remove error message after 3 seconds
      setTimeout(() => {
        if (errorMessage.parentNode) {
          loginForm.removeChild(errorMessage);
        }
      }, 3000);

      console.error("Login error:", error);
    }
  });

  //SignUp
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById(
      "signup-confirm-password"
    ).value;

    if (username.length < 3) {
      const errorMessage = document.createElement("div");
      errorMessage.className = "error-message";
      errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> Username must be at least 3 characters`;

      signupForm.appendChild(errorMessage);

      setTimeout(() => {
        if (errorMessage.parentNode) {
          signupForm.removeChild(errorMessage);
        }
      }, 3000);

      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      const errorMessage = document.createElement("div");
      errorMessage.className = "error-message";
      errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> Username can only contain letters, numbers, and underscores`;

      signupForm.appendChild(errorMessage);

      setTimeout(() => {
        if (errorMessage.parentNode) {
          signupForm.removeChild(errorMessage);
        }
      }, 3000);

      return;
    }

    if (password !== confirmPassword) {
      const errorMessage = document.createElement("div");
      errorMessage.className = "error-message";
      errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> Passwords do not match!`;

      signupForm.appendChild(errorMessage);

      setTimeout(() => {
        if (errorMessage.parentNode) {
          signupForm.removeChild(errorMessage);
        }
      }, 3000);

      return;
    }

    if (password.length < 6) {
      const errorMessage = document.createElement("div");
      errorMessage.className = "error-message";
      errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> Password must be at least 6 characters`;

      signupForm.appendChild(errorMessage);

      setTimeout(() => {
        if (errorMessage.parentNode) {
          signupForm.removeChild(errorMessage);
        }
      }, 3000);

      return;
    }

    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            username: username,
          },
        },
      });

      if (error) {
        const errorMessage = document.createElement("div");
        errorMessage.className = "error-message";
        errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${error.message}`;

        signupForm.appendChild(errorMessage);

        setTimeout(() => {
          if (errorMessage.parentNode) {
            signupForm.removeChild(errorMessage);
          }
        }, 3000);

        console.error("Signup error:", error);
        return;
      } else {
        // Show success message
        const successMessage = document.createElement("div");
        successMessage.className = "success-message";
        successMessage.innerHTML = `<i class="fas fa-check-circle"></i> Account created successfully!`;

        signupForm.appendChild(successMessage);

        // Get Username
        const username = data.user.user_metadata?.username || "User";
        const button = document.getElementById("get-started-button");
        button.innerHTML = username;

        // Close modal after successful signup
        setTimeout(() => {
          closeModal(signupModal);
          // Remove success message after modal is closed
          setTimeout(() => {
            signupForm.removeChild(successMessage);
            signupForm.reset();
          }, 500);
        }, 2000);
      }
    } catch (error) {
      const errorMessage = document.createElement("div");
      errorMessage.className = "error-message";
      errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> An unexpected error occurred during signup. Please try again.`;

      signupForm.appendChild(errorMessage);

      setTimeout(() => {
        if (errorMessage.parentNode) {
          signupForm.removeChild(errorMessage);
        }
      }, 3000);

      console.error("Signup error:", error);
    }
  });

  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN" && session?.user) {
      const username = session.user.user_metadata?.username || "User";
      const button = document.getElementById("get-started-button");
      button.innerHTML = username;
      console.log("Auth state changed: Signed in", session.user);
    } else if (event === "SIGNED_OUT") {
      const button = document.getElementById("get-started-button");
      button.innerHTML = "Get Started"; // Reset button text
      console.log("Auth state changed: Signed out");
    }
  });

  // Menu filtering functionality
  const menuCategories = document.querySelectorAll(".menu-category");
  const menuItems = document.querySelectorAll(".menu-item[data-category]");

  menuCategories.forEach((category) => {
    category.addEventListener("click", () => {
      // Remove active class from all categories
      menuCategories.forEach((cat) => cat.classList.remove("active"));

      // Add active class to clicked category
      category.classList.add("active");

      const selectedCategory = category.getAttribute("data-category");

      // Show/hide menu items based on category
      menuItems.forEach((item) => {
        if (
          selectedCategory === "all" ||
          item.getAttribute("data-category") === selectedCategory
        ) {
          item.style.display = "flex";
          setTimeout(() => {
            item.style.opacity = "1";
            item.style.transform = "translateY(0)";
          }, 50);
        } else {
          item.style.opacity = "0";
          item.style.transform = "translateY(20px)";
          setTimeout(() => {
            item.style.display = "none";
          }, 300);
        }
      });
    });
  });
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        // Calculate position with offset for navbar height
        const navbarHeight = document.querySelector(".navbar").offsetHeight;
        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset -
          navbarHeight;

        // Scroll to the calculated position
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Navbar scroll effect and section tracking
  const navbar = document.querySelector(".navbar");
  const navLinks = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("section");

  window.addEventListener("scroll", () => {
    // Navbar background effect
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Section tracking for navbar
    let current = "";

    // Get the contact and location sections for special handling
    const contactSection = document.getElementById("contact");
    const locationSection = document.getElementById("location");

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      // Adjust the offset to trigger slightly before reaching the section
      // This makes the navigation highlight feel more responsive
      const scrollPosition = window.scrollY + navbar.offsetHeight + 100;

      // Special handling for Find Us section - activate it immediately after Contact section ends
      if (contactSection && locationSection && section.id === "location") {
        const contactBottom =
          contactSection.offsetTop + contactSection.clientHeight;

        if (scrollPosition >= contactBottom) {
          current = "location";
          return; // Skip further checks if we're in location section
        }
      } else if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        current = section.getAttribute("id");
      }
    });

    // Update active link in navbar
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  // Menu expand button functionality
  const menuExpandButton = document.querySelector(".menu-expand-button");
  const menuGrid = document.querySelector(".menu-grid");

  if (menuExpandButton && menuGrid) {
    menuExpandButton.addEventListener("click", () => {
      menuGrid.classList.toggle("collapsed");

      if (menuGrid.classList.contains("collapsed")) {
        menuExpandButton.querySelector("span").textContent = "Show More";
        menuExpandButton.classList.remove("expanded");
        // Scroll to menu section when collapsing
        document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
      } else {
        menuExpandButton.querySelector("span").textContent = "Show Less";
        menuExpandButton.classList.add("expanded");
      }
    });
  }

  // Initial check for navbar
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  }

  // Form submission handling
  const contactForms = document.querySelectorAll(".contact-form");
  contactForms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // Here you would typically send the form data to a server
      const isReservation = form.querySelector(".reserve-button");
      const message = isReservation
        ? "Thank you for your reservation! We will confirm your booking shortly."
        : "Thank you for your message! We will get back to you soon.";

      // Create a success message element
      const successMessage = document.createElement("div");
      successMessage.className = "success-message";
      successMessage.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;

      // Add it to the form
      form.appendChild(successMessage);

      // Reset the form
      form.reset();

      // Remove the success message after 5 seconds
      setTimeout(() => {
        successMessage.style.opacity = "0";
        setTimeout(() => {
          form.removeChild(successMessage);
        }, 500);
      }, 5000);
    });
  });

  // Add animation on scroll
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(
      '.story-text, .story-image-container, .authentic-experience, .feature-list li, .testimonial-card, .reservation-form, .contact-info, .menu-item:not([style*="display: none"])'
    );

    elements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const elementBottom = element.getBoundingClientRect().bottom;

      if (elementTop < window.innerHeight && elementBottom > 0) {
        element.classList.add("animate-in");
      }
    });
  };

  // Initial check and scroll event listener
  setTimeout(animateOnScroll, 100); // Small delay to ensure DOM is fully loaded
  window.addEventListener("scroll", animateOnScroll);

  // Back to Top Button functionality
  const backToTopButton = document.getElementById("back-to-top");

  if (backToTopButton) {
    // Show button when user scrolls down 300px from the top
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.add("visible");
      } else {
        backToTopButton.classList.remove("visible");
      }
    });

    // Scroll to top when button is clicked
    backToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // Add CSS for animations
  const style = document.createElement("style");
  style.textContent = `
        .menu-item, .story-text, .story-image-container, .authentic-experience, .feature-list li, .testimonial-card, .reservation-form, .contact-info {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .feature-list li:nth-child(1) { transition-delay: 0.1s; }
        .feature-list li:nth-child(2) { transition-delay: 0.2s; }
        .feature-list li:nth-child(3) { transition-delay: 0.3s; }
        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        .success-message {
            background: rgba(39, 174, 96, 0.9);
            color: white;
            padding: 1rem;
            border-radius: var(--border-radius);
            margin-top: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            opacity: 1;
            transition: opacity 0.5s ease;
        }
    `;
  document.head.appendChild(style);
});
