const logger = require('../utils/logger');
const gradeService = require('../services/gradeService');
const attendanceService = require('../services/attendanceService');

// Rule-based campus assistant. It answers from the signed-in user's REAL records
// (grades, attendance) instead of fabricating numbers. Intents it cannot answer
// from data fall back to honest, generic guidance — it never invents specifics.
// To upgrade to a real LLM later, branch here on an API key and call the model
// with the same retrieved context.
class AiController {
    async ask(req, res) {
        try {
            const { prompt } = req.body;
            const user = req.user; // from verifyToken

            if (!prompt || typeof prompt !== 'string') {
                return res.status(400).json({ error: 'Please provide a prompt.' });
            }

            const lowerPrompt = prompt.toLowerCase();
            const name = user?.username || 'Öğrenci';
            let reply;

            if (lowerPrompt.includes('ortalama') || lowerPrompt.includes('gano') || lowerPrompt.includes('not')) {
                const grades = await gradeService.getGradesByUserId(user.id);
                const history = Array.isArray(grades?.history) ? grades.history : [];
                const latest = history.length ? history[history.length - 1] : null;
                const current = Array.isArray(grades?.currentSemester) ? grades.currentSemester : [];

                if (latest && typeof latest.gno === 'number') {
                    reply = `Merhaba ${name}, en güncel genel akademik ortalamanız (GANO) ${latest.gno.toFixed(2)}${latest.semester ? ` (${latest.semester})` : ''}. Detaylar için /dashboard/grades sekmesine bakabilirsiniz.`;
                } else if (current.length) {
                    reply = `Bu dönem ${current.length} dersiniz görünüyor, ancak henüz hesaplanmış bir GANO kaydınız yok. Not detaylarını /dashboard/grades sekmesinden inceleyebilirsiniz.`;
                } else {
                    reply = 'Sistemde henüz size ait bir not kaydı bulamadım. Notlarınız girildikçe buradan özetleyebilirim.';
                }
            } else if (lowerPrompt.includes('devamsız') || lowerPrompt.includes('yoklama')) {
                const records = await attendanceService.getAttendances(user.id);
                const withAbsences = (Array.isArray(records) ? records : [])
                    .filter(r => (r.absent || 0) > 0)
                    .sort((a, b) => (b.absent || 0) - (a.absent || 0));

                if (withAbsences.length) {
                    const top = withAbsences[0];
                    reply = `'${top.name || top.code}' dersinden ${top.absent} devamsızlığınız bulunuyor (devam: %${top.percent ?? '—'}). ${withAbsences.length > 1 ? `Toplam ${withAbsences.length} derste devamsızlık kaydınız var. ` : ''}Detaylar için /dashboard/attendance sekmesini kontrol edebilirsiniz.`;
                } else if (Array.isArray(records) && records.length) {
                    reply = 'Kayıtlı derslerinizde devamsızlık görünmüyor, tebrikler. Detaylar /dashboard/attendance sekmesinde.';
                } else {
                    reply = 'Sistemde size ait bir devamsızlık kaydı bulamadım.';
                }
            } else if (lowerPrompt.includes('ders kayd') || lowerPrompt.includes('kayıt')) {
                reply = 'Ders kayıt dönemleri akademik takvimde duyurulur. Danışman onayınızın ardından kesin kaydınız tamamlanır. Güncel tarihleri /dashboard/academic-calendar sekmesinden takip edebilirsiniz.';
            } else if (lowerPrompt.includes('mezuniyet') || lowerPrompt.includes('kredi')) {
                reply = 'Mezuniyet durumunuzu ve kalan kredilerinizi /dashboard/graduation sekmesinden güncel olarak görebilirsiniz. Belirli bir ders hakkında sorunuz varsa danışmanınızla iletişime geçebilirsiniz.';
            } else if (lowerPrompt.includes('şifre') || lowerPrompt.includes('2fa')) {
                reply = "Güvenlik ayarlarınızı Dashboard > Ayarlar menüsünden 'İki Adımlı Doğrulama (2FA)' sekmesine girerek Google Authenticator ile güncelleyebilirsiniz.";
            } else {
                reply = 'Anlıyorum. Size daha iyi yardımcı olabilmem için lütfen daha spesifik bir akademik soru sorun — örneğin notlarım, devamsızlığım, ders kaydım veya mezuniyet durumum hakkında.';
            }

            return res.status(200).json({ success: true, reply });
        } catch (error) {
            logger.error('AI Error:', error);
            res.status(500).json({ error: 'AI servisi şu anda yanıt veremiyor.' });
        }
    }
}

module.exports = new AiController();
