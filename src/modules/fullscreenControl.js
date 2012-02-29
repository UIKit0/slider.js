/*~~~fullscreenControl~~~ 
 *
 * GET: 
 * SET: 
 *
 * <renaudeau.gaetan@gmail.com> - 2012
 */
sliderjs.modules.register("fullscreenControl", function (sandbox, $) {
  
  var defaultValue = {
    tmpl: $.tmpl('<a class="fullscreenButton icon" href="javascript:;"></a>')
  };
    
  function template () {
    var v = sandbox.value();
    return v.tmpl($.extend({}, v, defaultValue));
  }
    
  function onTemplated (nodes, container) {
    var node = nodes[0];
    $.bind(node, "click", function (e) {
      e.preventDefault();
      sandbox.opt("fullscreen", !sandbox.opt("fullscreen"));
    });
  }

  function onKeyDown (e) {
    if (e.keyCode == 27 && sandbox.opt("fullscreen")) {
      sandbox.opt("fullscreen", false);
    }
  }

  return {
    init: function () {
      sandbox.template.add(".sliderjs div.left", template, onTemplated, 9);
      $.bind(window, "keydown", onKeyDown);
    },
    fix: function (value) {
      return $.extend({}, defaultValue, value);
    },
    change: function (value, old) {
      sandbox.template.refresh(template);
    },
    destroy: function () {
      sandbox.template.remove(template);
      $.unbind(window, "keydown", onKeyDown);
    }
  }
});

