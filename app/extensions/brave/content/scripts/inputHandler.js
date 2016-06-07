/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

// inject missing DOM Level 3 KeyEvent
// https://www.w3.org/TR/2001/WD-DOM-Level-3-Events-20010410/DOM3-Events.html#events-Events-KeyEvent
if (typeof KeyEvent === 'undefined') {
  KeyEvent = {
    DOM_VK_CANCEL: 3,
    DOM_VK_HELP: 6,
    DOM_VK_BACK_SPACE: 8,
    DOM_VK_TAB: 9,
    DOM_VK_CLEAR: 12,
    DOM_VK_RETURN: 13,
    DOM_VK_ENTER: 14,
    DOM_VK_SHIFT: 16,
    DOM_VK_CONTROL: 17,
    DOM_VK_ALT: 18,
    DOM_VK_PAUSE: 19,
    DOM_VK_CAPS_LOCK: 20,
    DOM_VK_ESCAPE: 27,
    DOM_VK_SPACE: 32,
    DOM_VK_PAGE_UP: 33,
    DOM_VK_PAGE_DOWN: 34,
    DOM_VK_END: 35,
    DOM_VK_HOME: 36,
    DOM_VK_LEFT: 37,
    DOM_VK_UP: 38,
    DOM_VK_RIGHT: 39,
    DOM_VK_DOWN: 40,
    DOM_VK_PRINTSCREEN: 44,
    DOM_VK_INSERT: 45,
    DOM_VK_DELETE: 46,
    DOM_VK_0: 48,
    DOM_VK_1: 49,
    DOM_VK_2: 50,
    DOM_VK_3: 51,
    DOM_VK_4: 52,
    DOM_VK_5: 53,
    DOM_VK_6: 54,
    DOM_VK_7: 55,
    DOM_VK_8: 56,
    DOM_VK_9: 57,
    DOM_VK_SEMICOLON: 59,
    DOM_VK_EQUALS: 61,
    DOM_VK_A: 65,
    DOM_VK_B: 66,
    DOM_VK_C: 67,
    DOM_VK_D: 68,
    DOM_VK_E: 69,
    DOM_VK_F: 70,
    DOM_VK_G: 71,
    DOM_VK_H: 72,
    DOM_VK_I: 73,
    DOM_VK_J: 74,
    DOM_VK_K: 75,
    DOM_VK_L: 76,
    DOM_VK_M: 77,
    DOM_VK_N: 78,
    DOM_VK_O: 79,
    DOM_VK_P: 80,
    DOM_VK_Q: 81,
    DOM_VK_R: 82,
    DOM_VK_S: 83,
    DOM_VK_T: 84,
    DOM_VK_U: 85,
    DOM_VK_V: 86,
    DOM_VK_W: 87,
    DOM_VK_X: 88,
    DOM_VK_Y: 89,
    DOM_VK_Z: 90,
    DOM_VK_CONTEXT_MENU: 93,
    DOM_VK_NUMPAD0: 96,
    DOM_VK_NUMPAD1: 97,
    DOM_VK_NUMPAD2: 98,
    DOM_VK_NUMPAD3: 99,
    DOM_VK_NUMPAD4: 100,
    DOM_VK_NUMPAD5: 101,
    DOM_VK_NUMPAD6: 102,
    DOM_VK_NUMPAD7: 103,
    DOM_VK_NUMPAD8: 104,
    DOM_VK_NUMPAD9: 105,
    DOM_VK_MULTIPLY: 106,
    DOM_VK_ADD: 107,
    DOM_VK_SEPARATOR: 108,
    DOM_VK_SUBTRACT: 109,
    DOM_VK_DECIMAL: 110,
    DOM_VK_DIVIDE: 111,
    DOM_VK_F1: 112,
    DOM_VK_F2: 113,
    DOM_VK_F3: 114,
    DOM_VK_F4: 115,
    DOM_VK_F5: 116,
    DOM_VK_F6: 117,
    DOM_VK_F7: 118,
    DOM_VK_F8: 119,
    DOM_VK_F9: 120,
    DOM_VK_F10: 121,
    DOM_VK_F11: 122,
    DOM_VK_F12: 123,
    DOM_VK_F13: 124,
    DOM_VK_F14: 125,
    DOM_VK_F15: 126,
    DOM_VK_F16: 127,
    DOM_VK_F17: 128,
    DOM_VK_F18: 129,
    DOM_VK_F19: 130,
    DOM_VK_F20: 131,
    DOM_VK_F21: 132,
    DOM_VK_F22: 133,
    DOM_VK_F23: 134,
    DOM_VK_F24: 135,
    DOM_VK_NUM_LOCK: 144,
    DOM_VK_SCROLL_LOCK: 145,
    DOM_VK_COMMA: 188,
    DOM_VK_PERIOD: 190,
    DOM_VK_SLASH: 191,
    DOM_VK_BACK_QUOTE: 192,
    DOM_VK_OPEN_BRACKET: 219,
    DOM_VK_BACK_SLASH: 220,
    DOM_VK_CLOSE_BRACKET: 221,
    DOM_VK_QUOTE: 222,
    DOM_VK_META: 224
  };
}

// TODO(bridiver) - can we enable KeyEvent with webkit prefs?
// KeyboardEventCode status=experimental
// KeyboardEventKey status=test

document.addEventListener('contextmenu', (e/*: Event*/) => {
  window.setTimeout(() => {
    if (!(e instanceof MouseEvent)) {
      return
    }
    // there is another event being fired on contextmenu, don't show this one
    if (e.defaultPrevented) {
      return
    }

    if (!e.target.nodeName) {
      return
    }

    var name = e.target.nodeName.toUpperCase()
    var href
    var maybeLink = e.target

    while (maybeLink.parentNode) {
      // Override for about: pages
      if (!maybeLink.getAttribute || maybeLink.getAttribute('data-context-menu-disable')) {
        return
      }
      if (maybeLink instanceof HTMLAnchorElement) {
        href = maybeLink.href
        break
      }
      maybeLink = maybeLink.parentNode
    }

    const selection = window.getSelection().toString()
    let spellcheck = null
    if (e.target.spellcheck && !e.target.readonly && !e.target.disabled) {
      let suggestions = []
      let isMisspelled = false
      if (selection.length > 0 && !hasWhitespace(selection)) {
        // This is not very taxing, it only happens once on right click and only
        // if it is on one word, and the check and result set are returned very fast.
        const info =chrome.ipc.sendSync('get-misspelling-info', selection)
        suggestions = info.suggestions
        isMisspelled = info.isMisspelled
      }
      spellcheck = {
        suggestions,
        isMisspelled
      }
    }

    let src = e.target.getAttribute ? e.target.getAttribute('src') : undefined
    // If the src is not fully specified, then try to expand it
    try {
      if (src) {
        src = new URL(src, window.location).href
      }
    } catch (e) {
    }

    var nodeProps = {
      name: name,
      href: href,
      isContentEditable: e.target.isContentEditable || false,
      src,
      selection,
      hasSelection: selection.length > 0,
      spellcheck,
      offsetX: e.pageX,
      offsetY: e.pageY
    }
   chrome.ipc.sendToHost('context-menu-opened', nodeProps)
    e.preventDefault()
  }, 0)
}, false)

document.addEventListener('keydown', (e /*: Event*/) => {
  if (!(e instanceof KeyboardEvent)) {
    return
  }
  switch (e.keyCode) {
    case KeyEvent.DOM_VK_ESCAPE:
      if (document.readyState !== 'complete') {
        e.preventDefault()
       chrome.ipc.sendToHost('stop-load')
      }
      break
    case KeyEvent.DOM_VK_BACK_SPACE:
      if (!isEditable(document.activeElement)) {
        e.shiftKey ?chrome.ipc.sendToHost('go-forward') :chrome.ipc.sendToHost('go-back')
      }
      break
    case KeyEvent.DOM_VK_LEFT:
      if (e.metaKey && !isEditable(document.activeElement) && isPlatformOSX()) {
       chrome.ipc.sendToHost('go-back')
      }
      break
    case KeyEvent.DOM_VK_RIGHT:
      if (e.metaKey && !isEditable(document.activeElement) && isPlatformOSX()) {
       chrome.ipc.sendToHost('go-forward')
      }
      break
  }
})

// shamelessly taken from https://developer.mozilla.org/en-US/docs/Web/Events/mouseenter
function delegate (event, selector) {
  var target = event.target
  var related = event.relatedTarget

  if (!(target instanceof Element && related instanceof Element)) {
    return
  }

  var match

  // search for a parent node matching the delegation selector
  while (target && target !== document && target.matches && !(match = target.matches(selector))) {
    target = target.parentNode
  }

  // exit if no matching node has been found
  if (!match) {
    return
  }

  // loop through the parent of the related target to make sure that it's not a child of the target
  while (related && related !== target && related !== document) {
    related = related.parentNode
  }

  // exit if this is the case
  if (related === target) {
    return
  }

  return target
}

document.addEventListener('mouseover', (event/*: Event*/) => {
  if (!(event instanceof MouseEvent)) {
    return
  }
  var target = delegate(event, 'a')
  if (target) {
    const pos = {
      x: event.clientX,
      y: event.clientY
    }
   chrome.ipc.sendToHost('link-hovered', target.href, pos)
  }
})

document.addEventListener('mouseout', (event/*: Event*/) => {
  if (!(event instanceof MouseEvent)) {
    return
  }
  if (delegate(event, 'a')) {
   chrome.ipc.sendToHost('link-hovered', null)
  }
})