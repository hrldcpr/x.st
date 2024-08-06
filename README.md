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
    # TODO --publish 443:443 and maybe something like --volume /etc/letsencrypt:/etc/letsencrypt:ro
    docker run --name xst --network xst --publish 80:80 --publish 443:443 --volume $PWD/html:/usr/share/nginx/html:ro --volume $PWD/letsencrypt:/etc/letsencrypt:ro --restart always --detach xst

## HTTPS

    mkdir letsencrypt
    docker run --rm --interactive --tty --volume $PWD/html:/usr/share/nginx/html --volume $PWD/letsencrypt:/etc/letsencrypt certbot/certbot certonly
    # use option 2 (webroot), domains x.st www.x.st, and webroot path /usr/share/nginx/html

    # test that renewals will work:
    docker run --rm --volume $PWD/html:/usr/share/nginx/html --volume $PWD/letsencrypt:/etc/letsencrypt certbot/certbot renew --dry-run
    # (ideally could do --volumes-from xst:rw but seems like you can't change ro to rw that way)

    crontab -e  # add the following to user crontab
    # daily certbot renewal check:
    1 1 * * * docker run --pull always --rm --volume $HOME/x.st/html:/usr/share/nginx/html --volume $HOME/x.st/letsencrypt:/etc/letsencrypt certbot/certbot renew || echo certbot renewal error > $HOME/x.st/html/nocache.html
    # (uptime robot will email if nocache.html contains "error")

    # weekly nginx restart in case certificate was renewed:
    2 2 * * 2 docker restart xst
