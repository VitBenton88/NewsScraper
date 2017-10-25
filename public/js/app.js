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



}); //END OF $(document).ready