document.addEventListener('DOMContentLoaded', () => {
    // Login and Signup Modal Functionality
    const getStartedButton = document.getElementById('get-started-button');
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    const switchToSignup = document.getElementById('switch-to-signup');
    const switchToLogin = document.getElementById('switch-to-login');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    // Function to open modal with animation
    const openModal = (modal) => {
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    };
    
    // Function to close modal with animation
    const closeModal = (modal) => {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 400); // Match the CSS transition time
    };
    
    // Event listener for opening login modal by default when Get Started is clicked
    getStartedButton.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(loginModal);
    });
    
    // Event listeners for closing modals
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            closeModal(loginModal);
            closeModal(signupModal);
        });
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            closeModal(loginModal);
        }
        if (e.target === signupModal) {
            closeModal(signupModal);
        }
    });
    
    // Switch between login and signup
    switchToSignup.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(loginModal);
        setTimeout(() => {
            openModal(signupModal);
        }, 400);
    });
    
    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(signupModal);
        setTimeout(() => {
            openModal(loginModal);
        }, 400);
    });
    
    // Form submission handling
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Here you would typically authenticate with a backend
        console.log('Login attempt:', { email, password });
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `<i class="fas fa-check-circle"></i> Login successful!`;
        
        loginForm.appendChild(successMessage);
        
        // Close modal after successful login
        setTimeout(() => {
            closeModal(loginModal);
            // Remove success message after modal is closed
            setTimeout(() => {
                loginForm.removeChild(successMessage);
                loginForm.reset();
            }, 500);
        }, 2000);
    });
    
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        
        // Check if passwords match
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        // Here you would typically register with a backend
        console.log('Signup attempt:', { name, email, password });
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `<i class="fas fa-check-circle"></i> Account created successfully!`;
        
        signupForm.appendChild(successMessage);
        
        // Close modal after successful signup
        setTimeout(() => {
            closeModal(signupModal);
            // Remove success message after modal is closed
            setTimeout(() => {
                signupForm.removeChild(successMessage);
                signupForm.reset();
            }, 500);
        }, 2000);
    });

    // Menu filtering functionality
    const menuCategories = document.querySelectorAll('.menu-category');
    const menuItems = document.querySelectorAll('.menu-item[data-category]');
    
    menuCategories.forEach(category => {
        category.addEventListener('click', () => {
            // Remove active class from all categories
            menuCategories.forEach(cat => cat.classList.remove('active'));
            
            // Add active class to clicked category
            category.classList.add('active');
            
            const selectedCategory = category.getAttribute('data-category');
            
            // Show/hide menu items based on category
            menuItems.forEach(item => {
                if (selectedCategory === 'all' || item.getAttribute('data-category') === selectedCategory) {
                    item.style.display = 'flex';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Calculate position with offset for navbar height
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                // Scroll to the calculated position
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect and section tracking
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        // Navbar background effect
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Section tracking for navbar
        let current = '';
        
        // Get the contact and location sections for special handling
        const contactSection = document.getElementById('contact');
        const locationSection = document.getElementById('location');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            // Adjust the offset to trigger slightly before reaching the section
            // This makes the navigation highlight feel more responsive
            const scrollPosition = window.scrollY + navbar.offsetHeight + 100;
            
            // Special handling for Find Us section - activate it immediately after Contact section ends
            if (contactSection && locationSection && section.id === 'location') {
                const contactBottom = contactSection.offsetTop + contactSection.clientHeight;
                
                if (scrollPosition >= contactBottom) {
                    current = 'location';
                    return; // Skip further checks if we're in location section
                }
            } else if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        // Update active link in navbar
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Menu expand button functionality
    const menuExpandButton = document.querySelector('.menu-expand-button');
    const menuGrid = document.querySelector('.menu-grid');
    
    if (menuExpandButton && menuGrid) {
        menuExpandButton.addEventListener('click', () => {
            menuGrid.classList.toggle('collapsed');
            
            if (menuGrid.classList.contains('collapsed')) {
                menuExpandButton.querySelector('span').textContent = 'Show More';
                menuExpandButton.classList.remove('expanded');
                // Scroll to menu section when collapsing
                document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
            } else {
                menuExpandButton.querySelector('span').textContent = 'Show Less';
                menuExpandButton.classList.add('expanded');
            }
        });
    }
    
    // Initial check for navbar
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    }

    // Form submission handling
    const contactForms = document.querySelectorAll('.contact-form');
    contactForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Here you would typically send the form data to a server
            const isReservation = form.querySelector('.reserve-button');
            const message = isReservation
                ? 'Thank you for your reservation! We will confirm your booking shortly.'
                : 'Thank you for your message! We will get back to you soon.';
                
            // Create a success message element
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
            
            // Add it to the form
            form.appendChild(successMessage);
            
            // Reset the form
            form.reset();
            
            // Remove the success message after 5 seconds
            setTimeout(() => {
                successMessage.style.opacity = '0';
                setTimeout(() => {
                    form.removeChild(successMessage);
                }, 500);
            }, 5000);
        });
    });

    // Add animation on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.story-text, .story-image-container, .authentic-experience, .feature-list li, .testimonial-card, .reservation-form, .contact-info, .menu-item:not([style*="display: none"])');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.classList.add('animate-in');
            }
        });
    };

    // Initial check and scroll event listener
    setTimeout(animateOnScroll, 100); // Small delay to ensure DOM is fully loaded
    window.addEventListener('scroll', animateOnScroll);
    
    // Back to Top Button functionality
    const backToTopButton = document.getElementById('back-to-top');
    
    if (backToTopButton) {
        // Show button when user scrolls down 300px from the top
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        // Scroll to top when button is clicked
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Add CSS for animations
    const style = document.createElement('style');
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
