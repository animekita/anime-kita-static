/// <reference path="jquery-1.4.1-vsdoc.js" />

// Extend jQuery. Use $(selector).image(src, callback);
$.fn.image = function (src, f)
{
    return this.each(function ()
    {
        $("<img />").appendTo(this).each(function ()
        {
            this.src = src;
            this.onload = f;
        });
    });
}

$(document).ready(function ()
{
    $.getJSON("http://alpha.kita.dk:8000/static/galleri.json", null, function (galleriData)
    {
        // Bind pre/next link click event
        $("#images a.controls-prev").live("click", function (event) { event.preventDefault(); PreviousImage(); });
        $("#images a.controls-next").live("click", function (event) { event.preventDefault(); NextImage(); });
        $("#galleryImage").parent().click(function (event) { event.preventDefault(); NextImage(); });

        // Register keypress events on the whole document
        $(document).keypress(function (e)
        {
            switch (e.keyCode)
            {
                case 37: /* Left arrow */
                    PreviousImage();
                    break;
                case 39: /* Right arrow */
                    NextImage();
                    break;
            }
        });

        // Globals
        var hidden = $("body").append('<div id="img-cache" style="display:none;"></div>').children("#img-cache");
        var iPreloadCount = 0;
        var iMaxPreload = 5;
        var allImages = [];
        var preloadedImages = [];
        var iIndex = 0;
        var prevLinkSet = false;
        var nextLinkSet = false;
        var directionForward = true;

        function BuildImageArray()
        {
            var photographer;

            for (var i = 0; i < galleriData.photographers.length; i++)
            {
                photographer = galleriData.photographers[i];

                for (var ii = 0, j = photographer.images.length; ii < j; ii++)
                {
                    allImages.push({ "image": photographer.images[ii].image, "photographer": photographer });
                }
            }
        }

        function BuildImageUrl(i)
        {
            return galleriData.baseUrl + allImages[i].photographer.encodedName + "/" + allImages[i].image;
        }

        function SetPhotographer(i)
        {
            var aLink = $("#collection-image-photographer a");
            aLink.html(allImages[i].photographer.name);
            aLink.attr("href", "http://staging.anime-kita.dk/galleri/server.fcgi/fotograf/" + allImages[i].photographer.encodedName);
        }

        function ChangeLinks(i)
        {
            // "Previous" link
            if (i > 0 && !prevLinkSet)
            {
                var prevSpanInner = $("#images span.controls-prev").html();
                $("#images span.controls-prev").replaceWith('<a class="controls-prev" href="#images">' + prevSpanInner + "</a>");
                prevLinkSet = true;
            }
            else if (i == 0)
            {
                var prevAInner = $("#images a.controls-prev").html();
                $("#images a.controls-prev").replaceWith('<span class="controls-prev">' + prevAInner + "</span>");
                prevLinkSet = false;
            }

            // "Next" link
            if (i < allImages.length && !nextLinkSet)
            {
                var nextSpanInner = $("#images span.controls-next").html();
                $("#images span.controls-next").replaceWith('<a class="controls-next" href="#images">' + nextSpanInner + "</a>");
                nextLinkSet = true;
            }
            else if (i == allImages.length - 1)
            {
                var nextAInner = $("#images a.controls-next").html();
                $("#images a.controls-next").replaceWith('<span class="controls-next">' + nextAInner + "</span>");
                nextLinkSet = false;
            }
        }

        function ImageIsPreloaded(image)
        {
            var Preloaded = false;

            for (var i = 0, j = preloadedImages.length; i < j; i++)
            {
                if (preloadedImages[i] == image)
                {
                    Preloaded = true;
                    break;
                }
            }

            return Preloaded;
        }

        function PreLoad(i)
        {
            // Check for 'out of index'
            var j = allImages.length;
            if (i >= j || i < 0) { return; }

            // Check if preload has to stop
            if (iPreloadCount > iMaxPreload) { return; }
            iPreloadCount++;

            // Make sure not to preload any existing images.
            while (ImageIsPreloaded(allImages[i].image))
            {
                if (directionForward) { i++; }
                else { i--; }

                // Check for 'out of index'
                if (i >= j || i < 0) { return; }
            }

            // Set next index
            var i_Next = directionForward ? (i + 1) : (i - 1);

            // Add to preloaded list
            preloadedImages.push(allImages[i].image);

            // Preload image and set callback
            $(hidden).image(BuildImageUrl(i), function ()
            {
                PreLoad(i_Next);
            });
        }

        function NextImage()
        {
            if (iIndex + 1 >= allImages.length) { return; }

            // Set next index
            iIndex++;
            directionForward = true;

            // Set the app state
            SetState(iIndex);
        }

        function PreviousImage()
        {
            if (iIndex - 1 < 0) { return; }

            // Set previous index
            iIndex--;
            directionForward = false;

            // Set the app state
            SetState(iIndex);
        }

        function LoadImage(i)
        {
            // Set image
            $("#galleryImage").attr("src", BuildImageUrl(i));

            // Set ScrollTop
            $(window).scrollTop($("#images").offset().top);

            // Set current index
            $(".imageIndex").html("billede " + (i + 1) + " ud af " + allImages.length);

            // Change prev/next links
            ChangeLinks(i);

            // Set photographer
            SetPhotographer(i);

            // Preload the next pictures
            iPreloadCount = 0;
            i++;

            setTimeout(function ()
            {
                PreLoad(i);
            }, 1000);
        }

        function SetState(i)
        {
            $.bbq.pushState({ index: i });
        }

        BuildImageArray();

        $(window).bind("hashchange", function (e)
        {
            iIndex = e.getState("index") || 0;
            iIndex = parseInt(iIndex);

            // Force inrange validation
            if (iIndex > allImages.length - 1)
            {
                SetState((allImages.length - 1));
                return;
            }
            else if (iIndex < 0)
            {
                SetState(0);
                return;
            }

            LoadImage(iIndex);
        });

        $(window).trigger("hashchange");
    });
});
