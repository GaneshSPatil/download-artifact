const core   = require('@actions/core');
const Github = require('./util/github');

(async function () {
  try {
    const owner           = core.getInput('REPOSITORY_OWNER', {required: true});
    const repo            = core.getInput('REPOSITORY_NAME', {required: true});
    const workflow        = core.getInput('WORKFLOW_NAME', {required: true});
    const artifact        = core.getInput('ARTIFACT_NAME', {required: true});
    const token           = core.getInput('GITHUB_TOKEN', {required: true});
    const unzipOnDownload = !!core.getInput('UNZIP_ON_DOWNLOAD');

    const found              = await Github.findWorkflowWithId(owner, repo, token, workflow);
    const latestRun          = await Github.findLatestRunForWorkflow(owner, repo, token, found.id);
    const artifactToDownload = await Github.findArtifactsForRun(owner, repo, token, latestRun.id, artifact);

    await Github.downloadFile(artifactToDownload, unzipOnDownload, token);
  } catch (e) {
    core.setFailed(e.message);
  }
})();
