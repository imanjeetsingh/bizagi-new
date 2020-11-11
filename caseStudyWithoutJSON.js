$(document).ready(function () {
    setTimeout(() => {
        handleIsotope();
    }, 1000);
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
                var searchResult = qsRegex ?
                    ($(this).find('.partnerinfo').text().match(qsRegex) || $(this).find('.card-body *:not("[class*=\'cta\']")').text().match(qsRegex)) :
                    true;
                // var searchResult = qsRegex ?
                //     ($(this).find('.card').text().match(qsRegex) || $(this).find('.card-text').text().match(qsRegex)) :
                //     true;

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

(function() {
    $container = $('#container');
    createContent();
    var $filterDisplay = $('#filter-display');
    $container.isotope();
    // do stuff when checkbox change
    $('#options').on('change', function(jQEvent) {
        var $checkbox = $(jQEvent.target);
        manageCheckbox($checkbox);
        var comboFilter = getComboFilter(filters);
        $container.isotope({ filter: comboFilter });
        $filterDisplay.text(comboFilter);
    });
});