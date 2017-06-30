'use strict';

const debounce = require('lodash.debounce');
const OverlayHighlight = require('./overlay-highlight');

const DEBOUNCE_WAIT = 50;
const _highlights = [];
const _highlightsChangedListeners = [];

const _notifyHighlightsChange = (highlights) => {
  _highlightsChangedListeners.forEach((cb)=>{
    cb(highlights);
  });
};

const _redrawHighlights = () => {
  _highlights.forEach( ( highlight ) => {
    highlight.render();
    _notifyHighlightsChange(highlight.getHighlightReferences());
  });
};


let _resizeListener;

module.exports = {

  highlightRange: (normedRange) => {

    if(!_resizeListener){
      _resizeListener = window.addEventListener('resize', debounce(_redrawHighlights, DEBOUNCE_WAIT), /*useCapture*/false);
    }

    const highlight = new OverlayHighlight(normedRange);

    highlight.render();

    // save highlight reference so we can redraw on viewport changes
    _highlights.push(highlight);

    return highlight.getHighlightReferences();
  },

  onHighlightsChanged: (cb) => {
    _highlightsChangedListeners.push(cb);
  },
};
