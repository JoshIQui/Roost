/* Takes in an error message. Sets the error message up in html, and
   displays it to the user. Will be hidden by other events that could
   end in an error.
*/
const handleError = (message) => {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('roostMessage').classList.remove('hidden');
};

// Returns information about the user currently logged in
const getLoginStatus = async (e) => {
    const response = await fetch('/loggedIn', {
        method: 'GET',
    });

    const result = await response.json();
    document.getElementById('roostMessage').classList.add('hidden');

    if(result.error) {
        handleError(result.error);
    }

    return result;
}

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

// Posts a video to the server from the video creation form.
const uploadVideo = async (url, data, handler) => {
    const response = await fetch(url, {
        method: 'POST',
        body: data,
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

// Gets the specified video
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

// Receives specific information about a specified video.
const getVideoData = async (url, data) => {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'ID': data.id,
        },
    });

    const result = await response.json();
    document.getElementById('roostMessage').classList.add('hidden');

    if(result.error) {
        handleError(result.error);
    }

    return result;
};

// Gets account information from the specified user.
const getAccount = async (url, data) => {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'ID': data.id
        },
    });

    const result = await response.json();
    document.getElementById('roostMessage').classList.add('hidden');

    if(result.redirect) {
        window.location = result.redirect;
        window.name = result.user._id;
    }

    if(result.error) {
        handleError(result.error);
    }
    
    return result;
};

// Sends a request to the server that changes the user's premium account status.
const togglePremium = async () => {
    const response = await fetch('/togglePremium', {
        method: 'POST',
    });

    const result = await response.json();
    document.getElementById('roostMessage').classList.add('hidden');

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
    getLoginStatus,
    sendPost,
    getVideo,
    getVideoData,
    getAccount,
    uploadVideo,
    togglePremium,
    hideError,
};