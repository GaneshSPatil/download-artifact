const core   = require('@actions/core');
const Github = require('./util/github');

(async function () {
  try {
    const owner           = core.getInput('REPOSITORY_OWNER', {required: true});
    const repo            = core.getInput('REPOSITORY_NAME', {required: true});
    const workflow        = core.getInput('WORKFLOW_NAME', {required: true});
    const artifact        = core.getInput('ARTIFACT_NAME', {required: true});
    const token           = core.getInput('GITHUB_TOKEN', {required: true});
    let pathToDownload    = core.getInput('PATH_TO_DOWNLOAD');
    pathToDownload        = pathToDownload ? pathToDownload : process.pwd();
    const unzipOnDownload = !!core.getInput('UNZIP_ON_DOWNLOAD');

    console.log(`Fetching workflow id for '${workflow}' workflow...`);
    const found = await Github.findWorkflowWithId(owner, repo, token, workflow);

    console.log(`Fetching the latest run for the workflow '${workflow}' (id: ${found.id})...`);
    const latestRun = await Github.findLatestRunForWorkflow(owner, repo, token, found.id);

    console.log(`Fetching the artifact information from workflow run ${workflow}(id:${latestRun.id})...`);
    const artifactToDownload = await Github.findArtifactsForRun(owner, repo, token, latestRun.id, artifact);

    console.log(`Downloading artifact '${artifactToDownload.name}' from url: ${artifactToDownload.archive_download_url}`);
    await Github.downloadFile(artifactToDownload, pathToDownload, unzipOnDownload, token);
  } catch (e) {
    core.setFailed(e.message);
  }
})();
