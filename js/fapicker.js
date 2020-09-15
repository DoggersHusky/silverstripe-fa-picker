(function ($) {
  $.entwine(function ($) {
    $(".fa-holder").entwine({
      Type: "",
      onmatch: function () {
        //reference
        let self = $(this);
        let activeIcon = $(this)
          .find("input.fapicker.text")
          .val()
          .split(" ")
          .pop();

        //update selected icon on start
        $(this)
          .find("span.fapicker-icons__holder__icon i")
          .attr("class", $(this).find("input.fapicker.text").val());

        //add active class to icon if has one
        if (activeIcon) {
          $(this)
            .find(
              ".fapicker-icons__holder ." +
                $(this).find("input.fapicker.text").val().split(" ").pop(),
            )
            .parent()
            .addClass("active");
        }

        //clicking the icon event
        $(this).on("click", ".fapicker-icons__holder__icon", function () {
          //add the icon to the textfield
          self.find("input.fapicker.text").val($(this).data("icon"));
          //hide all other actives
          self
            .find(".fapicker-icons__holder__icon.active")
            .removeClass("active");
          //set active
          $(this).addClass("active");
          //update selected icon
          self
            .find("span.fapicker-icons__holder__icon i")
            .attr("class", $(this).data("icon"));
        });

        //search filter
        $(this)
          .find(".fapicker-icons__search-holder input")
          .keyup(function () {
            self.doSearch();
          });

        //type selector
        $(this)
          .find(".fapicker-icons__type-selector li")
          .click(function () {
            //set the type to filter by
            self.setType($(this).data("type"));
            //hide all other actives
            $(this).parent().find("li.active").removeClass("active");
            //add the active class
            $(this).addClass("active");
            //run the search
            self.doFilterType();
          });
        this._super();
      },
      doSearch: function () {
        //remove icon not in search class
        $(this)
          .find(".fapicker-icons .fapicker-icons__holder li")
          .removeClass("iconNotSearch");

        //set newSearch to the val of the input
        let newSearch =
          "" + $(this).find(".fapicker-icons__search-holder input").val();

        //filter the list of icons
        $(this)
          .find(".fapicker-icons .fapicker-icons__holder li div:first-child")
          .filter(function (index) {
            //check to see if the data icon contains the searched word
            //inverse to hide everything else
            return !$(this).data("icon").includes(newSearch);
          })
          .parent()
          .addClass("iconNotSearch");
      },
      doFilterType: function () {
        //get the type
        let type = this.getType() + " ";

        // //remove class
        $(this)
          .find(".fapicker-icons .fapicker-icons__holder li")
          .removeClass("notInSearch");

        //do we have a type
        if (type.trim()) {
          //filter the list of icons
          $(this)
            .find(".fapicker-icons .fapicker-icons__holder li div:first-child")
            .filter(function (index) {
              //check to see if the data icon contains the searched word
              //inverse to hide everything else
              return !$(this).data("icon").includes(type);
            })
            .parent()
            .addClass("notInSearch");
        }
      },
    });
  });
})(jQuery);
