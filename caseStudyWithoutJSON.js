$(document).ready(function () {
    setTimeout(() => {
        handleIsotope();
    }, 1000);
})

function handleIsotope() {
    $('.grid').each(function (index, ele) {
        var $currentGrid = $(ele);
        var currentGridId = $(ele).attr('id');

        var $checkboxInput = $('[data-control-group="' + currentGridId + '"] .options input');
        var $searchInput = $('[data-control-search="' + currentGridId + '"]');
        var $filterDataViewer = $(ele).siblings('.filtering-data-viewer');
        var $noresultbox = $(ele).siblings('.no-results');
        $noresultbox.hide();
        var $elementitems = $currentGrid.find('.element-item');
        
        $elementitems.each(function(index, ele) {
                var filterdata = $(ele)
                .find('[data-filter-list]')
                    .attr('data-filter-list');
                    if(!!filterdata) {
                        $(ele).addClass(filterdata)
                    }
                });

                
        var qsRegex;
        var checkboxResult = "";
        
        $currentGrid.isotope({
            itemSelector: '.element-item',
            resizable: false, // disable normal resizing
            layoutMode: 'fitRows' 
        });
        function updatefilter() {
            if(!!checkboxResult && checkboxResult.length>0) {
                $filterDataViewer.show();
                var viewstring = 'You\'re filtering by ';
                checkboxResult = checkboxResult.split('.').join(' ');
                viewstring+='<strong>'+checkboxResult.split(',')+'</strong>';
                $filterDataViewer.html('<p class="filtering-data-content">'+viewstring+'</p>');
            } else {
                $filterDataViewer.hide();
            }

            $currentGrid.isotope({
                filter: function () {
                    var checkboxResultLocal = checkboxResult ? $(this).is(checkboxResult) : true;

                    var searchResult = qsRegex ?
                        $(this).find('.card-body *:not("[class*=\'cta\']")').text().match(qsRegex)
                        : true;

                    return checkboxResultLocal && searchResult;
                }
            }).on( 'arrangeComplete', function( event, filteredItems ) {
                if(filteredItems.length === 0) {
                    $noresultbox.show();
                } else {
                    $noresultbox.hide();
                }
            });
        };

        var quicksearch = $searchInput.on("keyup", debounce(function () {
            if (quicksearch.val() !== '') {
                qsRegex = new RegExp(quicksearch.val(), 'gi');
            } else {
                qsRegex = false;
            }
            updatefilter();
        }, 200));

        $checkboxInput.on("change", function () {
            var filters = [];
            $checkboxInput.filter(':checked').each(function () {
                filters.push(this.value);
            });
            checkboxResult = filters.join(', ');
            updatefilter();
        });
    });
    // debounce so filtering doesn't happen every millisecond
    function debounce(fn, threshold) {
        var timeout;
        return function debounced() {
            if (timeout) {
                clearTimeout(timeout);
            }
    
            function delayed() {
                fn();
                timeout = null;
            }
            timeout = setTimeout(delayed, threshold || 100);
        };
    }
}
