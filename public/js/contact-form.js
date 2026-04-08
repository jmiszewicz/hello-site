(function () {
  const form = document.querySelector(".contact-form");
  const submitBtn = form ? form.querySelector(".form-submit") : null;
  const modal = document.getElementById("form-modal");
  const modalCloseBtn = document.getElementById("form-modal-close");
  const modalOkBtn = document.getElementById("form-modal-ok");
  const modalText = document.getElementById("form-modal-text");
  const modalSeconds = document.getElementById("form-modal-seconds");
  const honeypot = form ? form.querySelector('input[name="_gotcha"]') : null;

  if (!form || !submitBtn || !modal || !modalCloseBtn || !modalOkBtn || !modalText || !modalSeconds) return;

  let countdownTimer = null;
  let countdownValue = 5;

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
  };

  const openModal = (message) => {
    modalText.textContent = message;
    countdownValue = 5;
    modalSeconds.textContent = String(countdownValue);
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");

    if (countdownTimer) clearInterval(countdownTimer);
    countdownTimer = setInterval(() => {
      countdownValue -= 1;
      modalSeconds.textContent = String(countdownValue);
      if (countdownValue <= 0) closeModal();
    }, 1000);
  };

  modalCloseBtn.addEventListener("click", closeModal);
  modalOkBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (honeypot && honeypot.value.trim() !== "") return;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const action = form.getAttribute("action");
    const formData = new FormData(form);
    const initialBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Wysyłanie...";

    try {
      const response = await fetch(action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Błąd wysyłki");
      }

      form.reset();
      openModal("Wkrótce otrzymasz odpowiedź.");
    } catch (error) {
      openModal("Nie udało się wysłać formularza. Spróbuj ponownie za chwilę.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = initialBtnText;
    }
  });
})();
