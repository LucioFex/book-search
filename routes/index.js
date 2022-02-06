const express = require('express');

const router = express.Router();

// Google Books API Helper
const booksApi = require('../helpers/booksApi');

// Routes of the main pages
router.get('/', async (req, res) => { // Home route
    try {
        const homeBooks = await booksApi.getHomeBooks();
        const latestBooks = await booksApi.getRecommendedBooks();
        res.render('home', {
            sectionTitle: 'Home', homeBooks, latestBooks,
        });
        // In case there's an error, no books will be displayed
    } catch (err) { res.status(404).render('page-not-found'); }
});

router.get('/popular', async (req, res) => { // Popular Books route
    const page = parseInt(req.query.page) || 1;

    try {
        const popularBooks = await booksApi.getPopularBooks(page);
        const latestBooks = await booksApi.getRecommendedBooks();
        res.render('books-section', {
            sectionTitle: 'Most Popular',
            navbarPopular: ' active',
            navbarCategories: '',
            route: 'popular',
            subject: '',
            books: popularBooks,
            latestBooks,
            page,
        });
        // In case there's an error, no books will be displayed
    } catch (err) { res.status(404).render('page-not-found'); }
});

router.get('/categories', async (req, res) => { // Categorized Books route
    const page = parseInt(req.query.page) || 1;
    const { subject } = req.query;

    try {
        const [
            subjectBooks, subjectName,
        ] = await booksApi.getCategorizedBooks(subject, page);

        const latestBooks = await booksApi.getRecommendedBooks();
        res.render('books-section', {
            sectionTitle: `Category: ${subjectName}`,
            navbarCategories: ' active',
            navbarPopular: '',
            subject: `&subject=${subjectName}`,
            route: 'categories',
            books: subjectBooks,
            latestBooks,
            page,
        });
        // In case there's an error, no books will be displayed
    } catch (err) { res.status(404).render('page-not-found'); }
});

// 404 http status response
router.use((req, res) => {
    res.status(404).render('page-not-found');
});

module.exports = router;
