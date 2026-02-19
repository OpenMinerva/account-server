const HEADERS = { 'Content-Type': 'application/json' }

async function deleteDevice(deviceId) {
    const url = "/api/v1/device"

    if (!deviceId) {
        console.error("No device ID.");
        return;
    }

    try {
        const response = await fetch(url, {
            headers: HEADERS, method: "DELETE", body: JSON.stringify({ deviceId })
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();

        if (result.ok == true) {
            // TODO: Handle result
            console.log(result)
        }
    } catch (e) {
        console.error(e.message);
    }
}