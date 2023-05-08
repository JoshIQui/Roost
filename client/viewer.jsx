const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const LoginNav = (props) => {
    if (!props.accLog.loggedIn) {
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
                <div class="navlink">
                    <a id="myAccount" href={"/account?_id=" + props.accLog.accountID}>My Account</a>
                </div>
            </section>
        );
    }
};

const Advertisement = (props) => {
    return(
        <img id="adIMG" src="assets/img/advertisement.png"/>
    );
}

const VideoPlayer = (props) => {
    const video = props.video;
    const ID = props.ID;

    return (
        <section id="videoPlayer">
            <video controls autoplay src={`/player?_id=${ID}`}></video>
            <h3 id="playerTitle">{video.title}</h3>
            <a id="playerOwner" href={"/account?_id=" + video.owner}>{video.ownerName}</a>
            <p id="playerDescription">{video.description}</p>
        </section>
    );
};

const init = async () => {
    if (!window.location.search)
    {
        window.history.replaceState("Updated with video ID", "Title", 'viewer?_id=' + window.name);
    }
    window.name = "";

    const videoID = new URLSearchParams(window.location.search).get("_id");
    
    const video = await helper.getVideoData('/getVideo', { id: videoID });
    const accLog = await helper.getLoginStatus();

    if (video) {
        ReactDOM.render(
            <VideoPlayer video={video.player} ID={videoID}/>,
            document.getElementById('videoPlayer')
        );
    }

    if (!accLog.premium) {
        ReactDOM.render(
            <Advertisement />,
            document.getElementById('advertisement')
        );
    }

    ReactDOM.render(
        <LoginNav accLog={accLog}/>,
        document.getElementById('loginNav')
    );
};

window.onload = init;