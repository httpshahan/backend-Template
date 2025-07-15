const request = require('supertest');
const path = require('path');
const fs = require('fs');
const app = require('../src/server');

describe('File Upload API', () => {
  let authToken;
  let testUserId;

  beforeAll(async () => {
    // Create test user and get auth token
    const userResponse = await request(app).post('/api/v1/auth/register').send({
      firstName: 'Test',
      lastName: 'User',
      email: 'testfileupload@example.com',
      password: 'TestPassword123!'
    });

    testUserId = userResponse.body.data.user.id;

    const loginResponse = await request(app).post('/api/v1/auth/login').send({
      email: 'testfileupload@example.com',
      password: 'TestPassword123!'
    });

    authToken = loginResponse.body.data.tokens.accessToken;
  });

  describe('GET /api/v1/upload/info', () => {
    it('should return upload configuration', async () => {
      const response = await request(app).get('/api/v1/upload/info').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('maxFileSize');
      expect(response.body.data).toHaveProperty('maxFiles');
      expect(response.body.data).toHaveProperty('allowedMimeTypes');
      expect(response.body.data.allowedMimeTypes).toContain('image/jpeg');
    });
  });

  describe('POST /api/v1/upload/single', () => {
    it('should require authentication', async () => {
      await request(app).post('/api/v1/upload/single').expect(401);
    });

    it('should return error when no file is uploaded', async () => {
      const response = await request(app)
        .post('/api/v1/upload/single')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No file uploaded');
    });

    it('should successfully upload a text file', async () => {
      // Create a temporary test file
      const testFile = path.join(__dirname, 'temp-test.txt');
      fs.writeFileSync(testFile, 'This is a test file for upload');

      const response = await request(app)
        .post('/api/v1/upload/single')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', testFile)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('File uploaded successfully');
      expect(response.body.data.file).toHaveProperty('filename');
      expect(response.body.data.file).toHaveProperty('originalName');
      expect(response.body.data.file.originalName).toBe('temp-test.txt');
      expect(response.body.data.file.mimetype).toBe('text/plain');

      // Clean up
      fs.unlinkSync(testFile);

      // Clean up uploaded file
      if (response.body.data.file.path) {
        try {
          fs.unlinkSync(response.body.data.file.path);
        } catch (error) {
          // File might not exist, that's okay
        }
      }
    });

    it('should reject files with disallowed MIME types', async () => {
      // Create a temporary test file with .exe extension (should be rejected)
      const testFile = path.join(__dirname, 'temp-test.exe');
      fs.writeFileSync(testFile, 'fake executable content');

      const response = await request(app)
        .post('/api/v1/upload/single')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', testFile)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not allowed');

      // Clean up
      fs.unlinkSync(testFile);
    });
  });

  describe('POST /api/v1/upload/multiple', () => {
    it('should require authentication', async () => {
      await request(app).post('/api/v1/upload/multiple').expect(401);
    });

    it('should successfully upload multiple files', async () => {
      // Create temporary test files
      const testFile1 = path.join(__dirname, 'temp-test1.txt');
      const testFile2 = path.join(__dirname, 'temp-test2.txt');
      fs.writeFileSync(testFile1, 'This is test file 1');
      fs.writeFileSync(testFile2, 'This is test file 2');

      const response = await request(app)
        .post('/api/v1/upload/multiple')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('files', testFile1)
        .attach('files', testFile2)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('2 files uploaded successfully');
      expect(response.body.data.files).toHaveLength(2);
      expect(response.body.data.count).toBe(2);

      // Clean up
      fs.unlinkSync(testFile1);
      fs.unlinkSync(testFile2);

      // Clean up uploaded files
      response.body.data.files.forEach(file => {
        if (file.path) {
          try {
            fs.unlinkSync(file.path);
          } catch (error) {
            // File might not exist, that's okay
          }
        }
      });
    });

    it('should return error when no files are uploaded', async () => {
      const response = await request(app)
        .post('/api/v1/upload/multiple')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No files uploaded');
    });
  });

  describe('GET /api/v1/upload/file/:filename', () => {
    let uploadedFileName;

    beforeAll(async () => {
      // Upload a test file first
      const testFile = path.join(__dirname, 'temp-serve-test.txt');
      fs.writeFileSync(testFile, 'This is a test file for serving');

      const uploadResponse = await request(app)
        .post('/api/v1/upload/single')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', testFile);

      uploadedFileName = uploadResponse.body.data.file.filename;
      fs.unlinkSync(testFile);
    });

    it('should serve uploaded files', async () => {
      const response = await request(app)
        .get(`/api/v1/upload/file/${uploadedFileName}`)
        .expect(200);

      expect(response.text).toBe('This is a test file for serving');
    });

    it('should return 404 for non-existent files', async () => {
      const response = await request(app).get('/api/v1/upload/file/nonexistent.txt').expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('File not found');
    });

    it('should reject files with path traversal attempts', async () => {
      const response = await request(app)
        .get('/api/v1/upload/file/../../../package.json')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid filename');
    });

    afterAll(async () => {
      // Clean up uploaded file
      if (uploadedFileName) {
        try {
          fs.unlinkSync(path.join('uploads/documents', uploadedFileName));
        } catch (error) {
          // File might not exist, that's okay
        }
      }
    });
  });

  describe('DELETE /api/v1/upload/file/:filename', () => {
    let uploadedFileName;

    beforeEach(async () => {
      // Upload a test file first
      const testFile = path.join(__dirname, 'temp-delete-test.txt');
      fs.writeFileSync(testFile, 'This is a test file for deletion');

      const uploadResponse = await request(app)
        .post('/api/v1/upload/single')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', testFile);

      uploadedFileName = uploadResponse.body.data.file.filename;
      fs.unlinkSync(testFile);
    });

    it('should require authentication', async () => {
      await request(app).delete(`/api/v1/upload/file/${uploadedFileName}`).expect(401);
    });

    it('should successfully delete uploaded files', async () => {
      const response = await request(app)
        .delete(`/api/v1/upload/file/${uploadedFileName}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('File deleted successfully');

      // Verify file is actually deleted
      const serveResponse = await request(app)
        .get(`/api/v1/upload/file/${uploadedFileName}`)
        .expect(404);
    });

    it('should return 404 for non-existent files', async () => {
      const response = await request(app)
        .delete('/api/v1/upload/file/nonexistent.txt')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('File not found');
    });

    it('should reject files with path traversal attempts', async () => {
      const response = await request(app)
        .delete('/api/v1/upload/file/../../../package.json')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid filename');
    });
  });
});
