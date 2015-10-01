
## Initial Setup

    sudo cp web.service /etc/systemd/system/
    sudo systemctl enable /etc/systemd/system/web.service

Copy the private https key to `ssl/secret/x.st.key`

## (Re)building

    docker build -t web .
    sudo systemctl restart web.service
