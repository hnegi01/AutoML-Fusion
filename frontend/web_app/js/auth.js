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

export const setUrl = (url, protocol) => {
    sessionStorage.setItem('sisenseUrl', url);
    sessionStorage.setItem('sisenseProtocol', protocol);  // Store protocol
};

export const getUrl = () => {
    return sessionStorage.getItem('sisenseUrl');
};

export const getProtocol = () => {
    return sessionStorage.getItem('sisenseProtocol') || 'https';  // Default to https
};

export const createObject = async () => {
    const urlInput = document.querySelector('#url');
    const usernameInput = document.querySelector('#username');
    const passwordInput = document.querySelector('#password');
    const errorMessage = document.querySelector('#error-message'); // Element to show errors

    if (urlInput && usernameInput && passwordInput) {
        const url = urlInput.value.trim();
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!url || !username || !password) {
            errorMessage.innerText = 'Please fill in all the fields.';
            errorMessage.style.color = 'red';
            return;
        }

        sisenseLoginCredential.url = url;
        sisenseLoginCredential.username = username;
        sisenseLoginCredential.password = password;

        // Call API with the login credentials
        await callApi(sisenseLoginCredential);
    } else {
        console.error('One or more input elements not found.');
    }
};

const isIpAddress = (url) => {
    return /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(url);
};

const callApi = async (loginCredentials) => {
    const { url, username, password } = loginCredentials;
    const errorMessage = document.querySelector('#error-message');

    let baseUrls = [];

    if (isIpAddress(url)) {
        // If it's an IP, try HTTPS first, then HTTP with port 30845
        baseUrls = [{ protocol: 'https', url: `https://${url}` }, { protocol: 'http', url: `http://${url}:30845` }];
    } else {
        // If it's a domain, only use HTTPS
        baseUrls = [{ protocol: 'https', url: `https://${url}` }];
    }

    let success = false;

    for (const base of baseUrls) {
        try {
            console.log(`Trying API call to: ${base.url}/api/v1/authentication/login`);

            const urlencoded = new URLSearchParams();
            urlencoded.append("username", username);
            urlencoded.append("password", password);

            const response = await fetch(`${base.url}/api/v1/authentication/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: urlencoded.toString(),
            });

            if (response.ok) {
                const result = await response.json();

                // Store token, URL, and protocol
                setToken(result.access_token);
                setUrl(url, base.protocol);

                console.log('Login successful');
                window.location.href = '/templates/addData.html';

                success = true;
                break; // Exit loop on success
            } else {
                console.error(`API call failed on ${base.url}`);
            }
        } catch (error) {
            console.error(`Error with ${base.url}:`, error);
        }
    }

    if (!success) {
        errorMessage.innerText = 'Login failed. Please check your credentials and try again.';
        errorMessage.style.color = 'red';
    }
};
