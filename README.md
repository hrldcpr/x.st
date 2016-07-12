
## Initial Setup

    git -C html clone https://github.com/hrldcpr/javascript-coroutines.git
    git -C html clone https://github.com/hrldcpr/linkages.git
    sudo systemctl enable $PWD/web.service

Copy the private https key to `ssl/secret/x.st.key`

## (Re)building

For now, just push the blog: `jekyll build && scp -r site/* x.st:x.st/html/`

And then:

    git -C html/javascript-coroutines pull
    git -C html/linkages pull
    docker build --pull --tag=web .
    sudo systemctl restart web.service
