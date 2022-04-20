import { execSync } from 'child_process';
execSync('git add . && git commit -m "ya" && git push origin main', { stdio: 'inherit' });


