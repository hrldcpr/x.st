
## Initial Setup

    sudo systemctl enable $PWD/web.service

Copy the private https key to `ssl/secret/x.st.key`

## (Re)building

    docker build -t web .
    sudo systemctl restart web.service
