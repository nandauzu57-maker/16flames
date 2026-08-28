import { createPasswordHash } from "../lib/security.js";
const password = process.argv[2];
if (!password) { console.error("Usage: npm run admin:hash -- \"password-kamu\""); process.exit(1); }
console.log(createPasswordHash(password));
