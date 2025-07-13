const API_BASE = 'https://customer-interaction-backend.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
  const pathname = window.location.pathname;

  // ✅ Redirect to login if user is not logged in (only on dashboard page)
  if (pathname.includes('dashboard.html')) {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);

      // 🔐 Hide Download CSV button for customers
      const downloadButton = document.getElementById('downloadCSV');
      if (downloadButton && user.role !== 'admin') {
        downloadButton.style.display = 'none';
      }

      // Set CSV download link dynamically
      if (downloadButton) {
        downloadButton.href = `${API_BASE}/api/customers/download`;
      }

    } else {
      window.location.href = 'login.html';
    }
  }

  // 🔗 Select forms and buttons
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const customerForm = document.getElementById('customerForm');
  const forgotForm = document.getElementById('forgotForm');
  const logoutBtn = document.getElementById('logoutBtn');

  // 🔐 LOGIN
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = loginForm.email.value;
      const password = loginForm.password.value;

      try {
        const res = await fetch(`${API_BASE}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || 'Login failed');

        localStorage.setItem('user', JSON.stringify(data.user));
        Swal.fire('Success!', data.msg, 'success').then(() => {
          window.location.href = 'dashboard.html';
        });

      } catch (err) {
        Swal.fire('Login Failed', err.message, 'error');
      }
    });
  }

  // 🔐 FORGOT PASSWORD
  if (forgotForm) {
    forgotForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = forgotForm.email.value.trim();
      const phone = forgotForm.phone.value.trim();
      const newPassword = forgotForm.newPassword.value.trim();
      const confirmPassword = forgotForm.confirmPassword.value.trim();

      if (!email || !phone || !newPassword || !confirmPassword) {
        Swal.fire('Error', 'All fields are required', 'error');
        return;
      }

      if (newPassword !== confirmPassword) {
        Swal.fire('Error', 'Passwords do not match', 'error');
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, phone, newPassword })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || 'Reset failed');

        Swal.fire('Success!', data.msg, 'success').then(() => {
          window.location.href = 'login.html';
        });

      } catch (err) {
        Swal.fire('Reset Failed', err.message, 'error');
      }
    });
  }

  // 📝 REGISTRATION
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const fullName = registerForm.fullName.value.trim();
      const age = registerForm.age.value.trim();
      const email = registerForm.email.value.trim();
      const phone = registerForm.phone.value.trim();
      const password = registerForm.password.value.trim();
      const confirm = registerForm.confirm.value.trim();
      const role = registerForm.role?.value || "";

      if (!fullName || !age || !email || !phone || !password || !confirm || !role) {
        Swal.fire('Error', 'All fields are required', 'error');
        return;
      }

      if (password !== confirm) {
        Swal.fire('Error', 'Passwords do not match', 'error');
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullName, age, email, phone, password, role })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || 'Registration failed');

        Swal.fire('Success!', data.msg, 'success').then(() => {
          window.location.href = 'login.html';
        });

      } catch (err) {
        Swal.fire('Registration Failed', err.message, 'error');
      }
    });
  }

  // 🚪 LOGOUT
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('user');
      Swal.fire('Logged Out', 'You have been logged out.', 'info').then(() => {
        window.location.href = 'login.html';
      });
    });
  }

  // 🧾 CUSTOMER FORM SUBMISSION
  if (customerForm) {
    customerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(customerForm);
      const products = formData.getAll('products');

      const payload = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        company: formData.get('company'),
        mobile: formData.get('mobile'),
        whatsapp: formData.get('whatsapp'),
        products
      };

      try {
        const res = await fetch(`${API_BASE}/api/customers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || 'Submission failed');

        Swal.fire('Thank you!', 'Customer details submitted', 'success').then(() => {
          customerForm.reset();
        });

      } catch (err) {
        Swal.fire('Error', err.message, 'error');
      }
    });
  }
});