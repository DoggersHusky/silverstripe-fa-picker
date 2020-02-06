(function($) {
  $.entwine(function($) {
    $(".fa-holder .fapicker.text").entwine({
      onmatch: function() {
        let self = $(this);

        //update icon ammount
        $(".fapicker-icons__bottom > span:nth-child(2)  strong").html(
          iconList.length,
        );

        //update icon version
        $(".fapicker-icons__bottom > span:nth-child(1)  strong").html(
          fa_version,
        );

        //loop through all the icons
        let newIcon = null;
        for (const icon of iconList) {
          //make the new icon
          newIcon =
            '<li class="fapicker-icons__holder__icon" data-icon="' +
            icon +
            '" ><i class="' +
            icon +
            '"></i></li>';

          //add the icons
          $(this)
            .parent()
            .find(".fapicker-icons .fapicker-icons__holder")
            .append(newIcon);
        }

        //add the listeners for clicking the button
        $(".fapicker-icons__holder__icon").click(function(e) {
          //add the icon to the textfield
          self.val($(this).data("icon"));

          //update slected icon
          $("span.fapicker-icons__holder__icon i").attr(
            "class",
            $(this).data("icon"),
          );
        });

        //search filter
        $(".fapicker-icons__search-holder input").keyup(function(e) {
          //reset icons after each key to allow for better filtering
          self
            .parent()
            .find(".fapicker-icons .fapicker-icons__holder li")
            .css("display", "flex");

          //set newSearch to the val of the input
          let newSearch = "" + $(this).val();

          //filter the list of icons
          self
            .parent()
            .find(".fapicker-icons .fapicker-icons__holder li")
            .filter(function(index) {
              //check to see if the datta icon contains the searched word
              //inverse to hide everything else
              return !$(this)
                .data("icon")
                .includes(newSearch);
            })
            .css("display", "none");
        });
      },
    });
  });
})(jQuery);
