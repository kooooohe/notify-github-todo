const request = require('request-promise')
const express = require('express');
const app = express();

app.get('/', async (req, res) => {
    let issue_pages = []

    // Get All Issues
    for (let i = 1; ; ++i) {
        const options_with_page = { ...options }
        options_with_page.uri += `&page=${i}`
        const body = await request(options_with_page)

        console.log(body.length)
        if (body.length === 0) {
            break
        }
        issue_pages.push(body)
    }
    for (let issues of issue_pages) {

        for (let issue of issues) {
            console.log(issue.title);
            if (!isOverTime(issue.title)) {
                continue;
            }
            const users = getUserNames(issue.assignees);
            sendSlack(users, issue.title);
        }
    }
    res.send('ok');
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('Hello world listening on port', port);
});

// github ID : slack ID
const user_slack_id_list = {
    'github_user1': 'slack_id_1',
    'github_user2': 'slack_id_2',
}

const options = {
    uri: `${process.env.GITHUB_API}?state=open`,
    method: 'GET',
    headers: {
        'user-agent': 'node.js',
        Authorization: `token ${process.env.GITHUB_TOKEN}`
    },
    json: true,
};


const date_re = /[0-9]{4}\/[0-9]{2}\/[0-9]{2}/
const now = new Date();

const isOverTime = (target_str) => {
    const res = target_str.match(date_re);
    if (!res) {
        return false
    }

    const t_date = new Date(res[0]);
    if (t_date.getTime() >= now.getTime()) {
        return false
    }

    return true
}

const getUserNames = (assignees) => {
    let user_names = ''
    for (let assignee of assignees) {
        if (user_slack_id_list[assignee.login]) {
            user_names += `<@${user_slack_id_list[assignee.login]}> `
        } else {
            user_names += assignee.login
        }
    }
    return user_names
}

const sendSlack = (users, content) => {
    request.post(
        {
            url: process.env.TARGET_SLACK_API,
            headers: { "Content-Type": "application/json" },
            json: {
                text: `${users} ${content}`
            }
        },
        (error, response, body) => {
            if (!error && response.statusCode === 200) {
                console.log(body);
            } else {
                console.log("error");
            }
        }
    );
};
