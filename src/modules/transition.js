/*~~~transition~~~ Shortcut for the different kind of transitions (css, canvas, ...)
 *
 * GET: the last current transition (except if you used a specific transition module like cssTransition)
 * SET: a new transition:
 *  - { mode: string, name: string } : will trigger the transition of the related module.
 *  the mode must be valid : (mode+"Transition") should be a valid module. ex: mode="css"
 *
 * <renaudeau.gaetan@gmail.com> - 2012
 */
sliderjs.modules.register("transition", function (sandbox, $) {
  var suffix = "Transition",
      fallback = { mode: "css", name: "simple" };

  function transitionSupported (t) {
    if (!t || !t.mode) return false;
    var supported = sandbox.ask(t.mode+suffix, "supported");
    return !supported || supported();
  }

  function onTransitionMode (o) {
    // TODO
  }

  return {
    init: function () {
      this.change(sandbox.value());
      sandbox.on("transitionMode", onTransitionMode);
    },
    destroy: function () {
      sandbox.off("transitionMode", onTransitionMode);
    },
    fix: function (value, old) {
      if (value instanceof Array) {
        for (var i=0; i<value.length; ++i)
          if(transitionSupported(value[i])) 
            return value[i];
      }
      else {
        if (transitionSupported(value)) return value;
      }
      return fallback;
    },
    change: function (value, old) {
      if (!value) return;
      sandbox.opt(value.mode+suffix, value);
    }
  }
});

