
## Initial Setup

    git -C html clone https://github.com/hrldcpr/javascript-coroutines.git
    git -C html clone https://github.com/hrldcpr/linkages.git
    sudo systemctl enable $PWD/web.service

Copy the private https key to `ssl/secret/x.st.key`

## (Re)building

    git -C html/javascript-coroutines pull
    git -C html/linkages pull
    docker build --pull --tag=web .
    sudo systemctl restart web.service
