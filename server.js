import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// In-memory data (temporary database)
let products = [
  { id: 1, name: "Shoe A", price: 2000, quantity: 10 },
  { id: 2, name: "Shoe B", price: 3500, quantity: 5 },
];

// GET all products
app.get('/products', (req, res) => {
  res.json(products);
});

// GET single product
app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// POST new product
app.post('/products', (req, res) => {
  const { name, price, quantity } = req.body;
  const newProduct = {
    id: products.length ? products[products.length - 1].id + 1 : 1,
    name,
    price,
    quantity,
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT (update) product
app.put('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ message: "Product not found" });

  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

// DELETE product
app.delete('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ message: "Product not found" });

  products.splice(index, 1);
  res.json({ message: "Product deleted" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});