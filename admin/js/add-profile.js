/* ==========================================================================
   ADD-PROFILE.JS - Profile Form Controller (Add & Edit Modes)
   ========================================================================== */

let isFormDirty = false;
let editingProfileId = null;
let profilePhotos = []; // Base64 data URIs
let profileBiodata = null; // { name, data }

document.addEventListener('DOMContentLoaded', () => {
  checkForEditMode();
  initFormEventListeners();
  initUploadHandlers();
  initUnsavedChangesWarning();
});

// Check if URL has ?id= parameter
function checkForEditMode() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  if (id) {
    const profile = typeof getProfileById === 'function' ? getProfileById(id) : null;
    if (profile) {
      editingProfileId = profile.id;
      document.getElementById('page-heading').textContent = `Edit Profile - ${profile.name}`;
      document.title = `Edit Profile (${profile.name}) - Matrimonial Admin Panel`;
      
      const navText = document.getElementById('nav-add-profile-text');
      if (navText) navText.textContent = 'Edit Profile';

      prefillForm(profile);
    } else {
      showToast('Profile not found for editing.', 'error');
      setTimeout(() => window.location.href = 'profiles.html', 1000);
    }
  }
}

// Pre-fill form fields in edit mode
function prefillForm(p) {
  document.getElementById('profile-id').value = p.id || '';
  document.getElementById('name').value = p.name || '';
  document.getElementById('gender').value = p.gender || '';
  document.getElementById('age').value = p.age || '';
  document.getElementById('height').value = p.height || '';
  document.getElementById('maritalStatus').value = p.maritalStatus || 'Never Married';
  document.getElementById('city').value = p.city || '';
  document.getElementById('education').value = p.education || '';
  document.getElementById('profession').value = p.profession || '';
  document.getElementById('income').value = p.income || '';
  document.getElementById('fatherName').value = p.fatherName || '';
  document.getElementById('fatherOccupation').value = p.fatherOccupation || '';
  document.getElementById('motherName').value = p.motherName || '';
  document.getElementById('siblings').value = p.siblings || '';
  document.getElementById('familyType').value = p.familyType || 'Nuclear';
  document.getElementById('religionDetails').value = p.religionDetails || '';
  document.getElementById('expectations').value = p.expectations || '';
  document.getElementById('contactNumber').value = p.contactNumber || '';

  if (p.photos && Array.isArray(p.photos)) {
    profilePhotos = [...p.photos];
    renderPhotoGrid();
  }

  if (p.biodataFile) {
    profileBiodata = { ...p.biodataFile };
    renderBiodataPreview();
  }
}

// Track Unsaved Form Changes
function initUnsavedChangesWarning() {
  const inputs = document.querySelectorAll('#profile-form input, #profile-form select, #profile-form textarea');
  inputs.forEach(input => {
    input.addEventListener('change', () => { isFormDirty = true; });
    input.addEventListener('input', () => { isFormDirty = true; });
  });

  window.addEventListener('beforeunload', (e) => {
    if (isFormDirty) {
      e.preventDefault();
      e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
    }
  });

  const cancelBtn = document.getElementById('cancel-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', (e) => {
      if (isFormDirty) {
        if (!confirm('Discard unsaved changes and return to profile list?')) {
          e.preventDefault();
        }
      }
    });
  }
}

// Upload Handlers for Photos & Biodata
function initUploadHandlers() {
  // Photo Dropzone
  const photoDropzone = document.getElementById('photo-dropzone');
  const photoInput = document.getElementById('photo-file-input');

  if (photoDropzone && photoInput) {
    photoDropzone.addEventListener('click', () => photoInput.click());
    
    photoDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      photoDropzone.style.borderColor = 'var(--maroon)';
    });

    photoDropzone.addEventListener('dragleave', () => {
      photoDropzone.style.borderColor = 'var(--border)';
    });

    photoDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      photoDropzone.style.borderColor = 'var(--border)';
      if (e.dataTransfer.files) handlePhotoFiles(e.dataTransfer.files);
    });

    photoInput.addEventListener('change', (e) => {
      if (e.target.files) handlePhotoFiles(e.target.files);
    });
  }

  // Biodata Dropzone
  const biodataDropzone = document.getElementById('biodata-dropzone');
  const biodataInput = document.getElementById('biodata-file-input');

  if (biodataDropzone && biodataInput) {
    biodataDropzone.addEventListener('click', () => biodataInput.click());

    biodataInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleBiodataFile(e.target.files[0]);
      }
    });
  }
}

// Handle Photo File Uploads & Compression
async function handlePhotoFiles(files) {
  const photoError = document.getElementById('photos-error-msg');
  if (photoError) photoError.style.display = 'none';

  for (let i = 0; i < files.length; i++) {
    if (profilePhotos.length >= 5) {
      showToast('Maximum 5 photos allowed per profile.', 'warning');
      break;
    }

    const file = files[i];
    const validation = Validators.validatePhotoFile(file);

    if (!validation.isValid) {
      showToast(validation.error, 'error');
      continue;
    }

    try {
      showToast(`Compressing ${file.name}...`, 'info');
      const compressedBase64 = await compressImage(file, 800, 0.75);
      profilePhotos.push(compressedBase64);
      isFormDirty = true;
      renderPhotoGrid();
    } catch (err) {
      showToast(`Failed to process ${file.name}`, 'error');
    }
  }
}

// Render Photo Thumbnails Grid
function renderPhotoGrid() {
  const grid = document.getElementById('photo-preview-grid');
  if (!grid) return;

  if (profilePhotos.length === 0) {
    grid.innerHTML = '';
    return;
  }

  let html = '';
  profilePhotos.forEach((src, idx) => {
    html += `
      <div class="photo-thumb-wrap">
        <img src="${src}" alt="Photo ${idx + 1}">
        ${idx === 0 ? `<span class="main-badge-overlay">Main</span>` : ''}
        <button type="button" class="photo-remove-btn" data-index="${idx}" title="Remove photo">&times;</button>
      </div>
    `;
  });

  grid.innerHTML = html;

  grid.querySelectorAll('.photo-remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      profilePhotos.splice(idx, 1);
      isFormDirty = true;
      renderPhotoGrid();
    });
  });
}

// Handle Biodata File Upload
function handleBiodataFile(file) {
  const validation = Validators.validateBiodataFile(file);
  if (!validation.isValid) {
    showToast(validation.error, 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    profileBiodata = {
      name: file.name,
      data: e.target.result
    };
    isFormDirty = true;
    renderBiodataPreview();
    showToast('Biodata document uploaded.', 'success');
  };
  reader.readAsDataURL(file);
}

// Render Biodata Preview Badge
function renderBiodataPreview() {
  const container = document.getElementById('biodata-preview-container');
  if (!container) return;

  if (!profileBiodata) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = `
    <div class="file-preview-box">
      <div style="display: flex; align-items: center; gap: 0.5rem; overflow: hidden;">
        ${getSvgIcon('file')}
        <strong style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(profileBiodata.name)}</strong>
      </div>
      <button type="button" class="btn btn-danger btn-sm" id="remove-biodata-btn" style="min-height: 28px; padding: 0.2rem 0.5rem;">
        Remove
      </button>
    </div>
  `;

  document.getElementById('remove-biodata-btn').addEventListener('click', () => {
    profileBiodata = null;
    isFormDirty = true;
    renderBiodataPreview();
  });
}

// Form Submission Event Listeners
function initFormEventListeners() {
  const draftBtn = document.getElementById('save-draft-btn');
  const publishBtn = document.getElementById('publish-btn');

  if (draftBtn) {
    draftBtn.addEventListener('click', () => submitForm('draft'));
  }

  if (publishBtn) {
    publishBtn.addEventListener('click', () => submitForm('published'));
  }
}

// Submit Profile Form (Draft or Publish)
function submitForm(targetStatus) {
  clearFormErrors();

  const isPublish = targetStatus === 'published';

  const formData = {
    name: document.getElementById('name').value,
    gender: document.getElementById('gender').value,
    age: document.getElementById('age').value,
    height: document.getElementById('height').value,
    maritalStatus: document.getElementById('maritalStatus').value,
    city: document.getElementById('city').value,
    education: document.getElementById('education').value,
    profession: document.getElementById('profession').value,
    income: document.getElementById('income').value,
    fatherName: document.getElementById('fatherName').value,
    fatherOccupation: document.getElementById('fatherOccupation').value,
    motherName: document.getElementById('motherName').value,
    siblings: document.getElementById('siblings').value,
    familyType: document.getElementById('familyType').value,
    religionDetails: document.getElementById('religionDetails').value,
    expectations: document.getElementById('expectations').value,
    contactNumber: document.getElementById('contactNumber').value,
    photos: profilePhotos,
    biodataFile: profileBiodata,
    status: targetStatus
  };

  const validation = Validators.validateProfile(formData, isPublish, editingProfileId);

  if (!validation.isValid) {
    displayFormErrors(validation.errors);
    showToast('Please fix the errors marked in the form.', 'error');
    return;
  }

  // Construct Final Profile Object
  const profileObject = {
    id: editingProfileId || ('prf_' + Date.now()),
    name: Validators.trim(formData.name),
    gender: formData.gender,
    age: formData.age ? Number(formData.age) : null,
    height: Validators.trim(formData.height),
    maritalStatus: formData.maritalStatus,
    city: Validators.trim(formData.city),
    education: Validators.trim(formData.education),
    profession: Validators.trim(formData.profession),
    income: Validators.trim(formData.income),
    fatherName: Validators.trim(formData.fatherName),
    fatherOccupation: Validators.trim(formData.fatherOccupation),
    motherName: Validators.trim(formData.motherName),
    siblings: Validators.trim(formData.siblings),
    familyType: formData.familyType,
    religionDetails: Validators.trim(formData.religionDetails),
    expectations: Validators.trim(formData.expectations),
    contactNumber: Validators.trim(formData.contactNumber),
    photos: profilePhotos,
    biodataFile: profileBiodata,
    status: targetStatus
  };

  // Save to Store
  if (typeof saveProfile === 'function') {
    const saved = saveProfile(profileObject);
    if (saved) {
      const actionText = editingProfileId ? 'updated' : 'created';
      if (typeof logActivity === 'function') {
        logActivity(`profile ${actionText}`, `Profile: ${profileObject.name} (${targetStatus})`);
      }

      isFormDirty = false; // Reset dirty flag
      showToast(`Profile successfully ${actionText} as ${targetStatus}!`, 'success');

      setTimeout(() => {
        window.location.href = 'profiles.html';
      }, 700);
    }
  }
}

// Clear all field error styles
function clearFormErrors() {
  document.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));
  document.querySelectorAll('.form-control, .form-select').forEach(i => i.classList.remove('is-invalid'));
  const photosErr = document.getElementById('photos-error-msg');
  if (photosErr) photosErr.style.display = 'none';
}

// Display errors and scroll to the first erroneous element
function displayFormErrors(errors) {
  let firstErrorElem = null;

  Object.keys(errors).forEach(field => {
    if (field === 'photos') {
      const photosErr = document.getElementById('photos-error-msg');
      if (photosErr) {
        photosErr.textContent = errors[field];
        photosErr.style.display = 'block';
        if (!firstErrorElem) firstErrorElem = document.getElementById('group-photos');
      }
    } else {
      const group = document.getElementById(`group-${field}`);
      const input = document.getElementById(field);
      if (group && input) {
        group.classList.add('has-error');
        input.classList.add('is-invalid');

        const feedback = group.querySelector('.invalid-feedback');
        if (feedback) feedback.textContent = errors[field];

        if (!firstErrorElem) firstErrorElem = input;
      }
    }
  });

  if (firstErrorElem) {
    firstErrorElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (typeof firstErrorElem.focus === 'function') {
      firstErrorElem.focus();
    }
  }
}
