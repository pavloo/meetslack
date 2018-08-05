console.log('yo');
chrome.storage.sync.get('is_snoozing', (data) => {
  const isSnoozing = !!data['is_snoozing'];
  console.log(isSnoozing);
});

document.getElementById('snooze').addEventListener('change', () => {
  console.log('yo');
});
