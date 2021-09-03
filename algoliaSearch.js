function initializeSearch(searchConfig) {
    var search = instantsearch({
        indexName: searchConfig.indexName,
        searchClient: algoliasearch(searchConfig.appId, searchConfig.searchApiKey),
    });

    var containerId = searchConfig.containerId;

    search.addWidgets([
        instantsearch.widgets.searchBox({
            container: "#" + containerId + " .searchbox",
        }),
        instantsearch.widgets.hits({
            container: "#" + containerId + "  .hits",
            templates: {
                item: document.getElementById(searchConfig.hitsTemplateId).text,
            },
        }),
        instantsearch.widgets.pagination({
            container: "#" + containerId + "  .pagination",
        }),
        instantsearch.widgets.refinementList({
            container: '#brands',
            attribute: 'brand',
            // operator: 'and',
            limit: 10,
        })
    ]);

    search.start();
}

ALGOLIA_SEARCH_CONFIG.forEach(initializeSearch);

// filter js
var checkList = document.getElementById('list1');
checkList.getElementsByClassName('anchor')[0].onclick = function(evt) {
  if (checkList.classList.contains('visible'))
    checkList.classList.remove('visible');
  else
    checkList.classList.add('visible');
}