const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'controllers');
let c = 0;
fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.js')) {
        const fullPath = path.join(dir, file);
        let content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('../utils/errorHandler')) {
            content = content.replace(/require\(['"]\.\.\/utils\/errorHandler['"]\)/g, "require('../utils/AppError')");
            fs.writeFileSync(fullPath, content);
            c++;
        }
    }
});
console.log(`Fixed imports in ${c} files`);
