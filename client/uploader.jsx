const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

// Parse information from the video creation form to prepare a post request.
const handleVideo = (e) => {
    e.preventDefault();
    helper.hideError();

    const title = e.target.querySelector('#videoTitle').value;
    const description = e.target.querySelector('#videoDescription').value;
    const file = e.target.querySelector('#videoFile').value;

    if (!title || !description || !file) {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.uploadVideo(e.target.action, new FormData(e.target), loadOwnedVideosFromServer);

    return false;
}

// The form for video creation.
const VideoForm = (props) => {
    return (
        <form id="videoForm"
            onSubmit={handleVideo}
            name="videoForm"
            action="/uploader"
            method="POST"
            className="videoForm"
            encType="multipart/form-data"
        >
            <label htmlFor="title">Title: </label>
            <input id="videoTitle" type="text" name="title" placeholder="Video Title" />
            <label htmlFor="description">Description: </label>
            <textarea id="videoDescription" name="description"></textarea>
            <label htmlFor="file">Upload file: </label>
            <input id="videoFile" type="file" name="file" accept=".mp3,.mp4,.mov,.webm" />
            <input className="uploadVideoSubmit" type="submit" value="Upload Video" />
        </form>
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
            {videoNodes}
        </div>
    );
}

// Loads an updated list of videos this account owns from the server.
const loadOwnedVideosFromServer = async () => {
    const response = await fetch('/getOwnedVideos');
    const data = await response.json();
    ReactDOM.render(
        <VideoList videos={data.videos} />,
        document.getElementById('videos')
    );
}

const init = () => {
    ReactDOM.render(
        <VideoForm />,
        document.getElementById('uploadVideo')
    );

    ReactDOM.render(
        <VideoList videos={[]} />,
        document.getElementById('videos')
    );

    loadOwnedVideosFromServer();
}

window.onload = init;