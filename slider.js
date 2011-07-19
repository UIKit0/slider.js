// A Simple flickr slider
(function($){

// Slider - a lightweight slider
// -----------------------------
this.Slider = Class.extend({
    // Constructor : init container node and current slide number
    init: function(node) {
        this.node = $(node);
        this.current = 0;
        this.lastHumanNav = 0;
    },
    
    // Go to slide number `num` : update both DOM and this.current
    slide: function(num) {
        var self = this;
        // Move current class in **slides**
        self.slides.eq(self.current).removeClass('current');
        self.slides.eq(num).addClass('current');
        // Move current class in **pages**
        self.pages.eq(self.current).removeClass('current');
        self.pages.eq(num).addClass('current');
        // Update current slider number
        self.current = num;
    },

    // Go to circular next slide (will call `slide`)
    next: function() {
        var next = this.current + 1;
        if(next >= this.slides.size()) next = 0;
        this.slide(next);
    },

    // Go to circular previous slide (will call `slide`)
    prev: function() {
        var prev = this.current - 1;
        if(prev < 0) prev = this.slides.size() - 1;
        this.slide(prev);
    },

    // Bind slider DOM events for navigation
    bind: function() {
        var self = this;
  
        self.node.find('.prevSlide').click(function(){ self.prev() });
        self.node.find('.nextSlide').click(function(){ self.next() });
        self.node.find('.slide-pager a').each(function(i){
            $(this).click(function(){
                self.slide(i);
            });
        });

        var now = function(){ return  new Date().getTime(); }
        self.node.find('.prevSlide, .nextSlide, .slide-pager a').click(function(){
            self.lastHumanNav = now();
        });
        if(!self.interval) {
            // Auto switch to next slide (but wait a moment if recent human interaction)
            self.interval = setInterval(function() {
                if(now()-self.lastHumanNav > 5000) self.next();
            }, 5000);
        }
    },

    // Start the slider
    start: function() {
        var self = this;
        
        self.slides = self.node.find('.slide-image');
        self.pages = self.node.find('.slide-pager a');
        
        this.bind();
        
        // init classes for current slide
        self.slides.removeClass('current').eq(self.current).addClass('current');
        self.pages.removeClass('current').eq(self.current).addClass('current');
    }
});

// Slider template
// ---------------
$.template('flickrSlider', '<div class="flickr-slider">'+
    '<div class="loader"><img src="load.gif"> Loading Flickr photos... (<span class="percent">0</span>%)</div>'+
    '<div class="slide-images">'+
        '{{each(i, slide) slides}}'+
            '<figure class="slide-image">'+
            '<a href="${slide.link}" target="_blank"><img src="${slide.src}"><figcaption>${slide.name}</figcaption></a>'+
            '</figure>'+
        '{{/each}}'+
    '</div>'+
    '<div class="options">'+
        '<a class="prevSlide" href="javascript:;">prev</a>'+
        '<span class="slide-pager">{{each slides}}<a href="javascript:;">${$index+1}</a>{{/each}}</span>'+
        '<a class="nextSlide" href="javascript:;">next</a>'+
    '</div>'+
'</div>');

// FlickrSlider extends Slider
// ------------
// retrieve recent photos, wait load and start slider
this.FlickrSlider = Slider.extend({
    // Constructor
    init: function(container) {
        this._super(container);
        this.container = $(container);
    },
    
    // Fetch flickr photos. You can override flickr params with the `options` arg
    fetch: function(options) {
        options = $.extend({
            method: 'flickr.photos.getRecent',
            per_page: 10,
            format: 'json',
            api_key: 'be902d7f912ea43230412619cb9abd52'
        }, options);
        var self = this;
        // Retrieve JSON flickr recent photos
        $.getJSON('http://www.flickr.com/services/rest/?jsoncallback=?', options, function(json){
            self.onResult(json);
        });
    },
    
    // On flickr photos fetched
    onResult: function(json) {
        var self = this;
        
        // Transforming json datas
        var slides = $.map(json.photos.photo, function(photo){
            return {
                link: 'http://www.flickr.com/photos/'+photo.owner+'/'+photo.id,
                src: 'http://farm'+photo.farm+'.static.flickr.com/'+photo.server+'/'+photo.id+'_'+photo.secret+'_z.jpg',
                name: photo.title.substring(0,20)
            }
        });
        
        // Templating and appending to DOM
        this.node = $.tmpl('flickrSlider', { slides: slides }).addClass('loading');
        self.container.empty().append(this.node);

        // Loading all images before showing the slider
        var nbLoad = 0;
        var imgs = self.node.find('.slide-image img').bind('load', function(){
            var total = imgs.size();
            if (++nbLoad == total) {
                self.node.removeClass('loading');
                self.start();
            }
            // Update loader progression (in percent)
            self.node.find('.loader .percent').text( Math.floor(100*nbLoad/total) );
        });
    }
});

}(jQuery));
