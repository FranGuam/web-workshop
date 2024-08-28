function toggleTheme(){
    const body = document.body;
    if(body.classList.contains('light-color-theme')){
        body.classList.remove('light-color-theme');
        body.classList.add('dark-color-theme');
    } else {
        body.classList.remove('dark-color-theme');
        body.classList.add('light-color-theme');
    }
}

const url = 'https://api.github.com/users/EM-Cai23/repos';
async function fetchGithubRepo(){
    try{
        const response = await fetch(url);
        if(!response.ok){
            throw new Error('Failed to fetch data from github');
        }
        const data = await response.json();
        displayRepos(data)
    }catch(error){
        console.error('Failed to fetch data from github', error);
    }
}

function displayRepos(data){
    const repoList = document.getElementById('repo-list');
    if(repoList!==null){
        repoList.innerHTML = '';
    }
    data.forEach(repo => {
        const repoItem = document.createElement('li');
        repoItem.innerHTML = `<a href="${repo.html_url}"> 仓库名称：${repo.name}</a>`;
        repoList.appendChild(repoItem);
    });
}