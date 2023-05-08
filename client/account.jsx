const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

// Calls a helper method to toggle premium account status
const togglePremium = (e) => {
    e.preventDefault();
    helper.hideError();

    helper.togglePremium();
}

// Determines the correct buttons to place on the navbar
const LoginNav = (props) => {
    if (!props.loggedIn) {
        return (
            <section>
                <div class="navlink"><a id="loginButton" href="/login">Login</a></div>
                <div class="navlink"><a id="signupButton" href="/signup">Sign up</a></div>
            </section>
        );
    } else {
        return (
            <section>
                <div class="navlink"><a href="/logout">Log out</a></div>
            </section>
        );
    }
};

// Displays the account owner's name and a button to toggle premium at any time for the current user.
const AccountDetails = (props) => {
    const account = props.account;

    return(
        <section>
            <h1>{account.username}</h1>
            <button id="togglePremiumButton" onClick={togglePremium}>Toggle Premium</button>
        </section>
    );
};

// Displays a list of all videos owned by this account.
const VideoList = (props) => {
    if (props.videos.length === 0) {
        return (
            <div className="videoList">
                <h3 className="emptyVideo">No Videos Yet!</h3>
            </div>
        );
    }

    const videoNodes = props.videos.map(video => {
        return (
            <a href={`/viewer?_id=${video._id}`}>
                <div key={video._id} className="video">
                    <h3 className="videoTitle"> {video.title} </h3>
                    <h3 className="videoOwner"> {video.ownerName} </h3>
                </div>
            </a>
        );
    });

    return (
        <div className="videoList">
            <h1>Videos</h1>
            {videoNodes}
        </div>
    );
};

// Loads an updated list of videos this account owns from the server.
const loadVideosFromServer = async (ID) => {
    const response = await fetch('/getAccountVideos', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'ID': ID
        },
    });

    const data = await response.json();

    ReactDOM.render(
        <VideoList videos={data.videos} />,
        document.getElementById('videos')
    );
}

const init = async () => {
    // Parse the search and remove the allocation of the window's name
    if (!window.location.search)
    {
        window.history.replaceState("Updated with user ID", "Title", 'account?_id=' + window.name);
    }
    window.name = "";

    // Get information about the user's interaction with the client
    const userID = new URLSearchParams(window.location.search).get("_id");
    const account = await helper.getAccount('/user', { id: userID });
    const loggedIn = await helper.getLoginStatus();

    ReactDOM.render(
        <LoginNav loggedIn={loggedIn}/>,
        document.getElementById('loginNav')
    );

    ReactDOM.render(
        <AccountDetails account={account.user}/>,
        document.getElementById('accountDetails')
    );

    ReactDOM.render(
        <VideoList videos={[]} />,
        document.getElementById('videos')
    );
    
    if (loggedIn.accountID == account.user._id) {

    }

    loadVideosFromServer(userID);
}

window.onload = init;