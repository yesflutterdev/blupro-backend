const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BluPro API Documentation',
      version: '1.0.0',
      description: 'API documentation for the BluPro application including Chat, Feed, and Authentication endpoints',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'Auth',
        description: 'Authentication endpoints',
      },
      {
        name: 'Chat',
        description: 'Chat and messaging endpoints',
      },
      {
        name: 'Feed',
        description: 'Social feed and posts endpoints',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            image: { type: 'string' },
          },
        },
        Feed: {
          type: 'object',
          properties: {
            text: { type: 'string' },
            image: { type: 'string' },
            likes: {
              type: 'array',
              items: { $ref: '#/components/schemas/User' },
            },
            comments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  userId: { $ref: '#/components/schemas/User' },
                  text: { type: 'string' },
                  userName: { type: 'string' },
                  userImage: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' },
                },
              },
            },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

module.exports = swaggerJsdoc(options); 