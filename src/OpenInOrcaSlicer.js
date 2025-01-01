// ==UserScript==
// @name        Printables: Open in Orca Slicer
// @description Replaces the "prusaslicer://open?file="-URLs with OrcaSlicer compatible URLs
// @match       https://www.printables.com/model/*
// @license     BSD-2-Clause OR MIT
// @downloadURL https://raw.githubusercontent.com/KizzyCode/Printables-OpenInOrcaSlicer-UserScript/refs/heads/master/src/OpenInOrcaSlicer.js
// @updateURL   https://raw.githubusercontent.com/KizzyCode/Printables-OpenInOrcaSlicer-UserScript/refs/heads/master/src/OpenInOrcaSlicer.js
// ==/UserScript==

(function() {
    // Override HTMLButtonElement.addEventListener
    const buttonElementAddEventListener = HTMLButtonElement.prototype.addEventListener;
    HTMLButtonElement.prototype.addEventListener = function(type, ...args) {
        // See if we have a slicer download button
        const classes = this.className.split(" ");
        const isSlicerButton = classes.includes("slicer-download") || classes.includes("slicer-download-all");
        const isHoverEvent = type === "mouseenter" || type === "mouseleave";
        if (isSlicerButton && isHoverEvent) {
            // Do not set event listener
            return;
        }
        
        // Add listener
        return buttonElementAddEventListener.apply(this, [type, ...args]);
    };
    
    // Override HTMLAnchorElement.click
    const anchorElementClick = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function(...args) {
        // Rewrite prusaslicer://open?file=... URLs
        const url = new URL(this.href);
        if (url.protocol.toLowerCase() === "prusaslicer:") {
            // Replace prusaslicer link with orcaslicer
            const fileURL = url.searchParams.get("file");
            const queryString = new URLSearchParams({ file: fileURL });
            this.href = `orcaslicer://open?${ queryString }`;
        }
        
        // Propagate click
        return anchorElementClick.apply(this, args);
    };
    
    // Update slicer icons
    setInterval(function() {
        // Scan all images
        for (const element of document.getElementsByTagName("IMG")) {
            if (element.getAttribute("alt") === "PrusaSlicer") {
            // Change tinting of all `PrusaSlicer` image elements
                element.src = element.src
                    .replace("fill='%23888'", "fill='%23000000'")
                    .replace("fill='%23ed6b21'", "fill='%23108776'");
            }
        }
    }, 1000);
})();
