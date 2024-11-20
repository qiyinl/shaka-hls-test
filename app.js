function initApp() {
    // Install built-in polyfills to patch browser incompatibilities.
    shaka.polyfill.installAll();
  
    // Check to see if the browser supports the basic APIs Shaka needs.
    if (!shaka.Player.isBrowserSupported()) {
      log('Browser not supported!');
      return;
    }
    // Everything looks good!
    initPlayer();
  }
  
  async function initPlayer() {
    // Create a Player instance.
    const video = document.getElementById('video');
    const player = new shaka.Player();
    await player.attach(video);
  
    // Listen for error events.
    player.addEventListener('error', (e) => {
          onError(e.detail);
        });
    // prove events are working
    player.addEventListener('started', (e) => {
          log('got `started` event:');
        });
    // log metadata
    player.addEventListener('emsg', (e) => {
          log('got `emsg` event:');
          log(e);
        });
    player.addEventListener('metadata', (e) => {
          log('got `metadata` event:');
          log(e);
        });
    player.addEventListener('timelineregionenter', (e) => {
          log('got `timelineregionenter` event:');
          log(e);
        });
  
    // Attach player to the window to make it easy to access in the JS console.
    window.player = player;
  }
  
  async function loadManifest() {
    let manifestUri = document.getElementById('url').value;
    // Try to load a manifest.
    // This is an asynchronous process.
    try {
      await window.player.load(manifestUri);
      // This runs if the asynchronous load is successful.
      log('The video has now been loaded!');
    } catch (e) {
      // onError is executed if the asynchronous load fails.
      onError(e);
    }
  }
  
  function onError(error) {
    // Log the error.
    log('Error code', error.code, 'object', error);
  }
  
  function clearLog() {
    let log_box = document.getElementById('event-log');
    log_box.innerHTML = "";
  }
  
  function log(message) {
      let now = new Date().toISOString();
      console.log(now, message);
      if(typeof message != "string") {
          message = JSON.encode(message);
      }
      let newDiv = document.createElement('div');
      newDiv.innerText = now + " - " + message;
      let log_box = document.getElementById('event-log');
      log_box.prepend(newDiv);
  }
  
  document.addEventListener('DOMContentLoaded', initApp);