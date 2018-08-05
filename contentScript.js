const slackToken = 'xoxp-2226351944-2730345659-408454310292-c8798a4f46e4d9dd1513ad2fbdeb520c';

setSlackStatus(slackToken, 'Google Meet', ':slack_call:').then((obj) => {
  chrome.runtime.sendMessage({
    type: 'save_prev',
    data: obj
  });
});

function pollForPresenting() {
  if (document.querySelectorAll(SHARE_SCREEN_SELECTOR).length > 0) {
    setDndFor(slackToken, 2); // set snooze notifications for 2 mins
  } else {
    setDndEnd(slackToken);
  }
  setTimeout(pollForPresenting, POLL_PERIOD_MS);
}

setTimeout(pollForPresenting, POLL_PERIOD_MS);

window.onunload = (event) => {
  clearTimeout(pollForPresenting);

  chrome.runtime.sendMessage({
    type: 'set_prev',
    data: {
      slackToken,
    }
  });
};
