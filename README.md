
## Building the Docker image

### Initial setup

    git -C html clone https://github.com/hrldcpr/javascript-coroutines.git
    git -C html clone https://github.com/hrldcpr/linkages.git

Copy the private https key to `ssl/secret/x.st.key`

### (Re)building

For now, just push the blog: `jekyll build && scp -r site/* x.st:x.st/html/`

And then:

    git -C html/javascript-coroutines pull
    git -C html/linkages pull
    docker build …  # see below


## Deploying on Google Container Engine with Kubernetes

### Initial setup

    kubectl create -f kubernetes.yaml

### (Re)building

See Docker (re)building above, and then:

    PROJECT=$(gcloud config list --format 'value(core.project)')
    IMAGE=gcr.io/$PROJECT/x.st
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
