const express = require('express');
const prisma = require('../lib/prisma');

const router = express.Router();

// GET all categories
router.get('/', async (_req, res) => {
  try {
    console.log('GET /categories');
    const categories = await prisma.category.findMany({
      include: { _count: { select: { articles: true } } },
      orderBy: { createdAt: 'desc' },
    });
    console.log('Found categories:', categories.length);
    res.json(categories);
  } catch (error) {
    console.error('GET categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories', details: error.message });
  }
});

// GET category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: req.params.id },
      include: { articles: true },
    });
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

// POST create category
router.post('/', async (req, res) => {
  try {
    console.log('POST /categories', req.body);
    const { name, slug } = req.body;
    if (!name || !slug) {
      console.log('Missing name or slug');
      return res.status(400).json({ error: 'Name and slug required' });
    }

    console.log('Creating category:', { name, slug });
    const category = await prisma.category.create({
      data: { name, slug },
    });
    console.log('Category created:', category);
    res.status(201).json(category);
  } catch (error) {
    console.error('Create category error:', error.message, error.code);
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Slug already exists' });
    }
    res.status(500).json({ error: 'Failed to create category', details: error.message });
  }
});

// PUT update category
router.put('/:id', async (req, res) => {
  try {
    const { name, slug } = req.body;
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: { ...(name && { name }), ...(slug && { slug }) },
    });
    res.json(category);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// DELETE category
router.delete('/:id', async (req, res) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

module.exports = router;
