
## Initial Setup

    sudo cp web.service /etc/systemd/system/
    sudo systemctl enable /etc/systemd/system/web.service

## (Re)building

    docker build -t web .
    sudo systemctl restart web.service
