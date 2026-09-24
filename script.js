document.addEventListener("DOMContentLoaded", function () {
  const revealItems = document.querySelectorAll(
    ".section-heading, .about-image, .about-copy, .cta-box, .site-footer"
  );

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
    revealItems.forEach(function (item) {
      item.classList.add("reveal");
    });

    const revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  }

  const tiltCards = document.querySelectorAll(
    ".main-card, .program-card, .exercise-card, .trainer-card, .price-card"
  );

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && window.matchMedia("(hover: hover)").matches) {
    tiltCards.forEach(function (card) {
      card.classList.add("tilt-card");

      card.addEventListener("pointermove", function (event) {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;

        card.style.transform = `perspective(900px) rotateX(${y * -8}deg) rotateY(${x * 8}deg) translateY(-6px)`;
      });

      card.addEventListener("pointerleave", function () {
        card.style.transform = "";
      });
    });
  }

  const form = document.querySelector(".cta-form");

  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      const button = form.querySelector("button");
      const nameInput = form.querySelector('input[type="text"]');
      const emailInput = form.querySelector('input[type="email"]');
      const name = nameInput ? nameInput.value.trim() : "";
      const email = emailInput ? emailInput.value.trim() : "";

      if (!name || !email) {
        alert("Please enter your name and email.");
        return;
      }

      if (button) {
        button.disabled = true;
        button.textContent = "Sending...";
      }

      try {
        const response = await fetch("/api/join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email }),
        });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Request failed.");
        }

        alert(result.message);
        form.reset();
      } catch (error) {
        alert("Backend se connection nahi ho saka. Flask server start karein.");
      } finally {
        if (button) {
          button.disabled = false;
          button.textContent = "Apply Now";
        }
      }
    });
  }
});
