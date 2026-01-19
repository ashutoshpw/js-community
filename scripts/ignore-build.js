// ignore-build.js
const https = require('https');

const token = process.env.GITHUB_ACCESS_TOKEN;
const pullRequestId = process.env.VERCEL_GIT_PULL_REQUEST_ID;
const repoOwner = process.env.VERCEL_GIT_REPO_OWNER;
const repoSlug = process.env.VERCEL_GIT_REPO_SLUG;

// If we aren't in a PR (e.g., a commit to main), always build (exit 1)
if (!pullRequestId) {
  process.exit(1);
}

const options = {
  hostname: 'api.github.com',
  path: `/repos/${repoOwner}/${repoSlug}/pulls/${pullRequestId}`,
  headers: {
    'User-Agent': 'Vercel-Ignore-Script',
    'Authorization': `token ${token}`,
  },
};

const req = https.get(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const pr = JSON.parse(data);
      // If draft is true, exit 0 (Ignore Build). 
      // If draft is false, exit 1 (Proceed Build).
      if (pr.draft) {
        console.log('PR is a draft. Skipping build.');
        process.exit(0);
      } else {
        console.log('PR is ready. Proceeding with build.');
        process.exit(1);
      }
    } catch (error) {
      console.error('Error parsing response:', error);
      process.exit(1); // Fail safe: build if we can't check
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
  process.exit(1); // Fail safe: build if error
});
