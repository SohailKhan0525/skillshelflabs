const words = [...document.querySelectorAll(".reveal-words span")];

if ("IntersectionObserver" in window && words.length) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      words.forEach((word, index) => {
        setTimeout(() => word.classList.add("is-visible"), index * 75);
      });
      obs.disconnect();
    });
  }, { threshold: 0.2 });
  observer.observe(document.querySelector(".reveal-words"));
} else {
  words.forEach((word) => word.classList.add("is-visible"));
}
