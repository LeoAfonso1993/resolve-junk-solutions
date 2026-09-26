import { spawnSync } from 'node:child_process';
const result = spawnSync('npm', ['run', 'build'], {
  stdio: 'inherit',
  env: { ...process.env, PUBLIC_LEAD_ENDPOINT: '/api/leads' },
});
process.exit(result.status ?? 1);
