var contentdata = [{
        // token: 'Adidas 1',
        Name: 'Adidas',
        Industry: 'Manufacturing & Retail',
        category: 'manufacturingRetail',
        Solution: 'Digital Operations',
        Solution2: 'Finance',
        Solution3: 'Marketing & Sales',
        Img: '//resourcesbizagi.azureedge.net/images/logo-clients/logo_adidas.png',
        Description: 'Largest sportswear manufacturer in Europe transforms supply chain across 400 factories to improve operational efficiency by 60%.',
        ctaContent: 'read more',
        ctaIcon: 'fa-arrow-right',
    },
    {
        // token: 'Adidas 2',
        Name: 'Adidas2',
        Industry: 'Manufacturing & Retail blassh',
        category: 'financialServices',
        Solution: 'Digital Operations',
        Solution2: 'Finance yo',
        Solution3: 'Marketing & Sales',
        Img: '//resourcesbizagi.azureedge.net/images/logo-clients/logo_adidas.png',
        Description: 'Largest sportswear manufacturer in Europe transforms supply chain across 400 factories to improve operational efficiency by 60%.',
        ctaContent: 'read more',
        ctaIcon: 'fa-arrow-right',
    },
    {
        // token: 'Adidas 3'x,
        Name: 'Adidas3',
        Industry: 'Manufacturing & Retail',
        category: 'manufacturingRetail digitalOperations',
        Solution: 'Digital Operations',
        Solution2: 'Finance',
        Solution3: 'Marketing & Sales',
        Img: '//resourcesbizagi.azureedge.net/images/logo-clients/logo_adidas.png',
        Description: 'Largest sportswear manufacturer in Europe transforms supply chain across 400 factories to improve operational efficiency by 60%.',
        ctaContent: 'read more',
        ctaIcon: 'fa-arrow-right',
    },
    {
        // token: 'Adidas 4',
        Name: 'Adidas4',
        Industry: 'Manufacturing & Retail',
        category: 'financialServices digitalOperations',
        Solution: 'Digital Operations',
        Solution2: 'Finance',
        Solution3: 'Marketing & Sales',
        Img: '//resourcesbizagi.azureedge.net/images/logo-clients/logo_adidas.png',
        Description: 'Largest sportswear manufacturer in Europe transforms supply chain across 400 factories to improve operational efficiency by 60%.',
        ctaContent: 'read more',
        ctaIcon: 'fa-arrow-right',
    },
    {
        // token: 'Adidas 5',
        Name: 'Adidas5',
        Industry: 'Manufacturing & Retail',
        category: 'hospitality',
        Solution: 'Digital Operations',
        Solution2: 'Finance',
        Solution3: 'Marketing & Sales',
        Img: '//resourcesbizagi.azureedge.net/images/logo-clients/logo_adidas.png',
        Description: 'Largest sportswear manufacturer in Europe transforms supply chain across 400 factories to improve operational efficiency by 60%.',
        ctaContent: 'read more',
        ctaIcon: 'fa-arrow-right',
    },
]

$(document).ready(function() {
    handleViewContent();
    handleIsotope();
})

function handleViewContent() {
    var $viewitem = $('#itemview');
    var $viewitemlist = $('#cardviewlist');

    var output = contentdata.map((data, index) => {
        var itemcontent = $viewitem.html();
        itemcontent = itemcontent.replace(/%Category%/ig, data.category ? data.category : '')
        itemcontent = itemcontent.replace(/%Title%/ig, data.Name ? data.Name : '')
        itemcontent = itemcontent.replace(/%Industry%/ig, data.Industry ? data.Industry : '')
        itemcontent = itemcontent.replace(/%Solution%/ig, data.Solution ? data.Solution : '')
        itemcontent = itemcontent.replace(/%Solution2%/ig, data.Solution2 ? data.Solution2 : '')
        itemcontent = itemcontent.replace(/%Solution3%/ig, data.Solution3 ? data.Solution3 : '')
        itemcontent = itemcontent.replace(/%Solution4%/ig, data.Solution4 ? data.Solution4 : '')
        itemcontent = itemcontent.replace(/%Image%/ig, data.Img ? data.Img : '')
        itemcontent = itemcontent.replace(/%ctaContent%/ig, data.ctaContent ? data.ctaContent : '')
        itemcontent = itemcontent.replace(/%ctaIcon%/ig, data.ctaIcon ? data.ctaIcon : '')
        return itemcontent;
    }).join('');
    $viewitemlist.html(output)
}

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