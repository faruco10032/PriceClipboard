const form = document.getElementById('settingsForm');

function saveOptions() {
  const checkboxes = form.querySelectorAll('input[type="checkbox"]');
  const settings = {};

  checkboxes.forEach((checkbox) => {
    settings[checkbox.name] = checkbox.checked;
  });

  chrome.storage.sync.set(settings);
}

function restoreOptions() {
  chrome.storage.sync.get(null, (settings) => {
    for (const key in settings) {
      const checkbox = form.querySelector(`input[name="${key}"]`);
      if (checkbox) {
        checkbox.checked = settings[key];
      }
    }
  });
}

form.addEventListener('change', saveOptions);
document.addEventListener('DOMContentLoaded', restoreOptions);
