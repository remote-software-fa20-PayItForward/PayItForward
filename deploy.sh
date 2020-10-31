ssh payitforward@68.183.120.255 "
    cd PayItForward
    git pull
    cd backend
    npm ci
    cd ../frontend
    npm ci
    pm2 restart \"backend\"
    pm2 restart \"frontend\"
"
