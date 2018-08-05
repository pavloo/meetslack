const SLACK_SET_STATUS_URL = 'https://slack.com/api/users.profile.set';
const SLACK_GET_USER_PROFILE = 'https://slack.com/api/users.profile.get';
const SLACK_SET_DND = 'https://slack.com/api/dnd.setSnooze';
const SLACK_SET_DND_END = 'https://slack.com/api/dnd.endDnd';
// this is magic selector which meet set's for div
// that appears when the user is sharing the screen
const SHARE_SCREEN_SELECTOR = '.fh0rdc';
const POLL_PERIOD_MS = 5000;

function appendParamsToUrl(urlStr, params) {
  const url = new URL(urlStr);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  return url;
}


function handleSlackAPIError(url, json) {
  return (json) => {
    if (!json.ok) {
      console.log(json);
      const errorMsg = `Slack API Error. URL: ${url}, Response: ${JSON.stringify(json)}`;
      if (json.error === 'not_authed') {
        alert('Slack access token is not set or is not correct.');
      } else {
        alert('Error interacting with Slack\'s API.');
      }
      throw new Error(errorMsg);
    }

    return json;
  };
}

function wait(ms) {
  return (...args) => {
    return new Promise((resolve, _) => {
      setTimeout(() => resolve(...args), ms);
    });
  };
}

function setSlackStatus(slackToken, statusText, statusEmoji)  {
  const statusBody = {
    token: slackToken,
    profile: JSON.stringify({
      status_text: statusText,
      status_emoji: statusEmoji,
    }),
  };

  let previousStatusText = '';
  let previousStatusEmoji = '';

  return wait(2000)()
    .then(() => {
      return fetch(
        appendParamsToUrl(SLACK_GET_USER_PROFILE, { token: slackToken })
      );
    })
    .then(resp => resp.json())
    .then(handleSlackAPIError(SLACK_GET_USER_PROFILE))
    .then(wait(2000))
    .then((json) => {
      previousStatusText = json.profile['status_text'];
      previousStatusEmoji = json.profile['status_emoji'];
      return fetch(appendParamsToUrl(SLACK_SET_STATUS_URL, statusBody), {
        method: 'POST',
      });
    })
    .then(resp => resp.json())
    .then(handleSlackAPIError(SLACK_SET_STATUS_URL))
    .then(() => ({ previousStatusText, previousStatusEmoji }))
    .catch(e => console.log(e.message));
}

function setDndFor(token, mins) {
  return fetch(appendParamsToUrl(SLACK_SET_DND, { token, num_minutes: mins }), {
    method: 'POST'
  }).then(handleSlackAPIError(SLACK_SET_DND));
}

function setDndEnd(token) {
  return fetch(appendParamsToUrl(SLACK_SET_DND_END, { token }), {
    method: 'POST'
  }).then(handleSlackAPIError(SLACK_SET_DND_END));
}
