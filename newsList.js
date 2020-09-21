$(document).ready(function() {
    apiPageCall(1);
})

function apiPageCall(page) {
    const api = $("#pagination").attr('data-target');
    handleTiles('loading');
    fetch(api + page, {
            headers: {
                'app-id': '5f46096cc2fb880002db8925'
            }
        }).then(response => response.json())
        .then(data => {
            handleTiles(data);
            handlePagination(data);
            console.log(data)
        })
}

function handleTiles(obj) {
    var output = [];
    var $result = $("#result");

    // Tiles Start
    if (obj !== 'loading' && obj.data) {
        for (var pdata of obj.data) {
            output.push(`
            <a href="${pdata.url}" class="col-9 col-md-10 col-lg-9 newsList-box-title-link" target="_self" id="news-box-link">
                <div class="newsList-box-title"></div>
            </a>
            <div class="col-3 col-md-2 col-lg-1 newsList-box-date">
                <span class="anewsList-box-date-text" src="${pdata.picture}"></span>
            </div>
           
            
            </div>
            </div>
            `)
        }
    } else {
        output.push(`Loading...`)
    }
    $result.html(output.join(``));
    // Tiles End
}

function handlePagination(obj) {
    var paginationhtml = [];
    var $pagination = $("#pagination");
    // Pagination Start
    if (obj.page > 1) {
        paginationhtml.push(`
                <li class="page-item">
                    <a class="page-link" href="#" data-page="${obj.page - 1}" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                        <span class="sr-only">Previous</span>
                    </a>
                </li>
            `);
    }

    paginationhtml.push(`<li class="page-item ${obj.page === 1 ? 'active' : ''}"><a class="page-link" href="#" data-page="${1}">${1}</a></li>`);
    if (obj.page > 3) {
        paginationhtml.push(`<li class="page-item"><a class="page-link disabled">...</a></li>`);
    }
    for (var i = obj.page - 1; i <= obj.page + 1; i++) {
        if (i > 1 && i < obj.total) {
            paginationhtml.push(`<li class="page-item ${i === obj.page ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`);
        }
    }
    if (obj.page < obj.total - 2) {
        paginationhtml.push(`<li class="page-item"><a class="page-link disabled">...</a></li>`);
    }
    paginationhtml.push(`<li class="page-item ${obj.page === obj.total ? 'active' : ''}"><a class="page-link" href="#" data-page="${obj.total}">${obj.total}</a></li>`);

    if (obj.page < obj.total) {
        paginationhtml.push(`
                <li class="page-item">
                    <a class="page-link" href="#" data-page="${obj.page + 1}" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                        <span class="sr-only">Next</span>
                    </a>
                </li>
            `);
    }
    $pagination.html(paginationhtml.join(``));
    // Pagination End

    $('.page-link:not(.disabled)').on('click', function(event) {
        event.preventDefault();
        apiPageCall($(this).attr('data-page'));
    })
}