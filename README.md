
## Building the Docker image

### Initial setup

    git -C html clone https://github.com/hrldcpr/javascript-coroutines.git
    git -C html clone https://github.com/hrldcpr/linkages.git

Copy the private https key to `ssl/secret/x.st.key`

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
    docker run -d --restart always --name xst --network xst -p 80:80 -p 443:443 xst


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
