const rp = require('request-promise');

function getAllWorkflows(owner, repo, accessToken) {
  const options = {
    url:     `https://api.github.com/repos/${owner}/${repo}/actions/workflows`,
    headers: {
      'Authorization': `bearer ${accessToken}`,
    }
  };

  return rp(options).then(function (json) {
    return JSON.parse(json);
  });
}

module.exports = {
  getAllWorkflows
};
