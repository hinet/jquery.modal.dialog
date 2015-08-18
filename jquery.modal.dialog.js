/*
    A simple jQuery modal dialog (https://github.com/hinet/jquery.modal.dialog)
    Version 0.5.6
*/
(function($) {

  var current = null;

  $.dialog = function(el, options) {
    $.dialog.close(); // Close any open dialogs.
    var remove, target;
    this.$body = $('body');
    this.options = $.extend({}, $.dialog.defaults, options);
    this.options.doFade = !isNaN(parseInt(this.options.fadeDuration, 10));
    if (el.is('a')) {
      target = el.attr('href');
      //Select element by id from href
      if (/^#/.test(target)) {
        this.$elm = $(target);
        if (this.$elm.length !== 1) return null;
        this.open();
      //AJAX
      } else {
        this.$elm = $('<div>');
        this.$body.append(this.$elm);
        remove = function(event, dialog) { dialog.elm.remove(); };
        this.showSpinner();
        el.trigger($.dialog.AJAX_SEND);
        $.get(target).done(function(html) {
          if (!current) return;
          el.trigger($.dialog.AJAX_SUCCESS);
          current.$elm.empty().append(html).on($.dialog.CLOSE, remove);
          current.hideSpinner();
          current.open();
          el.trigger($.dialog.AJAX_COMPLETE);
        }).fail(function() {
          el.trigger($.dialog.AJAX_FAIL);
          current.hideSpinner();
          el.trigger($.dialog.AJAX_COMPLETE);
        });
      }
    } else {
      this.$elm = el;
      this.$body.append(this.$elm);
      this.open();
    }
  };

  $.dialog.prototype = {
    constructor: $.dialog,

    open: function() {
      var m = this;
      if(this.options.doFade) {
        this.block();
        setTimeout(function() {
          m.show();
        }, this.options.fadeDuration * this.options.fadeDelay);
      } else {
        this.block();
        this.show();
      }
      if (this.options.escapeClose) {
        $(document).on('keydown.dialog', function(event) {
          if (event.which == 27) $.dialog.close();
        });
      }
      if (this.options.clickClose) this.blocker.click($.dialog.close);
    },

    close: function() {
      this.unblock();
      this.hide();
      $(document).off('keydown.dialog');
    },

    block: function() {
      var initialOpacity = this.options.doFade ? 0 : this.options.opacity;
      this.$elm.trigger($.dialog.BEFORE_BLOCK, [this._ctx()]);
      this.blocker = $('<div class="jquery-dialog blocker"></div>').css({
        top: 0, right: 0, bottom: 0, left: 0,
        width: "100%", height: "100%",
        position: "fixed",
        zIndex: this.options.zIndex,
        background: this.options.overlay,
        opacity: initialOpacity
      });
      this.$body.append(this.blocker);
      if(this.options.doFade) {
        this.blocker.animate({opacity: this.options.opacity}, this.options.fadeDuration);
      }
      this.$elm.trigger($.dialog.BLOCK, [this._ctx()]);
    },

    unblock: function() {
      if(this.options.doFade) {
        this.blocker.fadeOut(this.options.fadeDuration, function() {
          $(this).remove();
        });
      } else {
        this.blocker.remove();
      }
    },

    show: function() {
      this.$elm.trigger($.dialog.BEFORE_OPEN, [this._ctx()]);
      if (this.options.showClose) {
        this.closeButton = $('<a href="#close-dialog" rel="dialog:close" class="close-dialog ' + this.options.closeClass + '">' + this.options.closeText + '</a>');
        this.$elm.append(this.closeButton);
      }
      this.$elm.addClass(this.options.dialogClass + ' current');
      this.center();
      if(this.options.doFade) {
        this.$elm.fadeIn(this.options.fadeDuration);
      } else {
        this.$elm.show();
      }
      this.$elm.trigger($.dialog.OPEN, [this._ctx()]);
    },

    hide: function() {
      this.$elm.trigger($.dialog.BEFORE_CLOSE, [this._ctx()]);
      if (this.closeButton) this.closeButton.remove();
      this.$elm.removeClass('current');

      if(this.options.doFade) {
        this.$elm.fadeOut(this.options.fadeDuration);
      } else {
        this.$elm.hide();
      }
      this.$elm.trigger($.dialog.CLOSE, [this._ctx()]);
    },

    showSpinner: function() {
      if (!this.options.showSpinner) return;
      this.spinner = this.spinner || $('<div class="' + this.options.dialogClass + '-spinner"></div>')
        .append(this.options.spinnerHtml);
      this.$body.append(this.spinner);
      this.spinner.show();
    },

    hideSpinner: function() {
      if (this.spinner) this.spinner.remove();
    },

    center: function() {
      this.$elm.css({
        position: 'fixed',
        top: "50%",
        left: "50%",
        marginTop: - (this.$elm.outerHeight() / 2),
        marginLeft: - (this.$elm.outerWidth() / 2),
        zIndex: this.options.zIndex + 1
      });
    },

    //Return context for custom events
    _ctx: function() {
      return { elm: this.$elm, blocker: this.blocker, options: this.options };
    }
  };

  //resize is alias for center for now
  $.dialog.prototype.resize = $.dialog.prototype.center;

  $.dialog.close = function(event) {
    if (!current) return;
    if (event) event.preventDefault();
    current.close();
    var that = current.$elm;
    current = null;
    return that;
  };

  $.dialog.resize = function() {
    if (!current) return;
    current.resize();
  };

  // Returns if there currently is an active dialog
  $.dialog.isActive = function () {
    return current ? true : false;
  }

  $.dialog.defaults = {
    overlay: "#000",
    opacity: 0.75,
    zIndex: 1,
    escapeClose: true,
    clickClose: true,
    closeText: 'Close',
    closeClass: '',
    dialogClass: "dialog",
    spinnerHtml: null,
    showSpinner: true,
    showClose: true,
    fadeDuration: null,   // Number of milliseconds the fade animation takes.
    fadeDelay: 1.0        // Point during the overlay's fade-in that the dialog begins to fade in (.5 = 50%, 1.5 = 150%, etc.)
  };

  // Event constants
  $.dialog.BEFORE_BLOCK = 'dialog:before-block';
  $.dialog.BLOCK = 'dialog:block';
  $.dialog.BEFORE_OPEN = 'dialog:before-open';
  $.dialog.OPEN = 'dialog:open';
  $.dialog.BEFORE_CLOSE = 'dialog:before-close';
  $.dialog.CLOSE = 'dialog:close';
  $.dialog.AJAX_SEND = 'dialog:ajax:send';
  $.dialog.AJAX_SUCCESS = 'dialog:ajax:success';
  $.dialog.AJAX_FAIL = 'dialog:ajax:fail';
  $.dialog.AJAX_COMPLETE = 'dialog:ajax:complete';

  $.fn.dialog = function(options){
    if (this.length === 1) {
      current = new $.dialog(this, options);
    }
    return this;
  };

  // Automatically bind links with rel="dialog:close" to, well, close the dialog.
  $(document).on('click.dialog', 'a[rel="dialog:close"],button[rel="dialog:close"]', $.dialog.close);
  $(document).on('click.dialog', 'a[rel="dialog:open"]', function(event) {
    event.preventDefault();
    $(this).dialog();
  });
})(jQuery);
