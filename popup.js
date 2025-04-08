document.addEventListener("DOMContentLoaded", () => {
    const urlInput = document.getElementById("url");
    const autofillCheckbox = document.getElementById("autofillCheckbox");
    const clearBtn = document.getElementById("clearBtn");
    const status = document.getElementById("status");
    const downloadBtn = document.getElementById("downloadBtn");
    const progressBar = document.getElementById("progress-bar");
    
    let downloadURL = null;
  
    // Handle clear button visibility
    urlInput.addEventListener("input", () => {
      clearBtn.style.display = urlInput.value ? "block" : "none";
    });
    
    // Clear input when button is clicked
    clearBtn.addEventListener("click", () => {
      urlInput.value = "";
      clearBtn.style.display = "none";
      urlInput.focus();
    });
  
    // Try autofill when enabled
    if (autofillCheckbox.checked) {
      getCurrentTabURL(url => {
        if (url.includes("youtube.com/watch") || url.includes("youtu.be/")) {
          urlInput.value = url;
          clearBtn.style.display = "block";
        }
      });
    }
  
    // Re-autofill when toggled
    autofillCheckbox.addEventListener("change", () => {
      if (autofillCheckbox.checked) {
        getCurrentTabURL(url => {
          if (url.includes("youtube.com/watch") || url.includes("youtu.be/")) {
            urlInput.value = url;
            clearBtn.style.display = "block";
          }
        });
      } else {
        urlInput.value = "";
        clearBtn.style.display = "none";
      }
    });
  
    document.getElementById("mp3Btn").addEventListener("click", () => convert("mp3"));
    document.getElementById("mp4Btn").addEventListener("click", () => convert("mp4"));
  
    function getCurrentTabURL(callback) {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const tab = tabs[0];
        callback(tab?.url || "");
      });
    }
  
    function convert(format) {
      const url = urlInput.value.trim();
      
      // Reset UI
      downloadBtn.style.display = "none";
      downloadURL = null;
      progressBar.style.width = "0";
    
      if (!url.includes("youtube.com/watch") && !url.includes("youtu.be/")) {
        status.textContent = "❌ Please enter a valid YouTube URL";
        status.style.color = "#d93025";
        return;
      }
      
      // Extract video ID for a clean URL
      let videoId;
      if (url.includes("youtube.com/watch")) {
        videoId = new URL(url).searchParams.get("v");
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0];
      }
      
      const cleanURL = `https://www.youtube.com/watch?v=${videoId}`;
      const apiURL = `https://caterpillar-hack-production.up.railway.app/download?url=${encodeURIComponent(cleanURL)}&format=${format}`;
  
      status.textContent = `⏳ Converting to ${format.toUpperCase()}...`;
      status.style.color = "#444";
      
      // Simulate progress
      let width = 0;
      const interval = setInterval(() => {
        if (width >= 90) {
          clearInterval(interval);
        } else {
          width += 5;
          progressBar.style.width = `${width}%`;
        }
      }, 300);
    
      fetch(apiURL)
        .then(res => {
          if (!res.ok) throw new Error("Conversion failed");
          return res.blob();
        })
        .then(blob => {
          clearInterval(interval);
          progressBar.style.width = "100%";
          downloadURL = URL.createObjectURL(blob);
          
          status.textContent = `✅ ${format.toUpperCase()} ready!`;
          status.style.color = "#0f9d58";
    
          downloadBtn.style.display = "block";
          downloadBtn.onclick = () => {
            const a = document.createElement("a");
            a.href = downloadURL;
            a.download = `youtube.${format}`;
            a.click();
          };
        })
        .catch(err => {
          clearInterval(interval);
          progressBar.style.width = "0";
          status.textContent = "❌ Error: " + err.message;
          status.style.color = "#d93025";
        });
    }
  });
  