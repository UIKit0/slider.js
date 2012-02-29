/*~~~fullscreen~~~ 
 *
 * GET: 
 * SET: 
 *
 * <renaudeau.gaetan@gmail.com> - 2012
 */
sliderjs.modules.register("fullscreen", function (sandbox, $) {
  var cl = "fullscreen";
  var oldW, oldH;

  function onWindowResize () {
    var w = window.innerWidth, h = window.innerHeight;
    sandbox.opt("width", w).opt("height", h);
  }

  function setFullscreen (on) {
    if (!node) return;
    if(on) {
      oldW = sandbox.opt("width");
      oldH = sandbox.opt("height");
      $.addClass(node, cl);
      onWindowResize();
      $.unbind(window, "resize", onWindowResize);
      $.bind(window, "resize", onWindowResize);
    }
    else {
      oldW && sandbox.opt("width", oldW);
      oldH && sandbox.opt("height", oldH);
      $.removeClass(node, cl);
      $.unbind(window, "resize", onWindowResize);
    }
  }
  
  function onTemplated (container) {
    node = $.find(container, ".sliderjs")[0];
    setFullscreen(sandbox.value());
  }

  return {
    def: false,
    init: function () {
      sandbox.on("templated", onTemplated);
    },
    destroy: function () {
      sandbox.off("templated", onTemplated);
    },
    change: function (value) {
      setFullscreen(value);
    }
  }
});

