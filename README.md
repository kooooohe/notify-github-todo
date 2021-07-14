notify-github-todo
# Make .env file on root directory
like
```
GITHUB_API=XXXX
GITHUB_TOKEN=XXXX
TARGET_SLACK_API=XXXX 
```

# How to debug on develop enviroment
`docker-compose up`
go into node container and exec `yarn install && node index.js`

access your `localhost:8080`

You can get issues having `YYYY/MM/DD` format string in the title and which dates are before the current time.

![github com_kooooohe_notify-github-todo_issues_1](https://user-images.githubusercontent.com/17563192/72725008-382a0f80-3bc8-11ea-843f-6db50619fea2.png)
