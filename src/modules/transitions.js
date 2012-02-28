/*~~~transitions~~~ Handling multiple transition to change frequently
 *
 * GET:
 * SET: 
 *
 * <renaudeau.gaetan@gmail.com> - 2012
 */
sliderjs.modules.register("transitions", function (sandbox, $) {
  
  var defaultValue = {
    transitions: [],
    everySlides: 3,
    change: "random"
  };

  var current = 0;

  function syncCurrentTransition (v) {
    var t = v.transitions[current];
    t && sandbox.opt("transition", v.transitions[current]);
  }

  function nextCurrent (v) {
    switch (v.change) {
      case "random": return Math.floor(Math.random()*v.transitions.length);
      case "circular": return current+1<v.transitions.length ? current+1 : 0;
    }
    return 0;
  }

  function next (v) {
    if (!v || v.transitions.length <= 0) return;
    current = nextCurrent(v);
    syncCurrentTransition(v);
  }

  var skipped = 0;
  function onSlideChanged (o) {
    var v = sandbox.value();
    if (!v) return;
    if (++skipped == v.everySlides) {
      next(v);
      skipped = 0;
    }
  }

  return {
    init: function () {
      sandbox.
        on("slideChanged", onSlideChanged);
      this.change(sandbox.value());
    },
    destroy: function () {
      sandbox.
        off("slideChanged", onSlideChanged);
    },
    fix: function (value, old) {
      if (!value) return;
      if (value instanceof Array) value = { transitions: value };
      return $.extend(defaultValue, value);
    },
    change: function (value, old) {
      value && syncCurrentTransition(value);
    }
  }
});

