// {
//     "title": "HyperAutomation: What is it and How Could it Save Your Business?",
//     "image": "https://blog.bizagi.com/wp-content/uploads/2020/08/manufacturing-process-automation-324x160.jpg",
//     "url": "https://blog.bizagi.com/2020/08/18/hyperautomation-what-is-it-how-could-save-business/",
//     "description": "aaaaaaaaaaaaaaaaaaaaaaa",
//     "categories": [{
//         "title": "Digital Process Automation",
//         "url": "https://blog.bizagi.com/category/digital-process-automation/"
//     }]
// }]


$(document).ready(function() {
            var currentPage = 1;
            var loading = false;
            var $loading = $('#loading');
            var $result = $("#result");
            var eleCount = 0;
            var changeViewState = 3;

            apiPageCall(currentPage);

            function apiPageCall(page) {
                loading = true;
                var limit = 15;
                const api = $("#scrollLoad").attr('data-target');
                handleTiles('loading');
                $loading.show();
                fetch(api + page, {
                        headers: {
                            // 'app-id': '5f46096cc2fb880002db8925'
                            'app-id': 'lTE5abbDxdjGplutvTuc'
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        $loading.hide();
                        if (data.items.length > 0) {
                            loading = false;
                            handleTiles(data);
                            handleScroll(data);
                        }
                    })
            }

            function handleTiles(obj) {
                var output = [];
                if (obj !== 'loading' && obj.items) {
                    for (var pdata of obj.items) {
                        ++eleCount;
                        output.push(`
<div class="article-box col-12 ${eleCount <= changeViewState ? "col-sm-2 col-md-4 category-box": "category-list"} p-2">
<a class="article-box-link" href="${pdata.url}" target="_self" id="article-box-link">
    <div class="row">
        <div class=" ${eleCount > changeViewState ? "col-5 col-md-3 category-list-box": "col-12"}">
            <div class="article-image-box">
                <img class="article-image img-fluid" src="${pdata.image}" alt="${pdata.image} image">
            </div>
        </div>
        <div class=" ${eleCount > changeViewState ? "col-7 col-md-9 category-list-box no-link": "col-12"}">
            <h2 class="article-heading" onclick="location.href='${pdata.url}.html';">${pdata.title}</h2>
            ${pdata.categories ? pdata.categories.map((data) => `
            `).join('') : ''
}
            ${ eleCount > changeViewState? "<p>"+ pdata.description +"</p>": "" }
        </div>
    </div>
</a>
<div>
   
</div>
</div>
`)
}
}
$result.append(output.join(``));
// Tiles End
}

function handleScroll(data) {
var $checkLoadElement = $('#load-on-scroll');
$(window).on('scroll', function (event) {
const loadingCheck = Math.round((window.scrollY + window.innerHeight) - $checkLoadElement.offset().top);
if (data.items.length > 0) {
if (loadingCheck > 10 && !loading) {
currentPage++;
$(window).off('scroll');
apiPageCall(currentPage);
}
}
})
}
})
$(document).ready(function(){
$('p').click(false);
$('.no-link').click(false);
});