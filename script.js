const links = {
    linkCold: 'rooms/cold.html',
    linkHot: 'rooms/hot.html',
    linkWarm: 'rooms/warm.html'
}

let currentIframeId;
// top left red button to close the full page iframe
const closeBtn = document.createElement('button');
closeBtn.classList.add('close-btn');
closeBtn.onclick = handleCloseIFrame;
closeBtn.innerText = '+';
let currentIframe;

function handleLinkClick(index) {
    currentIframeId = index;
    const link = links[index];
    const iframe = document.createElement('iframe');
    iframe.src = link;
    iframe.style = "position: fixed; border:5px groove #c1e8e2; z-index:50000; top: 100px; left: 20px;";
    iframe.width = 300;
    iframe.height = 200;
    iframe.classList.add('iframe', index);

    if (currentIframe != null)
        document.body.removeChild(currentIframe);

    
    document.body.appendChild(iframe);
    setCloseBtVisibility(true);
    
    currentIframe = iframe;
}

// control the visibility of the close button
function setCloseBtVisibility(visible) {
    if(visible) {
    document.body.appendChild(closeBtn);
  }else {
   document.body.removeChild(closeBtn);
  }
}

function handleCloseIFrame() {
    const iframe = document.querySelector(`.${currentIframeId}`);
  document.body.removeChild(iframe);
  currentIframe = null;
  setCloseBtVisibility(false);
}