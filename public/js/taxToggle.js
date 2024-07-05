let taxSwitch = document.getElementById("flexSwitchCheckDefault");
let gstinfo = document.getElementsByClassName("gst");
taxSwitch.addEventListener("click", () => {
  for (gst of gstinfo) {
      if (gst.style.display != "inline")
    {
      gst.style.display = "inline";
      } else {
          gst.style.display = "none";
    }
  }
});
