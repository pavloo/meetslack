const slackToken = '';

let statusObj = {
  previousStatusText: '',
  previousStatusEmoji: ''
};

setSlackStatus(slackToken, 'Google Meet', ':slack_call:').then((obj) => {
  statusObj = obj;
});

window.onunload = (event) => {
  // we can't just send ajax request here because it's async
  // and the page may be already torn down by the time response
  // comes back, so we hand this job off to the background script
  chrome.runtime.sendMessage({
    slackToken,
    ...statusObj,
  });
};
