document.addEventListener("DOMContentLoaded", () => {
  const reveals = document.querySelectorAll(".reveal");
  const words = document.querySelectorAll(".tagline span");

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14 });

  reveals.forEach((item) => revealObserver.observe(item));

  const wordObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-active");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.75, rootMargin: "0px 0px -20% 0px" });

  words.forEach((word, index) => {
    word.style.transitionDelay = `${index * 90}ms`;
    wordObserver.observe(word);
  });
});