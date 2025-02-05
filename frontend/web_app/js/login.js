// login.js
import { createObject } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission
        await createObject();
    });
});

