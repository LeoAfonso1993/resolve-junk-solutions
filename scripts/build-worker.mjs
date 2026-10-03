import { spawnSync } from 'node:child_process';
const result = spawnSync('npm', ['run', 'build'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PUBLIC_LEAD_ENDPOINT: '/api/leads',
    PRE_LAUNCH_MODE: process.env.PRE_LAUNCH_MODE === 'true' ? 'true' : 'false',
  },
});
process.exit(result.status ?? 1);
