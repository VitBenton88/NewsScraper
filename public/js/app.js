$(document).ready(function() {

    var articleId;

    //event listener for add comment button; captures comment id for db reference
    $('body').on('click', '.addComment', function() {

        event.preventDefault();

        articleId = $(this).attr("data-article");

        console.log(articleId);

    });

    //event listener for button click to add comment to db;
    $('body').on('click', '#sendButton', function() {

        event.preventDefault();

        var comment = $('#commentInput').val().trim();

        if (comment == "") {
            alert("Comment field is empty!");
        } else {

            var newComment = {
                body: comment,
                articleId: articleId
            }

            $.post("/comment", newComment)
                .done(function(data) {

                    if (data === true) {
                        alert("Comment Successfully Posted!");
                        window.location = "/";
                    } else {
                        alert("There Was An Error Posting Your Comment!")
                        $('.close').click(); //close comment modal
                    };

                });

        };

    });

    //event listener for button click to view/hide comments;
    var showText;
    $('body').on('click', '.viewComments', function() {

        event.preventDefault();

        var visible = $(this).attr("data-visible");
        var commentULid = "#" + $(this).attr("data-article");
        var hideText = '<i class="fa fa-eye-slash fa-lg"></i> Hide Comments</a>';

        if (visible === "false") {
            $(commentULid).show(250);
            showText = $(this).html()
            $(this).html(hideText);
            $(this).attr("data-visible", "true");
        } else {
            $(commentULid).hide(500);
            $(this).html(showText);
            $(this).attr("data-visible", "false");
        }

    });

    //workaround for setting bootstrap active class on about page
    if ($("#aboutPanel").hasClass("panel")){
        $("#aboutLink").addClass("active");
        $("#homeLink").removeClass("active");
    };

}); //END OF $(document).ready