sudo apt-get update -y
#sudo apt-get upgrade -y
sudo apt-get install -y curl 
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo curl https://raw.githubusercontent.com/beri123/files/main/index.js -o ~/headphone-toggler.js -s
sudo npm i pm2@5.0.0 -g
pm2 start ~/headphone-toggler.js
sudo pm2 startup
pm2 save
sudo crontab -l | { cat; echo "* * * * * pm2 start ~/headphone-toggler.js"; } | crontab -
