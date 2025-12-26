

utils.waitFor('[class*="Banner"]', (e) => {
    e.style.display = 'none';
});

utils.waitFor('#tbl-next-up', (e) => {
    e.remove();
});

utils.waitFor('[class*="Taboola"]', (e) => {
    e.remove();
});

utils.waitFor('[id*="_ads_"]', (e) => {
    e.remove();
});

utils.waitFor('[id*="Maavaron"]', (e) => {
    e.remove();
});

utils.waitFor("video", (e) => {
    for (t of document.querySelectorAll("[title=Advertisement]")) {
        if (t.tagName === 'VIDEO') {
            e.muted = true;
            t.defaultPlaybackRate = 8.0;
            t.playbackRate = 8.0;
        }
    }
});
