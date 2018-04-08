
## Building the Docker image

### Initial setup

    git -C html clone https://github.com/hrldcpr/javascript-coroutines.git
    git -C html clone https://github.com/hrldcpr/linkages.git
    htpasswd -c secret/fllow.x.st <some_username>
    sudo letsencrypt certonly --webroot -w $PWD/html -d x.st -d www.x.st -d fllow.x.st
    sudo crontab -e
    # add the lines:
    @daily letsencrypt renew
    @weekly docker restart xst

### (Re)building

For now, just push the blog: `jekyll build && scp -r _site/* x.st:x.st/html/`

And then:

    git -C html/javascript-coroutines pull
    git -C html/linkages pull
    docker build …  # see below


## Deploying with Docker Restart Policies

    docker network create xst
    # then, run any proxied services or proxy_pass will fail
    docker build --pull --tag=xst .
    docker run --name xst --net xst -p 80:80 -p 443:443 -v $PWD/html:/usr/share/nginx/html -v /etc/letsencrypt:/etc/letsencrypt --restart always -d xst


## Deploying on Google Container Engine with Kubernetes

### Initial setup

    kubectl create -f kubernetes.yaml

### (Re)building

See Docker (re)building above, and then:

    PROJECT=$(gcloud config list --format 'value(core.project)')
    IMAGE=gcr.io/$PROJECT/xst
    TAG=$(date +%s)

    docker build --pull --tag $IMAGE .
    gcloud docker -- push $IMAGE

    docker tag $IMAGE{,:$TAG}
    gcloud docker -- push $IMAGE:$TAG

    kubectl set image deployment xst xst=$IMAGE:$TAG


## Deploying on CoreOS with systemd

### Initial Setup

    sudo systemctl enable $PWD/web.service

### (Re)building

See Docker (re)building above, and then:

    docker build --pull --tag=web .
    sudo systemctl restart web.service
