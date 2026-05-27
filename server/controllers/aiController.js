const logger = require('../utils/logger');

class AiController {
    async ask(req, res) {
        try {
            const { prompt } = req.body;
            const user = req.user; // from verifyToken

            if (!prompt) {
                return res.status(400).json({ error: 'Please provide a prompt.' });
            }

            // MOCK RAG (Retrieval Augmented Generation) logic
            // In a real scenario, this would contact OpenAI/Anthropic/Local LLM
            // with retrieved context from MeiliSearch or Vector DB.
            
            let reply = "";
            const lowerPrompt = prompt.toLowerCase();

            if (lowerPrompt.includes('ortalama') || lowerPrompt.includes('not')) {
                reply = `Merhaba ${user?.username || 'Öğrenci'}, mevcut genel akademik ortalamanız (GANO) 3.42. Bu dönem aldığınız derslerin vize sonuçları sisteme girilmiştir, /dashboard/grades sekmesinden kontrol edebilirsiniz.`;
            } else if (lowerPrompt.includes('mezuniyet') || lowerPrompt.includes('kredi')) {
                reply = `Mezuniyetinize toplam 12 kredi (yaklaşık 4 zorunlu ders) kalmıştır. Yaz okulunda açılması planlanan derslerle mezuniyet şartlarını sağlayabilirsiniz.`;
            } else if (lowerPrompt.includes('ders kayd') || lowerPrompt.includes('kayıt')) {
                reply = "Bahar dönemi ders kayıtları 15 Şubat saat 09:00'da başlayacaktır. Danışman onayınızın ardından kesin kayıt işleminiz tamamlanacaktır.";
            } else if (lowerPrompt.includes('devamsızlık') || lowerPrompt.includes('yoklama')) {
                reply = "Şu ana kadar 'Veri Yapıları ve Algoritmalar' dersinden 2 hafta devamsızlığınız bulunuyor. Sınır 4 haftadır, dikkatli olmanızı öneririm.";
            } else if (lowerPrompt.includes('şifre') || lowerPrompt.includes('2fa')) {
                reply = "Güvenlik ayarlarınızı Dashboard > Ayarlar menüsünden 'İki Adımlı Doğrulama (2FA)' sekmesine girerek Google Authenticator ile güncelleyebilirsiniz.";
            } else {
                reply = "Anlıyorum. Sana nasıl yardımcı olabileceğimi tam olarak kavramam için lütfen daha spesifik bir akademik soru sorabilir misin? Örneğin notlarım, devamsızlığım veya ders kaydım hakkında diyebilirsin.";
            }

            return res.status(200).json({
                success: true,
                reply
            });

        } catch (error) {
            logger.error('AI Error:', error);
            res.status(500).json({ error: 'AI servisi şu anda yanıt veremiyor.' });
        }
    }
}

module.exports = new AiController();
