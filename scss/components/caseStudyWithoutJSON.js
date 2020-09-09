$(document).ready(function() {
    handleIsotope();
})

function handleIsotope() {
    var $grid = $('.grid');
    var $checkboxes_industry = $('.option-set[data-group="industry"] .options input');
    var $checkboxes_solution = $('.option-set[data-group="solution"] .options input');
    var $quicksearch = $('.quicksearch');

    var qsRegex;
    var industryOptions = "";
    var solutionOptions = "";

    $grid.isotope({
        itemSelector: '.element-item',
    });

    function updatefilter() {
        $grid.isotope({
            filter: function() {
                var industryResult = industryOptions ? $(this).is(industryOptions) : true;
                var solutionResult = solutionOptions ? $(this).is(solutionOptions) : true;
                var searchResult = qsRegex ? $(this).text().match(qsRegex) : true;
                return industryResult && solutionResult && searchResult;
            }
        });
    };

    var quicksearch = $quicksearch.on("keyup", debounce(function() {
        if (quicksearch.val() !== '') {
            qsRegex = new RegExp(quicksearch.val(), 'gi');
        } else {
            qsRegex = false;
        }
        updatefilter();
    }, 200));

    $checkboxes_industry.on("change", function() {
        var filters = [];
        $checkboxes_industry.filter(':checked').each(function() {
            filters.push(this.value);
        });
        industryOptions = filters.join(', ');
        updatefilter();
    });

    $checkboxes_solution.on("change", function() {
        var filters = [];
        $checkboxes_solution.filter(':checked').each(function() {
            filters.push(this.value);
        });
        solutionOptions = filters.join(', ');
        updatefilter();
    });
}

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