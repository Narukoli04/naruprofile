document.addEventListener('DOMContentLoaded', () => {


    // --- Video Background Handling ---
    const backgroundVideo = document.querySelector('.hero-background-media .background-video');
    const backgroundImage = document.querySelector('.hero-background-media .background-image');
    if (backgroundVideo) {
        // Try to play the video
        const playPromise = backgroundVideo.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Video started playing successfully
                backgroundVideo.classList.add('is-playing'); // Add class to show video
                // Optional: remove background image if video plays
                if (backgroundImage) {
                    backgroundImage.style.display = 'none';
                }
            }).catch(error => {
                // Autoplay was prevented or other error occurred
                console.warn('Video autoplay prevented or failed:', error);
                // Keep the background image visible
                if (backgroundImage) {
                    backgroundImage.style.display = 'block';
                }
            });
        }
    }


    // --- Theme Toggle Functionality ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const moonIcon = document.querySelector('.moon-icon');
    const sunIcon = document.querySelector('.sun-icon');

    // Function to set the theme
    const setTheme = (theme) => {
        if (theme === 'dark-mode') {
            body.classList.add('dark-mode');
            body.classList.remove('light-mode');
            moonIcon.classList.add('hidden');
            sunIcon.classList.remove('hidden');
        } else {
            body.classList.add('light-mode');
            body.classList.remove('dark-mode');
            moonIcon.classList.remove('hidden');
            sunIcon.classList.add('hidden');
        }
        localStorage.setItem('theme', theme); // Save user preference
    };

    // Check for saved theme preference or system preference on load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Default to system dark mode if no preference saved
        setTheme('dark-mode');
    } else {
        // Default to light mode
        setTheme('light-mode');
    }

    // Toggle theme on button click
    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('dark-mode')) {
            setTheme('light-mode');
        } else {
            setTheme('dark-mode');
        }
    });


    // --- Navigation Active State ---
    const navLinks = document.querySelectorAll('.main-nav ul li a');
    const sections = document.querySelectorAll('main section');

    const updateActiveNavLink = () => {
        let currentActive = null;
        // Get current scroll position, adjusted for nav height
        const scrollY = window.scrollY || window.pageYOffset;
        const navHeight = document.querySelector('.main-nav').offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 1; // Subtract nav height and a small buffer
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollY >= sectionTop && scrollY < sectionBottom) {
                currentActive = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(currentActive)) {
                link.classList.add('active');
            }
        });
    };

    // Update active link on scroll and on page load
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Call on load to set initial active state


    // --- Smooth Scroll for Navigation ---
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            const navHeight = document.querySelector('.main-nav').offsetHeight;
            const offsetTop = targetSection.offsetTop - navHeight;

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            // Update active link immediately on click
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });


    // --- GSAP Animations ---

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Hero Section Character-by-Character Animation
    const heroTitle = document.querySelector('.animate-char-by-char');
    if (heroTitle) {
        const chars = heroTitle.textContent.split('');
        heroTitle.textContent = ''; // Clear original text

        chars.forEach(char => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.opacity = 0; // Start invisible
            heroTitle.appendChild(span);
        });

        gsap.to(heroTitle.children, {
            opacity: 1,
            stagger: 0.05, // Delay between each character
            duration: 0.5,
            ease: "power2.out",
            delay: 0.5 // Start after initial page load
        });
    }

    // Hero Section Fade In Up (for paragraph and button)
    gsap.from(".animate-fade-in-up, .hero-section .btn", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        stagger: 0.2,
        delay: 1 // After title animation
    });

    // Scroll Animations for sections and elements
    const animateOnScroll = (selector, fromVars = { y: 50, opacity: 0 }, duration = 1, stagger = 0.15) => {
        gsap.from(selector, {
            ...fromVars,
            duration: duration,
            ease: "power2.out",
            stagger: stagger,
            scrollTrigger: {
                trigger: selector,
                start: "top 80%", // When the top of the element hits 80% of the viewport height
                toggleActions: "play none none none", // Play animation once
                once: true, // Only animate once
                // markers: true, // Uncomment for debugging scroll triggers
            }
        });
    };

    // About section fade-in text and sliding image
    animateOnScroll('.about-section .about-image-wrapper', { x: -50, opacity: 0 }, 1, 0.2);
    animateOnScroll('.about-section .about-text', { x: 50, opacity: 0 }, 1, 0.2);

    // Skills section cards
    animateOnScroll('.skills-section .skill-card', { y: 50, opacity: 0 }, 0.8, 0.1);

    // Projects section cards
    animateOnScroll('.projects-section .project-card', { y: 50, opacity: 0 }, 0.8, 0.1);

    // Contact section form
    animateOnScroll('.contact-section .contact-form', { y: 50, opacity: 0 }, 1, 0);


    // --- Progress Bar Animation for Skills ---
    const progressBars = document.querySelectorAll('.skill-card .progress-bar');
    progressBars.forEach(bar => {
        const targetWidth = bar.style.width; // Get width from inline style (e.g., "95%")
        bar.style.width = '0%'; // Reset to 0 for animation

        gsap.to(bar, {
            width: targetWidth, // Animate to the target width
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
                trigger: bar.closest('.skill-card'), // Trigger when skill card enters view
                start: "top 85%",
                toggleActions: "play none none none",
                once: true,
            }
        });
    });


    // --- Parallax Effect for Hero Background ---
    gsap.to(".hero-section", {
        backgroundPositionY: "20%", // Adjust this value to control parallax strength
        ease: "none",
        scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top", // Ends when bottom of hero section passes top of viewport
            scrub: true, // Links animation to scroll position
        }
    });


    // --- Project Modal Functionality ---
    const projectCards = document.querySelectorAll('.project-card');
    const projectModal = document.getElementById('project-modal');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const modalProjectTitle = document.getElementById('modal-project-title');
    const modalProjectImage = document.getElementById('modal-project-image');
    const modalProjectDescription = document.getElementById('modal-project-description');
    const modalLiveDemoLink = document.getElementById('modal-live-demo');
    const modalGithubRepoLink = document.getElementById('modal-github-repo');

    // Dummy project data (replace with real data for your projects)
    const projectsData = {
        1: {
            title: "E-commerce Store",
            image: "assets/images/project1.jpg",
            description: "A fully responsive e-commerce platform built with **React** and **Redux** for state management, leveraging **Firebase** for backend services. Features include dynamic product listings, a robust shopping cart, secure user authentication, and streamlined order processing. The design prioritizes user experience and mobile responsiveness, ensuring a smooth and intuitive shopping journey across all devices. This project showcases strong component-based architecture and efficient data flow.",
            liveDemo: "https://github.com/yourusername/ecommerce-store-live-demo", // Replace with actual demo link
            githubRepo: "https://github.com/yourusername/ecommerce-store" // Replace with actual repo link
        },
        2: {
            title: "Interactive Dashboard",
            image: "assets/images/project2.jpg",
            description: "An intuitive data visualization dashboard developed using **D3.js** for custom, high-fidelity charts and **Chart.js** for simpler graph integrations. It allows users to explore complex datasets with interactive elements, dynamic filters, and real-time data loading capabilities. This project highlights my ability to transform raw data into actionable insights through engaging and performant visual representations, optimized for both performance and user interaction.",
            liveDemo: "https://github.com/yourusername/interactive-dashboard-live-demo",
            githubRepo: "https://github.com/yourusername/interactive-dashboard"
        },
        3: {
            title: "Blog Platform",
            image: "assets/images/project3.jpg",
            description: "A complete full-stack blog platform developed with **Next.js** for a performant and SEO-friendly frontend, and **Strapi** (a Headless CMS) for a flexible and easy-to-manage backend. It features dynamic content creation, rich text editing with markdown support, user commenting functionalities, and robust SEO capabilities for better discoverability. This project demonstrates my proficiency in building scalable web applications with modern frameworks and content management systems.",
            liveDemo: "https://github.com/yourusername/blog-platform-live-demo",
            githubRepo: "https://github.com/yourusername/blog-platform"
        }
    };

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.dataset.projectId;
            const project = projectsData[projectId];

            if (project) {
                modalProjectTitle.textContent = project.title;
                modalProjectImage.src = project.image;
                modalProjectDescription.innerHTML = project.description; // Use innerHTML for bold tags
                modalLiveDemoLink.href = project.liveDemo;
                modalGithubRepoLink.href = project.githubRepo;

                projectModal.classList.add('active');
            }
        });
    });

    closeModalBtn.addEventListener('click', () => {
        projectModal.classList.remove('active');
    });

    // Close modal if user clicks outside of it
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            projectModal.classList.remove('active');
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal.classList.contains('active')) {
            projectModal.classList.remove('active');
        }
    });


    // --- Contact Form Floating Labels ---
    const formInputs = document.querySelectorAll('.contact-form .form-input');

    formInputs.forEach(input => {
        // Add not-placeholder-shown class on load if input has content (e.g., from autofill)
        if (input.value) {
            input.classList.add('not-placeholder-shown');
        }

        input.addEventListener('focus', () => {
            input.classList.add('not-placeholder-shown'); // Always lift label on focus
        });

        input.addEventListener('blur', () => {
            if (input.value === '') {
                input.classList.remove('not-placeholder-shown'); // Lower label if empty on blur
            }
        });

        // Ensure label stays up if content is added programmatically or by autofill
        input.addEventListener('input', () => {
            if (input.value === '') {
                input.classList.remove('not-placeholder-shown');
            } else {
                input.classList.add('not-placeholder-shown');
            }
        });
    });

    // Handle form submission (example - replace with actual backend logic)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default form submission

            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            console.log("Form Submitted:");
            console.log("Name:", name);
            console.log("Email:", email);
            console.log("Subject:", subject);
            console.log("Message:", message);

            // In a real application, you would send this data to a backend server.
            // For example, using the Fetch API:
            /*
            fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, subject, message }),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                alert('Message sent successfully!');
                contactForm.reset(); // Clear the form
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Failed to send message. Please try again later.');
            });
            */

            alert('Thank you for your message, ' + name + '! I will get back to you soon.');
            contactForm.reset(); // Clear the form after submission
            // Manually remove 'not-placeholder-shown' class from labels after reset
            formInputs.forEach(input => {
                input.classList.remove('not-placeholder-shown');
            });
        });
    }

});