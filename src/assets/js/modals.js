function fadeOut(el, callback){
    var val;
    (function fadeOutAnimate() {
        val = parseFloat(el.style.opacity || 1) - .05;
        if (val > 0) {
            el.style.opacity = val;
            requestAnimationFrame(fadeOutAnimate);
        }
        else {
            el.style.opacity = 0;
            el.style.display = "none";
            if (callback && typeof callback === "function") {
                return callback(el);
            }
        }
    })();
}

function fadeIn(el, display, callback){
    if (display == undefined)
        el.style.display = "block";
    else
        el.style.display = display;

    var val;
    (function fadeInAnimate() {
        val = parseFloat(el.style.opacity || 0) + .05;
        if (val < 1.0) {
            el.style.opacity = val;
            requestAnimationFrame(fadeInAnimate);
        }
        else {
            el.style.opacity = 1;
            if (callback && typeof callback === "function") {
                return callback(el);
            }
        }
    })();
}



document.addEventListener('mousedown', function (e) {

    e = e || window.event;
    var target = e.target || e.srcElement;

    if (target.tagType == "path") {
        // Move up the DOM tree twice
        target = target.parentElement.parentElement;
    }
    else if (target.tagType == "svg") {
        // Move up the DOM tree once
        target = target.parentElement;
    }

    if (target.hasAttribute('data-toggle') && target.getAttribute('data-toggle') == 'modal') {
        if (target.hasAttribute('data-target')) {
            e.preventDefault();
            var m_ID = target.getAttribute('data-target');
            var modal = document.getElementById(m_ID);
            modal.classList.add('modal-open');
            fadeIn(modal);
        }
    }

    // Close modal window with 'data-dismiss' attribute or when the backdrop is clicked
    if ((target.hasAttribute('data-dismiss') && target.getAttribute('data-dismiss') == 'modal') || target.classList.contains('modal')) {
        e.preventDefault();
        var modal = ( document.getElementsByClassName('modal-open') )[0];
        modal.classList.remove('modal-open');
        fadeOut(modal);
    }

}, false);