let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

let jwt = require('jsonwebtoken');

// create a reference to the model
let Book = require('../models/book');

module.exports.displayBookList = async (req, res, next) => {
    try {
        let bookList = await Book.find();
        res.render('book/list', 
        {title: 'Books', 
        BookList: bookList, 
        displayName: req.user ? req.user.displayName : ''}); 
    } catch(err) {
        console.error(err);
    }
}

module.exports.displayAddPage = async (req, res, next) => {
    res.render('book/add', {title: 'Add Book', 
    displayName: req.user ? req.user.displayName : ''})          
}

module.exports.processAddPage = async (req, res, next) => {
    let newBook = new Book({
        "name": req.body.name,
        "author": req.body.author,
        "published": req.body.published,
        "description": req.body.description,
        "price": req.body.price
    });

    try {
        await newBook.save();
        res.redirect('/book-list');
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
}

module.exports.displayEditPage = async (req, res, next) => {
    let id = req.params.id;

    try {
        let bookToEdit = await Book.findById(id);
        res.render('book/edit', {title: 'Edit Book', book: bookToEdit, 
        displayName: req.user ? req.user.displayName : ''})
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
}

module.exports.processEditPage = async (req, res, next) => {
    let id = req.params.id

    let updatedBook = {
        "_id": id,
        "name": req.body.name,
        "author": req.body.author,
        "published": req.body.published,
        "description": req.body.description,
        "price": req.body.price
    };

    try {
        await Book.updateOne({_id: id}, updatedBook);
        res.redirect('/book-list');
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
}

module.exports.performDelete = async (req, res, next) => {
    let id = req.params.id;

    try {
        await Book.findByIdAndRemove(id);
        res.redirect('/book-list');
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
}