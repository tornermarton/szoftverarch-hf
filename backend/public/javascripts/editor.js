mark_section = function (element) {
    if ($(element).hasClass("marked")) {
        $(element).removeClass("marked");
    }
    else {
        $(element).addClass("marked");
    }
};

show_section = function () {
    let content = this.lastChild.lastChild;

    this.replaceWith(content);
};

hide_section = function(element) {
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
    $(node).find("textarea")[0].addEventListener("focusout", function() { textarea_on_focusout(this) });
    $(node).find("textarea")[0].addEventListener("input", function() { textarea_on_input(this) });

    element.replaceWith(hidden_element);
};

add_comment = function(element) {
    $(element).removeClass("width-100");
    $(element).addClass("width-70");
    $(element).next().show();
    $(element).next().children("textarea").focus();
};

remove_selection = function() {
    let selected = $(".selected");

    let editor_menu_element = $(selected).parent().parent().children(".editor-menu");
    $(selected).removeClass("selected");

    $(editor_menu_element).hide();

    $(selected).parent().parent().remove(editor_menu_element);
    $('body').append(editor_menu_element);
};

select_element = function (event, element) {
    remove_selection();

    let editor_menu_element = $('body').children(".editor-menu");
    $(element).addClass("selected");

    $(editor_menu_element).show();

    $(element).parent().parent().append(editor_menu_element);

    event.stopPropagation();
};

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

textarea_on_focusout = function (element) {
    element.value = element.value.trim();
    textarea_on_input(element);

    if (element.value === "") {
        $(element).parent().hide();
        $(element).parent().prev().removeClass("width-70");
        $(element).parent().prev().addClass("width-100");
    }
};

textarea_on_input = function (element) {
    element.style.height = "";
    element.style.height = element.scrollHeight + "px";
};

$("textarea").focusout(function () { textarea_on_focusout(this) });
$("textarea").on("input", function() { textarea_on_input(this) });

$(".cite").click(function (event) {
    event.stopPropagation();
});

