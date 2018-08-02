const slackToken = '';

setSlackStatus(slackToken, 'Google Meet', ':slack_call:').then((obj) => {
  chrome.runtime.sendMessage({
    type: 'save_prev',
    data: obj
  });
});

window.onunload = (event) => {
  chrome.runtime.sendMessage({
    type: 'set_prev',
    data: {
      slackToken,
    }
  });
};
