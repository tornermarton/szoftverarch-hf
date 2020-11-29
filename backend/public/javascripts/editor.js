// *** SELECT START ***
function remove_selection() {
    let selected = $(".selected");

    let editor_menu_element = $(selected).parent().parent().children(".editor-menu");
    $(selected).removeClass("selected");

    $(editor_menu_element).hide();

    $(selected).parent().parent().remove(editor_menu_element);
    $('body').append(editor_menu_element);
}

function select_element(event, element) {
    remove_selection();

    let editor_menu_element = $('body').children(".editor-menu");
    $(element).addClass("selected");

    $(element).parent().parent().append(editor_menu_element);
    $(editor_menu_element).show();

    event.stopPropagation();
}
// *** SELECT END ***

// *** MARK START ***
function mark_section(element) {
    if ($(element).hasClass("marked")) {
        $(element).removeClass("marked");
    }
    else {
        $(element).addClass("marked");
    }
}
// *** MARK END ***

// *** COMMENT START ***
function textarea_on_input(element) {
    element.style.height = "";
    element.style.height = element.scrollHeight + "px";
}

function textarea_on_focusout(element) {
    element.innerText = element.innerText.trim();
    textarea_on_input(element);

    if (element.innerText=== "") {
        $(element).parent().hide();
        $(element).parent().prev().removeClass("width-70");
        $(element).parent().prev().addClass("width-100");
    }
}

function add_comment(element) {
    $(element).removeClass("width-100");
    $(element).addClass("width-70");
    $(element).next().show();
    $(element).next().children(".editable-div").focus();
}
// *** COMMENT END ***

// *** BOOKMARK START ***
function create_bookmarks_block() {
    $("body").prepend(`<div id="bookmarks" class="card mb-3"><div class="card-body"><h3 class="card-title">Bookmarks</h3></div></div>`);
}

function remove_bookmark(element) {
    $(element).parents(".bookmark").remove();

    if ($("#bookmarks").find(".bookmark").length === 0) {
        $("#bookmarks").remove();
    }
}

function add_bookmark(element) {
    const name = window.prompt("Name: ");

    if (name && name.trim() !== "") {
        let id = "bookmark-" + Date.now().toString();

        if ($(element).attr('id')) {
            id = $(element).attr('id');
        }
        else {
            $(element).attr('id', id);
        }

        if ($("#bookmarks").length === 0) {
            create_bookmarks_block();
        }

        $("#bookmarks .card-body").append(`
        <div class="btn-group mb-2 bookmark" role="group">
            <a class="btn btn-outline-dark" role="button" href="#${id}">
                <i class="fas fa-bookmark mr-1"></i><span>${name}</span>
            </a>
            <div class="btn btn-danger" role="button" onclick="remove_bookmark(this)">X</div>
        </div>
    `);
    }
}
// *** BOOKMARK END ***

// *** HIDE START ***
function show_section() {
    let content = this.lastChild.lastChild;

    this.replaceWith(content);
}

function hide_section(element) {
    remove_selection();
    element = $(element).parent().parent()[0];

    let node = element.cloneNode(deep=true);
    let hidden_element = document.createElement("div");
    let hidden_wrapper = document.createElement("div");
    let hidden_placeholder = document.createElement("div");

    $(hidden_element).addClass("hidden_element");
    $(hidden_wrapper).addClass("hidden_wrapper");

    hidden_placeholder.innerHTML = "HIDDEN";

    hidden_wrapper.appendChild(node);
    hidden_element.appendChild(hidden_placeholder);
    hidden_element.appendChild(hidden_wrapper);

    hidden_element.addEventListener("click", show_section);
    $(node).find(".document-section-content")[0].addEventListener("click", function(event) {select_element(event, this)});

    element.replaceWith(hidden_element);
}
// *** HIDE END ***

function jumpToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

// *** WIRE IN FUNCTIONS START ***
$(".document-section-content").click(function (event) {
    select_element(event, this);
});

$(document).click(function() {
    remove_selection();
});

$(".editor-menu-mark").click(function () {
    mark_section($(this).parents(".document-section").find(".document-section-content"));
});

$(".editor-menu-hide").click(function () {
    hide_section($(this).parents(".document-section").find(".document-section-content"));
});

$(".editor-menu-comment").click(function () {
    add_comment($(this).parents(".document-section").find(".document-section-content"));
});

$(".editor-menu-bookmark").click(function () {
    add_bookmark($(this).parents(".document-section").find(".document-section-before"));
});

$(".cite").click(function (event) {
    event.stopPropagation();
});

$(".editable-div").on("resize", function () {
    textarea_on_input($(this));
});

$("#save-button").click(function() {
    let html = document.documentElement.outerHTML;

    let docid = $('html').attr("data-document-id");

    $.ajax({
        type: "POST",
        url: "/documents/" + docid + "/save/",
        data: {"document_html": html},
        dataType: "json",
        success: function (result){
            if (result.success) {
                alert("Saved!");
            }
            else {
                alert("Failed to save!");
            }
        }
    });
});

