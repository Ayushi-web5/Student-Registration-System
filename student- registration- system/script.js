/* script.js
   Student Registration System
   - add/edit/delete
   - validation
   - persist to localStorage
   - dynamic vertical scrollbar handling
*/

/* ======== Config & DOM refs ======== */
const LS_KEY = 'students_v1';
const form = document.getElementById('studentForm');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');

const nameInput = document.getElementById('name');
const idInput = document.getElementById('studentId');
const emailInput = document.getElementById('email');
const contactInput = document.getElementById('contact');

const studentsTbody = document.getElementById('studentsTbody');
const emptyText = document.getElementById('emptyText');
const tableWrapper = document.getElementById('tableWrapper');

const nameError = document.getElementById('nameError');
const idError = document.getElementById('idError');
const emailError = document.getElementById('emailError');
const contactError = document.getElementById('contactError');

let students = []; // array of objects { name, studentId, email, contact }
let editIndex = -1; // -1 means add mode

/* ======== Utilities ======== */
function saveToLocalStorage() {
  localStorage.setItem(LS_KEY, JSON.stringify(students));
}

function loadFromLocalStorage() {
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/* Simple validators */
function isOnlyLetters(str) {
  return /^[A-Za-z\s]+$/.test(str.trim());
}
function isOnlyNumbers(str) {
  return /^\d+$/.test(str.trim());
}
function isValidEmail(str) {
  // reasonable email regex (not perfect, but acceptable for this task)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str.trim());
}

/* Show / hide error text */
function setError(node, message) {
  node.textContent = message || '';
}

/* ======== Render ======== */
function renderTable() {
  studentsTbody.innerHTML = '';

  if (students.length === 0) {
    emptyText.style.display = 'block';
  } else {
    emptyText.style.display = 'none';
  }

  students.forEach((s, idx) => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${escapeHtml(s.name)}</td>
      <td>${escapeHtml(s.studentId)}</td>
      <td>${escapeHtml(s.email)}</td>
      <td>${escapeHtml(s.contact)}</td>
      <td>
        <div class="actions">
          <button class="btn-edit" data-index="${idx}">Edit</button>
          <button class="btn-delete" data-index="${idx}">Delete</button>
        </div>
      </td>
    `;
    studentsTbody.appendChild(tr);
  });

  // Attach action listeners (delegation could be used but this is clear)
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', onEditClicked);
  });
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', onDeleteClicked);
  });

  // Handle dynamic vertical scrollbar: enable overflow if content taller than wrapper
  // To satisfy "Add a vertical scrollbar dynamically (With the use of JavaScript)"
  // we toggle overflow-auto when content taller than wrapper.
  requestAnimationFrame(() => {
    const wrapper = tableWrapper;
    // small delay ensures layout updated
    const needScroll = wrapper.scrollHeight > wrapper.clientHeight;
    wrapper.style.overflowY = needScroll ? 'auto' : 'hidden';
  });
}

/* ======== Events ======== */
form.addEventListener('submit', (e) => {
  e.preventDefault();
  clearErrors();

  const name = nameInput.value.trim();
  const studentId = idInput.value.trim();
  const email = emailInput.value.trim();
  const contact = contactInput.value.trim();

  let valid = true;

  if (!name) { setError(nameError, 'Name is required'); valid = false; }
  else if (!isOnlyLetters(name)) { setError(nameError, 'Name must contain only letters and spaces'); valid = false; }

  if (!studentId) { setError(idError, 'Student ID is required'); valid = false; }
  else if (!isOnlyNumbers(studentId)) { setError(idError, 'Student ID must be numeric'); valid = false; }

  if (!email) { setError(emailError, 'Email is required'); valid = false; }
  else if (!isValidEmail(email)) { setError(emailError, 'Enter a valid email'); valid = false; }

  if (!contact) { setError(contactError, 'Contact number is required'); valid = false; }
  else if (!isOnlyNumbers(contact)) { setError(contactError, 'Contact must be numeric'); valid = false; }
  else if (contact.length < 10) { setError(contactError, 'Contact must be at least 10 digits'); valid = false; }

  if (!valid) return;

  // Prevent empty row or duplicate studentId (unless editing the same row)
  const duplicateIndex = students.findIndex(s => s.studentId === studentId);
  if (editIndex === -1 && duplicateIndex !== -1) {
    setError(idError, 'A student with this ID already exists');
    return;
  } else if (editIndex !== -1 && duplicateIndex !== -1 && duplicateIndex !== editIndex) {
    setError(idError, 'Another student with this ID already exists');
    return;
  }

  const studentObj = { name, studentId, email, contact };

  if (editIndex === -1) {
    // Add mode
    students.push(studentObj);
  } else {
    // Edit mode
    students[editIndex] = studentObj;
    editIndex = -1;
    submitBtn.textContent = 'Add Student';
  }

  saveToLocalStorage();
  renderTable();
  form.reset();
});

resetBtn.addEventListener('click', () => {
  form.reset();
  clearErrors();
  editIndex = -1;
  submitBtn.textContent = 'Add Student';
});

function onEditClicked(e) {
  const idx = Number(e.currentTarget.dataset.index);
  if (!Number.isFinite(idx)) return;
  const s = students[idx];
  nameInput.value = s.name;
  idInput.value = s.studentId;
  emailInput.value = s.email;
  contactInput.value = s.contact;
  editIndex = idx;
  submitBtn.textContent = 'Update Student';
  window.location.hash = '#form';
}

function onDeleteClicked(e) {
  const idx = Number(e.currentTarget.dataset.index);
  if (!Number.isFinite(idx)) return;
  const s = students[idx];
  const confirmed = confirm(`Delete record for "${s.name}" (ID: ${s.studentId})?`);
  if (!confirmed) return;
  students.splice(idx, 1);
  saveToLocalStorage();
  renderTable();
}

/* Helper to clear error texts */
function clearErrors() {
  setError(nameError, '');
  setError(idError, '');
  setError(emailError, '');
  setError(contactError, '');
}

/* Escape for safety when injecting into DOM */
function escapeHtml(unsafe) {
  return String(unsafe)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

/* ======== Init ======== */
function init() {
  students = loadFromLocalStorage();
  renderTable();
}

init();
