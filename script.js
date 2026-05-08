document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const nav = document.querySelector("nav");
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  const revealElements = document.querySelectorAll(".reveal");

  let menuOpen = false;

  // Mobile menu
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      menuOpen = !menuOpen;
      mobileMenu.classList.toggle("hidden", !menuOpen);

      const icon = mobileMenuBtn.querySelector("i");
      if (icon) {
        icon.setAttribute("data-lucide", menuOpen ? "x" : "menu");
        window.lucide?.createIcons();
      }
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuOpen = false;
        mobileMenu.classList.add("hidden");

        const icon = mobileMenuBtn.querySelector("i");
        if (icon) {
          icon.setAttribute("data-lucide", "menu");
          window.lucide?.createIcons();
        }
      });
    });
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (event) {
      const href = this.getAttribute("href");

      if (!href || href === "#") return;

      const target = document.querySelector(href);

      if (target) {
        event.preventDefault();

        const offset = 84;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
          top,
          behavior: "smooth",
        });
      }
    });
  });

  // Navbar polish on scroll
  const updateNav = () => {
    if (!nav) return;

    if (window.scrollY > 20) {
      nav.style.background = "rgba(31, 36, 53, 0.9)";
      nav.style.backdropFilter = "blur(20px)";
      nav.style.webkitBackdropFilter = "blur(20px)";
      nav.style.boxShadow = "0 12px 32px rgba(0, 0, 0, 0.18)";
    } else {
      nav.style.background = "rgba(19, 29, 51, 0.62)";
      nav.style.backdropFilter = "blur(18px)";
      nav.style.webkitBackdropFilter = "blur(18px)";
      nav.style.boxShadow = "none";
    }
  };

  updateNav();
  window.addEventListener("scroll", updateNav, { passive: true });

  // Reveal on scroll
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  // Contact form submission
  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();

        if (formStatus) {
          formStatus.textContent = "Please complete the required fields before sending.";
        }

        return;
      }

      const formData = new FormData(contactForm);

      if (formStatus) {
        formStatus.textContent = "Sending your request...";
      }

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          contactForm.reset();

          if (formStatus) {
            formStatus.textContent = "Thanks — your request has been sent.";
          }
        } else {
          if (formStatus) {
            formStatus.textContent = "Something went wrong. Please email hello@getintrust.com directly.";
          }
        }
      } catch (error) {
        if (formStatus) {
          formStatus.textContent = "Could not send the form. Please email hello@getintrust.com directly.";
        }
      }
    });
  }
});