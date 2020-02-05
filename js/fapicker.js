(function($) {
  $.entwine(function($) {
    $(".fapicker.text").entwine({
      onmatch: function() {
        $(this).iconpicker();
      },
    });

    $(".iconpicker-item").entwine({
      onclick: function(e) {
        e.preventDefault();
      },
    });
  });
})(jQuery);
