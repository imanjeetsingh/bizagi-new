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
            <div class="article-box col-md-5">
            <a class="article-box-link" href="${pdata.url}" target="_self" id="article-box-link">
            <div class="article-image-box">
            <img class="article-image img-fluid" src="${pdata.picture}" alt="${pdata.title} image">
            </div>
            <h5 class="article-heading mt-2">${pdata.title} ${pdata.firstName} ${pdata.lastName}</h5>
            </a>
            <div>
            ${pdata.categories ? pdata.categories.map((data) => `
            <a class="article-image-tag-link" href="${data.url}" target="_self">
            <div class="article-image-tag bottom">${data.title}</div>
            </a>
            `).join('') : ''}
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

    $('.page-link:not(.disabled)').on('click', function (event) {
        event.preventDefault();
        apiPageCall($(this).attr('data-page'));
    })
}