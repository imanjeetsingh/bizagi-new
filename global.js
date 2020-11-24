(function($) {

    // scroll action for header
    $(window).scroll(function() {
        var scroll = $(window).scrollTop();

        if (scroll >= 10) {
            $(".home-header").addClass("affix");
        }
        if (scroll <= 0) {
            $(".home-header").removeClass("affix");
        }
        if (scroll >= 10) {
            $(".inner-header").addClass("affix");
        }
        if (scroll <= 0) {
            $(".inner-header").removeClass("affix");
        }
    });
    $(document).ready(function() {
        if (window.screen.width < 1025) {
            var $dropDownBox = $(".nav-container .navbar-nav > .nav-item > .nav-item-suplist > .nav-list");
            $dropDownBox.each(function(index, val) {
                var $atag = $(val).prev();
                var mobileLink = $(".mobileLinkId").attr("data-mobileLink");
                var aele = '<li class="nav-list-sublist"><a class="dropdown-item" href="' + $atag.attr('href') + '"> ' + mobileLink + '</a></li>';
                $(val).prepend(aele)
                $atag.attr('href', '#')
            })
        }
        if (window.screen.width > 1024) {
            $('header .navbar-nav .dropdown-toggle').removeAttr('data-toggle');
        }
    });
})($);
// platform page how it works card component js
$(document).ready(function() {
    var maxHeight = 0;
    if (window.screen.width > 767) {

        $(".card-upper-section").each(function() {
            if ($(this).height() > maxHeight) {
                maxHeight = $(this).height();
            }
        });

        $(".card-upper-section").height(maxHeight);


        var bottomHeight = 0;

        $(".card-bottom-section").each(function() {
            if ($(this).height() > bottomHeight) {
                bottomHeight = $(this).height();
            }
        });

        $(".card-bottom-section").height(bottomHeight);
    }
});

// filterable
// $(document).ready(function () {
//     setTimeout(() => {
//         handleIsotope();
//     }, 1000);
// })

// function handleIsotope() {
//     $('.grid').each(function (index, ele) {
//         var $currentGrid = $(ele);
//         var currentGridId = $(ele).attr('id');

//         var $checkboxInput = $('[data-control-group="' + currentGridId + '"] .options input');
//         var $searchInput = $('[data-control-search="' + currentGridId + '"]');
//         var $filterDataViewer = $(ele).siblings('.filtering-data-viewer');
//         var $noresultbox = $(ele).siblings('.no-results');
//         $noresultbox.hide();
//         var $elementitems = $currentGrid.find('.element-item');

//         $elementitems.each(function(index, ele) {
//                 var filterdata = $(ele)
//                 .find('[data-filter-list]')
//                     .attr('data-filter-list');
//                     if(!!filterdata) {
//                         $(ele).addClass(filterdata)
//                     }
//                 });


//         var qsRegex;
//         var checkboxResult = "";

//         $currentGrid.isotope({
//             itemSelector: '.element-item',
//             resizable: false, // disable normal resizing
//             layoutMode: 'fitRows' 
//         });
//         function updatefilter() {
//             if(!!checkboxResult && checkboxResult.length>0) {
//                 $filterDataViewer.show();
//                 var viewstring = 'You\'re filtering by ';
//                 checkboxResult = checkboxResult.split('.').join(' ');
//                 viewstring+='<strong>'+checkboxResult.split(',')+'</strong>';
//                 $filterDataViewer.html('<p class="filtering-data-content">'+viewstring+'</p>');
//             } else {
//                 $filterDataViewer.hide();
//             }

//             $currentGrid.isotope({
//                 filter: function () {
//                     var checkboxResultLocal = checkboxResult ? $(this).is(checkboxResult) : true;

//                     var searchResult = qsRegex ?
//                         $(this).find('.card-body *:not("[class*=\'cta\']")').text().match(qsRegex)
//                         : true;

//                     return checkboxResultLocal && searchResult;
//                 }
//             }).on( 'arrangeComplete', function( event, filteredItems ) {
//                 if(filteredItems.length === 0) {
//                     $noresultbox.show();
//                 } else {
//                     $noresultbox.hide();
//                 }
//             });
//         };

//         var quicksearch = $searchInput.on("keyup", debounce(function () {
//             if (quicksearch.val() !== '') {
//                 qsRegex = new RegExp(quicksearch.val(), 'gi');
//             } else {
//                 qsRegex = false;
//             }
//             updatefilter();
//         }, 200));

//         $checkboxInput.on("change", function () {
//             var filters = [];
//             $checkboxInput.filter(':checked').each(function () {
//                 filters.push(this.value);
//             });
//             checkboxResult = filters.join(', ');
//             updatefilter();
//         });
//     });
//     // debounce so filtering doesn't happen every millisecond
//     function debounce(fn, threshold) {
//         var timeout;
//         return function debounced() {
//             if (timeout) {
//                 clearTimeout(timeout);
//             }

//             function delayed() {
//                 fn();
//                 timeout = null;
//             }
//             timeout = setTimeout(delayed, threshold || 100);
//         };
//     }
// }

// scrolltop js

$(document).ready(function() {
    backToTop();
});

function backToTop() {
    var btn = $('.dmtop');

    $(window).scroll(function() {
        if ($(window).scrollTop() > 10) {
            btn.css("bottom", "20px");
        } else {
            btn.css("bottom", "-100px");
        }
    });

    btn.on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: 0
        }, '300');
    });
}

function payloadGetter(searchTerm, params) {
    return `{
        search(q: "${searchTerm}", siteKeys: ["${params.siteKey}"], language: "${params.language}", workspace: ${params.workspace}) {
      results(size: 10, page: 0) {
        totalHits
        took
        hits {
          link
          displayableName
          excerpt
        }
      }
    }
  }`;
};

function clearResults(searchResultElement) {
    searchResultElement.html('');
}

function createSearchResult(searchResult) {
    var elements = "";
    for (var i = 0; i < searchResult.length; i++) {
        var displayableName = searchResult[i].displayableName;
        var link = searchResult[i].link;
        elements += "<div><a href=" + link + ">" + displayableName + "</a></div>";
    }
    return elements;
}

function displaySearchResult(searchResult, params) {
    var searchResultElement = params.searchResultElement;
    searchResultElement.html(createSearchResult(searchResult));
}


function getSearchResult(searchTerm, params) {
    var url = params.url;
    const query = payloadGetter(searchTerm, params);

    return $.ajax({
        url: url,
        contentType: 'application/json;charset=UTF-8',
        method: 'POST',
        // method: 'GET',
        data: JSON.stringify({
            query
        }),
    })
}

function handleSearchInput(params) {
    var inputElement = params.inputElement;
    inputElement.on('keyup', function(event) {
        var searchTerm = event.target.value || '';
        var strippedSearchTerm = searchTerm.trim();

        if (strippedSearchTerm.length === 0) clearResults(params.searchResultElement);

        if (strippedSearchTerm.length < 3) return; // proceed with search only if 3 or more characters aree entered

        getSearchResult(strippedSearchTerm, params).done(function(response) {
            // console.log(response);
            var hits = response.data.search.results.hits;
            displaySearchResult(hits, params);
        });
    });
}

function submitSearchForm(searchTerm, redirectUrl) {
    if (searchTerm.length < 3) return;
    window.location.href = redirectUrl + '?q=' + searchTerm;
}

function initSearch() {
    var searchContainer = $('#search-form-header');
    var formElement = searchContainer.find('form');
    searchContainer.append("<div class='search-results'></div>")
    var searchResultElem = searchContainer.find('.search-results');

    var params = {
        inputElement: formElement.find('#searchTerm'),
        searchResultElement: searchResultElem,
        url: '/modules/graphql',
        siteKey: searchContainer.find('input[name ="src_sites.values"]').val(),
        language: searchContainer.find('input[name ="src_languages.values"]').val(),
        workspace: searchContainer.find('input[name ="mode"]').val().toUpperCase(),
    }
    handleSearchInput(params);

    // handling form enter
    formElement.on('submit', function(event) {
        event.preventDefault(); // disable form default submit behavior
        var searchTerm = params.inputElement.val();
        var searchUrl = formElement.attr('action');
        submitSearchForm(searchTerm, searchUrl);
    });
}

// on ready
$(document).ready(function() {
    initSearch();
    // for focus on search
    $('.search-box-searchIcon').click(function() {
        setTimeout(function() {
            $('#searchTerm').focus();
        }, 100);
        $('#searchTerm').removeAttr('placeholder');
    });

    // search out click
    $(document).mouseup(function(e) {
        var container = $("#search-form-header");

        // if the target of the click isn't the container nor a descendant of the container
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            container.hide();
            container.removeClass("active");
        }
    });
    // $('.search-results').css({
    //     "display": "none"
    // });

    // $("#searchTerm").keyup(function() {
    //     if ($(".search-results").has("div").length < 1) {
    //         $('.search-results').css({
    //             "display": "none"
    //         });
    //     } else {
    //         $('.search-results').css({
    //             "display": "block"
    //         });
    //     }
    // });
});