jQuery(window).load(function(){
	initOpenClose();
	initNavigationSelect();
	initSlideShow();
 });
 /* fade-box init */
 function initOpenClose() {
	 jQuery('section.block').openClose({
		 addClassBeforeAnimation: false,
		 activeClass:'expanded',
		 opener:'div.opener',
		 slider:'div.fade-box',
		 effect:'fade',
		 animSpeed:400,
		 event:'hover'
	 });
 }
 /* init convert navigation to select */
 function initNavigationSelect() {
	 jQuery('#nav>.container>ul').navigationSelect({
		 levelIndentHTML: '- ',
		 defaultOptionAttr: 'title',
		 defaultOptionText: 'Menu:'
	 });
 }
/* slideshow init */
function initSlideShow() {
	jQuery('div.slider-holder').fadeGallery({
		slides: 'div.smask li',
		currentNumber: 'span.cur-num',
		totalNumber: 'span.all-num',
		switchSimultaneously: false,
		autoRotation: true,
		autoHeight: true,
		switchTime: 5000,
		animSpeed: 600
	});
}
/* FADE BOX */
;(function($){
	$.fn.openClose = function(o){
		// default options
		var options = $.extend({
			addClassBeforeAnimation: true,
			activeClass:'active',
			opener:'.opener',
			slider:'.slide',
			animSpeed: 400,
			animStart:false,
			animEnd:false,
			effect:'fade',
			event:'click'
		},o);

		return this.each(function(){
			// options
			var holder = $(this), animating;
			var opener = $(options.opener, holder);
			var slider = $(options.slider, holder);
			if(slider.length) {
				opener.bind(options.event,function(){
					if(!animating) {
						animating = true;
						if(typeof options.animStart === 'function') options.animStart();
						if(holder.hasClass(options.activeClass)) {
							toggleEffects[options.effect].hide({
								speed: options.animSpeed,
								box: slider,
								complete: function() {
									animating = false;
									if(!options.addClassBeforeAnimation) {
										holder.removeClass(options.activeClass);
									}
									if(typeof options.animEnd === 'function') options.animEnd();
								}
							});
							if(options.addClassBeforeAnimation) {
								holder.removeClass(options.activeClass);
							}
						} else {
							if(options.addClassBeforeAnimation) {
								holder.addClass(options.activeClass);
							}
							toggleEffects[options.effect].show({
								speed: options.animSpeed,
								box: slider,
								complete: function() {
									animating = false;
									if(!options.addClassBeforeAnimation) {
										holder.addClass(options.activeClass);
									}
									if(typeof options.animEnd === 'function') options.animEnd();
								}
							})
						}
					}
					return false;
				});
				if(holder.hasClass(options.activeClass)) {
					slider.show();
				}
				else {
					slider.hide();
				}
			}
		});
	}
	
	// animation effects
	var toggleEffects = {
		slide: {
			show: function(o) {
				o.box.slideDown(o.speed, o.complete);
			},
			hide: function(o) {
				o.box.slideUp(o.speed, o.complete);
			}
		},
		fade: {
			show: function(o) {
				o.box.fadeIn(o.speed, o.complete);
			},
			hide: function(o) {
				o.box.fadeOut(o.speed, o.complete);
			}
		},
		none: {
			show: function(o) {
				o.box.show(0, o.complete);
			},
			hide: function(o) {
				o.box.hide(0, o.complete);
			}
		}
	}
}(jQuery));
/* PUT ARROW IF HAS DROP-DOWN */
function initPage() {
	initHasDropDown();
}
function initHasDropDown()
{
	var nav = document.getElementById("nav");
	if(nav) {
		var lis = nav.getElementsByTagName("li");
		for (var i=0; i<lis.length; i++) {
			if(lis[i].getElementsByTagName("ul").length > 0) {
				lis[i].className += " has-drop-down"
				lis[i].getElementsByTagName("a")[0].className += " has-drop-down-a"
			}
			lis[i].onmouseover = function()	{
				this.className += " hover";
			}
			lis[i].onmouseout = function() {
				this.className = this.className.replace(" hover", "");
			}
		}
	}
}
if (window.addEventListener)
	window.addEventListener("load", initPage, false);
else if (window.attachEvent && !window.opera)
	window.attachEvent("onload", initPage);
/* CONVERT NAVIGATION TO SELECT */
/* generate select from navigation */
;(function($) {
	function NavigationSelect(options) {
		this.options = $.extend({
			list: null,
			levelIndentHTML: ' &bull; ',
			defaultOptionAttr: 'title',
			defaultOptionText: '...',
			selectClass: 'nav-select',
			activeClass: 'nav-active',
			defaultOptionClass: 'opt-default',
			hasDropClass: 'opt-sublevel',
			levelPrefixClass: 'opt-level-',
			useDefaultOption: true
		}, options);
		if(this.options.list) {
			this.createSelect();
			this.attachEvents();
		}
	}
	NavigationSelect.prototype = {
		createSelect: function() {
			var self = this;
			this.startIndex = 0;
			this.navigation = $(this.options.list);
			this.select = $('<select>').addClass(this.options.selectClass);
			this.createDefaultOption();
			this.createList(this.navigation, 0);
			this.select.insertBefore(this.navigation);
		},
		createDefaultOption: function() {
			if(this.options.useDefaultOption) {
				var attrText = this.navigation.attr(this.options.defaultOptionAttr);
				var defaultOption = $('<option>').addClass(this.options.defaultOptionClass).text(attrText || this.options.defaultOptionText);
				this.navigation.removeAttr(this.options.defaultOptionAttr);
				this.select.append(defaultOption);
				this.startIndex = 1;
			}
		},
		createList: function(list, level) {
			var self = this;
			list.children().each(function(index, item) {
				var listItem = $(this),
					listLink = listItem.find('a').eq(0),
					listDrop = listItem.find('ul').eq(0),
					hasDrop = listDrop.length > 0;

				if(listLink.length) {
					self.select.append(self.createOption(listLink, hasDrop, level, listLink.hasClass(self.options.activeClass)));
				}
				if(hasDrop) {
					self.createList(listDrop, level + 1);
				}
			});
		},
		createOption: function(link, hasDrop, level, selected) {
			var optionHTML = this.getLevelIndent(level) + link.html();
			return $('<option>').html(optionHTML)
				.addClass(this.options.levelPrefixClass + (level + 1))
				.toggleClass(this.options.hasDropClass, hasDrop)
				.val(link.attr('href')).attr('selected', selected ? 'selected' : false);
		},
		getLevelIndent: function(level) {
			return (new Array(level + 1)).join(this.options.levelIndentHTML);
		},
		attachEvents: function() {
			// redirect on select change
			var self = this;
			this.select.change(function() {
				if(this.selectedIndex >= self.startIndex) {
					location.href = this.value;
				}
			});
		}
	};

	// jquery pluginm interface
	$.fn.navigationSelect = function(opt) {
		return this.each(function() {
			new NavigationSelect($.extend({list: this}, opt));
		});
	};
}(jQuery));
/* SLIDESHOW WITH FADE EFFECT */
/* jQuery SlideShow plugin */
;(function($){
	function FadeGallery(options) {
		this.options = $.extend({
			slides: 'ul.slideset > li',
			activeClass:'active',
			disabledClass:'disabled',
			btnPrev: 'a.btn-prev',
			btnNext: 'a.btn-next',
			generatePagination: false,
			pagerList: '<ul>',
			pagerListItem: '<li><a href="#"></a></li>',
			pagerListItemText: 'a',
			pagerLinks: '.pagination li',
			currentNumber: 'span.current-num',
			totalNumber: 'span.total-num',
			btnPlay: '.btn-play',
			btnPause: '.btn-pause',
			btnPlayPause: '.btn-play-pause',
			autorotationActiveClass: 'autorotation-active',
			autorotationDisabledClass: 'autorotation-disabled',
			circularRotation: true,
			switchSimultaneously: true,
			disableWhileAnimating: false,
			disableFadeIE: false,
			autoRotation: false,
			pauseOnHover: true,
			autoHeight: false,
			switchTime: 4000,
			animSpeed: 600,
			event:'click'
		}, options);
		this.init();
	}
	FadeGallery.prototype = {
		init: function() {
			if(this.options.holder) {
				this.findElements();
				this.initStructure();
				this.attachEvents();
				this.refreshState(true);
				this.autoRotate();
				this.makeCallback('onInit', this);
			}
		},
		findElements: function() {
			// control elements
			this.gallery = $(this.options.holder);
			this.slides = this.gallery.find(this.options.slides);
			this.slidesHolder = this.slides.eq(0).parent();
			this.stepsCount = this.slides.length;
			this.btnPrev = this.gallery.find(this.options.btnPrev);
			this.btnNext = this.gallery.find(this.options.btnNext);
			this.currentIndex = 0;
			
			// disable fade effect in old IE
			if(this.options.disableFadeIE && $.browser.msie && $.browser.version < 9) {
				this.options.animSpeed = 0;
			}
			
			// create gallery pagination
			if(typeof this.options.generatePagination === 'string') {
				this.pagerHolder = this.gallery.find(this.options.generatePagination).empty();
				this.pagerList = $(this.options.pagerList).appendTo(this.pagerHolder);
				for(var i = 0; i < this.stepsCount; i++) {
					$(this.options.pagerListItem).appendTo(this.pagerList).find(this.options.pagerListItemText).text(i+1);
				}
				this.pagerLinks = this.pagerList.children();
			} else {
				this.pagerLinks = this.gallery.find(this.options.pagerLinks);
			}
			
			// get start index
			var activeSlide = this.slides.filter('.'+this.options.activeClass);
			if(activeSlide.length) {
				this.currentIndex = this.slides.index(activeSlide);
			}
			this.prevIndex = this.currentIndex;
			
			// autorotation control buttons
			this.btnPlay = this.gallery.find(this.options.btnPlay);
			this.btnPause = this.gallery.find(this.options.btnPause);
			this.btnPlayPause = this.gallery.find(this.options.btnPlayPause);
			
			// misc elements
			this.curNum = this.gallery.find(this.options.currentNumber);
			this.allNum = this.gallery.find(this.options.totalNumber);
		},
		initStructure: function() {
			this.slides.css({display:'block',opacity:0}).eq(this.currentIndex).css({
				opacity:''
			});
		},
		attachEvents: function() {
			this.btnPrev.bind(this.options.event, this.bindScope(function(e){
				this.prevSlide();
				e.preventDefault();
			}));
			this.btnNext.bind(this.options.event, this.bindScope(function(e){
				this.nextSlide();
				e.preventDefault();
			}));
			this.pagerLinks.each(this.bindScope(function(ind, obj){
				$(obj).bind(this.options.event, this.bindScope(function(e){
					this.numSlide(ind);
					e.preventDefault();
				}));
			}));
			
			// autorotation buttons handler
			this.btnPlay.bind(this.options.event, this.bindScope(function(e){
				this.startRotation();
				e.preventDefault();
			}));
			this.btnPause.bind(this.options.event, this.bindScope(function(e){
				this.stopRotation();
				e.preventDefault();
			}));
			this.btnPlayPause.bind(this.options.event, this.bindScope(function(e){
				if(!this.gallery.hasClass(this.options.autorotationActiveClass)) {
					this.startRotation();
				} else {
					this.stopRotation();
				}
				e.preventDefault();
			}));
			
			// pause on hover handling
			if(this.options.pauseOnHover) {
				this.gallery.hover(this.bindScope(function(){
					if(this.options.autoRotation) {
						this.galleryHover = true;
						this.pauseRotation();
					}
				}), this.bindScope(function(){
					if(this.options.autoRotation) {
						this.galleryHover = false;
						this.resumeRotation();
					}
				}));
			}
		},
		prevSlide: function() {
			if(!(this.options.disableWhileAnimating && this.galleryAnimating)) {
				this.prevIndex = this.currentIndex;
				if(this.currentIndex > 0) {
					this.currentIndex--;
					this.switchSlide();
				} else if(this.options.circularRotation) {
					this.currentIndex = this.stepsCount - 1;
					this.switchSlide();
				}
			}
		},
		nextSlide: function(fromAutoRotation) {
			if(!(this.options.disableWhileAnimating && this.galleryAnimating)) {
				this.prevIndex = this.currentIndex;
				if(this.currentIndex < this.stepsCount - 1) {
					this.currentIndex++;
					this.switchSlide();
				} else if(this.options.circularRotation || fromAutoRotation === true) {
					this.currentIndex = 0;
					this.switchSlide();
				}
			}
		},
		numSlide: function(c) {
			if(this.currentIndex != c) {
				this.prevIndex = this.currentIndex;
				this.currentIndex = c;
				this.switchSlide();
			}
		},
		switchSlide: function() {
			if(this.slides.length > 1) {
				this.galleryAnimating = true;
				this.slides.eq(this.prevIndex).stop().animate({opacity:0},{duration: this.options.animSpeed, complete: this.bindScope(function(){
					this.slides.eq(this.prevIndex).css({opacity:0});
				})});
				clearTimeout(this.switchTimer);
				this.switchTimer = setTimeout(this.bindScope(function(){
					this.slides.eq(this.currentIndex).stop().animate({opacity:1},{duration: this.options.animSpeed, complete: this.bindScope(function(){
						this.slides.eq(this.currentIndex).css({opacity:''});
						this.galleryAnimating = false;
						this.autoRotate();
						
						// onchange callback
						this.makeCallback('onChange', this);
					})});
					
				}), this.options.switchSimultaneously ? 1 : this.options.animSpeed);
				this.refreshState();
				
				// onchange callback
				this.makeCallback('onBeforeChange', this);
			}
		},
		refreshState: function(initial) {
			this.slides.removeClass(this.options.activeClass).eq(this.currentIndex).addClass(this.options.activeClass);
			this.pagerLinks.removeClass(this.options.activeClass).eq(this.currentIndex).addClass(this.options.activeClass);
			this.curNum.html(this.currentIndex+1);
			this.allNum.html(this.stepsCount);
			
			// initial refresh
			if(this.options.autoHeight) {
				if(initial) {
					this.slidesHolder.css({height: this.slides.eq(this.currentIndex).outerHeight(true) });
				} else {
					this.slidesHolder.stop().animate({height: this.slides.eq(this.currentIndex).outerHeight(true)}, {duration: this.options.animSpeed});
				}
			}
			
			// disabled state
			if(!this.options.circularRotation) {
				this.btnPrev.add(this.btnNext).removeClass(this.options.disabledClass);
				if(this.currentIndex === 0) this.btnPrev.addClass(this.options.disabledClass);
				if(this.currentIndex === this.stepsCount - 1) this.btnNext.addClass(this.options.disabledClass);
			}
		},
		startRotation: function() {
			this.options.autoRotation = true;
			this.galleryHover = false;
			this.autoRotationStopped = false;
			this.resumeRotation();
		},
		stopRotation: function() {
			this.galleryHover = true;
			this.autoRotationStopped = true;
			this.pauseRotation();
		},
		pauseRotation: function() {
			this.gallery.addClass(this.options.autorotationDisabledClass);
			this.gallery.removeClass(this.options.autorotationActiveClass);
			clearTimeout(this.timer);
		},
		resumeRotation: function() {
			if(!this.autoRotationStopped) {
				this.gallery.addClass(this.options.autorotationActiveClass);
				this.gallery.removeClass(this.options.autorotationDisabledClass);
				this.autoRotate();
			}
		},
		autoRotate: function() {
			clearTimeout(this.timer);
			if(this.options.autoRotation && !this.galleryHover && !this.autoRotationStopped) {
				this.gallery.addClass(this.options.autorotationActiveClass);
				this.timer = setTimeout(this.bindScope(function(){
					this.nextSlide(true);
				}), this.options.switchTime);
			} else {
				this.pauseRotation();
			}
		},
		bindScope: function(func, scope) {
			return $.proxy(func, scope || this);
		},
		makeCallback: function(name) {
			if(typeof this.options[name] === 'function') {
				var args = Array.prototype.slice.call(arguments);
				args.shift();
				this.options[name].apply(this, args);
			}
		}
	}
	// jquery plugin
	$.fn.fadeGallery = function(opt){
		return this.each(function(){
			$(this).data('FadeGallery', new FadeGallery($.extend(opt,{holder:this})));
		});
	}
}(jQuery));
