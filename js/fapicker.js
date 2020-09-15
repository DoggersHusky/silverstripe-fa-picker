(function ($) {
    $.entwine(function ($) {
        $(".fa-holder").entwine({
            onmatch: function () {
                let self = $(this);
                let type = null;

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
                    .attr("class", $(this).find("input.fapicker.text").val());

                //loop through all the icons
                let newIcon = null;
                for (const icon of iconList) {
                    let cssClass = "";

                    if ($(this).find("input.fapicker.text").val() === icon) {
                        cssClass = "active";
                    }

                    //make the new icon
                    newIcon =
                        '<li class="fapicker-icons__holder__icon ' +
                        cssClass +
                        '" data-icon="' +
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
                    .click(function (e) {
                        //add the icon to the textfield
                        self.find("input.fapicker.text").val(
                            $(this).data("icon")
                        );

                        //hide all other actives
                        self.find(
                            ".fapicker-icons__holder__icon.active"
                        ).removeClass("active");

                        //set active
                        $(this).addClass("active");

                        //update selected icon
                        self.find("span.fapicker-icons__holder__icon i").attr(
                            "class",
                            $(this).data("icon")
                        );
                    });

                //set the filter to the selected type and then run the filter
                $(this)
                    .find(".fapicker-icons__type-selector li")
                    .click(function () {
                        //get the type to filter by
                        type = $(this).data("type");

                        //hide all other actives
                        self.find(
                            ".fapicker-icons__type-selector li.active"
                        ).removeClass("active");

                        //add the active class
                        $(this).addClass("active");
                    });

                //search filter
                $(this)
                    .find(".fapicker-icons__search-holder input")
                    .keyup(function (e) {
                        //reset icons after each key to allow for better filtering
                        self.parent()
                            .find(".fapicker-icons .fapicker-icons__holder li")
                            .css("display", "flex");

                        //set newSearch to the val of the input
                        let newSearch = "" + $(this).val();

                        //filter the list of icons
                        self.find(".fapicker-icons .fapicker-icons__holder li")
                            .filter(function (index) {
                                //check to see if the data icon contains the searched word
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
