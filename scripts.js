// Function to validate input based on the type selected
function validateInput(input, type) {
  const patterns = {
    binary: /^[01]+$/,
    decimal: /^\d+$/,
    octal: /^[0-7]+$/,
    hexadecimal: /^[0-9A-Fa-f]+$/,
    ternary: /^[012]+$/,
    quinary: /^[0-4]+$/,
    duodecimal: /^[0-9A-Ba-b]+$/,
    vigesimal: /^[0-9A-Ja-j]+$/
  };
  return patterns[type]?.test(input) || false;
}

// Function to get base for parseInt and toString based on type
function getBase(type) {
  switch (type) {
    case "binary":
      return 2;
    case "octal":
      return 8;
    case "decimal":
      return 10;
    case "hexadecimal":
      return 16;
    case "ternary":
      return 3;
    case "quinary":
      return 5;
    case "duodecimal":
      return 12;
    case "vigesimal":
      return 20;
    default:
      throw new Error("Unsupported type");
  }
}

// Function to perform number conversion
function convert() {
  const inputNumber = document.getElementById("inputNumber").value.trim();
  const fromType = document.getElementById("conversionTypeFrom").value;
  const toType = document.getElementById("conversionTypeTo").value;
  const resultDiv = document.getElementById("result");
  const loadingDiv = document.getElementById("loading");

  // Clear previous result and show loading indicator
  resultDiv.textContent = "";
  loadingDiv.style.display = "block";

  if (!validateInput(inputNumber, fromType)) {
    resultDiv.textContent = `Invalid input. Please enter a valid ${fromType} number.`;
    loadingDiv.style.display = "none";
    return;
  }

  try {
    const decimalValue = parseInt(inputNumber, getBase(fromType));
    if (isNaN(decimalValue)) throw new Error("Invalid input");

    const result = decimalValue.toString(getBase(toType)).toUpperCase();

    // Save conversion to history
    saveConversionToHistory(inputNumber, fromType, toType, result);

    // Simulate a delay for loading
    setTimeout(() => {
      loadingDiv.style.display = "none";
      resultDiv.textContent = `${fromType.toUpperCase()}: ${inputNumber} ⟶ ${toType.toUpperCase()}: ${result}`;
    }, 500);
  } catch (error) {
    resultDiv.textContent = "Error during conversion. Please try again.";
    loadingDiv.style.display = "none";
    console.error(error);
  }
}

// Function to show conversion steps (if needed)
function showSteps() {
  const inputNumber = document.getElementById("inputNumber").value.trim();
  const fromType = document.getElementById("conversionTypeFrom").value;
  const toType = document.getElementById("conversionTypeTo").value;
  const resultDiv = document.getElementById("result");

  resultDiv.textContent = "";

  if (!validateInput(inputNumber, fromType)) {
    resultDiv.textContent = `Invalid input. Please enter a valid ${fromType} number.`;
    return;
  }

  try {
    const decimalValue = parseInt(inputNumber, getBase(fromType));
    if (isNaN(decimalValue)) throw new Error("Invalid input");

    // Depending on the UI design, you may implement steps here.
    // This example focuses on the result and conversion saving.

    const result = decimalValue.toString(getBase(toType)).toUpperCase();
    resultDiv.textContent = `${fromType.toUpperCase()}: ${inputNumber} ⟶ ${toType.toUpperCase()}: ${result}`;
  } catch (error) {
    resultDiv.textContent = "Error during conversion. Please try again.";
    console.error(error);
  }
}

// Function to clear input and result
function clearResult() {
  document.getElementById("inputNumber").value = ""; // Clear input field
  document.getElementById("result").textContent = ""; // Clear result display
}

// Function to copy result to clipboard
function copyResult() {
  const resultText = document.getElementById("result").textContent;
  if (!resultText) {
    alert("Nothing to copy. Perform a conversion first.");
    return;
  }

  navigator.clipboard.writeText(resultText)
    .then(() => alert("Result copied to clipboard!"))
    .catch(err => console.error('Failed to copy: ', err));
}

// Function to save conversion to history
function saveConversionToHistory(inputNumber, fromType, toType, result) {
  const conversion = {
    input: inputNumber,
    from: fromType,
    to: toType,
    result: result
  };

  let conversions = JSON.parse(localStorage.getItem("conversions")) || [];
  conversions.push(conversion);
  localStorage.setItem("conversions", JSON.stringify(conversions));
}

// Function to display conversion history
function displayConversionHistory() {
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = ""; // Clear previous history

  const conversions = JSON.parse(localStorage.getItem("conversions")) || [];

  conversions.forEach((conversion, index) => {
    const { input, from, result, to } = conversion;
    const newListItem = document.createElement("li");
    newListItem.innerHTML = `<strong>${input}</strong> (${from}) &rarr; <strong>${result}</strong> (${to})`;
    historyList.appendChild(newListItem);
  });
}

// Function to clear conversion history
function clearConversionHistory() {
  localStorage.removeItem("conversions");
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = ""; // Clear displayed history
}

// Function to open history modal
function openHistoryModal() {
  const historyModal = document.getElementById("historyModal");
  historyModal.style.display = "block";
  displayConversionHistory(); // Display history when modal opens
}

// Function to close history modal
function closeHistoryModal() {
  const historyModal = document.getElementById("historyModal");
  historyModal.style.display = "none";
}

// Function to initialize conversion history
function initializeConversionHistory() {
  const conversions = JSON.parse(localStorage.getItem("conversions")) || [];
  if (conversions.length > 0) {
    displayConversionHistory();
  }
}

// Function to show conversion steps
function showSteps() {
  const inputNumber = document.getElementById("inputNumber").value.trim();
  const fromType = document.getElementById("conversionTypeFrom").value;
  const toType = document.getElementById("conversionTypeTo").value;
  const resultDiv = document.getElementById("result");

  resultDiv.textContent = "";

  if (!validateInput(inputNumber, fromType)) {
      resultDiv.textContent = `Invalid input. Please enter a valid ${fromType} number.`;
      return;
  }

  try {
      const decimalValue = parseInt(inputNumber, getBase(fromType));
      if (isNaN(decimalValue)) throw new Error("Invalid input");

      let steps = `Conversion Steps:\n`;

      // Step 1: Convert fromType to Decimal
      steps += `Step 1: Convert ${fromType.toUpperCase()} (${inputNumber}) to Decimal.\n`;
      steps += `Result: (${inputNumber})₂ = (`;

      // Calculate individual steps for binary to decimal
      let binaryDigits = inputNumber.split("").reverse(); // Reverse to start from least significant bit

      for (let i = 0; i < binaryDigits.length; i++) {
          const digit = parseInt(binaryDigits[i]);
          if (digit === 1) {
              steps += `1 × 2^${i}`;
              if (i < binaryDigits.length - 1) steps += " + ";
          }
      }

      steps += `) = (${decimalValue})₁₀\n\n`;

      // Step 2: Convert Decimal to toType
      switch (toType) {
          case "binary":
              steps += `Step 2: Convert Decimal (${decimalValue}) to ${toType.toUpperCase()}.\n`;
              steps += `Result: (${decimalValue})₁₀ = (${decimalValue.toString(2)})₂\n`;
              break;
          case "octal":
              steps += `Step 2: Convert Decimal (${decimalValue}) to ${toType.toUpperCase()}.\n`;
              steps += `Result: (${decimalValue})₁₀ = (${decimalValue.toString(8)})₈\n`;
              break;
          case "hexadecimal":
              steps += `Step 2: Convert Decimal (${decimalValue}) to ${toType.toUpperCase()}.\n`;
              steps += `Result: (${decimalValue})₁₀ = (${decimalValue.toString(16).toUpperCase()})₁₆\n`;
              break;
          case "decimal":
              steps += `Step 2: ${toType.toUpperCase()} is the same as Decimal.\n`;
              steps += `Result: (${decimalValue})₁₀ remains (${decimalValue})₁₀ in Decimal.\n`;
              break;
          case "ternary":
              steps += `Step 2: Convert Decimal (${decimalValue}) to ${toType.toUpperCase()}.\n`;
              steps += `Result: (${decimalValue})₁₀ = (${decimalValue.toString(3)})₃\n`;
              break;
          case "quinary":
              steps += `Step 2: Convert Decimal (${decimalValue}) to ${toType.toUpperCase()}.\n`;
              steps += `Result:
          (${decimalValue})₁₀ = (${decimalValue.toString(5)})₅\n`;
              break;
          case "duodecimal":
              steps += `Step 2: Convert Decimal (${decimalValue}) to ${toType.toUpperCase()}.\n`;
              steps += `Result: (${decimalValue})₁₀ = (${decimalValue.toString(12).toUpperCase()})₁₂\n`;
              break;
          case "vigesimal":
              steps += `Step 2: Convert Decimal (${decimalValue}) to ${toType.toUpperCase()}.\n`;
              steps += `Result: (${decimalValue})₁₀ = (${decimalValue.toString(20).toUpperCase()})₂₀\n`;
              break;
          default:
              throw new Error("Invalid conversion type");
      }

      resultDiv.textContent = steps;
  } catch (error) {
      resultDiv.textContent = "Error during conversion. Please try again.";
      console.error(error);
  }
}


// JavaScript to toggle donation modal visibility
const donateButton = document.querySelector('.donate button');
const donateModal = document.getElementById('donateModal');
const donateCloseBtn = document.querySelector('#donateModal .close');

donateButton.addEventListener('click', function() {
  showDonateDetails();
  donateModal.style.display = 'block';
});

donateCloseBtn.addEventListener('click', function() {
  donateModal.style.display = 'none';
});

window.addEventListener('click', function(event) {
  if (event.target === donateModal) {
    donateModal.style.display = 'none';
  }
});

// Function to close donation modal
function closeModal() {
  donateModal.style.display = 'none';
}

// Function to show donation details
function showDonateDetails() {
  const modalContent = document.querySelector('#donateModal .modal-content');
  modalContent.innerHTML = `
    <span class="close" onclick="closeModal()">&times;</span>
    <h2>Bank Information</h2>
    <p>
      Please use the following bank details for donations:
      <br />
      Bank Name: Universal Bank of Africa, Sierra Leone (UBA)
      <br />
      Swift Code: UNAFSLFRXXX
      <br />
      Account Number: 540120750503790
      <br />
      Account Name: DARAMY, IBRAHIM SORIE
      <br />
      <br />
      I appreciate your support!
    </p>
  `;
}


// Function to open conversion history modal
function openHistoryModal() {
  const historyModal = document.getElementById("historyModal");
  historyModal.style.display = "block";
  displayConversionHistory(); // Display history when modal opens
}

// Function to close conversion history modal
function closeHistoryModal() {
  const historyModal = document.getElementById("historyModal");
  historyModal.style.display = "none";
}

// Function to clear conversion history
function clearConversionHistory() {
  localStorage.removeItem("conversions");
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = ""; // Clear displayed history
}

// Function to initialize conversion history
function initializeConversionHistory() {
  const conversions = JSON.parse(localStorage.getItem("conversions")) || [];
  if (conversions.length > 0) {
    displayConversionHistory();
  }
}

// Function to display conversion history
function displayConversionHistory() {
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = ""; // Clear previous history

  const conversions = JSON.parse(localStorage.getItem("conversions")) || [];

  conversions.forEach((conversion, index) => {
    const { input, from, result, to } = conversion;
    const newListItem = document.createElement("li");
    newListItem.innerHTML = `<strong>${input}</strong> (${from}) &rarr; <strong>${result}</strong> (${to})`;
    historyList.appendChild(newListItem);
  });
}


// JavaScript for menu toggle
function toggleMenu() {
  const navLinks = document.getElementById("navLinks");
  navLinks.classList.toggle("active");
}