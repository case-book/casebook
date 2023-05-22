import { Octokit } from 'octokit';

const octokit = new Octokit();

const GitService = {};
GitService.getReleaseList = (successHandler, failHandler) => {
  return octokit
    .request('GET /repos/case-book/casebook/releases', {
      owner: 'case-book',
      repo: 'casebook',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    })
    .then(d => {
      successHandler(d.data);
    })
    .catch(failHandler);
};

export default GitService;
