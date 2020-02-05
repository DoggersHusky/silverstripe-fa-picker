(function($) {
  $.entwine(function($) {
    $(".fa-holder .fapicker.text").entwine({
      onmatch: function() {
        let self = $(this);

        //loop through all the icons
        let newIcon = null;
        for (i = 0; i < iconList.icons.length; i++) {
          //make the new icon
          newIcon =
            '<div class="fapicker-icons__holder__icon" data-icon="' +
            iconList.icons[i].title +
            '"><i class="' +
            iconList.icons[i].title +
            '"></i></div>';

          //add the icons
          $(this)
            .parent()
            .find(".fapicker-icons .fapicker-icons__holder")
            .append(newIcon);
        }

        //add the listeners
        $(".fapicker-icons__holder__icon").click(function(e) {
          console.log($(this).data("icon"));
          self.val($(this).data("icon"));
        });
      },
    });

    $(".iconpicker-item").entwine({
      onclick: function(e) {
        e.preventDefault();
      },
    });
  });
})(jQuery);
