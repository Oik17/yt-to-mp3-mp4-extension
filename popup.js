function download(format) {
    const url = document.getElementById("url").value;
    const status = document.getElementById("status");
  
    if (!url.startsWith("http")) {
      status.textContent = "Please enter a valid URL";
      return;
    }
  
    const apiURL = `http://localhost:8080/download?url=${encodeURIComponent(url)}&format=${format}`;
    status.textContent = "Downloading...";
  
    fetch(apiURL)
      .then(res => {
        if (!res.ok) throw new Error("Download failed");
        return res.blob();
      })
      .then(blob => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `video.${format}`;
        a.click();
        status.textContent = "Download started!";
      })
      .catch(err => {
        status.textContent = "Failed: " + err.message;
      });
  }
  