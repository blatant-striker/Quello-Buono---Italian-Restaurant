document.addEventListener('DOMContentLoaded', () => {
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
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
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
