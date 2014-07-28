#!/bin/bash

# make user superuser
sudo su

# go to root dir
cd /

#install necessary stuff
yum install -y nano openssh-clients git

# clone repo
git clone https://github.com/peterfraedrich/ColdBlue.git

# install node.js
rpm --import https://fedoraproject.org/static/0608B895.txt
rpm -Uvh http://download-i2.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm
yum install nodejs npm --enablerepo=epel

# install npm stuff
cd /ColdBlue/STV2/
npm install inherits
npm install nodemon # for dev only, unless we want to use it for prod
npm install

# add firewall rules
iptables -I INPUT 5 -p tcp --dport 80 -m state --state NEW,ESTABLISHED -j ACCEPT # http
iptables -I INPUT 5 -p tcp --dport 666 -m state --state NEW,ESTABLISHED -j ACCEPT # API
service iptables save
service ip6tables save
service iptables restart
service ip6tables restart

# start server
nodemon server.js