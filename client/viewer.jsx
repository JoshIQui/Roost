const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const init = async () => {
    if (!window.location.search)
    {
        window.history.replaceState("Updated with video ID", "Title", 'viewer?v=' + window.name);
    }
    window.name = "";

    const videoID = new URLSearchParams(window.location.search).get("v");
    
    const response = await helper.getVideo('/player', { id: videoID });

    console.log(response);
};

window.onload = init;