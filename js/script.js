// URL della tua Web App Apps Script (endpoint /exec)
const BACKEND_URL = "https://script.google.com/macros/s/AKfycbzbhtcC6CJhP6-IXoJysH6hbF3D1kQLJ7EaR0qdiifdcaPsDTrrfLKf7N9HphMslFVc/exec";

document.addEventListener("DOMContentLoaded", () => {

  const bt = document.getElementById("bt_level");
  const sm = document.getElementById("sm_level");
  const htn = document.getElementById("htn_level");
  const bpmn = document.getElementById("bpmn_level");

  const rq1 = document.getElementById("rq1");
  const finalComments = document.getElementById("finalComments");
  const submitBtn = document.getElementById("submitBtn");

  const blocks = document.querySelectorAll(".formalism-block");

  document.getElementById("expertiseContinue").addEventListener("click", () => {
    
    rq1.classList.remove("d-none");
    finalComments.classList.remove("d-none");
    submitBtn.classList.remove("d-none");

    blocks.forEach(block => {
      const f = block.getAttribute("data-form");

      let lvl = 0;
      if (f === "bt") lvl = parseInt(bt.value);
      if (f === "sm") lvl = parseInt(sm.value);
      if (f === "htn") lvl = parseInt(htn.value);
      if (f === "bpmn") lvl = parseInt(bpmn.value);

      if (lvl >= 2) block.classList.remove("d-none");
      else block.classList.add("d-none");
    });
  });

  document.getElementById("surveyForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {};
    formData.forEach((value, key) => data[key] = value);

    console.log("Sending JSON:", data);

    await fetch(BACKEND_URL, {
      method: "POST",
      mode: 'no-cors',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    });

    alert("Thank you! Your response has been submitted.");
    e.target.reset();
  });
});

