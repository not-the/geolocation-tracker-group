    //// Requirements:
    // - Geolocation API
    // - Get time and date
    // - Storage API

    // Variables
    var nav = window.navigator.geolocation;
    var options = {
        timeout: 1000,
        maximumAge: 10000,
        enableHighAccuracy: true
    }
    var collapsed = true;
    var collapseObject = document.getElementById("");
    var mostRecentContainer = document.getElementById("mostRecentContainer");
    var componentsContainer = document.getElementById("componentsContainer");

    var currentReset = `
        <div class="categories" id="mostRecentItem">
          <ul>
            <p class="location">Location #</p><p class="right">Date/Time</p>
            <p class="location1">Latitude: ---</p>
            <p class="location1">Longitude: ---</p>
            <button class="delete_button right" onclick="deleteItem('current')">Delete</button>
          </ul>
        </div>
        `;



    // Start key counter and get elements on page load
    function keyCounter() {
      if(localStorage.getItem('entryCount') == null || localStorage.getItem('entryCount') == 0) {
        // Reset counter
        console.log("No LocalStorage data found, resetting counter...");
        localStorage.setItem('entryCount', 0);
      }
      else {
        // Loop through localstorage and write saved data to page
        console.log("LocalStorage data found, attempting to load...");

        for(i=1;i<=localStorage.getItem('entryCount');i++) {
          if(localStorage.getItem(`${i}date`) == null) {
            // Skip if current entry no longer exists
            continue;
          } else if( !(i + 1 == localStorage.getItem('entryCount')) ) {
            // Update page
            pageUpdate(i + 1, false);
          } else if(i + 1 == localStorage.getItem('entryCount')) {
            // Update page, is most recent item
            pageUpdate(i + 1, true);
          }
        }
      }
    }
    keyCounter();



    // Record current location (Button 1)
    function recordLocation() {
        nav.getCurrentPosition(navHandler, errorHandler, options);
    }

    // Navigation Handler
    function navHandler(position) {
        var date = new Date();
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        // Increase Key counter
        localStorage.setItem('entryCount', parseInt(localStorage.getItem('entryCount')) + 1);
        let keyNum = localStorage.getItem('entryCount');

        // Write to local storage with unique keys
        localStorage.setItem(`${keyNum}lat`,  latitude);
        localStorage.setItem(`${keyNum}long`, longitude);
        localStorage.setItem(`${keyNum}date`, `${date.toLocaleDateString
        ()} at ${date.toLocaleTimeString()}`);

        pageUpdate(keyNum, true);
    }

    // Error Handler
    function errorHandler(error) {
        console.log("Geolocation error");
    }

    // Clear History
    function clearHistory() {
      for(i=1;i<=localStorage.getItem("entryCount"); i++) {
        localStorage.clear("lat" + i);
        localStorage.clear("long" + i);
      }
      
      componentsContainer.innerHTML = "";
      mostRecentContainer.innerHTML = currentReset;
      keyCounter();
    }

    // Show more
    function showMore() {
      if(collapsed) {
        collapsed = false;
        componentsContainer.classList.remove("showMoreOpen");
        componentsContainer.classList.add("showMoreClosed");

        componentsContainer.style.visibility = "hidden";
        componentsContainer.style.overflow = "hidden";
        componentsContainer.style.height = "10px";
      } else {
        collapsed = true;
        componentsContainer.classList.remove("showMoreClosed");
        componentsContainer.classList.add("showMoreOpen");

        componentsContainer.style.visibility = "visible";
        componentsContainer.style.height = "unset";
      }
    }

    // Delete entry button
    function deleteItem(keyNum, current) {
      console.log(`deleteItem for keyNum: ${keyNum} with current set to ${current}`);

      // Remove from localstorage
      localStorage.removeItem(`${keyNum}lat`);
      localStorage.removeItem(`${keyNum}long`);
      localStorage.removeItem(`${keyNum}date`);

      // Remove from page
      if(current) {
        mostRecentContainer.innerHTML = currentReset;
        localStorage.setItem("entryCount", (localStorage.getItem("entryCount") - 1));
      } else {
        document.getElementById(`item${keyNum}`).remove();
      }
    }
  
    // Update Page
    function pageUpdate(keyNum, isCurrent, normal) {
      var sample = document.createElement("div");
      var minusOne = keyNum - 1;

      // Most Recent item
      if(isCurrent == true) {
        mostRecentContainer.innerHTML = `
        <div class="categories" id="item${keyNum}">
          <ul>
            <p class="location">Location ${keyNum}</p><p class="right">${localStorage.getItem(`${keyNum}date`)}</p>
            <p class="location1">Latitude: ${localStorage.getItem(`${keyNum}lat`)}</p>
            <p class="location1">Longitude: ${localStorage.getItem(`${keyNum}long`)}</p>
            <button type="deletebutton-2" class="delete_button right" onclick="deleteItem(${keyNum}, true)">Delete</button>
          </ul>
        </div>
        `;
      }

      // Collapse Items
      if( !(keyNum == 1) ) {
        sample.innerHTML = `
        <div class="categories" id="item${minusOne}">
          <ul>
            <p class="location">Location ${minusOne}</p><p class="right">${localStorage.getItem(`${minusOne}date`)}</p>
            <p class="location1">Latitude: ${localStorage.getItem(`${minusOne}lat`)}</p>
            <p class="location1">Longitude: ${localStorage.getItem(`${minusOne}long`)}</p>
            <button type="deletebutton-2" class="delete_button right" onclick="deleteItem(${minusOne}, false)">Delete</button>
          </ul>
        </div>
        `;
      }


      componentsContainer.prepend(sample);
    }