<div class="fa-holder">
    <input $AttributesHTML />

    <div class="fapicker-icons">
        <div class="fapicker-icons__search-holder">
            <span class="fapicker-icons__holder__icon"><i class=""></i></span><input type="text" class="text" placeholder="Filter..."/>
        </div>

        <ul class="fapicker-icons__type-selector">
            <li data-type="" class="active">All</li>
            <li data-type="fas">Solid</li>
            <li data-type="far">Regular</li>
            <% if $IsProVersion %>
                <li data-type="fal">Light</li>
                <li data-type="fad">Duotone</li>
            <% end_if %>
            <li data-type="fab">Brands</li>
        </ul>

        <ul class="fapicker-icons__holder">
            $IconList
        </ul>

        <div class="fapicker-icons__bottom">
            <span class="small version">Version <strong>$VersionNumber</strong></span>
            <span class="small icons"><strong>$IconAmount</strong> Icons</span>
        </div>
    </div>
</div>


