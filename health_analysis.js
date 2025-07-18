// Ініціалізація змінних
const addPatientButton = document.getElementById("addPatient");
const report = document.getElementById("report");
const btnSearch = document.getElementById('btnSearch');
const patients = [];

// Додаємо пацієнта
function addPatient() {
  const name = document.getElementById("name").value;
  const gender = document.querySelector('input[name="gender"]:checked');
  const age = document.getElementById("age").value;
  const condition = document.getElementById("condition").value;

  if (name && gender && age && condition) {
    patients.push({ name, gender: gender.value, age, condition });
    resetForm();
    generateReport();
  } else {
    alert("Будь ласка, заповніть усі поля.");
  }
}

// Очищаємо форму
function resetForm() {
  document.getElementById("name").value = "";
  const checkedGender = document.querySelector('input[name="gender"]:checked');
  if (checkedGender) {
    checkedGender.checked = false;
  }
  document.getElementById("age").value = "";
  document.getElementById("condition").value = "";
}

// Генеруємо звіт
function generateReport() {
  const numPatients = patients.length;
  const conditionsCount = {
    Diabetes: 0,
    Thyroid: 0,
    "High Blood Pressure": 0,
  };
  const genderConditionsCount = {
    Male: {
      Diabetes: 0,
      Thyroid: 0,
      "High Blood Pressure": 0,
    },
    Female: {
      Diabetes: 0,
      Thyroid: 0,
      "High Blood Pressure": 0,
    },
  };

  for (const patient of patients) {
    if (conditionsCount.hasOwnProperty(patient.condition)) {
      conditionsCount[patient.condition]++;
    }
    if (genderConditionsCount[patient.gender] && genderConditionsCount[patient.gender].hasOwnProperty(patient.condition)) {
      genderConditionsCount[patient.gender][patient.condition]++;
    }
  }

  report.innerHTML = `Number of patients: ${numPatients}<br><br>`;
  report.innerHTML += `Conditions Breakdown:<br>`;
  for (const condition in conditionsCount) {
    report.innerHTML += `${condition}: ${conditionsCount[condition]}<br>`;
  }

  report.innerHTML += `<br>Gender-Based Conditions:<br>`;
  for (const gender in genderConditionsCount) {
    report.innerHTML += `${gender}:<br>`;
    for (const condition in genderConditionsCount[gender]) {
      report.innerHTML += `&nbsp;&nbsp;${condition}: ${genderConditionsCount[gender][condition]}<br>`;
    }
  }
}

// Функція пошуку по JSON (async)
async function searchCondition() {
  const inputValue = document.getElementById('conditionInput').value.trim().toLowerCase();
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '';

  if (!inputValue) {
    resultDiv.innerHTML = 'Please enter a health condition to search.';
    return;
  }

  try {
    const response = await fetch('./health_analysis.json');
    if (!response.ok) {
      throw new Error('Could not load data');
    }
    const data = await response.json();

    const found = data.conditions.find(cond => cond.name.toLowerCase() === inputValue);

    if (found) {
      let html = `<h3>${found.name}</h3>`;
      html += `<img src="${found.imagesrc}" alt="${found.name}">`;

      html += `<h4>Symptoms:</h4><ul>`;
      found.symptoms.forEach(symptom => {
        html += `<li>${symptom}</li>`;
      });
      html += `</ul>`;

      html += `<h4>Prevention:</h4><ul>`;
      found.prevention.forEach(prevention => {
        html += `<li>${prevention}</li>`;
      });
      html += `</ul>`;

      html += `<h4>Treatment:</h4><p>${found.treatment}</p>`;

      resultDiv.innerHTML = html;
    } else {
      resultDiv.innerHTML = 'No data found for this condition.';
    }
  } catch (error) {
    resultDiv.innerHTML = 'Error loading data.';
    console.error(error);
  }
}

// Прив’язуємо події
addPatientButton.addEventListener("click", addPatient);
btnSearch.addEventListener('click', searchCondition);
