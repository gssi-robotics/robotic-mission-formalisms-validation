// URL google sheet endpoint
const BACKEND_URL = "https://script.google.com/macros/s/AKfycbw_JA-vmqfFz-JIHEpjRcoUba4xnfKQ-ulEQV7NCqWAdeuWNez6V7Cm2QOYk64xDkm2/exec";

document.addEventListener("DOMContentLoaded", () => {

  const bt = document.getElementById("bt_level");
  const sm = document.getElementById("sm_level");
  const htn = document.getElementById("htn_level");
  const bpmn = document.getElementById("bpmn_level");

  const rq1 = document.getElementById("rq1");
  const rq2 = document.getElementById("rq2");
  const rq3 = document.getElementById("rq3");
  const finalComments = document.getElementById("finalComments");
  const submitBtn = document.getElementById("submitBtn");
  const noteLabel = document.getElementById("noteLabel");

  const rq1Blocks = document.querySelectorAll(".formalism-block");
  const rq2Blocks = document.querySelectorAll(".rq2-block");
  const rq3Blocks = document.querySelectorAll(".rq3-block");

  // Conditional display based on expertise >= 3 (i.e., some experience)
  document.getElementById("expertiseContinue").addEventListener("click", () => {

    const expGroup = document.getElementById("expertiseSelection");
    const genInfoGroup = document.getElementById("generalInformation");
    const expFields = expGroup ? expGroup.querySelectorAll("select[required], input[required]") : [];
    const genFields = genInfoGroup ? genInfoGroup.querySelectorAll("select[required], input[required]") : [];
    const fields = Array.prototype.slice.call(expFields).concat(Array.prototype.slice.call(genFields));
    let valid = true;

    fields.forEach(field => {
        if (!field.value) {
            valid = false;
            field.classList.add("is-invalid");   // evidenzia errore
        } else {
            field.classList.remove("is-invalid");
        }
    });
    if (!valid) {
        // alert("Please fill in all required fields before continuing.");
        return;
    }

    rq1.classList.remove("d-none");
    rq2.classList.remove("d-none");
    rq3.classList.remove("d-none");
    finalComments.classList.remove("d-none");
    submitBtn.classList.remove("d-none");
    noteLabel.classList.remove("d-none");

    const formLevels = {
      bt: parseInt(bt.value),
      sm: parseInt(sm.value),
      htn: parseInt(htn.value),
      bpmn: parseInt(bpmn.value)
    };

    rq1Blocks.forEach(block => {
      const f = block.dataset.form;
      if (formLevels[f] >= 3) block.classList.remove("d-none");
      else block.classList.add("d-none");
    });

    rq1Blocks.forEach(block => {
      const f = block.dataset.form;
      const visible = (formLevels[f] >= 3);
    
      toggleRequiredInBlock(block, visible);
    });

    rq3Blocks.forEach(block => {
      const f = block.dataset.form;
      const visible = (formLevels[f] >= 3);
    
      if (visible) block.classList.remove("d-none");
      else block.classList.add("d-none");
    
      toggleRequiredInBlock(block, visible);
    });

    rq2Blocks.forEach(block => {
      const f = block.dataset.form;
      const visible = (formLevels[f] >= 3);
    
      if (visible) block.classList.remove("d-none");
      else block.classList.add("d-none");
    
      toggleRequiredInBlock(block, visible);
    });
    
    

    // rq2Blocks.forEach(block => {
    //   const f = block.dataset.form;
    //   formLevels[f] >= 2 ? block.classList.remove("d-none") : block.classList.add("d-none");
    // });

    rq3Blocks.forEach(block => {
      const f = block.dataset.form;
      if (formLevels[f] >= 3) block.classList.remove("d-none");
      else block.classList.add("d-none");
    });
  });

  // SUBMIT
  document.getElementById("surveyForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const payload = {};
    formData.forEach((value, key) => payload[key] = value);

    console.log("Sending:", payload);

    await fetch(BACKEND_URL, {
      method: "POST",
      mode: 'no-cors',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(payload)
    });

    alert("Thank you! Your submission has been received.");
    e.target.reset();
  });
});

// --- CONDITIONAL REQUIRED FOR RQ2 TEXTAREAS ---
function setupRQ2DynamicRequired() {
  // find all RQ2 selects
  const selects = document.querySelectorAll("select[name^='rq2_']:not([name$='expressiveness'])");

  selects.forEach(select => {
    const baseName = select.name; // e.g., rq2_bt_reactive
    const textareaName = baseName + "_additional";
    const textarea = document.querySelector(`textarea[name="${textareaName}"]`);

    if (!textarea) return;

    // When the user selects a value:
    select.addEventListener("change", () => {
      const value = parseInt(select.value);

      if (value <= 3) {
        textarea.required = true;
        textarea.placeholder = "Please explain why (required)";
        textarea.classList.add("border-danger");
      } else {
        textarea.required = false;
        textarea.placeholder = "Optional";
        textarea.classList.remove("border-danger");
      }
    });
  });
}

setupRQ2DynamicRequired();

const profileSelect = document.getElementById("profile_select");
const profileOtherBlock = document.getElementById("profile_other_block");
const profileOtherInput = profileOtherBlock.querySelector("input");

profileSelect.addEventListener("change", () => {
  if (profileSelect.value === "other") {
    profileOtherBlock.classList.remove("d-none");
    profileOtherInput.required = true;
  } else {
    profileOtherBlock.classList.add("d-none");
    profileOtherInput.required = false;
    profileOtherInput.value = "";
  }
});


function toggleRequiredInBlock(block, enable) {
  const fields = block.querySelectorAll("[required]");
  fields.forEach(field => {
    if (enable) {
      field.setAttribute("required", "required");
    } else {
      field.removeAttribute("required");
    }
  });
}

// Handles the conditional required textareas for RQs
function setupConditionalRequired() {
  const selects = document.querySelectorAll(
    "select[name$='_concepts'], select[name$='_control'], select[name$='_agreement']"
  );

  selects.forEach(select => {
    const base = select.name;

    let textareaChangeName = null;
    let textareaMissingName = null;

    if (base.endsWith("_concepts")) {
      textareaChangeName = base + "_change";
      textareaMissingName = base + "_missing"; 
    }

    else if (base.endsWith("_control")) {
      const prefix = base.replace("_control", "");
      textareaChangeName = prefix + "_change";
    }

    else if (base.endsWith("_agreement")) {
      const prefix = base.replace("_agreement", "");
      textareaChangeName = prefix + "_change"; // e.g. rq3_sm_pro_cons_change
    }

    const textareaChange = textareaChangeName
      ? document.querySelector(`textarea[name="${textareaChangeName}"]`)
      : null;

    const textareaMissing = textareaMissingName
      ? document.querySelector(`textarea[name="${textareaMissingName}"]`)
      : null;

    select.addEventListener("change", () => {
      const v = parseInt(select.value);
      const require = v <= 3;

      if (textareaChange) {
        textareaChange.required = require;
        textareaChange.placeholder = require
          ? "Please explain why (required if ≤ 3)"
          : "Optional";
        textareaChange.classList.toggle("border-danger", require);
      }

      if (textareaMissing) {
        textareaMissing.required = require;
        textareaMissing.placeholder = require
          ? "Please explain why (required if ≤ 3)"
          : "Optional";
        textareaMissing.classList.toggle("border-danger", require);
      }
    });
  });
}


setupConditionalRequired();
