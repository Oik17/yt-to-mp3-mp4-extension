document.getElementById("mp3Btn").addEventListener("click", () => convert("mp3"));
document.getElementById("mp4Btn").addEventListener("click", () => convert("mp4"));

let downloadURL = null;

function convert(format) {
  const url = document.getElementById("url").value;
  const status = document.getElementById("status");
  const downloadBtn = document.getElementById("downloadBtn");

  downloadBtn.style.display = "none";
  downloadURL = null;

  if (!url.startsWith("http")) {
    status.textContent = "Please enter a valid URL";
    return;
  }

  const apiURL = `https://caterpillar-hack-production.up.railway.app/download?url=${encodeURIComponent(url)}&format=${format}`;
  status.textContent = "Converting...";

  fetch(apiURL)
    .then(res => {
      if (!res.ok) throw new Error("Conversion failed");
      return res.blob();
    })
    .then(blob => {
      downloadURL = URL.createObjectURL(blob);
      status.textContent = "✅ Converted successfully!";
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
    });
}
