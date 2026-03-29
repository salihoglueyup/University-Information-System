# Katkı Rehberi (CONTRIBUTING)

UBIS'e katkı sağlamayı düşündüğün için teşekkürler! Bu rehber, kod katkısı, bug raporlama ve feature önerme hakkında bilgilendirmektedir.

## 📋 Başlamadan Önce

1. **Bu projeyi fork et** (GitHub'da fork button)
2. **Local'e clone et**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ubis.git
   cd ubis
   ```
3. **Upstream'i ekle** (güncellemeleri almak için):
   ```bash
   git remote add upstream https://github.com/original-owner/ubis.git
   ```
4. **Kurulum rehberini oku**: [docs/SETUP_GUIDE.md](docs/SETUP_GUIDE.md)

---

## 🐛 Bug Raporlama

Bir bug (hata) bulursan:

### 1. Bug'ın daha önce raporlanmadığını kontrol et
```
GitHub Repo → Issues → Search "your bug"
```

### 2. Yeni issue aç
**Title**: Açıklayıcı ve kısa
```
❌ Wrong: "Bug in grades"
✅ Right: "Grade calculation shows incorrect GPA for 'AA' grades"
```

**Description Template**:
```markdown
## Describe the bug
Bir açıklama yaz.

## Steps to reproduce
1. Github'a git
2. Issues'a tıkla
3. Hata oluşur

## Expected behavior
Ne olması gerekiyordu?

## Screenshots
Varsa ekle

## Environment
- OS: Windows 11 / Ubuntu 22.04
- Browser: Chrome 120
- Version: v0.1.0
```

---

## ✨ Feature İsteği

Yeni feature öneriyorsan:

### 1. Öneriye uygun olup olmadığını kontrol et

Feature'ın projenin kapsam ve hedeflerine uygun mu?
- ✅ Akademik yönetim sistemi geliştirmek
- ❌ Sosyal medya entegrasyonu (kapsam dışı)

### 2. GitHub Discussions'da tartış
```
GitHub Repo → Discussions → New discussion
Title: "Idea: Add SMS notifications for grades"
Category: Ideas
```

Topluluk ve yöneticilerden feedback al.

### 3. Issue aç
**Title**: Açık ve özlü
**Label**: `enhancement` veya `feature-request`

---

## 💻 Kod Katkısı Adımları

### Adım 1: Branch Oluştur
```bash
# Upstream'den güncel al
git fetch upstream
git checkout upstream/main

# Yeni branch oluştur (descriptive name)
git checkout -b feature/add-sms-notifications
# ya da
git checkout -b fix/grade-gpa-calculation
```

**Branch Adlandırması Kuralları**:
- `feature/` - Yeni özellik
- `fix/` - Bug düzeltme
- `docs/` - Dokümantasyon
- `refactor/` - Kod düzenleme
- `test/` - Test ekleme

### Adım 2: Codunu Yaz

#### Kod Standartları

**Frontend (React)**:
- Functional components + hooks
- PropTypes validate
- Tailwind CSS styling
- File naming: `camelCase.jsx`

```javascript
// ✅ Good
const StudentGrades = ({ studentId }) => {
  const [grades, setGrades] = useState([]);
  
  useEffect(() => {
    fetchGrades(studentId);
  }, [studentId]);
  
  return <div>{grades.map(...)}</div>;
};

export default StudentGrades;
```

**Backend (Node.js)**:
- Middleware → Controller → Service → Model
- Error handling (try-catch → next())
- Consistent response format
- File naming: `camelCase.js`

```javascript
// ✅ Good
exports.getGrades = async (req, res, next) => {
  try {
    const grades = await gradeService.getByStudent(req.params.studentId);
    res.status(200).json({ status: 'success', data: grades });
  } catch (err) {
    next(err); // Error handler middleware
  }
};
```

#### Comments & Documentation

```javascript
// ❌ Kötü
const calc = (a, b) => a + b; // adds numbers

// ✅ İyi
/**
 * Calculate weighted average GPA from grades
 * @param {Array<{grade, credit}>} grades - Grade records with credits
 * @returns {number} Weighted GPA (0-4)
 */
const calculateGPA = (grades) => {
  // logic...
};
```

### Adım 3: Kodu Test Et

```bash
# Frontend
cd client
npm run lint        # ESLint
npm run lint:fix    # Auto-fix
npm run test        # Jest tests
npm run build       # Production build

# Backend
cd server
npm test            # Mocha/Jest tests
npm run lint        # ESLint
```

### Adım 4: Commit Mesajı

**Conventional Commits** formatı kullan:

```
type(scope): subject

body (optional)
footer (optional)
```

**Type**:
- `feat:` - Yeni feature
- `fix:` - Bug düzeltme
- `docs:` - Dokümantasyon
- `refactor:` - Kod düzenleme
- `test:` - Test ekleme
- `perf:` - Performans

**Örnek**:
```bash
git add .
git commit -m "feat(grades): add GPA calculation with weighted average

- Calculate weighted GPA from student grades
- Handle different grading scales (AA-F)
- Add validation for credit hours
- Include unit tests

Fixes #123"
```

### Adım 5: Push ve Pull Request

```bash
# Local branch'ı push et
git push origin feature/add-sms-notifications

# GitHub'da PR aç
# - Base: original-owner/ubis (main branch)
# - Compare: YOUR_USERNAME/ubis (feature-branch)
```

**PR Description Template**:

```markdown
## Describe your changes
Feature/fix ne yapıyor?

## Related Issues
Closes #123

## Type of change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation
- [ ] Refactoring

## Testing
Test ettiysen nasıl test ettin?

## Screenshots / Demo
Varsa ekle

## Checklist
- [ ] Code follows style guidelines (ESLint passes)
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Tests added/updated
- [ ] Documentation updated if needed
- [ ] No breaking changes
```

---

## 📐 Code Review Süreci

### Beklenticiler
- Yapıcı eleştiri kabullenme (bu kişisel değil!)
- Geri dönüş veya öneriler hızlıca cevapla
- Topluluk standartlarına uy

### Gözden Geçirenler Kontrol Eder
1. **Kod Kalitesi**: ESLint, type safety, readability
2. **İş Mantığı**: Doğru mü? Edge cases handle mi?
3. **Tests**: Yeterli coverage var mı?
4. **Dokümantasyon**: API docs, comments güncellenmiş mi?
5. **Performans**: Yavaşlık ya da hafızla sızıntı var mı?

### Suggestions Aldıysan
1. Önerileri anlamadıysan sor
2. Kodunu düzelt (commit → push)
3. Gözden geçirenin onayını bekle
4. Merge olur!

---

## 🧪 Test Yazma

**Her özellik test gerekli!**

### Frontend Test (Jest + React Testing Library)

```javascript
// src/components/GradeForm.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import GradeForm from './GradeForm';

describe('GradeForm', () => {
  test('renders form fields', () => {
    render(<GradeForm />);
    expect(screen.getByLabelText(/student/i)).toBeInTheDocument();
  });

  test('submits form with valid data', async () => {
    const onSubmit = jest.fn();
    render(<GradeForm onSubmit={onSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/student/i), { target: { value: '123' } });
    fireEvent.click(screen.getByText(/submit/i));
    
    expect(onSubmit).toHaveBeenCalled();
  });
});
```

### Backend Test (Mocha + Chai)

```javascript
// server/tests/grades.test.js
describe('Grade Service', () => {
  it('should calculate GPA correctly', async () => {
    const grades = ['AA', 'BA', 'BB'];
    const gpa = await gradeService.calculateGPA(grades);
    
    expect(gpa).to.be.closeTo(3.5, 0.1);
  });

  it('should handle invalid grades', () => {
    expect(() => gradeService.calculateGPA(['XX'])).to.throw();
  });
});
```

---

## 📚 Dokümantasyon

Kod katkısı ile beraber dokümantasyon güncellemesi de gerekli:

- **API endpoint** eklediysen → [API_MODULES.md](docs/API_MODULES.md) güncelle
- **Yeni feature** eklediysen → [FEATURES.md](docs/FEATURES.md) güncelle
- **Kurulum değişti** → [SETUP_GUIDE.md](docs/SETUP_GUIDE.md) güncelle

---

## 🚀 Merge Kriterleri

PR merge edilebilmesi için:
- ✅ Tüm code review comments cevaplandı
- ✅ CI/CD passed (tests, lint, build)
- ✅ En az 2 yönetici approval verdi
- ✅ Hiç conflict yok (main breed ile)
- ✅ Commit sayısı makul (squash et lazımsa)

---

## 😄 Topluluk Rehberi

- **Kibar olun**: Herkes öğrenmekte
- **Saygı gösterin**: Farklı seviyeleri
- **İşbirliği**: Sen ve gözden geçiren aynı takımdanız
- **Açık fikir**: Eleştiri öğrenme fırsatı

---

## 🆘 Yardım Gerek mi?

- **Setup problemi**: [docs/SETUP_GUIDE.md](docs/SETUP_GUIDE.md)
- **Kod örneği**: Existing PR'ları gözden geçir
- **Soru**: [Discussions](https://github.com/yourusername/ubis/discussions)
- **Emergency**: tech-team@ubis.local

---

## ⭐ Minnettar Jestiriler

Katkı sağlaması için teşekkürler! Siz bu projeyi harika kılıyorsunuz. 🎉

---

**Last Updated**: Mart 2026  
**Maintainer**: Core Team
