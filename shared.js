const SLACK_SET_STATUS_URL = 'https://slack.com/api/users.profile.set';
const SLACK_GET_USER_PROFILE = 'https://slack.com/api/users.profile.get';

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

  return fetch(
    appendParamsToUrl(SLACK_GET_USER_PROFILE, { token: slackToken })
  )
    .then(resp => resp.json())
    .then(handleSlackAPIError(SLACK_GET_USER_PROFILE))
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
