(function ($) {
    $.entwine(function ($) {
        //the holder
        $(".fa-holder").entwine({
            Type: "",
            onmatch: function () {
                //update selected icon on start
                $(this)
                    .find("span.fapicker-icons__holder__icon i")
                    .attr("class", $(this).find("input.fapicker.text").val());

                //add active class to icon
                $(this)
                    .find(
                        "." +
                            $(this)
                                .find("input.fapicker.text")
                                .val()
                                .split(" ")
                                .pop()
                    )
                    .parent()
                    .addClass("active");
            },
        });

        //icon clicking
        $(".fapicker-icons__holder__icon").entwine({
            onclick: function () {
                //get the holder
                let holder = $(".fa-holder");

                //add the icon to the textfield
                holder.find("input.fapicker.text").val($(this).data("icon"));

                //hide all other actives
                holder
                    .find(".fapicker-icons__holder__icon.active")
                    .removeClass("active");

                //set active
                $(this).addClass("active");

                //update selected icon
                holder
                    .find("span.fapicker-icons__holder__icon i")
                    .attr("class", $(this).data("icon"));
            },
        });

        //search filter
        $(".fapicker-icons__search-holder input").entwine({
            onkeyup: function (e) {
                //run the search
                this.doSearch();
            },
            doSearch: function () {
                //get the holder
                let holder = $(".fa-holder");
                //get the type
                let type = $(".fa-holder").getType();

                //remove icon not in search class
                holder
                    .find(".fapicker-icons .fapicker-icons__holder li")
                    .removeClass("iconNotSearch");

                //set newSearch to the val of the input
                let newSearch = "" + $(this).val();

                //filter the list of icons
                holder
                    .find(
                        ".fapicker-icons .fapicker-icons__holder li div:first-child"
                    )
                    .filter(function (index) {
                        //check to see if the data icon contains the searched word
                        //inverse to hide everything else
                        return !$(this).data("icon").includes(newSearch);
                    })
                    .parent()
                    .addClass("iconNotSearch");
            },
            doFilterType: function () {
                //get the holder
                let holder = $(".fa-holder");
                //get the type
                let type = $(".fa-holder").getType() + " ";

                // //remove class
                holder
                    .find(".fapicker-icons .fapicker-icons__holder li")
                    .removeClass("notInSearch");

                //do we have a type
                if (type.trim()) {
                    //filter the list of icons
                    holder
                        .find(
                            ".fapicker-icons .fapicker-icons__holder li div:first-child"
                        )
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

        //type selector
        $(".fapicker-icons__type-selector li").entwine({
            onclick: function () {
                //get the holder
                let holder = $(".fa-holder");

                //set the type to filter by
                holder.setType($(this).data("type"));

                //hide all other actives
                $(this).parent().find("li.active").removeClass("active");

                //add the active class
                $(this).addClass("active");

                //run the search
                $(".fapicker-icons__search-holder input").doFilterType();
            },
        });
    });
})(jQuery);
