// auth.js
export let sisenseLoginCredential = {
    url: '',
    username: '',
    password: ''
};

export const setToken = (token) => {
    sessionStorage.setItem('sisenseToken', token);
};

export const getToken = () => {
    return sessionStorage.getItem('sisenseToken');
};

export const setUrl = (url) => {
    sessionStorage.setItem('sisenseUrl', url);
};

export const getUrl = () => {
    return sessionStorage.getItem('sisenseUrl');
};

export const createObject = async () => {
    const urlInput = document.querySelector('#url');
    const usernameInput = document.querySelector('#username');
    const passwordInput = document.querySelector('#password');

    if (urlInput && usernameInput && passwordInput) {
        const url = urlInput.value.trim();
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!url || !username || !password) {
            console.error('Please fill in all the fields.');
            return;
        }

        sisenseLoginCredential.url = url;
        sisenseLoginCredential.username = username;
        sisenseLoginCredential.password = password;

        // Call your API function here, passing sisenseLoginCredential
        await callApi(sisenseLoginCredential);
    } else {
        console.error('One or more input elements not found.');
    }
};

const callApi = async (loginCredentials) => {
    try {
        var urlencoded = new URLSearchParams();
        urlencoded.append("username", loginCredentials.username);
        urlencoded.append("password", loginCredentials.password);

        const response = await fetch(`https://${sisenseLoginCredential.url}/api/v1/authentication/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body:  urlencoded.toString(),
        });

        if (response.ok) {
            const result = await response.json();

            // Set the token and URL in sessionStorage
            setToken(result.access_token);
            setUrl(loginCredentials.url);

            window.location.href = '/templates/addData.html';
        } else {
            console.error('API call failed.');
        }
    } catch (error) {
        console.error('Error during API call:', error);
    }
};
