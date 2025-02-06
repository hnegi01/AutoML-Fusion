import { createObject } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 
        await createObject();
    });
});

