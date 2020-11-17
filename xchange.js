var slideIndex = 1;

showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function reset() {
    slideIndex = 1;
}

function showSlides(n) {
    var i;

    var slides = document.getElementsByClassName("mySlides");
    var dotCars = document.getElementsByClassName("dotCar");
    if (slides.length > 0) {

        if (n > slides.length) { slideIndex = 1 }
        if (n < 1) { slideIndex = slides.length }
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        for (i = 0; i < dotCars.length; i++) {
            dotCars[i].className = dotCars[i].className.replace(" activeCar", "");
        }
        slides[slideIndex - 1].style.display = "block";
        dotCars[slideIndex - 1].className += " activeCar";
    }
}


$(function() {
    $("body").append('<div class="modal-loading-ajax"></div>');
    $(document).on({
        ajaxStart: function() { $("body").addClass("loading"); },
        ajaxStop: function() { $("body").removeClass("loading"); }
    });


    var instanceBizagiXchange = new APP.BizagiXchange();
    instanceBizagiXchange.initialize();
});



// -------------------------------------------------------------------------




/* Replace all String */
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

var parMeter = "https://www.bizagi.com/";

/*Namespace*/
window.APP = {};

/*Class definitions*/
APP.BizagiXchange = function() {};

APP.BizagiXchange.prototype = {
    initialize: function() {
        var valueThisReference = this;

        valueThisReference.global_all_items = [];
        valueThisReference.listsObtained = [];


        $.ajax({
            url: ''+ parMeter +'/widgetxchange/services/xchange.svc/GetAllItems/' + $('#langConnectorXchange').val(),
            cache: false,
            type: 'get',
            dataType: "json",
            async: false,
            context: this
        }).done(function(data) {
            $.each(data.GetAllItemsResult, function(index, object) {
                object.ItemType = "Widget";
                object.SortName = object.ItemName;
            });
            valueThisReference.global_all_items = valueThisReference.global_all_items.concat(data.GetAllItemsResult);
            valueThisReference.listsObtained.push('Widget');
            this.render_global_item_list();
        });

        $.ajax({
            url: ''+ parMeter +'/connectorxchange/services/xchange.svc/GetAllItems/' + $('#langConnectorXchange').val(),
            cache: false,
            type: 'get',
            dataType: "json",
            async: false,
            context: this
        }).done(function(data) {
            $.each(data.GetAllItemsResult, function(index, object) {
                object.ItemType = "Connector";
                object.SortName = object.ItemName;
            });
            valueThisReference.global_all_items = valueThisReference.global_all_items.concat(data.GetAllItemsResult);
            valueThisReference.listsObtained.push('Connector');
            this.render_global_item_list();
        });

        $.ajax({
            url: ''+ parMeter +'processxchange/services/ProcessCentral.svc/Processes/GetViewAll/' + $('#langConnectorXchange').val(),
            cache: false,
            type: 'get',
            dataType: "json",
            async: false,
            context: this
        }).done(function(data) {
            $.each(data.GetViewAllProcessesResult, function(index, object) {
                object.ItemType = "Process";
                object.SortName = object.TemplateName;
            });
            valueThisReference.global_all_items = valueThisReference.global_all_items.concat(data.GetViewAllProcessesResult);
            valueThisReference.listsObtained.push('Process');
            this.render_global_item_list();
        });

        // Section: Xchanges Filter functions
        $('.show-all').click(function(e) {
            e.preventDefault();
            $('.show-all').addClass('active');
            $('.show-processes').removeClass('active');
            $('.show-widgets').removeClass('active');
            $('.show-connectors').removeClass('active');

            $('div.xchItem').show();
        });
        $('.show-processes').click(function(e) {
            e.preventDefault();
            $('.show-all').removeClass('active');
            $('.show-processes').addClass('active');
            $('.show-widgets').removeClass('active');
            $('.show-connectors').removeClass('active');

            $('.xchItem.process').show();
            $('.xchItem.connector').hide();
            $('.xchItem.widget').hide();
        });
        $('.show-connectors').click(function(e) {
            e.preventDefault();
            $('.show-all').removeClass('active');
            $('.show-processes').removeClass('active');
            $('.show-widgets').removeClass('active');
            $('.show-connectors').addClass('active');

            $('.xchItem.process').hide();
            $('.xchItem.connector').show();
            $('.xchItem.widget').hide();
        });
        $('.show-widgets').click(function(e) {
            e.preventDefault();
            $('.show-all').removeClass('active');
            $('.show-processes').removeClass('active');
            $('.show-widgets').addClass('active');
            $('.show-connectors').removeClass('active');

            $('.xchItem.process').hide();
            $('.xchItem.connector').hide();
            $('.xchItem.widget').show();
        });
        $('.clear-results').click(function(e) {
            e.preventDefault();

            $('#filter1').val("");
            $('#filterButton').click();
            $('.show-all').click();
        });


        // Section: Filter Bar functions
        $('.recently-added-trigger').click(function(e) {
            e.preventDefault();
            $('.recently-added-trigger').addClass('active');
            //$('.li-category').removeClass('active');
            //Process
            $.ajax({
                url: ''+ parMeter +'/processxchange/services/ProcessCentral.svc/Processes/GetRecently/' + $('#langConnectorXchange').val(),
                cache: false,
                type: 'get',
                dataType: "json",
                async: true
            }).done(function(data) {
                valueThisReference.render_process_item_list(data.GetRecentlyProcessesResult);
            });

            //Connectors
            $.ajax({
                url: ''+ parMeter +'connectorxchange/services/xchange.svc/GetItemsRecentlyAdded/' + $('#langConnectorXchange').val(),
                cache: false,
                type: 'get',
                dataType: "json",
                async: true
            }).done(function(data) {
                valueThisReference.render_connector_item_list(data.GetItemsRecentlyAddedResult);
            });

            //Widgets
            $.ajax({
                url: ''+ parMeter +'/widgetxchange/services/xchange.svc/GetItemsRecentlyAdded/' + $('#langConnectorXchange').val(),
                cache: false,
                type: 'get',
                dataType: "json",
                async: true
            }).done(function(data) {
                valueThisReference.render_widget_item_list(data.GetItemsRecentlyAddedResult);
            });

        });

        $('.top-download-trigger').click(function(e) {
            e.preventDefault();
            $('.top-download-trigger').addClass('active');
            //$('.li-category').removeClass('active');
            //Process
            $.ajax({
                url: ''+ parMeter +'processxchange/services/ProcessCentral.svc/Processes/GetTopDownloads/' + $('#langConnectorXchange').val(),
                cache: false,
                type: 'get',
                dataType: "json",
                async: true
            }).done(function(data) {
                valueThisReference.render_process_item_list(data.GetTopDownloadsProcessesResult);
            });

            //Connectors
            $.ajax({
                url: ''+ parMeter +'connectorxchange/services/xchange.svc/GetItemsTopDownload/' + $('#langConnectorXchange').val(),
                cache: false,
                type: 'get',
                dataType: "json",
                async: true
            }).done(function(data) {
                valueThisReference.render_connector_item_list(data.GetItemsTopDownloadResult);
            });

            //Widgets
            $.ajax({
                url: ''+ parMeter +'widgetxchange/services/xchange.svc/GetItemsTopDownload/' + $('#langConnectorXchange').val(),
                cache: false,
                type: 'get',
                dataType: "json",
                async: true
            }).done(function(data) {
                if (data.GetItemsTopDownloadResult.length == 0) {
                    $('.widget_xchange_section').hide();
                }
                valueThisReference.render_widget_item_list(data.GetItemsTopDownloadResult);
            });
        });

        $('.top-ranked-trigger').click(function(e) {
            e.preventDefault();
            $('.top-ranked-trigger').addClass('active');
            //$('.li-category').removeClass('active');
            //Process
            $.ajax({
                url: ''+ parMeter +'processxchange/services/ProcessCentral.svc/Processes/GetTopRanked/' + $('langConnectorXchange').val(),
                cache: false,
                type: 'get',
                dataType: "json",
                async: true
            }).done(function(data) {
                valueThisReference.render_process_item_list(data.GetTopRankedProcessesResult);
            });

            //Connectors
            $.ajax({
                url: ''+ parMeter +'connectorxchange/services/xchange.svc/GetItemsTopRanked/' + $('#langConnectorXchange').val(),
                cache: false,
                type: 'get',
                dataType: "json",
                async: true
            }).done(function(data) {
                valueThisReference.render_connector_item_list(data.GetItemsTopRankedResult);
            });

            //Widgets
            $.ajax({
                url: ''+ parMeter +'widgetxchange/services/xchange.svc/GetItemsTopRanked/' + $('#langConnectorXchange').val(),
                cache: false,
                type: 'get',
                dataType: "json",
                async: true
            }).done(function(data) {
                valueThisReference.render_widget_item_list(data.GetItemsTopRankedResult);
            });
        });

        $('.all-trigger').click(function(e) {
            e.preventDefault();
            //$('.li-category').removeClass('active');
            valueThisReference.render_process_item_list(valueThisReference.process_all_items.GetViewAllProcessesResult);
            valueThisReference.render_connectoritem_list(valueThisReference.connector_all_items.GetAllItemsResult);
            valueThisReference.render_widget_item_list(valueThisReference.widget_all_items.GetAllItemsResult);
        });

        //
        $("#rating-review").rateYo({ normalFill: "#A0A0A0", numStars: 5, precision: 0, starWidth: "15px", rating: 5 });

        $('#modal-item-terms-conditions').on('hide.bs.modal', function(e) {
            $('#modal-item-terms-conditions').find('.modal-body').scrollTop(0).scrollLeft(0);
            $('#chk-terms-conditions').prop('checked', false);
            $("#div-accept-terms-conditions").removeClass('alert alert-danger');
        });

        $('#modal-item-detail').on('hide.bs.modal', function(e) {
            $('#tab-controller a:first').tab('show');
            $('.xchReviewForm').show();
            $('.load-more-reviews').show();
            $('.xchReview').show();
            $('.xchReviewFormResponse').hide();
            $('.xchShare-response').hide();
            $('.xchShare').show();
            valueThisReference.clear_review_form();
            $('.xchReview').empty();
            $('#hd-id-item-counter-list-review').val('0');
            valueThisReference.clear_share_form();
        });

        $('#categories-main-selector').unbind('click');
        $('#categories-main-selector').click(function(e) {
            e.preventDefault();
        });

        $('#btn-review').click(function(e) {
            e.preventDefault();
            //var curpage = $('#hd-id-item-counter-list-review').val();
            //$('#hd-id-item-counter-list-review').val("1");
            var itemType = $('#hd-id-item-type').val();
            var webURL = "";
            if ($('#frm-review').valid()) {
                if (itemType == "Widget" || itemType == "Connector") {
                    switch (itemType) {
                        case 'Widget':
                            webURL = ''+ parMeter +'widgetxchange/services.ashx';
                            break;
                        case 'Connector':
                            webURL = ''+ parMeter +'connectorxchange/services.ashx';
                            break;
                        default:
                    }

                    $.ajax({
                        url: webURL,
                        method: 'POST',
                        cache: false,
                        data: { svc: "3", itemid: $("#hd-id-item-review").val(), aliasComment: $("#alias-review").val(), comment: $("#comment-review").val(), ratingvalue: $('#rating-review').rateYo('rating'), accept: '1' },
                        success: function(data) {
                            $('.xchReviewForm').hide();
                            $('.load-more-reviews').hide();
                            $('.xchReview').hide();
                            $('.xchReviewFormResponse').show();

                            $("#hd-id-item-counter-list-review").attr("max", "1");
                            $("#hd-id-item-counter-list-review").prop("max", "1");
                            $('#response-review').text(data);
                            valueThisReference.clear_review_form();
                            valueThisReference.render_current_review_page();
                        }
                    });
                } else if (itemType == "Process") {
                    var reviewData = {
                        "IdTemplate": $("#hd-id-item-review").val(),
                        "Alias": $("#alias-review").val(),
                        "Commentary": $("#comment-review").val(),
                        "Rating": $('#rating-review').rateYo('rating')
                    };

                    $.ajax({
                        type: 'POST',
                        url: ''+ parMeter +'processxchange/services/ProcessCentral.svc/Processes/SaveReview/' + $('#langConnectorXchange').val(),
                        data: JSON.stringify(reviewData),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function(data, status, jqXHR) {
                            $('.xchReviewForm').hide();
                            $('.load-more-reviews').hide();
                            if (data.Success) {
                                $('#response-review').append($('<span/>').addClass('success-review').text(data.Message));
                            } else {
                                $('#response-review').append($('<span/>').addClass('error-review').text(data.Message));
                            }
                            $('.xchReview').hide();
                            $('.xchReviewFormResponse').show();
                            valueThisReference.clear_review_form();
                            valueThisReference.render_current_review_page();
                        },
                        error: function(xhr) {
                            $('.xchReviewForm').hide();
                            $('.load-more-reviews').hide();
                            $('#response-review').append($('<span/>').addClass('error-review').text(xhr.responseText));
                            $('.xchReview').hide();
                            $('.xchReviewFormResponse').show();

                        }
                    });

                }
            }
            //$('#hd-id-item-counter-list-review').val(curpage);
        });

        $('#btnSubmitShare').click(function(e) {
            e.preventDefault();
            var itemType = $('#hd-id-item-type').val();
            var webURL = "";
            var shareData;
            if ($('#frm-share').valid()) {
                switch (itemType) {
                    case 'Widget':
                        webURL = ''+ parMeter +'widgetxchange/services/xchange.svc/Share/' + $('#langConnectorXchange').val();
                        shareData = {
                            "IdItem": $('#hd-id-item-share').val(),
                            "NameSender": $('#txtNameSenderShare').val(),
                            "EmailSender": $('#txtEmailSenderShare').val(),
                            "NameFriend1": $('#txtNameFriend1Share').val(),
                            "EmailFriend1": $('#txtEmailFriend1Share').val(),
                            "NameFriend2": $('#txtNameFriend2Share').val(),
                            "EmailFriend2": $('#txtEmailFriend2Share').val(),
                            "NameFriend3": $('#txtNameFriend3Share').val(),
                            "EmailFriend3": $('#txtEmailFriend3Share').val(),
                            "Message": $('#txtTextBodyShare').val()
                        };
                        break;
                    case 'Connector':
                        webURL = ''+ parMeter +'connectorxchange/services/xchange.svc/Share/' + $('#langConnectorXchange').val();
                        shareData = {
                            "IdItem": $('#hd-id-item-share').val(),
                            "NameSender": $('#txtNameSenderShare').val(),
                            "EmailSender": $('#txtEmailSenderShare').val(),
                            "NameFriend1": $('#txtNameFriend1Share').val(),
                            "EmailFriend1": $('#txtEmailFriend1Share').val(),
                            "NameFriend2": $('#txtNameFriend2Share').val(),
                            "EmailFriend2": $('#txtEmailFriend2Share').val(),
                            "NameFriend3": $('#txtNameFriend3Share').val(),
                            "EmailFriend3": $('#txtEmailFriend3Share').val(),
                            "Message": $('#txtTextBodyShare').val()
                        };
                        break;
                    case 'Process':
                        webURL = ''+ parMeter +'processxchange/services/ProcessCentral.svc/Processes/Share/' + $('#langConnectorXchange').val();

                        shareData = {
                            "IdTemplate": $('#hd-id-item-share').val(),
                            "NameSender": $('#txtNameSenderShare').val(),
                            "EmailSender": $('#txtEmailSenderShare').val(),
                            "NameFriend1": $('#txtNameFriend1Share').val(),
                            "EmailFriend1": $('#txtEmailFriend1Share').val(),
                            "NameFriend2": $('#txtNameFriend2Share').val(),
                            "EmailFriend2": $('#txtEmailFriend2Share').val(),
                            "NameFriend3": $('#txtNameFriend3Share').val(),
                            "EmailFriend3": $('#txtEmailFriend3Share').val(),
                            "Message": $('#txtTextBodyShare').val()
                        };

                        break;
                    default:
                        break;
                }

                $.ajax({
                    type: 'POST',
                    url: webURL,
                    data: JSON.stringify(shareData),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function(data, status, jqXHR) {
                        $('#msg-share-response').empty();
                        $('#msg-share-response').append($('<span/>').text(data.Message));
                        $('.xchShare').hide();
                        $('.xchShare-response').show();
                        valueThisReference.clear_share_form();
                    },
                    error: function(xhr) {
                        $('#msg-share-response').empty();
                        $('#msg-share-response').append($('<span/>').text(xhr.responseText));
                        $('.xchShare').hide();
                        $('.xchShare-response').show();
                        valueThisReference.clear_share_form();
                    }
                });
            }
        });

        $('#btn-back-share').click(function(e) {
            e.preventDefault();
            $('.xchShare-response').hide();
            $('.xchShare').show();
        });

        $('#btn-back-form-review').click(function(e) {
            e.preventDefault();
            $('.xchReviewForm').show();
            $('.load-more-reviews').show();
            $('.xchReview').show();
            $('.xchReviewFormResponse').hide();
            valueThisReference.clear_review_form();
        });

        $('.load-more-reviews').click(function(e) {
            e.preventDefault();
            valueThisReference.render_current_review_page();
        });

        $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
            if ($(e.target).attr('href') == '#reviews') {
                $('#hd-id-item-counter-list-review').val('0');
                valueThisReference.render_current_review_page();
            }
        });

        $('#filterButton').click(function() {
            valueThisReference.filter_xchange_list($('#filter1').val().trim());
            valueThisReference.updateCounters();
        });

        $('#filter1').keypress(function(e) {
            var key = e.which;
            if (key == 13) {
                $('#filterButton').click();
                /*
                valueThisReference.filter_xchange_list($('#filter1').val().trim());
                valueThisReference.updateCounters();
                */
                return false;
            }
        });

        valueThisReference.processURL();
    },

    updateCounters: function() {
        $('#counter-all').text($('.xchItem:visible').length);
        $('#counter-widget').text($('.xchItem.widget:visible').length);
        $('#counter-connector').text($('.xchItem.connector:visible').length);
        $('#counter-process').text($('.xchItem.process:visible').length);
    },
    render_items_by_category: function(object_sender) {
        $.ajax({
            url: ''+ parMeter +'connectorxchange/services/xchange.svc/GetAllItemsByCategory/' + $('#langConnectorXchange').val() + '/' + $(object_sender).data('category-id'),
            cache: false,
            type: 'get',
            dataType: "json",
            async: true,
            context: this
        }).done(function(data) {
            $('.li-category').removeClass('active');
            $(object_sender).closest('li').addClass('active');
            this.render_item_list(data.GetAllItemsByCategoryResult);
        });
    },
    render_global_item_list: function() {
        var valueThisReference = this;
        if (valueThisReference.listsObtained.length == 3) {

            valueThisReference.global_all_items.sort(function(a, b) {
                if (a.SortName < b.SortName) return -1;
                if (a.SortName > b.SortName) return 1;
                return 0;
            })

            $.each(valueThisReference.global_all_items, function(index, object) {
                switch (object.ItemType) {
                    case 'Process':
                        valueThisReference.render_process_item(object);
                        break;
                    case 'Widget':
                        valueThisReference.render_widget_item(object);
                        break;
                    case 'Connector':
                        valueThisReference.render_connector_item(object);
                        break;
                    default:
                }
            });
            valueThisReference.updateCounters();
        }
    },
    /*
    render_widget_item_list: function(object_list_items){
    	//$('.widget_xchangeItemsList').empty();

    	var valueThisReference = this;
    	$.each(object_list_items,function(index, object) {
    		valueThisReference.render_widget_item(object);

    	});
    	valueThisReference.updateCounters();
    },
    render_connector_item_list: function(object_list_items){
    	//$('.connector_xchangeItemsList').empty();
    	var valueThisReference = this;
    	$.each(object_list_items,function(index, object) {
    		valueThisReference.render_connector_item(object);

    	});
    	valueThisReference.updateCounters();
    },
    render_process_item_list: function(object_list_items){
    	//$('.process_xchangeItemsList').empty();

    	var valueThisReference = this;
    	$.each(object_list_items,function(index, object) {
    		valueThisReference.render_process_item(object);
    	});
    	valueThisReference.updateCounters();
    },*/
    render_process_item: function(item) {
        var valueThisReference = this;

        var container = $('<div/>').addClass('col-md-4 col-sm-4 xchItem process');
        var box = $('<div/>').addClass('box-process');

        var head = $('<div/>').addClass('head-grad-process');
        var imghead = $('<img/>').addClass('icon-process').attr('src', ''+ parMeter +'processxchange/Documents/' + item.GuidTemplate + '/images/icon-xchange.svg')
            //var imghead = $('<img/>').addClass('icon-process').attr('src','https://i.imgur.com/Y7lTW6s.png')

        head.append(imghead);

        var body = $('<div/>').addClass('body-info');
        var title = $('<h4/>').attr('id', 'xchange-item-name').addClass('ti-txt16 ti-color2 ti-f400 text-center ti-txttitle').text(item.TemplateName);

        var moreInfo = $('<div/>').addClass('more-info');
        var spanrate = $('<span/>').addClass('rate').append($('<i/>').addClass('fa fa-star').attr('aria-hidden', true)).append(item.AverageRating.toFixed(1));
        var spancost = $('<span/>').addClass('cost').text('Free');
        //moreInfo.append(spanrate);
        moreInfo.append(spancost);

        var btnModal = $('<a/>').addClass('btn-process').attr('href', '#')
        btnModal.data('item-id-detail', item.IdTemplate);
        btnModal.data('item-type', item.ItemType);
        btnModal.click(function(e) {
            e.preventDefault();
            valueThisReference.render_xchange_item_detail($(this));
        });
        var iLearnMore = $('<i/>').addClass('fa fa-chevron-right').attr('aria-hidden', true)
        btnModal.append(iLearnMore);
        iLearnMore.after('Learn More');
        //btnModal.text('Learn More');

        body.append(title);
        body.append(moreInfo);
        body.append(btnModal);

        box.append(head);
        box.append(body);

        container.append(box);
        $('.global_xchangeItemsList').append(container);
    },
    render_widget_item: function(item) {
        /*
        var valueThisReference = this;
        var containerItemGeneral = $('<div/>').addClass('col-lg-3 col-md-3 col-sm-4 col-xs-10 col-xs-offset-1 xchItem');
        var elementEventItemGeneral = $('<a/>').addClass('xchItemLink').attr('href','#').data('item-id-detail', item.ItemId).click(function(e){e.preventDefault();valueThisReference.render_widget_item_detail($(this));});
        var itemBox = $('<div/>').addClass('xchItemBox').append($('<div/>').addClass('xchItemCost').text((item.CostTypeId == 1 ? item.CostTypeName : item.Cost + ' USD'))).append($('<div/>').addClass('xchItemName').text(item.ItemName)).append($('<div/>').addClass('xchItemThumbnail').append($('<img/>').attr('src',''+ parMeter +'/widgetxchange/Resources/'+item.GuidItem+'/thumbnail.png'))).append($('<div/>').addClass('xchItemInfo').append($('<span/>').addClass('xchItemRate').append($('<i/>').addClass('fa fa-star').attr('aria-hidden',true)).append(item.Rating.toFixed(1))));

        elementEventItemGeneral.append(itemBox);
        containerItemGeneral.append(elementEventItemGeneral);
        $('.widget_xchangeItemsList').append(containerItemGeneral);
        */

        var valueThisReference = this;

        var container = $('<div/>').addClass('col-md-4 col-sm-4 xchItem widget');
        var box = $('<div/>').addClass('box-widget');

        var head = $('<div/>').addClass('head-grad-widget');
        var imghead = $('<img/>').addClass('icon-widget').attr('src', ''+ parMeter +'widgetxchange/Resources/' + item.GuidItem + '/images/icon-xchange.svg')
            //var imghead = $('<img/>').addClass('icon-process').attr('src','https://i.imgur.com/Y7lTW6s.png')

        head.append(imghead);

        var body = $('<div/>').addClass('body-info');
        var title = $('<h4/>').attr('id', 'xchange-item-name').addClass('ti-txt16 ti-color2 ti-f400 text-center ti-txttitle').text(item.ItemName);

        var moreInfo = $('<div/>').addClass('more-info');
        var spanrate = $('<span/>').addClass('rate').append($('<i/>').addClass('fa fa-star').attr('aria-hidden', true)).append(item.Rating.toFixed(1));
        var spancost = $('<span/>').addClass('cost').text('Free');
        //moreInfo.append(spanrate);
        moreInfo.append(spancost);

        var btnModal = $('<a/>').addClass('btn-widget').attr('href', '#');
        btnModal.data('item-id-detail', item.ItemId);
        btnModal.data('item-type', item.ItemType);
        btnModal.click(function(e) {
            e.preventDefault();
            valueThisReference.render_xchange_item_detail($(this));
        });
        var iLearnMore = $('<i/>').addClass('fa fa-chevron-right').attr('aria-hidden', true)
        btnModal.append(iLearnMore);
        iLearnMore.after('Learn More');
        //btnModal.text('Learn More');

        body.append(title);
        body.append(moreInfo);
        body.append(btnModal);

        box.append(head);
        box.append(body);

        container.append(box);
        $('.global_xchangeItemsList').append(container);
    },
    render_connector_item: function(item) {
        /*
        var valueThisReference = this;
        var containerItemGeneral = $('<div/>').addClass('col-lg-3 col-md-3 col-sm-4 col-xs-10 col-xs-offset-1 xchItem');
        var elementEventItemGeneral = $('<a/>').addClass('xchItemLink').attr('href','#').data('item-id-detail', item.ItemId).click(function(e){e.preventDefault();valueThisReference.render_connector_item_detail($(this));});
        //var itemBox = $('<div/>').addClass('xchItemBox').append($('<div/>').addClass('xchItemCost').text((item.CostTypeId == 1 ? item.CostTypeName : item.Cost + ' USD'))).append($('<div/>').addClass('xchItemName').text(item.ItemName)).append($('<div/>').addClass('xchItemThumbnail').append($('<img/>').attr('src',''+ parMeter +'connectorxchange/Resources/'+item.GuidItem+'/thumbnail.png'))).append($('<div/>').addClass('xchItemInfo').append($('<span/>').addClass('xchItemRate').append($('<i/>').addClass('fa fa-star').attr('aria-hidden',true)).append(item.Rating.toFixed(1))).append($('<span/>').addClass('xchItemDownloads').append($('<i/>').addClass('fa fa-download').attr('aria-hidden',true)).append(item.CounterDownloads)));
        //.append($('<div/>').addClass('xchItemType').text(item.ItemType))
        var itemBox = $('<div/>').addClass('xchItemBox').append($('<div/>').addClass('xchItemCost').text((item.CostTypeId == 1 ? item.CostTypeName : item.Cost + ' USD'))).append($('<div/>').addClass('xchItemName').text(item.ItemName)).append($('<div/>').addClass('xchItemThumbnail').append($('<img/>').attr('src',''+ parMeter +'connectorxchange/Resources/'+item.GuidItem+'/thumbnail.png'))).append($('<div/>').addClass('xchItemInfo').append($('<span/>').addClass('xchItemRate').append($('<i/>').addClass('fa fa-star').attr('aria-hidden',true)).append(item.Rating.toFixed(1))).append($('<span/>')));

        elementEventItemGeneral.append(itemBox);
        containerItemGeneral.append(elementEventItemGeneral);
        $('.connector_xchangeItemsList').append(containerItemGeneral);
        */

        var valueThisReference = this;
        var isbeta = false;
        var isootb = false;
        if (/ - BETA$/.test(item.ItemName)) {
            item.SortName = item.SortName.replace(/ - BETA$/, '');
            isbeta = true;
        }
        if (/ - OOTB$/.test(item.ItemName)) {
            item.ItemName = item.ItemName.replace(/ - OOTB$/, '');
            item.SortName = item.SortName.replace(/ - OOTB$/, '');
            isootb = true;
        }

        var container = $('<div/>').addClass('col-md-4 col-sm-4 xchItem connector');
        var box = $('<div/>').addClass('box-connector');

        var head = $('<div/>').addClass('head-grad-connector');
        var imghead = $('<img/>').addClass('icon-connector').attr('src', ''+ parMeter +'connectorxchange/Resources/' + item.GuidItem + '/images/icon-xchange.svg')
            //var imghead = $('<img/>').addClass('icon-process').attr('src','https://i.imgur.com/Y7lTW6s.png')
        if (isbeta) {
            head.append([
                '<div class="tag-beta" ',
                'style="position: absolute; border: 1px solid white; width: 65px; top: 7px; left: 7px; border-radius: 15px;">',
                '<p style="margin: 0; padding: 0; font-size: 13px; font-weight: 600; text-align: center; color: white;">',
                '<i class="fa fa-rocket" aria-hidden="true"></i><span> BETA</span></p></div>'
            ].join(''));
        }

        head.append(imghead);

        var body = $('<div/>').addClass('body-info');
        var title = $('<h4/>').attr('id', 'xchange-item-name').addClass('ti-txt16 ti-color2 ti-f400 text-center ti-txttitle').text(item.ItemName);

        var moreInfo = $('<div/>').addClass('more-info');
        var spanrate = $('<span/>').addClass('rate').append($('<i/>').addClass('fa fa-star').attr('aria-hidden', true)).append(item.Rating.toFixed(1));
        var spancost = $('<span/>').addClass('cost').text('Free');
        //moreInfo.append(spanrate);
        if (isbeta) {
            moreInfo.css('textAlign', 'center');
        } else {
            moreInfo.append(spancost);
        }

        var btnModal = $('<a/>').addClass('btn-connector').attr('href', '#');
        btnModal.data('item-id-detail', item.ItemId);
        btnModal.data('item-type', item.ItemType);
        btnModal.click(function(e) {
            e.preventDefault();
            valueThisReference.render_xchange_item_detail($(this));
        });
        var iLearnMore = $('<i/>').addClass('fa fa-chevron-right').attr('aria-hidden', true)
        if (isbeta) {
            btnModal.html('Learn more');
        } else {
            btnModal.append(iLearnMore);
            iLearnMore.after('&nbsp;Learn More');
        }
        //btnModal.text('Learn More');

        body.append(title);
        body.append(moreInfo);
        body.append(btnModal);

        box.append(head);
        box.append(body);

        container.append(box);
        $('.global_xchangeItemsList').append(container);
    },
    render_xchange_item_detail: function(object_sender) {
        var itemType = $(object_sender).data('item-type');

        $('#modal-header').removeClass();
        $('#modal-version').removeClass();
        $('#modal-updated').show();
        $('#modal-updated').removeClass();
        $('#modal-description').empty();

        modalData = {};
        switch (itemType) {
            case 'Process':

                $('#modal-header').addClass("head-grad-process paddingwrapper10");
                // $('#modal-version').addClass("ti-txt16 ti-color1 text-center border-right-darkteal");
                $('#modal-version').addClass("ti-txt16 ti-color1 text-center");
                // $('#modal-updated').addClass("ti-txt16 ti-color1 text-center border-right-darkteal");
                $('#modal-updated').addClass("ti-txt16 ti-color1 text-center");

                modalData.webserviceUrl = ''+ parMeter +'processxchange/services/ProcessCentral.svc/Processes/GetTemplate/' + $(object_sender).data('item-id-detail') + '/' + $('#langConnectorXchange').val();
                modalData.tabshare_title = "Share Bizagi process templates with clients, colleagues and friends. Just include their complete name and email adresses below:";
                modalData.tabshare_message = "Hi [Friend's Name]</p><textarea name=\"txtTextBodyShare\" id=\"txtTextBodyShare\" class=\"input-share\">IÂ´ve been using BizagiÂ´s Process Xchange and I highly recommend it. You can download templates from Bizagi Studio through Process Xchange menu, or browse them in the website http://www.bizagi.com/en/community/process-xchange. Enjoy!</textarea><p class=\"ti-txt14 ti-color ti-f500 ti-margin-b10 ti-margin-t20\">Kind regards<br><br><b>[ Your name and email ]</b></p>";

                modalData.parseData = function(data) {
                    this.title = data.GetTemplateResult.TemplateName;
                    this.iconSrc = ''+ parMeter +'processxchange/Documents/' + data.GetTemplateResult.GuidTemplate + '/images/icon-xchange.svg';
                    this.version = data.GetTemplateResult.TemplateVersion;
                    this.updated = data.GetTemplateResult.ReleaseDate;
                    this.rate = data.GetTemplateResult.AverageRating.toFixed(1);
                    this.imgsSlider = data.GetTemplateResult.Images;
                    this.imgsSliderPath = ''+ parMeter +'processxchange/Documents/' + data.GetTemplateResult.GuidTemplate + '/images/';
                    this.shortDescription = data.GetTemplateResult.ShortDescription;
                    this.videoSrc = data.GetTemplateResult.Videos[0].PathFile;
                    this.description = data.GetTemplateResult.Description;
                    this.docList = data.GetTemplateResult.DocumentFiles;
                    this.idItem = data.GetTemplateResult.IdTemplate;
                    this.idItemReview = data.GetTemplateResult.IdTemplate;
                    this.idItemType = itemType;
                }
                $('#modal-updated').hide();
                break;
            case 'Connector':

                $('#modal-header').addClass("head-grad-connector paddingwrapper10");
                $('#modal-version').addClass("ti-txt16 ti-color1 text-center border-right-darkyellow");
                // $('#modal-updated').addClass("ti-txt16 ti-color1 text-center border-right-darkyellow");
                $('#modal-updated').addClass("ti-txt16 ti-color1 text-center");

                modalData.webserviceUrl = ''+ parMeter +'connectorxchange/services/xchange.svc/GetItemDetail/' + $('#langConnectorXchange').val() + '/' + $(object_sender).data('item-id-detail');
                modalData.tabshare_title = "Share Bizagi connectors with clients, colleagues and friends. Just include their complete name and email adresses below:";
                modalData.tabshare_message = "Hi [Friend's Name]</p><textarea name=\"txtTextBodyShare\" id=\"txtTextBodyShare\" class=\"input-share\">IÂ´ve been using BizagiÂ´s connectors library, Connectors Xchange, and I highly recommend it. If you want to use it just open your Bizagi Studio and go to Connectors in the Tools menu. Enjoy!</textarea><p class=\"ti-txt14 ti-color ti-f500 ti-margin-b10 ti-margin-t20\">Kind regards<br><br><b>[ Your name and email ]</b></p>";

                modalData.parseData = function(data) {
                    this.title = data.GetItemDetailResult.ItemName;
                    this.iconSrc = ''+ parMeter +'connectorxchange/Resources/' + data.GetItemDetailResult.GuidItem + '/images/icon-xchange.svg';
                    this.version = data.GetItemDetailResult.Version;
                    this.updated = data.GetItemDetailResult.UpdatedDateString;
                    this.rate = data.GetItemDetailResult.Rating.toFixed(1);
                    this.itemDownload = data.GetItemDetailResult.SetupFileName;
                    this.itemGUID = data.GetItemDetailResult.GuidItem;
                    this.imgsSlider = data.GetItemDetailResult.Images;
                    this.imgsSliderPath = ''+ parMeter +'connectorxchange/Resources/' + data.GetItemDetailResult.GuidItem + '/gallery/';
                    this.shortDescription = data.GetItemDetailResult.Overview;
                    //this.videoSrc = data.GetItemDetailResult.Videos[0].PathFile;
                    this.description = data.GetItemDetailResult.Description;
                    this.details = data.GetItemDetailResult.Detail.replaceAll('replacereferenceh', 'href');
                    if (data.GetItemDetailResult.FileRelated) {
                        this.instructionSrc = ''+ parMeter +'connectorxchange/Resources/' + data.GetItemDetailResult.GuidItem + '/docs/' + data.GetItemDetailResult.FileRelated;
                    }
                    this.idItem = data.GetItemDetailResult.ItemId;
                    this.idItemReview = data.GetItemDetailResult.GuidItem;
                    this.idItemType = itemType;
                };


                break;
            case 'Widget':

                $('#modal-header').addClass("head-grad-widget paddingwrapper10");
                $('#modal-version').addClass("ti-txt16 ti-color1 text-center border-right-darkteal");
                // $('#modal-updated').addClass("ti-txt16 ti-color1 text-center border-right-darkteal");
                $('#modal-updated').addClass("ti-txt16 ti-color1 text-center");

                modalData.webserviceUrl = ''+ parMeter +'widgetxchange/services/xchange.svc/GetItemDetail/' + $('#langConnectorXchange').val() + '/' + $(object_sender).data('item-id-detail');
                modalData.tabshare_title = "Share Bizagi widgets with clients, colleagues and friends. Just include their complete name and email adresses below:";
                modalData.tabshare_message = "Hi [Friend's Name]</p><textarea name=\"txtTextBodyShare\" id=\"txtTextBodyShare\" class=\"input-share\">IÂ´ve been using BizagiÂ´s Widget Xchange and I highly recommend it. If you want to use it just open your Bizagi Studio and go to the Forms designer and move to the Controls tab. Browse them all and enjoy!</textarea><p class=\"ti-txt14 ti-color ti-f500 ti-margin-b10 ti-margin-t20\">Kind regards<br><br><b>[ Your name and email ]</b></p>";

                modalData.parseData = function(data) {
                    this.title = data.GetItemDetailResult.ItemName;
                    this.iconSrc = ''+ parMeter +'widgetxchange/Resources/' + data.GetItemDetailResult.GuidItem + '/images/icon-xchange.svg';
                    this.version = data.GetItemDetailResult.Version;
                    this.updated = data.GetItemDetailResult.UpdatedDateString;
                    this.rate = data.GetItemDetailResult.Rating.toFixed(1);
                    this.itemDownload = data.GetItemDetailResult.SetupFileName;
                    this.itemGUID = data.GetItemDetailResult.GuidItem;
                    this.imgsSlider = data.GetItemDetailResult.Images;
                    this.imgsSliderPath = ''+ parMeter +'widgetxchange/Resources/' + data.GetItemDetailResult.GuidItem + '/gallery/';
                    this.shortDescription = data.GetItemDetailResult.Overview;
                    //this.videoSrc = data.GetItemDetailResult.Videos[0].PathFile;
                    this.description = data.GetItemDetailResult.Description;
                    this.details = data.GetItemDetailResult.Detail.replaceAll('replacereferenceh', 'href');
                    this.idItem = data.GetItemDetailResult.ItemId;
                    this.idItemReview = data.GetItemDetailResult.GuidItem;
                    this.idItemType = itemType;
                }

                break;
            default:
                return;
        }



        $.ajax({
            url: modalData.webserviceUrl,
            cache: false,
            type: 'get',
            dataType: "json",
            async: true,
            context: this
        }).done(function(data) {
            modalData.parseData(data);
            
            var valueThisReference = this;

            $('#modal-title').text(modalData.title);
            $('#modal-icon').attr('src', modalData.iconSrc);

            var spanversion = $('#modal-version');
            spanversion.empty();
            var titleversion = $('<b/>').text("Version: ");
            spanversion.append(titleversion);
            titleversion.after(" " + modalData.version);

            var spanupdated = $('#modal-updated');
            spanupdated.empty();
            var titleupdated = $('<b/>').text("Updated: ");
            spanupdated.append(titleupdated);
            titleupdated.after(" " + modalData.updated);

            var spanrate = $('#modal-rate');
            spanrate.empty();
            var titlerate = $('<b/>').text("Rate: ");
            spanrate.append(titlerate);
            titlerate.after(" " + modalData.rate);

            if (modalData.hasOwnProperty('itemDownload') && modalData.itemDownload != "") {
                $('#modal-download-btn').show();
                $('#modal-download-btn').data('item-download', modalData.itemDownload);
                $('#modal-download-btn').data('item-guid', modalData.itemGUID);
                $('#modal-download-btn').click(function(e) {
                    e.preventDefault();
                    valueThisReference.render_download_confirmation($(this));
                });
            } else {
                $('#modal-download-btn').hide();
            }

            $('#modal-tab-overview').tab('show');

            $('#modal-tabs').children().first().addClass('active');
            //Start - Tab Overview

            /*
            $.each(modalData.imgsSlider,function(index, object) {
            	var divImgSlider = $('<div/>');
            	var imgSlider = $('<img/>').attr('src', modalData.imgsSliderPath + object.GuidImage + '.png');
            	divImgSlider.append(imgSlider);

            	divImgSlider.appendTo('#modal-overview-slider');
            });*/
            $('#imagenes').empty();
            $('#pruebaCarouselSlide').empty();
            $.each(modalData.imgsSlider, function(index, object) {
                if (index == 0) {
                    //$('<li/>').data('target','#modal-overview-slider').data('slide-to',index).addClass('active').appendTo('#modal-overview-carousel-indicators');
                    //$('<div/>').addClass('item active').append($('<img/>').attr('src',modalData.imgsSliderPath + object.GuidImage + '.png')).appendTo('#modal-overview-carousel-inner');

                    $('<div/>').addClass('mySlides fadeCar').append($('<img/>').attr('src', modalData.imgsSliderPath + object.GuidImage + '.png')).attr('style', 'display: block;').appendTo('#imagenes');

                    $('<span/>').addClass('dotCar activeCar').attr('onclick', 'currentSlide(' + (index + 1) + ')').appendTo('#pruebaCarouselSlide');


                } else {
                    $('<div/>').addClass('mySlides fadeCar').append($('<img/>').attr('src', modalData.imgsSliderPath + object.GuidImage + '.png')).attr('style', 'display: none;').appendTo('#imagenes');

                    //	$('<li/>').data('target','#modal-overview-slider').data('slide-to',index).appendTo('#modal-overview-carousel-indicators');
                    //	$('<div/>').addClass('item').append($('<img/>').attr('src',modalData.imgsSliderPath + object.GuidImage + '.png')).appendTo('#modal-overview-carousel-inner');
                    $('<span/>').addClass('dotCar').attr('onclick', 'currentSlide(' + (index + 1) + ')').appendTo('#pruebaCarouselSlide');
                }
            });


            $('#modal-shortdescription').html(modalData.shortDescription);
            //End - Tab Overview
            //Start - Tab Details
            if (modalData.hasOwnProperty('videoSrc')) {
                $('#modal-video-div').show();
                $('#modal-video').attr('src', modalData.videoSrc);
            } else {
                $('#modal-video-div').hide();
            }
            $('#modal-description').html(modalData.description);
            if (modalData.hasOwnProperty('docList')) {
                $('#modal-doclist').show();
                $('#modal-doclist').empty();
                $.each(modalData.docList, function(index, object) {
                    $('<li/>').append($('<a/>').attr('target', '_blank').attr('href', object.PathFile).text(object.FileName)).appendTo('#modal-doclist');
                });
            } else {
                $('#modal-doclist').empty();
                $('#modal-doclist').hide();
            }
            if (modalData.hasOwnProperty('details')) {
                $('#modal-doc-text-div').show();
                $('#modal-doc-text-div').empty();
                $('#modal-doc-text-div').html(modalData.details.replaceAll('replacereferenceh', 'href'));
                if (modalData.instructionSrc) {
                    if ($('#langConnectorXchange').val() == 'en') {
                        $('#modal-doc-text-div').append(
                            $("<a>").text("Instructions").attr("target", "_blank").attr("href", modalData.instructionSrc)
                        );
                    } else if ($('#langConnectorXchange').val() == 'es') {
                        $('#modal-doc-text-div').append(
                            $("<a>").text("Instrucciones").attr("target", "_blank").attr("href", modalData.instructionSrc)
                        );
                    }
                }
            } else {
                $('#modal-doc-text-div').empty();
                $('#modal-doc-text-div').hide();
            }

            //End - Tab Details
            //Start - Tab Reviews
            $('#hd-id-item-review').val(modalData.idItemReview);
            $('#hd-id-item').val(modalData.idItem);
            $('#hd-id-item-type').val(modalData.idItemType);
            $('#hd-id-item-share').val(modalData.idItem);
            $('#hd-id-item-counter-list-review').val('0');

            webserviceUrl = "";
            switch (itemType) {
                case 'Process':
                    webserviceUrl = ''+ parMeter +'processxchange/services/ProcessCentral.svc/Processes/GetReviewsByPage/' + $('#hd-id-item').val() + '/';
                    break;
                case 'Widget':
                    webserviceUrl = ''+ parMeter +'widgetxchange/services/xchange.svc/GetItemReviewsByPage/' + $('#hd-id-item').val() + '/';
                    break;
                case 'Connector':
                    webserviceUrl = ''+ parMeter +'connectorxchange/services/xchange.svc/GetItemReviewsByPage/' + $('#hd-id-item').val() + '/';
                    break;
                default:
            }
            var flag = true;
            var maxPages = 0;
            while (flag === true) {
                $.ajax({
                    url: webserviceUrl + maxPages.toString(),
                    cache: false,
                    type: 'get',
                    dataType: "json",
                    async: false
                }).done(function(data) {
                    if (data.GetItemReviewsByPageResult.length > 0) {
                        maxPages = parseInt(maxPages) + 1;
                    } else {
                        flag = false;
                    }
                });
            }
            maxPages = maxPages > 0 ? maxPages : 1;
            $("#hd-id-item-counter-list-review").attr("max", maxPages);
            $("#hd-id-item-counter-list-review").prop("max", maxPages);

            $('#pagerdiv').empty();
            var btnprv = $('<button></button>').addClass('pagerbutt').text('<')
                .click(function(e) {
                    e.preventDefault();
                    valueThisReference.prv();
                });
            $('#pagerdiv').append(btnprv);
            for (var i = 0; i < maxPages; i++) {
                var btnnum = $('<input></input>')
                    .addClass('pageradbutt')
                    .attr('id', 'btnnum' + i)
                    .attr('name', 'btnnum')
                    .attr('type', 'radio')
                    .val(i)
                    .click(function() {
                        $("#hd-id-item-counter-list-review").val($(this).val());
                        valueThisReference.render_current_review_page();
                    });
                if (i === 0) {
                    $(btnnum).prop("checked", true);
                }
                $('#pagerdiv').append(btnnum);
                var lblnum = $('<label></label>')
                    .addClass('pagerlbl')
                    .attr('for', 'btnnum' + i)
                    .text((i + 1).toString())
                $('#pagerdiv').append(lblnum);
            }
            var btnnext = $('<button></button>').addClass('pagerbutt').text('>')
                .click(function(e) {
                    e.preventDefault();
                    valueThisReference.nxt();
                });
            $('#pagerdiv').append(btnnext);
            //Start - End Reviews
            //Start - Tab Share
            $('#modal-share-title').html(modalData.tabshare_title);
            $('#modal-share-message').html(modalData.tabshare_message);
            //End - Tab Share

            $('#ModalItemDetail').off('hidden.bs.modal').on('hidden.bs.modal', function() {
                valueThisReference.clear_review_form();
                $('.xchReview').empty();
                $('#hd-id-item-counter-list-review').val('0');
                valueThisReference.clear_share_form();
                reset();
            }).modal('show');
            //ModalConnector
        });
    },
    render_download_confirmation: function(object_sender) {

        var itemType = $('#hd-id-item-type').val();
        downloadUrl = "";
        switch (itemType) {
            case 'Widget':
                downloadUrl = ''+ parMeter +'widgetxchange/Resources/' + $(object_sender).data('item-guid') + '/install/' + $(object_sender).data('item-download');
                break;
            case 'Connector':
                downloadUrl = ''+ parMeter +'connectorxchange/Resources/' + $(object_sender).data('item-guid') + '/install/' + $(object_sender).data('item-download');
                break;
            default:
        }

        $('#modal-item-detail').modal('hide');
        $('#modal-item-terms-conditions').modal('show');
        $('#btn-cancel-terms-conditions').click(function(e) {
            e.preventDefault();
            $('#modal-item-terms-conditions').modal('hide');
        });
        $('#btn-accept-terms-conditions').click(function(e) {
            e.preventDefault();
            if ($("#chk-terms-conditions").is(':checked')) {
                window.open(downloadUrl);
                $('#modal-item-terms-conditions').modal('hide');
                $("#div-accept-terms-conditions").removeClass('alert alert-danger');
            } else {
                $("#div-accept-terms-conditions").addClass('alert alert-danger');
            }
        });
    },
    clear_review_form: function() {
        $('#response-review').text('');
        $("#hd-id-item-review").val('');
        $("#alias-review").val('');
        $("#comment-review").val('');
        $('#rating-review').rateYo('rating', 5);
    },
    clear_share_form: function() {
        $('#txtNameSenderShare').val('');
        $('#txtEmailSenderShare').val('');
        $('#txtNameFriend1Share').val('');
        $('#txtEmailFriend1Share').val('');
        $('#txtNameFriend2Share').val('');
        $('#txtEmailFriend2Share').val('');
        $('#txtNameFriend3Share').val('');
        $('#txtEmailFriend3Share').val('');
        $('#txtTextBodyShare').val($('#hd-message-share').val());
    },
    render_current_review_page: function() {
        var itemType = $('#hd-id-item-type').val();

        webserviceUrl = "";
        switch (itemType) {
            case 'Process':
                webserviceUrl = ''+ parMeter +'processxchange/services/ProcessCentral.svc/Processes/GetReviewsByPage/' + $('#hd-id-item').val() + '/';
                break;
            case 'Widget':
                webserviceUrl = ''+ parMeter +'widgetxchange/services/xchange.svc/GetItemReviewsByPage/' + $('#hd-id-item').val() + '/';
                break;
            case 'Connector':
                webserviceUrl = ''+ parMeter +'connectorxchange/services/xchange.svc/GetItemReviewsByPage/' + $('#hd-id-item').val() + '/';
                break;
            default:
        }

        var divItemReviews = $('#item-reviews');

        var curpage = curpage = parseInt($('#hd-id-item-counter-list-review').val());

        divItemReviews.empty();
        $.ajax({
            url: webserviceUrl + curpage.toString(),
            cache: false,
            type: 'get',
            dataType: "json",
            async: true
        }).done(function(data) {
            $.each(data.GetItemReviewsByPageResult, function(index, object) {
                var divreviewbox = $('<div/>').addClass('comment-box');
                var datereview = $('<p/>').addClass('date-review').text(object.CommentDateString);
                divreviewbox.append(datereview);

                var reviewer = $('<p/>').addClass('ti-txt16 ti-f600 ti-color2 ti-nomargin').text(object.Alias);
                divreviewbox.append(reviewer);

                var containerStars = $('<div/>').addClass('rated-group');
                for (i = 1; i <= object.Value; i++) {
                    containerStars.append($('<i/>').addClass('fa fa-star').attr('aria-hidden', 'true'));
                }
                for (j = object.Value; j < 5; j++) {
                    containerStars.append($('<i/>').addClass('fa fa-star-o').attr('aria-hidden', 'true'));
                }
                divreviewbox.append(containerStars);

                var reviewcomment = $('<p/>').addClass('ti-txt14 ti-color ti-f500 ti-margin-b10').text(object.Comment);
                divreviewbox.append(reviewcomment);

                divItemReviews.append(divreviewbox);
                //$('<div/>').addClass('xchReviewDetails').append($('<div/>').addClass('xchCommnentUser').text(object.Alias)).append(containerStars).append($('<div/>').addClass('xchCommnentDate').text(object.CommentDateString)).append($('<div/>').addClass('xchReviewComment').text(object.Comment)).appendTo('.xchReview');
            });
        });
    },
    add_to_xchange_list: function(xchange_list, list_to_add) {
        Array.prototype.push.apply(xchange_list.GetAllItemsResult, list_to_add.GetAllItemsResult);
    },
    filter_xchange_list: function(value) {
        if (value == '') {
            $('.xchItem').show();
        } else {
            var rex = new RegExp(value, 'i');
            $('.xchItem').hide();
            $('.xchItem').filter(function() {
                var xchItemName = $('#xchange-item-name', $(this)).text();
                return rex.test(xchItemName);
            }).show();
        }
    },
    processURL: function() {
        var valueThisReference = this;
        var url = new URL(location.href);

        var filter = valueThisReference.getAllUrlParams().filter;
        if (filter !== "" && filter != undefined) {

            switch (filter.toLowerCase()) {
                case "widgets":
                    $('.show-widgets').click();
                    break;
                case "processmodels":
                    $('.show-processes').click();
                    break;
                case "connectors":
                    $('.show-connectors').click();
                    break;
                default:
                    break;
            }
        }
    },

    getAllUrlParams: function(url) {

        // get query string from url (optional) or window
        var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

        // we'll store the parameters here
        var obj = {};

        // if query string exists
        if (queryString) {

            // stuff after # is not part of query string, so get rid of it
            queryString = queryString.split('#')[0];

            // split our query string into its component parts
            var arr = queryString.split('&');

            for (var i = 0; i < arr.length; i++) {
                // separate the keys and the values
                var a = arr[i].split('=');

                // in case params look like: list[]=thing1&list[]=thing2
                var paramNum = undefined;
                var paramName = a[0].replace(/\[\d*\]/, function(v) {
                    paramNum = v.slice(1, -1);
                    return '';
                });

                // set parameter value (use 'true' if empty)
                var paramValue = typeof(a[1]) === 'undefined' ? true : a[1];

                // (optional) keep case consistent
                paramName = paramName.toLowerCase();
                paramValue = paramValue.toLowerCase();

                // if parameter name already exists
                if (obj[paramName]) {
                    // convert value to array (if still string)
                    if (typeof obj[paramName] === 'string') {
                        obj[paramName] = [obj[paramName]];
                    }
                    // if no array index number specified...
                    if (typeof paramNum === 'undefined') {
                        // put the value on the end of the array
                        obj[paramName].push(paramValue);
                    }
                    // if array index number specified...
                    else {
                        // put the value at that index number
                        obj[paramName][paramNum] = paramValue;
                    }
                }
                // if param name doesn't exist yet, set it
                else {
                    obj[paramName] = paramValue;
                }
            }
        }

        return obj;
    },

    prv: function() {
        var currval = parseInt($('#hd-id-item-counter-list-review').val());
        if (currval > 0) {
            $('#btnnum' + (currval - 1)).click();
            //$('#hd-id-item-counter-list-review').val(currval - 1);
            //this.render_current_review_page();
        }
    },

    nxt: function() {
        var currval = parseInt($('#hd-id-item-counter-list-review').val());
        if (currval < parseInt($('#hd-id-item-counter-list-review').prop("max"))) {
            $('#btnnum' + (currval + 1)).click();
            //$('#hd-id-item-counter-list-review').val(currval + 1);
            //this.render_current_review_page();
        }
    },

};

