$(document).ready(function() {
            let totalpages = 0;
            apiPageCall(1);

            function apiPageCall(page) {
                const pagestr = totalpages > 0 ? "&pages=" + totalpages : '';
                const api = $("#pagination").attr('data-target');
                handleTiles('loading');
                fetch(api + page + pagestr, {}).then(response => response.json())
                    .then(data => {
                        if (data.pages > 0) {
                            totalpages = data.pages;
                        }
                        handleTiles(data);
                        handlePagination(data);
                        console.log(data)
                    })
            }

            function handleTiles(obj) {
                var output = [];
                var $result = $("#result");

                // Tiles Start
                if (obj !== 'loading' && obj.items) {
                    for (var pdata of obj.items) {
                        output.push(`
        <div class="article-box col-lg-5">
        <a class="article-box-link" href="${pdata.url}" target="_self" id="article-box-link">
        <div class="article-image-box">
        <img class="article-image img-fluid" src="${pdata.image}" alt="${pdata.title} image">
        </div>
        <h3 class="article-heading mt-2">${pdata.title}</h3>
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
if(totalpages && totalpages > 1) {
    var paginationhtml = [];
    var $pagination = $("#pagination");
    // Pagination Start
    if (obj.currentPage > 1) {
        paginationhtml.push(`
                <li class="page-item">
                    <a class="page-link" href="#" data-page="${obj.currentPage - 1}" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                        <span class="sr-only">Previous</span>
                    </a>
                </li>
            `);
    }

    paginationhtml.push(`<li class="page-item ${obj.currentPage === 1 ? 'active' : ''}"><a class="page-link" href="#" data-page="${1}">${1}</a></li>`);
    if (obj.currentPage > 3) {
        paginationhtml.push(`<li class="page-item"><a class="page-link disabled">...</a></li>`);
    }
    for (var i = obj.currentPage - 1; i <= obj.currentPage + 1; i++) {
        if (i > 1 && i < totalpages) {
            paginationhtml.push(`<li class="page-item ${i === obj.currentPage ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`);
        }
    }
    if (obj.currentPage < totalpages - 2) {
        paginationhtml.push(`<li class="page-item"><a class="page-link disabled">...</a></li>`);
    }
    paginationhtml.push(`<li class="page-item ${obj.currentPage === totalpages ? 'active' : ''}"><a class="page-link" href="#" data-page="${totalpages}">${totalpages}</a></li>`);

    if (obj.currentPage < totalpages) {
        paginationhtml.push(`
                <li class="page-item">
                    <a class="page-link" href="#" data-page="${obj.currentPage + 1}" aria-label="Next">
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
}
})