const fs     = require('fs');
const https  = require('https');
const AdmZip = require('adm-zip');
const rp     = require('request-promise');

function findWorkflowWithId(owner, repo, accessToken, workflow) {
  const options = {
    url:     `https://api.github.com/repos/${owner}/${repo}/actions/workflows`,
    headers: {
      'Authorization': `bearer ${accessToken}`,
      'User-Agent':    'download-artifact-github-action'
    }
  };

  return rp(options).then(function (json) {
    let all     = JSON.parse(json);
    const found = all.workflows.find(w => w.name === workflow);

    if (!found) {
      throw `Could not find a workflow with name '${workflow}' for the specified repository!`;
    }

    return found;
  });
}

function findLatestRunForWorkflow(owner, repo, accessToken, workflowId) {
  const options = {
    url:     `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflowId}/runs`,
    headers: {
      'Authorization': `bearer ${accessToken}`,
      'User-Agent':    'download-artifact-github-action'
    }
  };

  return rp(options).then(function (json) {
    return JSON.parse(json).workflow_runs[0];
  });
}

function findArtifactsForRun(owner, repo, accessToken, runId, artifact) {
  const options = {
    url:     `https://api.github.com/repos/${owner}/${repo}/actions/runs/${runId}/artifacts`,
    headers: {
      'Authorization': `bearer ${accessToken}`,
      'User-Agent':    'download-artifact-github-action'
    }
  };

  return rp(options).then(function (json) {
    const all   = JSON.parse(json);
    const found = all.artifacts.find((a) => a.name === artifact);

    if (!found) {
      throw `Could not find the artifact with name '${artifact}' for the ${runId} workflow run!`;
    }

    return found;
  });
}

function downloadFile(artifact, shouldUnzip, accessToken) {
  const options = {
    url:            artifact.archive_download_url,
    headers:        {
      'Authorization': `bearer ${accessToken}`,
      'User-Agent':    'download-artifact-github-action'
    },
    followRedirect: false
  };

  return rp(options).catch(async (res) => {
    const location    = res.response.headers.location;
    const zipFileName = artifact.name;

    const file = fs.createWriteStream(zipFileName);
    await https.get(location, function (response) {
      const stream = response.pipe(file);

      stream.on('finish', function () {
        if (shouldUnzip) {
          console.log(`Unzipping the downloaded artifact...`);

          const pathToExtract = process.cwd();
          const zip           = new AdmZip(`${zipFileName}`);

          zip.extractAllTo(pathToExtract);
          console.log(fs.readdirSync(pathToExtract));
        }

        console.log(`Done!!`);
      });
    });
  });
}


module.exports = {
  findWorkflowWithId,
  findLatestRunForWorkflow,
  findArtifactsForRun,
  downloadFile
};
