## 🚀 Download Artifact - Github Action
A Github Action for downloading build artifacts from any workflow building Github repository.

## Usage

See [action.yml](https://github.com/GaneshSPatil/download-artifact/blob/master/action.yml) for comprehensive list of options.

*Note:* Do not specify `GITHUB_TOKEN` as a plain text value. 
Use [Github Secrets](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets) for specifying the secret access token.

```yaml
- name: download_app_for_testing
  uses: GaneshSPatil/download-artifact@master
  with:
    REPOSITORY_OWNER: 'MyOrganization'
    REPOSITORY_NAME: 'MyProject'
    WORKFLOW_NAME: 'build-app'
    ARTIFACT_NAME: 'my-application'
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    UNZIP_ON_DOWNLOAD: true
    PATH_TO_DOWNLOAD: 'path/to/download'
```

## Example:

```yaml
on: [push]

jobs:
  download_artifact:
    runs-on: ubuntu-latest
    name: A job to download artifact from GaneshSPatil/upstream repository
    steps:
      - name: download_artifact
        uses: GaneshSPatil/download-artifact@master
        with:
          REPOSITORY_OWNER: 'GaneshSPatil'
          REPOSITORY_NAME: 'upstream'
          WORKFLOW_NAME: 'Generate Test Artifact'
          ARTIFACT_NAME: 'my-artifact'
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          UNZIP_ON_DOWNLOAD: true
          PATH_TO_DOWNLOAD: 'path/to/download'

      - run: ls path/to/download
```

## License

Download Artifact is an open source project, under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0).

