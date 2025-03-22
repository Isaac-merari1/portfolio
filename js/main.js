// Theme Switcher
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Function to set theme
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update icon visibility
    const lightIcon = document.querySelector('.light-icon');
    const darkIcon = document.querySelector('.dark-icon');
    if (theme === 'dark') {
        lightIcon.style.display = 'block';
        darkIcon.style.display = 'none';
    } else {
        lightIcon.style.display = 'none';
        darkIcon.style.display = 'block';
    }
}

// Initialize theme
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        // Default to dark theme
        setTheme('dark');
    }
}

// Handle theme toggle click
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
});

// Handle system theme changes
prefersDarkScheme.addEventListener('change', (e) => {
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});

// Initialize theme on page load
initializeTheme();

// Intersection Observer for revealing elements
const revealOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px'
};

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
        }
    });
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

document.querySelectorAll('.reveal').forEach(element => {
    element.classList.add('reveal-hidden');
    revealObserver.observe(element);
});

// Smooth scrolling with dynamic offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        // Update active nav link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
        });
        this.classList.add('active');
    });
});

// Number counter animation
function animateNumbers() {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        let current = 0;
        const increment = target / 50; // Will complete in 50 steps
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                clearInterval(timer);
                current = target;
            }
            stat.textContent = Math.floor(current);
        }, 40); // 40ms interval = 2 seconds total duration
    });
}

// Advanced typing effect with cursor
const roles = ["Software Engineer", "Full Stack Developer", "Cloud Computing Expert", "AI Enthusiast"];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 100;
let erasingDelay = 50;
let newTextDelay = 2000;

function typeRole() {
    const typedTextSpan = document.querySelector('.typed-text');
    const cursorSpan = document.querySelector('.cursor');
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typedTextSpan.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedTextSpan.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? erasingDelay : typingDelay;

    if (!isDeleting && charIndex === currentRole.length) {
        typeSpeed = newTextDelay;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500;
    }

    setTimeout(typeRole, typeSpeed);
}

// Smooth parallax effect
function parallax() {
    const heroImage = document.querySelector('.hero-image');
    const scrolled = window.pageYOffset;
    
    if (heroImage && window.innerWidth > 768) {
        const rate = scrolled * 0.15;
        heroImage.style.transform = `translateY(${rate}px)`;
    }
}

// Smart navbar behavior
const navbar = document.querySelector('.navbar');
let lastScroll = 0;
let isScrollingUp = false;

// Scroll to Top functionality
const scrollToTopBtn = document.getElementById('scroll-to-top');
const scrollThreshold = 400; // Show button after scrolling this many pixels

function handleScroll() {
    const currentScroll = window.pageYOffset;
    const scrollDelta = currentScroll - lastScroll;
    
    // Update navbar background
    if (currentScroll > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }

    // Smart hide/show based on scroll direction and velocity
    if (Math.abs(scrollDelta) > 10) {
        if (scrollDelta > 0 && currentScroll > 500) {
            navbar.style.transform = 'translateY(-100%)';
            isScrollingUp = false;
        } else {
            navbar.style.transform = 'translateY(0)';
            isScrollingUp = true;
        }
    }

    // Toggle scroll-to-top button visibility
    if (currentScroll > scrollThreshold) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }

    lastScroll = currentScroll;
    
    // Call parallax effect
    parallax();
}

// Smooth scroll to top
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Mobile menu handling
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const navLinks = document.querySelector('.nav-links');
let isMenuOpen = false;

if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        navLinks.classList.toggle('show');
        mobileMenuButton.classList.toggle('active');
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (isMenuOpen && !e.target.closest('.nav-content')) {
        isMenuOpen = false;
        navLinks.classList.remove('show');
        mobileMenuButton.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Initialize everything when the page loads
window.addEventListener('load', () => {
    // Start typing effect
    typeRole();
    
    // Add reveal classes to elements
    document.querySelectorAll('section, .hero-stats').forEach(element => {
        element.classList.add('reveal');
        revealObserver.observe(element);
    });
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Add dynamic styles
    const style = document.createElement('style');
    style.textContent = `
        .reveal-hidden {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .revealed {
            opacity: 1;
            transform: translateY(0);
        }

        .navbar-scrolled {
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid var(--border);
        }

        @media (max-width: 768px) {
            .mobile-menu-button {
                width: 30px;
                height: 30px;
                position: relative;
                cursor: pointer;
                z-index: 1000;
            }

            .mobile-menu-button.active {
                position: fixed;
                right: 20px;
            }

            .nav-links.show {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: white;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 999;
            }
        }
    `;
    document.head.appendChild(style);
});

// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formStatus = document.getElementById('formStatus');

    // Check if EmailJS is properly initialized
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS is not loaded. Please check your script tags.');
        return;
    }

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Show loading state
        submitBtn.classList.add('loading');
        formStatus.className = 'form-status loading';
        formStatus.textContent = 'Sending message...';

        // Get form data
        const formData = {
            user_name: document.getElementById('name').value,
            user_email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Validate form data
        if (!formData.user_name || !formData.user_email || !formData.subject || !formData.message) {
            formStatus.className = 'form-status error';
            formStatus.textContent = 'Please fill in all fields.';
            submitBtn.classList.remove('loading');
            return;
        }

        // Send email using EmailJS
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData)
            .then(function(response) {
                // Show success message
                formStatus.className = 'form-status success';
                formStatus.textContent = 'Message sent successfully!';
                contactForm.reset();
            }, function(error) {
                // Show detailed error message
                console.error('EmailJS Error:', error);
                formStatus.className = 'form-status error';
                formStatus.textContent = `Failed to send message: ${error.text || 'Please check your EmailJS configuration.'}`;
            })
            .finally(function() {
                // Remove loading state
                submitBtn.classList.remove('loading');
                
                // Hide status message after 5 seconds
                setTimeout(() => {
                    formStatus.className = 'form-status';
                }, 5000);
            });
    });
}); 