(function () {
  const buttons = document.querySelectorAll(".wybieram-btn");
  const messageField = document.getElementById("message");

  const specialChars = "!@#$%^&*=+-";
  const decodeSteps = 3;
  const stepDelay = 4;
  const parallelChars = 1;

  const typewriterEffect = (element, text, speed = 60) => {
    element.value = "";
    element.classList.remove("typewriter");

    let currentIndex = 0;
    const displayText = [];

    const revealChars = () => {
      const charsToReveal = [];
      for (let i = 0; i < parallelChars && currentIndex + i < text.length; i += 1) {
        charsToReveal.push(currentIndex + i);
      }

      if (charsToReveal.length === 0) {
        element.classList.remove("typewriter");
        return;
      }

      let scrambleIndex = 0;

      const scrambleInterval = setInterval(() => {
        if (scrambleIndex < decodeSteps) {
          charsToReveal.forEach((idx) => {
            displayText[idx] = specialChars[Math.floor(Math.random() * specialChars.length)];
          });
          element.value = displayText.join("");
          scrambleIndex += 1;
        } else {
          charsToReveal.forEach((idx) => {
            displayText[idx] = text[idx];
          });
          element.value = displayText.join("");
          clearInterval(scrambleInterval);

          currentIndex += parallelChars;
          setTimeout(revealChars, speed);
        }
      }, stepDelay);
    };

    element.classList.add("typewriter");
    revealChars();
  };

  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      const serviceName = this.getAttribute("data-service-label") || this.getAttribute("data-service") || "wybrany";
      const message = `Chcę wycenić wariant ${serviceName}. Proszę o kontakt.`;

      if (messageField) {
        typewriterEffect(messageField, message);
        messageField.focus();
      }

      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
})();
