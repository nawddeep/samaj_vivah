/* ==========================================================================
   VALIDATORS.JS - Form Validation Rules & Helpers
   ========================================================================== */

const Validators = {
  // Trim spaces helper
  trim(str) {
    return str ? String(str).trim() : '';
  },

  // Validate Login Form
  validateLogin(email, password) {
    const errors = {};
    const trimmedEmail = this.trim(email);
    const trimmedPassword = this.trim(password);

    if (!trimmedEmail) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!trimmedPassword) {
      errors.password = 'Password is required.';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Validate Reject Reason (User Approval)
  validateRejectReason(reason) {
    const trimmed = this.trim(reason);
    if (!trimmed) {
      return { isValid: false, error: 'Rejection reason is required.' };
    }
    if (trimmed.length < 5) {
      return { isValid: false, error: 'Reason must be at least 5 characters long.' };
    }
    return { isValid: true, error: null };
  },

  // Validate Add / Edit Profile Form
  validateProfile(data, isPublish = true, existingId = null) {
    const errors = {};
    const trimmedName = this.trim(data.name);

    // Required for both Draft and Publish
    if (!trimmedName) {
      errors.name = 'Full name is required.';
    }

    // Additional validations required for Publish
    if (isPublish) {
      if (!this.trim(data.gender)) {
        errors.gender = 'Please select a gender.';
      }

      const ageNum = Number(data.age);
      if (!data.age || isNaN(ageNum) || !Number.isInteger(ageNum) || ageNum < 18 || ageNum > 70) {
        errors.age = 'Age must be a whole number between 18 and 70.';
      }

      if (!this.trim(data.city)) {
        errors.city = 'City is required.';
      }

      if (!this.trim(data.education)) {
        errors.education = 'Education is required.';
      }

      if (!this.trim(data.profession)) {
        errors.profession = 'Profession is required.';
      }

      // Contact Number Validation
      const trimmedContact = this.trim(data.contactNumber);
      if (!trimmedContact) {
        errors.contactNumber = 'Contact number is required.';
      } else if (!/^[6-9]\d{9}$/.test(trimmedContact)) {
        errors.contactNumber = 'Contact number must be exactly 10 digits starting with 6, 7, 8, or 9.';
      } else {
        // Check for duplicate contact numbers across other profiles
        if (typeof getProfiles === 'function') {
          const allProfiles = getProfiles();
          const duplicate = allProfiles.find(p => p.contactNumber === trimmedContact && p.id !== existingId);
          if (duplicate) {
            errors.contactNumber = `This contact number is already used by profile: ${duplicate.name} (ID: ${duplicate.id}).`;
          }
        }
      }

      // Photos Validation (at least 1 photo required for publish)
      if (!data.photos || !Array.isArray(data.photos) || data.photos.length === 0) {
        errors.photos = 'At least 1 profile photo is required to publish.';
      } else if (data.photos.length > 5) {
        errors.photos = 'Maximum 5 photos allowed.';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Validate single photo file before compression
  validatePhotoFile(file) {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return { isValid: false, error: 'Only JPG, PNG, or WEBP images are allowed.' };
    }
    const maxSizeMB = 2;
    if (file.size > maxSizeMB * 1024 * 1024) {
      return { isValid: false, error: `File size exceeds ${maxSizeMB} MB limit.` };
    }
    return { isValid: true, error: null };
  },

  // Validate biodata file
  validateBiodataFile(file) {
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      return { isValid: false, error: 'Only JPG, PNG, or PDF files are allowed.' };
    }
    const maxSizeMB = 3;
    if (file.size > maxSizeMB * 1024 * 1024) {
      return { isValid: false, error: `File size exceeds ${maxSizeMB} MB limit.` };
    }
    return { isValid: true, error: null };
  }
};
