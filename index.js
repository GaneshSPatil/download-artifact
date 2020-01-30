const core = require('@actions/core');
const Github = require('./util/github');

(async function () {
  const owner    = core.getInput('REPOSITORY_OWNER', {required: true});
  const repo     = core.getInput('REPOSITORY_NAME', {required: true});
  const workflow = core.getInput('WORKFLOW_NAME', {required: true});
  const artifact = core.getInput('ARTIFACT_NAME', {required: true});
  const token    = core.getInput('GITHUB_TOKEN', {required: true});

  const workflows = await Github.getAllWorkflows(owner, repo, token);
  console.log(JSON.stringify(workflows, null, 2));
})();
console.log(`Hello World!`);
