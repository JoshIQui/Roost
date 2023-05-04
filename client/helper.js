/* Takes in an error message. Sets the error message up in html, and
   displays it to the user. Will be hidden by other events that could
   end in an error.
*/
const handleError = (message) => {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('roostMessage').classList.remove('hidden');
};

/* Sends post requests to the server using fetch. Will look for various
    entries in the response JSON object, and will handle them appropriately.
*/
const sendPost = async (url, data, handler) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();
    document.getElementById('roostMessage').classList.add('hidden');

    if(result.redirect) {
        window.location = result.redirect;
    }

    if(result.error) {
        handleError(result.error);
    }

    if (handler) {
        handler(result);
    }
};

const getVideo = async (url, data) => {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'ID': data.id,
        },
    });

    const result = await response.json();
    document.getElementById('roostMessage').classList.add('hidden');

    if(result.redirect) {
        window.location = result.redirect;
        window.name = result.player._id;
    }

    if(result.error) {
        handleError(result.error);
    }

    return result;
};

const hideError = () => {
    document.getElementById('roostMessage').classList.add('hidden');
};

module.exports = {
    handleError,
    sendPost,
    getVideo,
    hideError,
};