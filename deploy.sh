ssh payitforward@68.183.120.255 "
    cd PayItForward
    git pull
    cd backend
    npm install
    cd ../frontend
    npm install
    pm2 restart \"backend\"
"