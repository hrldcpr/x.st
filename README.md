
## Building the Docker image

### Initial setup

    git -C html clone https://github.com/hrldcpr/javascript-coroutines.git
    git -C html clone https://github.com/hrldcpr/linkages.git
    
    # old letsencrypt command, probably different now:
    sudo letsencrypt certonly --webroot -w $PWD/html -d x.st -d www.x.st
    
    sudo crontab -e
    # add the lines:
    @daily certbot renew
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
    docker build --tag xst .
    docker run --name xst --network xst --publish 80:80 --publish 443:443 --volume $PWD/html:/usr/share/nginx/html --volume /etc/letsencrypt:/etc/letsencrypt --restart always --detach xst
