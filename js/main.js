/**
 * DIYGuideHub - Main JavaScript
 * Minimal JavaScript for essential functionality
 */

(function () {
	"use strict";

	// ============================================
	// Mobile Menu Toggle
	// ============================================
	const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
	const navLinks = document.querySelector(".nav-links");

	if (mobileMenuBtn && navLinks) {
		mobileMenuBtn.addEventListener("click", function () {
			const isExpanded = this.getAttribute("aria-expanded") === "true";

			this.setAttribute("aria-expanded", !isExpanded);
			this.classList.toggle("active");
			navLinks.classList.toggle("active");

			// Prevent body scroll when menu is open
			document.body.style.overflow = navLinks.classList.contains("active")
				? "hidden"
				: "";
		});

		// Close menu when clicking a link
		navLinks.querySelectorAll("a").forEach(function (link) {
			link.addEventListener("click", function () {
				mobileMenuBtn.classList.remove("active");
				mobileMenuBtn.setAttribute("aria-expanded", "false");
				navLinks.classList.remove("active");
				document.body.style.overflow = "";
			});
		});

		// Close menu when clicking outside
		document.addEventListener("click", function (e) {
			if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
				mobileMenuBtn.classList.remove("active");
				mobileMenuBtn.setAttribute("aria-expanded", "false");
				navLinks.classList.remove("active");
				document.body.style.overflow = "";
			}
		});
	}

	// ============================================
	// Smooth Scroll for Anchor Links
	// ============================================
	document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
		anchor.addEventListener("click", function (e) {
			const targetId = this.getAttribute("href");

			// Skip if it's just "#" or empty
			if (targetId === "#" || targetId === "") return;

			const targetElement = document.querySelector(targetId);

			if (targetElement) {
				e.preventDefault();

				const headerHeight = document.querySelector(".header").offsetHeight;
				const targetPosition =
					targetElement.getBoundingClientRect().top +
					window.pageYOffset -
					headerHeight -
					20;

				window.scrollTo({
					top: targetPosition,
					behavior: "smooth",
				});

				// Update URL without jumping
				history.pushState(null, null, targetId);
			}
		});
	});

	// ============================================
	// Header Scroll Effect
	// ============================================
	const header = document.querySelector(".header");
	let lastScrollY = window.scrollY;
	let ticking = false;

	function updateHeader() {
		const currentScrollY = window.scrollY;

		if (currentScrollY > 100) {
			header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
		} else {
			header.style.boxShadow = "";
		}

		lastScrollY = currentScrollY;
		ticking = false;
	}

	window.addEventListener("scroll", function () {
		if (!ticking) {
			window.requestAnimationFrame(updateHeader);
			ticking = true;
		}
	});

	// ============================================
	// Newsletter Form Handling
	// ============================================
	const newsletterForms = document.querySelectorAll(
		".newsletter-form, .sidebar-newsletter form"
	);

	newsletterForms.forEach(function (form) {
		form.addEventListener("submit", function (e) {
			e.preventDefault();

			const emailInput = this.querySelector('input[type="email"]');
			const submitBtn = this.querySelector('button[type="submit"]');
			const originalBtnText = submitBtn.textContent;

			// Basic email validation
			const email = emailInput.value.trim();
			if (!isValidEmail(email)) {
				showFormMessage(this, "Please enter a valid email address.", "error");
				return;
			}

			// Simulate form submission
			submitBtn.textContent = "Subscribing...";
			submitBtn.disabled = true;

			// Simulate API call delay
			setTimeout(function () {
				// Success state
				showFormMessage(
					form,
					"Thanks for subscribing! Check your email for confirmation.",
					"success"
				);
				emailInput.value = "";
				submitBtn.textContent = originalBtnText;
				submitBtn.disabled = false;
			}, 1500);
		});
	});

	function isValidEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	function showFormMessage(form, message, type) {
		// Remove any existing message
		const existingMessage = form.querySelector(".form-message");
		if (existingMessage) {
			existingMessage.remove();
		}

		// Create message element
		const messageEl = document.createElement("div");
		messageEl.className = "form-message form-message--" + type;
		messageEl.textContent = message;
		messageEl.style.cssText =
			type === "success"
				? "color: #10b981; font-size: 0.875rem; margin-top: 0.5rem;"
				: "color: #ef4444; font-size: 0.875rem; margin-top: 0.5rem;";

		form.appendChild(messageEl);

		// Auto-remove after 5 seconds
		setTimeout(function () {
			messageEl.remove();
		}, 5000);
	}

	// ============================================
	// Table of Contents Active State
	// ============================================
	const tocBox = document.querySelector(".toc-box");

	if (tocBox) {
		const tocLinks = tocBox.querySelectorAll("a");
		const sections = [];

		tocLinks.forEach(function (link) {
			const targetId = link.getAttribute("href");
			const section = document.querySelector(targetId);
			if (section) {
				sections.push({
					link: link,
					section: section,
				});
			}
		});

		function updateTocActive() {
			const scrollPosition = window.scrollY + 150;

			sections.forEach(function (item) {
				const sectionTop = item.section.offsetTop;
				const sectionBottom = sectionTop + item.section.offsetHeight;

				if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
					tocLinks.forEach(function (l) {
						l.style.color = "";
						l.style.fontWeight = "";
					});
					item.link.style.color = "#2563eb";
					item.link.style.fontWeight = "600";
				}
			});
		}

		window.addEventListener("scroll", debounce(updateTocActive, 10));
		updateTocActive(); // Initial call
	}

	// ============================================
	// Lazy Loading Images (Native + Fallback)
	// ============================================
	if ("loading" in HTMLImageElement.prototype) {
		// Browser supports native lazy loading
		document.querySelectorAll("img[data-src]").forEach(function (img) {
			img.src = img.dataset.src;
			img.loading = "lazy";
		});
	} else {
		// Fallback for older browsers
		const lazyImages = document.querySelectorAll("img[data-src]");

		if (lazyImages.length > 0) {
			const lazyImageObserver = new IntersectionObserver(
				function (entries) {
					entries.forEach(function (entry) {
						if (entry.isIntersecting) {
							const lazyImage = entry.target;
							lazyImage.src = lazyImage.dataset.src;
							lazyImageObserver.unobserve(lazyImage);
						}
					});
				},
				{
					rootMargin: "100px",
				}
			);

			lazyImages.forEach(function (img) {
				lazyImageObserver.observe(img);
			});
		}
	}

	// ============================================
	// Reading Progress Bar (Article Pages)
	// ============================================
	const articleBody = document.querySelector(".article-body");

	if (articleBody) {
		// Create progress bar
		const progressBar = document.createElement("div");
		progressBar.className = "reading-progress";
		progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #2563eb, #3b82f6);
        z-index: 10000;
        transition: width 0.1s ease;
    `;
		document.body.appendChild(progressBar);

		function updateReadingProgress() {
			const articleStart = articleBody.offsetTop;
			const articleHeight = articleBody.offsetHeight;
			const windowHeight = window.innerHeight;
			const scrollPosition = window.scrollY;

			const progress = Math.min(
				Math.max(
					(scrollPosition - articleStart + windowHeight) / articleHeight,
					0
				),
				1
			);

			progressBar.style.width = progress * 100 + "%";
		}

		window.addEventListener("scroll", debounce(updateReadingProgress, 10));
		updateReadingProgress(); // Initial call
	}

	// ============================================
	// Copy Link Functionality
	// ============================================
	const shareButtons = document.querySelectorAll('[data-share="copy"]');

	shareButtons.forEach(function (button) {
		button.addEventListener("click", function () {
			const url = window.location.href;

			if (navigator.clipboard) {
				navigator.clipboard.writeText(url).then(function () {
					showToast("Link copied to clipboard!");
				});
			} else {
				// Fallback
				const textarea = document.createElement("textarea");
				textarea.value = url;
				document.body.appendChild(textarea);
				textarea.select();
				document.execCommand("copy");
				document.body.removeChild(textarea);
				showToast("Link copied to clipboard!");
			}
		});
	});

	function showToast(message) {
		const toast = document.createElement("div");
		toast.className = "toast";
		toast.textContent = message;
		toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #1e293b;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 10000;
        animation: fadeInUp 0.3s ease;
    `;

		document.body.appendChild(toast);

		setTimeout(function () {
			toast.style.animation = "fadeOut 0.3s ease";
			setTimeout(function () {
				toast.remove();
			}, 300);
		}, 3000);
	}

	// ============================================
	// Sticky Sidebar Handling
	// ============================================
	const stickySidebar = document.querySelector(".pdf-product-box.sticky");

	if (stickySidebar) {
		const footer =
			document.querySelector(".bottom-cta") ||
			document.querySelector(".footer");

		function handleStickySidebar() {
			if (window.innerWidth <= 900) {
				stickySidebar.style.position = "static";
				return;
			}

			const footerTop = footer.getBoundingClientRect().top;
			const sidebarHeight = stickySidebar.offsetHeight;
			const headerHeight = 72;
			const buffer = 24;

			if (footerTop < sidebarHeight + headerHeight + buffer) {
				stickySidebar.style.position = "absolute";
				stickySidebar.style.bottom = "0";
				stickySidebar.style.top = "auto";
			} else {
				stickySidebar.style.position = "sticky";
				stickySidebar.style.top = headerHeight + buffer + "px";
				stickySidebar.style.bottom = "auto";
			}
		}

		window.addEventListener("scroll", debounce(handleStickySidebar, 10));
		window.addEventListener("resize", debounce(handleStickySidebar, 100));
		handleStickySidebar(); // Initial call
	}

	// ============================================
	// Utility Functions
	// ============================================
	function debounce(func, wait) {
		let timeout;
		return function executedFunction() {
			const context = this;
			const args = arguments;
			const later = function () {
				timeout = null;
				func.apply(context, args);
			};
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		};
	}

	// ============================================
	// Expandable Category Cards
	// ============================================
	const categoryCards = document.querySelectorAll(".category-card");

	categoryCards.forEach(function (card) {
		const header = card.querySelector(".category-card-header");
		const toggle = card.querySelector(".category-toggle");
		const articlesContainer = card.querySelector(".category-articles");

		if (header && toggle && articlesContainer) {
			// Click on header or toggle button
			header.addEventListener("click", function (e) {
				// Prevent default if clicking on the toggle button
				if (e.target.closest(".category-toggle")) {
					e.preventDefault();
				}

				toggleCategory(card);
			});

			// Prevent article links from triggering collapse
			const articleLinks = articlesContainer.querySelectorAll("a");
			articleLinks.forEach(function (link) {
				link.addEventListener("click", function (e) {
					e.stopPropagation();
				});
			});
		}
	});

	function toggleCategory(card) {
		const isActive = card.classList.contains("active");
		const toggle = card.querySelector(".category-toggle");
		const articlesContainer = card.querySelector(".category-articles");

		// Optional: Close all other categories (accordion behavior)
		// Comment out these lines if you want multiple categories open at once
		categoryCards.forEach(function (otherCard) {
			if (otherCard !== card && otherCard.classList.contains("active")) {
				otherCard.classList.remove("active");
				otherCard
					.querySelector(".category-toggle")
					.setAttribute("aria-expanded", "false");
			}
		});

		if (isActive) {
			// Close this category
			card.classList.remove("active");
			toggle.setAttribute("aria-expanded", "false");

			// Scroll adjustment if needed
			const cardTop = card.getBoundingClientRect().top + window.pageYOffset;
			const headerHeight = document.querySelector(".header").offsetHeight;

			if (cardTop < window.pageYOffset) {
				window.scrollTo({
					top: cardTop - headerHeight - 20,
					behavior: "smooth",
				});
			}
		} else {
			// Open this category
			card.classList.add("active");
			toggle.setAttribute("aria-expanded", "true");

			// Smooth scroll to bring the card into view
			setTimeout(function () {
				const cardTop = card.getBoundingClientRect().top + window.pageYOffset;
				const headerHeight = document.querySelector(".header").offsetHeight;

				window.scrollTo({
					top: cardTop - headerHeight - 20,
					behavior: "smooth",
				});
			}, 100);
		}
	}

	// Optional: Close categories when clicking outside
	document.addEventListener("click", function (e) {
		if (!e.target.closest(".category-card")) {
			// Uncomment to enable closing on outside click
			// categoryCards.forEach(function(card) {
			//     card.classList.remove('active');
			//     card.querySelector('.category-toggle').setAttribute('aria-expanded', 'false');
			// });
		}
	});

	// Optional: Keyboard navigation for accessibility
	categoryCards.forEach(function (card) {
		const header = card.querySelector(".category-card-header");

		header.addEventListener("keydown", function (e) {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				toggleCategory(card);
			}
		});

		// Make header focusable
		header.setAttribute("tabindex", "0");
	});

	// ============================================
	// Add Animation Keyframes
	// ============================================
	const style = document.createElement("style");
	style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translate(-50%, 20px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
	document.head.appendChild(style);

	// ============================================
	// Initialize on DOM Ready
	// ============================================
	console.log("DIYGuideHub initialized successfully");
})();
