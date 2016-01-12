
## Initial Setup

    git -C html clone https://github.com/hrldcpr/javascript-coroutines.git
    sudo systemctl enable $PWD/web.service

Copy the private https key to `ssl/secret/x.st.key`

## (Re)building

    git -C html/javascript-coroutines pull
    docker build -t web .
    sudo systemctl restart web.service
