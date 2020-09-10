$(document).ready(function() {
            var currentPage = 1;
            var output = [];
            var loading = false;
            var $loading = $('#loading');

            apiPageCall(currentPage);

            function apiPageCall(page) {
                loading = true;
                var limit = 15;
                const api = $("#scrollLoad").attr('data-target');;
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
                        if (data.data.length > 0) {
                            loading = false;
                            handleTiles(data);
                            handleScroll(data)
                        }
                    })
            }

            function handleTiles(obj) {
                var $result = $("#result");
                output.pop();
                // Tiles Start
                if (obj !== 'loading' && obj.data) {
                    for (var pdata of obj.data) {
                        output.push(`
                    <div class="article-box col-md-3">
                        <a class="article-box-link" href="${pdata.url}" target="_self" id="article-box-link">
                            <div class="article-image-box">
                                <img class="article-image img-fluid" src="${pdata.picture}" alt="${pdata.title} image">
                            </div>
                        </a>
                    </div>
                    <div class="col-md-9 article-box">
                    <h5 class="article-heading">${pdata.title} ${pdata.firstName} ${pdata.lastName}</h5>
                    <p>${pdata.tdescriptionitle}</p>
                            ${pdata.categories ? pdata.categories.map((data) => `
                        <a class="article-image-tag-link" href="${data.url}" target="_self">
                            <span class="article-image-tag bottom">${data.title}</span>
                        </a>
                    </div>
                                `).join('') : ''
                            }
                        </div>
                    </div>
                `)
            }
        }
        $result.html(output.join(``));
        // Tiles End
    }

    function handleScroll(data) {
        var $checkLoadElement = $('#load-on-scroll');
        $(window).on('scroll', function (event) {
            const loadingCheck = Math.round((window.scrollY + window.innerHeight) - $checkLoadElement.offset().top);
            if (data.data.length > 0) {
                if (loadingCheck > 10 && !loading) {
                    currentPage++;
                    $(window).off('scroll');
                    apiPageCall(currentPage);
                }
            }
        })
    }
})