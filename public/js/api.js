const HEADERS = { 'Content-Type': 'application/json' }

async function createAccount(username, password, passwordConfirm) {
    const url = "/api/v1/account"

    if (!username) {
        console.log("No username.");
        return;
    }
    if (!password) {
        console.log("No password.");
        return;
    }
    if (!passwordConfirm) {
        console.log("No password confirmation.");
        return;
    }

    try {
        const response = await fetch(url, { method: "POST", body: JSON.stringify({ username, password }) });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();

        // TODO: Display errors
        console.log(result)
    } catch (e) {
        console.error(e.message);
    }
}

async function loginAccount(username, password) {
    const url = "/api/v1/login"

    if (!username) {
        console.log("No username.");
        return;
    }
    if (!password) {
        console.log("No password.");
        return;
    }

    try {
        const response = await fetch(url, {
            headers: HEADERS, method: "POST", body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();

        if (result.ok == true) {
            window.location = "/"
        }
    } catch (e) {
        console.error(e.message);
    }
}