_TODO_ get letsencrypt working again; just relying on cloudflare https for now.

## Building the Docker image

### Initial setup

    git -C html clone https://github.com/hrldcpr/javascript-coroutines.git
    git -C html clone https://github.com/hrldcpr/linkages.git
    # TODO letsencrypt certbot and perhaps crontab

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
    # TODO --publish 443:443 and maybe something like --volume /etc/letsencrypt:/etc/letsencrypt
    docker run --name xst --network xst --publish 80:80 --volume $PWD/html:/usr/share/nginx/html --restart always --detach xst
