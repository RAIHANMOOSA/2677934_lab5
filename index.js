const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let booksCollection = [];

const generateUniqueId = () => {
  return Math.floor(Math.random() * 100000).toString();
};

app.get('/whoami', (req, res) => {
  res.json({ studentNumber: "2677934" });
});

app.get('/books', (req, res) => {
  res.json(booksCollection);
});

app.get('/books/:id', (req, res) => {
  const book = booksCollection.find(b => b.id === req.params.id);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
  res.json(book);
});

app.post('/books', (req, res) => {
  const { title, details } = req.body;

  if (!title || !details || !Array.isArray(details)) {
    return res.status(400).json({ error: 'Missing required book details' });
  }

  const newBook = {
    id: generateUniqueId(),
    title,
    details: details.map(detail => ({
      id: generateUniqueId(),
      ...detail
    }))
  };

  booksCollection.push(newBook);
  res.status(201).json(newBook);
});

app.put('/books/:id', (req, res) => {
  const { id } = req.params;
  const { title, details } = req.body;

  const book = booksCollection.find(b => b.id === id);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  if (title) book.title = title;
  
  if (details && Array.isArray(details)) {
    book.details = details.map(detail => ({
      id: generateUniqueId(),
      ...detail
    }));
  }

  res.json(book);
});

app.delete('/books/:id', (req, res) => {
  const bookIndex = booksCollection.findIndex(b => b.id === req.params.id);
  if (bookIndex === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }

  booksCollection.splice(bookIndex, 1);
  res.status(204).send();
});

app.post('/books/:id/details', (req, res) => {
  const { id } = req.params;
  const { author, genre, publicationYear } = req.body;

  const book = booksCollection.find(b => b.id === id);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  if (!author || !genre || !publicationYear) {
    return res.status(400).json({ error: 'Missing required detail fields' });
  }

  const newDetail = {
    id: generateUniqueId(),
    author,
    genre,
    publicationYear
  };

  book.details.push(newDetail);
  res.status(201).json(newDetail);
});

app.delete('/books/:id/details/:detailId', (req, res) => {
  const { id, detailId } = req.params;

  const book = booksCollection.find(b => b.id === id);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  const detailIndex = book.details.findIndex(d => d.id === detailId);
  if (detailIndex === -1) {
    return res.status(404).json({ error: 'Detail not found' });
  }

  book.details.splice(detailIndex, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
