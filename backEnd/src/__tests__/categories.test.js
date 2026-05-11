import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Categories API', () => {
  let categoryId;

  beforeAll(async () => {
    // Clean up before tests
    await prisma.category.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/categories', () => {
    it('should create a new category', async () => {
      const res = await request(app)
        .post('/api/categories')
        .send({ name: 'Tech', slug: 'tech' });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Tech');
      expect(res.body.slug).toBe('tech');
      categoryId = res.body.id;
    });

    it('should return 400 if name or slug missing', async () => {
      const res = await request(app)
        .post('/api/categories')
        .send({ name: 'Tech' });

      expect(res.status).toBe(400);
    });

    it('should return 409 if slug already exists', async () => {
      await request(app)
        .post('/api/categories')
        .send({ name: 'Tech2', slug: 'tech' });

      const res = await request(app)
        .post('/api/categories')
        .send({ name: 'Tech3', slug: 'tech' });

      expect(res.status).toBe(409);
    });
  });

  describe('GET /api/categories', () => {
    it('should fetch all categories', async () => {
      const res = await request(app).get('/api/categories');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /api/categories/:id', () => {
    it('should fetch a category by id', async () => {
      const res = await request(app).get(`/api/categories/${categoryId}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(categoryId);
    });

    it('should return 404 if category not found', async () => {
      const res = await request(app).get('/api/categories/invalid-id');

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/categories/:id', () => {
    it('should update a category', async () => {
      const res = await request(app)
        .put(`/api/categories/${categoryId}`)
        .send({ name: 'Technology' });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Technology');
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should delete a category', async () => {
      const res = await request(app).delete(`/api/categories/${categoryId}`);

      expect(res.status).toBe(204);
    });

    it('should return 404 if category not found', async () => {
      const res = await request(app).delete('/api/categories/invalid-id');

      expect(res.status).toBe(404);
    });
  });
});
