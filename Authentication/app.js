const API_BASE_URL = 'https://api.freeapi.app/api/v1/users';

const loginView = document.getElementById('login-view');
const registerView = document.getElementById('register-view');
const dashboardView = document.getElementById('dashboard-view');

const goToRegisterBtn = document.getElementById('go-to-register');
const goToLoginBtn = document.getElementById('go-to-login');

const toastElement = document.getElementById('toast');
const userProfile = document.getElementById('user-profile');
const logoutBtn = document.getElementById('logout-btn');

function switchView(viewName) {
    loginView.classList.add('hidden');
    loginView.classList.remove('block');
    
    registerView.classList.add('hidden');
    registerView.classList.remove('block');
    
    dashboardView.classList.add('hidden');
    dashboardView.classList.remove('block');

    if (viewName === 'login') {
        loginView.classList.remove('hidden');
        loginView.classList.add('block');
    } else if (viewName === 'register') {
        registerView.classList.remove('hidden');
        registerView.classList.add('block');
    } else if (viewName === 'dashboard') {
        dashboardView.classList.remove('hidden');
        dashboardView.classList.add('block');
    }
}

function showToast(message, type = 'success') {
    toastElement.textContent = message;
    toastElement.className = 'fixed top-5 right-5 px-4 py-3 rounded-lg text-white shadow-xl transition-opacity duration-300 z-50 border font-medium opacity-100 block';
    
    if (type === 'success') {
        toastElement.classList.add('bg-emerald-600', 'border-emerald-500');
    } else {
        toastElement.classList.add('bg-red-600', 'border-red-500');
    }

    setTimeout(() => {
        toastElement.classList.remove('opacity-100');
        toastElement.classList.add('opacity-0');
        setTimeout(() => {
            toastElement.classList.remove('block');
            toastElement.classList.add('hidden');
        }, 300);
    }, 3000);
}

goToRegisterBtn.addEventListener('click', (e) => {
    e.preventDefault();
    switchView('register');
});

goToLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    switchView('login');
});

const registerForm = document.getElementById('register-form');
const registerBtn = document.getElementById('register-btn');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const role = document.getElementById('reg-role').value;

    const originalBtnText = registerBtn.innerText;
    registerBtn.innerText = 'Registering...';
    registerBtn.disabled = true;
    registerBtn.classList.add('opacity-70', 'cursor-not-allowed');

    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                role: role
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            showToast('Account created successfully! Please log in.', 'success');
            registerForm.reset(); 
            switchView('login');
        } else {
            let errorMessage = data.message || 'Registration failed.';
            if (response.status === 422 && data.errors) {
                errorMessage = Array.isArray(data.errors) && data.errors.length > 0 ? data.errors[0] : JSON.stringify(data.errors);
            }
            showToast(`Error: ${errorMessage}`, 'error');
        }

    } catch (error) {
        showToast('A network error occurred.', 'error');
    } finally {
        registerBtn.innerText = originalBtnText;
        registerBtn.disabled = false;
        registerBtn.classList.remove('opacity-70', 'cursor-not-allowed');
    }
});

const loginForm = document.getElementById('login-form');
const loginBtn = document.getElementById('login-btn');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const originalBtnText = loginBtn.innerText;
    loginBtn.innerText = 'Logging in...';
    loginBtn.disabled = true;
    loginBtn.classList.add('opacity-70', 'cursor-not-allowed');

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            showToast('Logged in successfully!', 'success');
            localStorage.setItem('accessToken', data.data.accessToken);
            loginForm.reset();
            switchView('dashboard');
            fetchCurrentUser();
        } else {
            let errorMessage = data.message || 'Login failed.';
            if (response.status === 422 && data.errors) {
                errorMessage = Array.isArray(data.errors) && data.errors.length > 0 ? data.errors[0] : JSON.stringify(data.errors);
            }
            showToast(`Error: ${errorMessage}`, 'error');
        }
    } catch (error) {
        showToast('A network error occurred.', 'error');
    } finally {
        loginBtn.innerText = originalBtnText;
        loginBtn.disabled = false;
        loginBtn.classList.remove('opacity-70', 'cursor-not-allowed');
    }
});

async function fetchCurrentUser() {
    userProfile.innerHTML = '<p class="text-sm text-zinc-500 text-center">Loading user data...</p>';
    const token = localStorage.getItem('accessToken');

    if (!token) {
        switchView('login');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/current-user`, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok && data.success) {
            const user = data.data;
            userProfile.innerHTML = `
                <div class="flex items-center space-x-4">
                    <div class="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xl uppercase">
                        ${user.username.charAt(0)}
                    </div>
                    <div>
                        <p class="text-white font-medium text-lg">${user.username}</p>
                        <p class="text-zinc-400 text-sm">${user.email}</p>
                        <span class="inline-block mt-1 px-2 py-0.5 bg-zinc-800 text-indigo-400 text-xs rounded border border-zinc-700">${user.role}</span>
                    </div>
                </div>
            `;
        } else {
            showToast('Session expired. Please log in again.', 'error');
            localStorage.removeItem('accessToken');
            switchView('login');
        }
    } catch (error) {
        showToast('Failed to fetch user data.', 'error');
    }
}

logoutBtn.addEventListener('click', async () => {
    const token = localStorage.getItem('accessToken');
    const originalBtnText = logoutBtn.innerText;
    
    logoutBtn.innerText = 'Logging out...';
    logoutBtn.disabled = true;

    try {
        await fetch(`${API_BASE_URL}/logout`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        localStorage.removeItem('accessToken');
        showToast('Logged out successfully', 'success');
        switchView('login');
        userProfile.innerHTML = '';
    } catch (error) {
        showToast('Logout failed. Try again.', 'error');
    } finally {
        logoutBtn.innerText = originalBtnText;
        logoutBtn.disabled = false;
    }
});