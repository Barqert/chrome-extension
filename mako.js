
function handleAd(e) {
    console.log("handleAd");
    e.muted = true;
    e.defaultPlaybackRate = 16;
    e.playbackRate = 16;
    e.style.display = 'none';
}

utils.waitFor("video[title=Advertisement]", (e) => {
    observer = new MutationObserver(m => handleAd(e));
    observer.observe(e, {
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true
    });
    e.addEventListener('volumechange', () => {
        if (e.muted === false) {
            handleAd(e);
        }
    });
    handleAd(e);
});

utils.waitFor("#videoPlayer_ima-ad-container", (e) => {
    observer = new MutationObserver(m => {
        e.style.display = 'none';
    });
    observer.observe(e, {
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true
    });
    e.style.display = 'none';
});

utils.waitFor(".emptyPlace", (e) => {
    e.style.display = 'none';
});

utils.waitFor("//*[text()='לאתר המפרסם']", (e) => {
    e.parentElement.style.display = 'none';
});