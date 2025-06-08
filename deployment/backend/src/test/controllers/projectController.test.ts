import request from 'supertest';
import { Express } from 'express';
import { createProject, getProjects, getProject, updateProject, deleteProject } from '../../controllers/projectController';

// Mock the database
jest.mock('../../config/database', () => ({
  project: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
}));

describe('Project Controller', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;

  beforeEach(() => {
    mockReq = global.testUtils.createMockRequest();
    mockRes = global.testUtils.createMockResponse();
    mockNext = global.testUtils.createMockNext();
  });

  describe('createProject', () => {
    it('should create a new project successfully', async () => {
      const projectData = {
        title: 'Test Project',
        shortDescription: 'A test project',
        fullDescription: 'A detailed test project description',
        price: 2999,
        category: 'WEB_DEVELOPMENT',
        tags: ['react', 'typescript'],
      };

      mockReq.body = projectData;
      mockReq.user = global.testUtils.mockSeller;

      const mockCreatedProject = {
        id: 'test-project-id',
        ...projectData,
        sellerId: mockReq.user.id,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock database call
      const prisma = require('../../config/database');
      prisma.project.create.mockResolvedValue(mockCreatedProject);

      await createProject(mockReq, mockRes, mockNext);

      expect(prisma.project.create).toHaveBeenCalledWith({
        data: {
          ...projectData,
          sellerId: mockReq.user.id,
          status: 'PENDING',
        },
      });

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Project created successfully',
        data: { project: mockCreatedProject },
      });
    });

    it('should return error if user is not authenticated', async () => {
      mockReq.user = null;

      await createProject(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User not authenticated',
          statusCode: 401,
        })
      );
    });

    it('should return error if user is not a seller', async () => {
      mockReq.user = global.testUtils.mockUser; // Regular user, not seller

      await createProject(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Only sellers can create projects',
          statusCode: 403,
        })
      );
    });

    it('should validate required fields', async () => {
      mockReq.body = {}; // Empty body
      mockReq.user = global.testUtils.mockSeller;

      await createProject(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
        })
      );
    });
  });

  describe('getProjects', () => {
    it('should return paginated projects', async () => {
      const mockProjects = [
        { ...global.testUtils.mockProject, id: 'project-1' },
        { ...global.testUtils.mockProject, id: 'project-2' },
      ];

      mockReq.query = { page: '1', limit: '10' };

      const prisma = require('../../config/database');
      prisma.project.findMany.mockResolvedValue(mockProjects);
      prisma.project.count.mockResolvedValue(2);

      await getProjects(mockReq, mockRes, mockNext);

      expect(prisma.project.findMany).toHaveBeenCalledWith({
        where: { status: 'APPROVED' },
        include: {
          seller: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profilePicture: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10,
      });

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Projects retrieved successfully',
        data: {
          projects: mockProjects,
          pagination: {
            page: 1,
            limit: 10,
            total: 2,
            pages: 1,
            hasNext: false,
            hasPrev: false,
          },
        },
      });
    });

    it('should filter projects by category', async () => {
      mockReq.query = { category: 'WEB_DEVELOPMENT' };

      const prisma = require('../../config/database');
      prisma.project.findMany.mockResolvedValue([]);
      prisma.project.count.mockResolvedValue(0);

      await getProjects(mockReq, mockRes, mockNext);

      expect(prisma.project.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            status: 'APPROVED',
            category: 'WEB_DEVELOPMENT',
          },
        })
      );
    });

    it('should search projects by title', async () => {
      mockReq.query = { search: 'react' };

      const prisma = require('../../config/database');
      prisma.project.findMany.mockResolvedValue([]);
      prisma.project.count.mockResolvedValue(0);

      await getProjects(mockReq, mockRes, mockNext);

      expect(prisma.project.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            status: 'APPROVED',
            OR: [
              { title: { contains: 'react', mode: 'insensitive' } },
              { shortDescription: { contains: 'react', mode: 'insensitive' } },
              { tags: { hasSome: ['react'] } },
            ],
          },
        })
      );
    });
  });

  describe('getProject', () => {
    it('should return a single project by ID', async () => {
      const mockProject = global.testUtils.mockProject;
      mockReq.params = { id: 'test-project-id' };

      const prisma = require('../../config/database');
      prisma.project.findUnique.mockResolvedValue(mockProject);

      await getProject(mockReq, mockRes, mockNext);

      expect(prisma.project.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-project-id' },
        include: {
          seller: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profilePicture: true,
              bio: true,
              website: true,
              socialLinks: true,
              isVerified: true,
              createdAt: true,
            },
          },
          reviews: {
            include: {
              buyer: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  profilePicture: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
          _count: {
            select: {
              reviews: true,
              purchases: true,
            },
          },
        },
      });

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Project retrieved successfully',
        data: { project: mockProject },
      });
    });

    it('should return 404 if project not found', async () => {
      mockReq.params = { id: 'non-existent-id' };

      const prisma = require('../../config/database');
      prisma.project.findUnique.mockResolvedValue(null);

      await getProject(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Project not found',
          statusCode: 404,
        })
      );
    });
  });

  describe('updateProject', () => {
    it('should update project successfully', async () => {
      const updateData = {
        title: 'Updated Project Title',
        price: 3999,
      };

      mockReq.params = { id: 'test-project-id' };
      mockReq.body = updateData;
      mockReq.user = global.testUtils.mockSeller;

      const existingProject = {
        ...global.testUtils.mockProject,
        sellerId: mockReq.user.id,
      };

      const updatedProject = {
        ...existingProject,
        ...updateData,
        updatedAt: new Date(),
      };

      const prisma = require('../../config/database');
      prisma.project.findUnique.mockResolvedValue(existingProject);
      prisma.project.update.mockResolvedValue(updatedProject);

      await updateProject(mockReq, mockRes, mockNext);

      expect(prisma.project.update).toHaveBeenCalledWith({
        where: { id: 'test-project-id' },
        data: updateData,
      });

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Project updated successfully',
        data: { project: updatedProject },
      });
    });

    it('should return error if user is not the project owner', async () => {
      mockReq.params = { id: 'test-project-id' };
      mockReq.user = { ...global.testUtils.mockSeller, id: 'different-seller-id' };

      const existingProject = {
        ...global.testUtils.mockProject,
        sellerId: 'original-seller-id',
      };

      const prisma = require('../../config/database');
      prisma.project.findUnique.mockResolvedValue(existingProject);

      await updateProject(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'You can only update your own projects',
          statusCode: 403,
        })
      );
    });
  });

  describe('deleteProject', () => {
    it('should delete project successfully', async () => {
      mockReq.params = { id: 'test-project-id' };
      mockReq.user = global.testUtils.mockSeller;

      const existingProject = {
        ...global.testUtils.mockProject,
        sellerId: mockReq.user.id,
      };

      const prisma = require('../../config/database');
      prisma.project.findUnique.mockResolvedValue(existingProject);
      prisma.project.delete.mockResolvedValue(existingProject);

      await deleteProject(mockReq, mockRes, mockNext);

      expect(prisma.project.delete).toHaveBeenCalledWith({
        where: { id: 'test-project-id' },
      });

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Project deleted successfully',
        data: null,
      });
    });

    it('should return error if project has purchases', async () => {
      mockReq.params = { id: 'test-project-id' };
      mockReq.user = global.testUtils.mockSeller;

      const existingProject = {
        ...global.testUtils.mockProject,
        sellerId: mockReq.user.id,
        _count: { purchases: 5 },
      };

      const prisma = require('../../config/database');
      prisma.project.findUnique.mockResolvedValue(existingProject);

      await deleteProject(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Cannot delete project with existing purchases',
          statusCode: 400,
        })
      );
    });
  });
});
