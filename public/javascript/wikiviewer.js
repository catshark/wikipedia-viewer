function searchToggle(obj, evt){
    var container = $(obj).closest('.search-wrapper');

    if(!container.hasClass('active')){
        $(obj).find("span").toggleClass('active');
        container.addClass('active');
        container.find(".close").toggleClass('active');
        evt.preventDefault();
    }
    else if(container.hasClass('active') && $(obj).closest('.input-holder').length == 0){
        // clear search results
        var wikiLinks = document.querySelectorAll('.article');
        Array.prototype.forEach.call(wikiLinks, function(el, i) {
            el.parentNode.removeChild(el);
        });

        var searchForm = document.getElementById('search-form');
        var randomLink = document.querySelector('.search-wrapper p');
        var searchField = document.querySelector('.search-input');

        randomLink.classList.add('random-article');
        searchForm.classList.add('absolute-center');
        searchForm.classList.add('is-responsive');
        searchForm.parentNode.classList.remove('col-md-4');
        searchForm.parentNode.classList.remove('col-md-offset-4');
        searchForm.parentNode.classList.remove('text-center');

        //$(obj).toggleClass('active');
        container.find('.search-icon').removeAttr('style');
        container.find("span").toggleClass('active');
        container.removeClass('active');
        //container.find(".close").toggleClass('active');
        // clear input
        container.find('.search-input').val('');
    }
}

function submitFn(obj, evt){
    value = $(obj).find('.search-input').val().trim();

    _html = "Yup yup! Your search text sounds like this: ";
    if(!value.length){
        _html = "Yup yup! Add some text friend :D";
    }
    else{
        _html += "<b>" + value + "</b>";
    }

    $(obj).find('.result-container').html('<span>' + _html + '</span>');
    $(obj).find('.result-container').fadeIn(100);

    evt.preventDefault();
}
/*
var searchBtn = document.querySelector("button");
console.log(window.getComputedStyle(searchBtn)['display']);
$("button").one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {
    $(this).css('display','none');
});*/

document.querySelector('.absolute-center').addEventListener('submit', function (e) {
    e.preventDefault();
    
    var searchForm = document.getElementById('search-form');
    var randomLink = document.querySelector('.search-wrapper p');
    var searchField = document.querySelector('.search-input');
    var searchValue = searchField.value;

    var wikiLinks;
    if (searchValue.length > 0) {
        randomLink.classList.remove('random-article');
        searchForm.classList.remove('absolute-center');
        searchForm.classList.remove('is-responsive');
        searchForm.parentNode.classList.add('col-md-4');
        searchForm.parentNode.classList.add('col-md-offset-4');
        searchForm.parentNode.classList.add('text-center');
        getWikiLinks(searchValue, writeData);
    }

});

function getWikiLinks(searchTerm, callback) {
    var request = new XMLHttpRequest();
    requestUrl = 'https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrsearch=' +
    searchTerm +  '&gsrlimit=10&prop=pageimages|extracts|info&inprop=url&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max';

    var wikiInfo = [];
    request.open('GET', requestUrl, true);

    request.onload = function() {
        if (request.readyState === 4) {
            if ((request.status >= 200 && request.status < 300) || request.status == 304) {
                // Success!
                var data = JSON.parse(request.responseText);
                if (data.query) {
                    var wikiPages = data.query.pages;

                    for (var page in wikiPages) {
                        if (wikiPages.hasOwnProperty(page)) {
                            wikiInfo.push({url: wikiPages[page].fullurl, title: wikiPages[page].title, extract: wikiPages[page].extract});
                        }
                    }
                    callback(wikiInfo);
                }
                else {
                    removeWikiList();
                }
            }
        }
    };

    request.send();
}

function removeWikiList() {
    var wikiLinks = document.querySelectorAll('.article');
    if (wikiLinks.length > 0) {
        Array.prototype.forEach.call(wikiLinks, function(el, i) {
            el.parentNode.removeChild(el);
        });
    }
}

function writeData(myData) {
    for (var i = 0; i < myData.length; i++) {
        console.log("url is " + myData[i].url + ". title is " + myData[i].title + ". extract is " + myData[i].extract + ".");
    }

    var wikiList = document.querySelector(".wiki-list");

    $('.wiki-list').fadeOut("fast", function() {

        //removeWikiList();
        var listArticlesTemplate = document.getElementById("displayWikis-template").innerHTML;
        var compiled = Handlebars.compile(listArticlesTemplate);

        wikiList.innerHTML = compiled(myData);
    });

    $('.wiki-list').fadeIn("slow");
}

function callWikiAPI(searchTerm) {
    var request = new XMLHttpRequest();
    requestUrl = 'https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrsearch=' +
        searchTerm +  '&gsrlimit=10&prop=pageimages|extracts|info&inprop=url&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max';

    var wikiInfo = [];
    request.open('GET', requestUrl, true);

    request.onload = function() {
        if (request.readyState === 4) {
            if ((request.status >= 200 && request.status < 300) || request.status == 304) {
                // Success!
                var data = JSON.parse(request.responseText);
                var wikiPages = data.query.pages;

                for (var page in wikiPages) {
                    if (wikiPages.hasOwnProperty(page)) {
                        console.log(page + " -> " + wikiPages[page]);
                        wikiInfo.push({url: wikiPages[page].fullurl, title: wikiPages[page].title, extract: wikiPages[page].extract});
                    }
                }
            }
        }
    };

    request.send();

    return wikiInfo;
}
