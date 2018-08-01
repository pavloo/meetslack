chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // check if message is from content script
  if (!sender.tab) {
    return;
  }
  let {
    slackToken,
    previousStatusText,
    previousStatusEmoji,
  } = request;

  setSlackStatus(slackToken, previousStatusText, previousStatusEmoji);
});
