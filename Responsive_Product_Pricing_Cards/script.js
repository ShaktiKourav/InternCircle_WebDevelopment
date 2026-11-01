const billingToggle = document.querySelector("#billing-toggle");
const prices = document.querySelectorAll(".price");
const billingDetails = document.querySelectorAll(".billing-detail");
const monthlyLabel = document.querySelector("#monthly-label");
const yearlyLabel = document.querySelector("#yearly-label");
const billingNote = document.querySelector("#billing-note");

function setBillingCycle(isYearly) {
  billingToggle.setAttribute("aria-checked", String(isYearly));
  billingToggle.setAttribute(
    "aria-label",
    isYearly ? "Switch to monthly billing" : "Switch to yearly billing"
  );

  prices.forEach((price) => {
    price.textContent = isYearly ? price.dataset.yearly : price.dataset.monthly;
  });

  billingDetails.forEach((detail) => {
    detail.textContent = isYearly
      ? detail.dataset.yearlyLabel
      : detail.dataset.monthlyLabel;
  });

  monthlyLabel.classList.toggle("active", !isYearly);
  yearlyLabel.classList.toggle("active", isYearly);
  billingNote.textContent = isYearly
    ? "Yearly billing selected. Save 20% on paid plans."
    : "Billed monthly. Change anytime.";
}

billingToggle.addEventListener("click", () => {
  const isYearly = billingToggle.getAttribute("aria-checked") !== "true";
  setBillingCycle(isYearly);
});

// Set the initial state and keep the control keyboard accessible.
setBillingCycle(false);
