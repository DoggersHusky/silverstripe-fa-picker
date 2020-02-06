(function($) {
  $.entwine(function($) {
    $(".fa-holder").entwine({
      onmatch: function() {
        let self = $(this);

        //update icon ammount
        $(this)
          .find(".fapicker-icons__bottom > span:nth-child(2)  strong")
          .html(iconList.length);

        //update icon version
        $(this)
          .find(".fapicker-icons__bottom > span:nth-child(1)  strong")
          .html(fa_version);

        //update selected icon on start
        $(this)
          .find("span.fapicker-icons__holder__icon i")
          .attr(
            "class",
            $(this)
              .find("input.fapicker.text")
              .val()
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
            .find(".fapicker-icons .fapicker-icons__holder")
            .append(newIcon);
        }

        //add the listeners for clicking the button
        $(this)
          .find(".fapicker-icons__holder__icon")
          .click(function(e) {
            //add the icon to the textfield
            self.find("input.fapicker.text").val($(this).data("icon"));

            //update selected icon
            self
              .find("span.fapicker-icons__holder__icon i")
              .attr("class", $(this).data("icon"));
          });

        //search filter
        $(this)
          .find(".fapicker-icons__search-holder input")
          .keyup(function(e) {
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
