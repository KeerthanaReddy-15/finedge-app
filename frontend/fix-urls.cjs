const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src', 'pages');

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 

    files.forEach((file) => {
        if (!file.endsWith('.jsx')) return;
        
        const filePath = path.join(directoryPath, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // Regex to capture the URL part after http://localhost:5000
        const regex = /'http:\/\/localhost:5000(\/api\/[^']+)'/g;
        
        if (regex.test(content)) {
            const newContent = content.replace(regex, "`\\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}$1`");
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Updated ${file}`);
        }
    });
});
