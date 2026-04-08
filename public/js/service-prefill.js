(function () {
  const buttons = document.querySelectorAll(".wybieram-btn");
  const messageField = document.getElementById("message");
  let typingIntervalId = null;

  const typewriterEffect = (element, text, speed = 60) => {
    if (typingIntervalId) {
      clearInterval(typingIntervalId);
    }

    element.value = "";
    let currentIndex = 0;

    typingIntervalId = setInterval(() => {
      currentIndex += 1;
      element.value = text.slice(0, currentIndex);

      if (currentIndex >= text.length) {
        clearInterval(typingIntervalId);
        typingIntervalId = null;
      }
    }, speed);
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
