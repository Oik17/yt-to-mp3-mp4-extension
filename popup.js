document.addEventListener("DOMContentLoaded", () => {
    const urlInput = document.getElementById("url");
    const autofillCheckbox = document.getElementById("autofillCheckbox");
  
    // Try autofill when enabled
    if (autofillCheckbox.checked) {
      getCurrentTabURL(url => {
        if (url.includes("youtube.com/watch")) {
          urlInput.value = url;
        }
      });
    }
  
    // Re-autofill when toggled
    autofillCheckbox.addEventListener("change", () => {
      if (autofillCheckbox.checked) {
        getCurrentTabURL(url => {
          if (url.includes("youtube.com/watch")) {
            urlInput.value = url;
          }
        });
      } else {
        urlInput.value = "";
      }
    });
  
    document.getElementById("mp3Btn").addEventListener("click", () => convert("mp3"));
    document.getElementById("mp4Btn").addEventListener("click", () => convert("mp4"));
  });
  
  let downloadURL = null;
  
  function getCurrentTabURL(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const tab = tabs[0];
      callback(tab?.url || "");
    });
  }
  
  function convert(format) {
    const url = document.getElementById("url").value.trim();
    const status = document.getElementById("status");
    const downloadBtn = document.getElementById("downloadBtn");
  
    downloadBtn.style.display = "none";
    downloadURL = null;
  
    if (!url.startsWith("http")) {
      status.textContent = "❌ Please enter a valid YouTube URL.";
      status.style.color = "red";
      return;
    }
    const cleanURL = url.includes("youtube.com/watch")
  ? `https://www.youtube.com/watch?v=${new URL(url).searchParams.get("v")}`
  : url;

    const apiURL = `https://caterpillar-hack-production.up.railway.app/download?url=${encodeURIComponent(cleanURL)}&format=${format}`;

    status.textContent = "⏳ Converting...";
    status.style.color = "#444";
  
    fetch(apiURL)
      .then(res => {
        if (!res.ok) throw new Error("Conversion failed");
        return res.blob();
      })
      .then(blob => {
        downloadURL = URL.createObjectURL(blob);
        status.textContent = "✅ Converted successfully!";
        status.style.color = "green";
  
        downloadBtn.style.display = "inline-block";
        downloadBtn.onclick = () => {
          const a = document.createElement("a");
          a.href = downloadURL;
          a.download = `video.${format}`;
          a.click();
        };
      })
      .catch(err => {
        status.textContent = "❌ Failed: " + err.message;
        status.style.color = "red";
      });
  }
  