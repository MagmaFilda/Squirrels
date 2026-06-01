function getLoggedUser() {
    return localStorage.getItem("username");
}


function getToken() {
    return localStorage.getItem("token");
}

function isLoggedIn() {
    return !!getToken();
}

function getAuthHeaders() {
    return {
        "Authorization": `Bearer ${getToken()}`,
        "Content-Type": "application/json"
    };
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "../index.html";
}

async function authFetch(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            ...getAuthHeaders(),
            ...(options.headers || {})
        }
    });

    if (response.status === 401) {
        logout();
        return;
    }

    return response;
}