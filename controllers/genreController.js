var Genre = require('../models/genre');
var Book = require('../models/book');
var async = require("async");

//Display list of all Genre
exports.genre_list = function(req, res, next) {
    
    Genre.find()
        .exec(function (err, list_genre) {
            if (err) { return next(err); }

            //Successful, so render
            res.render('genre_list', {title: 'Genre List', genre_list: list_genre });
        });
};

// Display detail page for a specific Genre
exports.genre_detail = function(req, res, next) {

    async.parallel({
        genre: function(callback) {
            Genre.findById(req.params.id)
                .exec(callback);
        },
    
        genre_books: function (callback) {
            Book.find({ 'genre': req.params.id })
                .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next (err); }

        //Successful, so render
        res.render('genre_detail', { title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books } );
    });
};

// Display Genre create form on GET
exports.genre_create_get = function(req, res) {
    res.render('genre_form', { title: 'Create Genre'});
};

// Handle Genre create on POST
exports.genre_create_post = function(req, res, next) {
    
    //Check that the name field is not empty
    req.checkBody('name', 'Genre name required').notEmpty();

    //Trim and escape the name field.
    req.senitize('name').escape();
    req.senitize('name').trim();

    //Run the validators
    var errors = req.validationErrors();

    //Create a genre object with escaped and trimmed data.
    var genre = new Genre (
        { name: req.body.name }
    );

    if (errors) {
        //If there are errors render the form again, passing the previously entered values and errors
        res.render('genre_form', { title: "Create Genre", genre: genre, errors: errors});
    return;
    }
    else {
        Genre.findOne({ 'name': req.body.name })
            .exec( function(err, found_genre) {
                console.log('found_genre: ' + found_genre);
                if (err) { return next(err); }

                if (found_genre) {
                    res.redirect(found_genre.url);
                }
                else {
                    genre.save(function (err) {
                        if (err) { return next(err); }
                        res.redirect(genre.url);
                    });
                }
            })
    }
};

// Display Genre delete form on GET
exports.genre_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST
exports.genre_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET
exports.genre_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST
exports.genre_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update POST');
};
