let statusObj;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // check if message is from content script
  if (!sender.tab) {
    return;
  }

  if (request.type === 'save_prev') {
    if (!statusObj) {
      statusObj = request.data;
    }
    return;
  }

  let {
    slackToken,
  } = request.data;

  if (!statusObj) {
    return;
  }

  let {
    previousStatusText,
    previousStatusEmoji,
  } = statusObj;

  setSlackStatus(slackToken, previousStatusText, previousStatusEmoji)
    .then(() => {
      chrome.tabs.query({ url: 'https://meet.google.com/*'}, (tabs) => {
        console.log('Number of tabs: ' + tabs.length);
        if (tabs.length == 0) {
          statusObj = null;
        }
      });
    });

  setDndEnd(slackToken);
});
