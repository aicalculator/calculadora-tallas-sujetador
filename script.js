// Initialize Tippy.js tooltips
tippy('.tooltip-button', {
  content(reference) {
    return reference.getAttribute('aria-label');
  },
  theme: 'light-border',
  trigger: 'mouseenter focus click', // Trigger on hover, focus, and click
  interactive: true, // Allows clicking inside the tooltip
  placement: 'right',
});

// Bra Size Calculator Functionality
const form = document.getElementById('bra-size-form');
const resultCard = document.getElementById('result');
const braSizeResult = document.getElementById('bra-size-result');
const closeResult = document.getElementById('close-result');

// Unit Conversion Constants
const INCH_TO_CM = 2.54;

// Function to convert inches to centimeters
function convertToCm(value, unit) {
  return unit === 'in' ? value * INCH_TO_CM : value;
}

// Function to convert centimeters to inches
function convertToIn(value) {
  return value / INCH_TO_CM;
}

// Function to calculate bra size
function calculateBraSize(bandSize, bustSize, unit) {
  const bandSizeCm = convertToCm(bandSize, unit);
  const bustSizeCm = convertToCm(bustSize, unit);
  const cupSize = bustSizeCm - bandSizeCm;
  let cup;

  if (cupSize <= 10) cup = 'AA';
  else if (cupSize <= 12) cup = 'A';
  else if (cupSize <= 14) cup = 'B';
  else if (cupSize <= 16) cup = 'C';
  else if (cupSize <= 18) cup = 'D';
  else if (cupSize <= 20) cup = 'DD/E';
  else if (cupSize <= 22) cup = 'F';
  else cup = 'G+';

  // Prepare display based on unit
  if (unit === 'cm') {
    return `${bandSizeCm.toFixed(1)} cm / ${cup}`;
  } else {
    const bandSizeIn = convertToIn(bandSizeCm).toFixed(1);
    return `${bandSizeIn} in / ${cup}`;
  }
}

// Function to validate inputs
function validateInputs(bandSize, bustSize, unit) {
  const errors = [];
  const bandSizeCm = convertToCm(bandSize, unit);
  const bustSizeCm = convertToCm(bustSize, unit);

  // Realistic band size range
  if (bandSizeCm < 60 || bandSizeCm > 150) {
    errors.push(
      unit === 'cm'
        ? 'La talla de banda debe estar entre 60cm y 150cm.'
        : 'La talla de banda debe estar entre 23.6in y 59.1in.'
    );
  }

  // Realistic bust size range
  if (bustSizeCm < 70 || bustSizeCm > 200) {
    errors.push(
      unit === 'cm'
        ? 'La talla de busto debe estar entre 70cm y 200cm.'
        : 'La talla de busto debe estar entre 27.6in y 78.7in.'
    );
  }

  // Bust size should be greater than band size
  if (bustSizeCm <= bandSizeCm) {
    errors.push('La talla de busto debe ser mayor que la talla de banda.');
  }

  return errors;
}

// Function to update placeholders based on selected unit
function updatePlaceholders(unit) {
  const bandSizeInput = document.getElementById('band-size');
  const bustSizeInput = document.getElementById('bust-size');

  if (unit === 'cm') {
    bandSizeInput.placeholder = 'e.g., 75';
    bustSizeInput.placeholder = 'e.g., 95';
  } else {
    bandSizeInput.placeholder = 'e.g., 30';
    bustSizeInput.placeholder = 'e.g., 37';
  }
}

// Function to save user preferences
function savePreferences(unit) {
  localStorage.setItem('braSizeCalculatorUnit', unit);
}

// Function to load user preferences
function loadPreferences() {
  const savedUnit = localStorage.getItem('braSizeCalculatorUnit');
  if (savedUnit) {
    document.getElementById('unit-selector').value = savedUnit;
    updatePlaceholders(savedUnit);
  } else {
    updatePlaceholders('cm');
  }
}

// Real-Time Validation Function
function validateField(field) {
  const unit = document.getElementById('unit-selector').value;
  const bandSize = parseFloat(document.getElementById('band-size').value);
  const bustSize = parseFloat(document.getElementById('bust-size').value);

  let bandSizeError = '';
  let bustSizeError = '';

  if (field === 'bandSize' || field === 'all') {
    if (isNaN(bandSize) || bandSize <= 0) {
      bandSizeError = 'Por favor, ingresa un número positivo.';
    } else {
      const bandSizeCm = convertToCm(bandSize, unit);
      if (bandSizeCm < 60 || bandSizeCm > 150) {
        bandSizeError = unit === 'cm'
          ? 'La talla de banda debe estar entre 60cm y 150cm.'
          : 'La talla de banda debe estar entre 23.6in y 59.1in.';
      }
    }
    displayError('band-size-error', bandSizeError);
    toggleValidationClass('band-size', bandSizeError);
  }

  if (field === 'bustSize' || field === 'all') {
    if (isNaN(bustSize) || bustSize <= 0) {
      bustSizeError = 'Por favor, ingresa un número positivo.';
    } else {
      const bustSizeCm = convertToCm(bustSize, unit);
      if (bustSizeCm < 70 || bustSizeCm > 200) {
        bustSizeError = unit === 'cm'
          ? 'La talla de busto debe estar entre 70cm y 200cm.'
          : 'La talla de busto debe estar entre 27.6in y 78.7in.';
      }
    }
    displayError('bust-size-error', bustSizeError);
    toggleValidationClass('bust-size', bustSizeError);
  }

  // Additional Validation: Bust size > Band size
  if (field === 'all') {
    const bandSizeCm = convertToCm(bandSize, unit);
    const bustSizeCm = convertToCm(bustSize, unit);
    if (!isNaN(bandSizeCm) && !isNaN(bustSizeCm) && bustSizeCm <= bandSizeCm) {
      bustSizeError = 'La talla de busto debe ser mayor que la talla de banda.';
      displayError('bust-size-error', bustSizeError);
      toggleValidationClass('bust-size', bustSizeError);
    }
  }
}

// Function to display error messages
function displayError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = message;
}

// Function to toggle validation classes
function toggleValidationClass(fieldId, error) {
  const inputGroup = document.getElementById(fieldId).parentElement;
  if (error) {
    inputGroup.classList.add('invalid');
    inputGroup.classList.remove('valid');
  } else {
    inputGroup.classList.add('valid');
    inputGroup.classList.remove('invalid');
  }
}

// Handle unit selector change
document.getElementById('unit-selector').addEventListener('change', function () {
  const selectedUnit = this.value;
  updatePlaceholders(selectedUnit);
  savePreferences(selectedUnit);
  validateField('all');
});

// Real-Time Validation Event Listeners
document.getElementById('band-size').addEventListener('input', function () {
  validateField('bandSize');
});

document.getElementById('bust-size').addEventListener('input', function () {
  validateField('bustSize');
});

// Handle form submission
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const unit = document.getElementById('unit-selector').value;
  const bandSize = parseFloat(document.getElementById('band-size').value);
  const bustSize = parseFloat(document.getElementById('bust-size').value);

  validateField('all');

  const bandSizeError = document.getElementById('band-size-error').textContent;
  const bustSizeError = document.getElementById('bust-size-error').textContent;

  if (bandSizeError || bustSizeError) {
    // Focus the first input with an error
    if (bandSizeError) {
      document.getElementById('band-size').focus();
    } else {
      document.getElementById('bust-size').focus();
    }
    return;
  }

  // Calculate bra size
  const size = calculateBraSize(bandSize, bustSize, unit);
  braSizeResult.textContent = size;

  // Show result with animation
  resultCard.classList.remove('hidden');
  resultCard.setAttribute('aria-hidden', 'false');
  closeResult.focus();
});

// Close result card
closeResult.addEventListener('click', function () {
  resultCard.classList.add('hidden');
  resultCard.setAttribute('aria-hidden', 'true');
  form.querySelector('.calculate-button').focus();
});

// Close result when clicking outside the dialog
window.addEventListener('click', function (event) {
  if (event.target === resultCard) {
    resultCard.classList.add('hidden');
    resultCard.setAttribute('aria-hidden', 'true');
    form.querySelector('.calculate-button').focus();
  }
});

// Load user preferences on page load
document.addEventListener('DOMContentLoaded', function () {
  loadPreferences();
});

// JavaScript for Accordion-Style FAQs
document.addEventListener('DOMContentLoaded', function () {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function(item) {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', function () {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';

      // Close all open FAQs
      faqItems.forEach(function(otherItem) {
        otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        otherItem.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isExpanded) {
        // Open the clicked FAQ
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
});
