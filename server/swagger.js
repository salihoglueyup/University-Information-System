const swaggerJsDoc = require('swagger-jsdoc');

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
                url: 'http://localhost:5000/api',
                description: 'Lokal Geliştirme Sunucusu'
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
    apis: ['./server/routes/*.js', './server/controllers/*.js']
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
