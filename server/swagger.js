const swaggerJsDoc = require('swagger-jsdoc');
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'UBIS Kurumsal OBS API',
            version: '3.0.0',
            description: 'İstanbul Aydın Üniversitesi Öğrenci Bilgi Sistemi (UBIS) için geliştirilmiş modern ve ölçeklenebilir RESTful API Servisleri Dokümantasyonu.',
            contact: {
                name: 'UBIS IT Support',
                url: 'https://ubis.aydin.edu.tr'
            }
        },
        servers: [
            {
                url: process.env.API_URL || 'http://localhost:5000/api',
                description: 'API Sunucusu'
            }
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [
            {
                BearerAuth: []
            }
        ]
    },
    // Rotaların (endpoint'lerin) açıklamasını nerede bulacağı
    apis: [path.join(__dirname, 'routes/*.js'), path.join(__dirname, 'controllers/*.js')]
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
