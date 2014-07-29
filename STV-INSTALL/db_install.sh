#!/bin/bash

# DB INSTALL FILE x64

# get app server IP for iptables stuff
echo -n "Type the IP of the application server: "
read server
echo $server

# open ports in iptables
iptables -A INPUT -s $server -p tcp --destination-port 27017 -m state --state NEW,ESTABLISHED -j ACCEPT
iptables -A OUTPUT -d $server -p tcp --source-port 27017 -m state --state ESTABLISHED -j ACCEPT

# get arch
echo -n "Select a system arch: [1] x86_64, [2] i686: "
read iarch
echo $iarch

if [ $iarch == 1 ]; then
	# add mongodb to yum repo
	cat > /etc/yum.repos.d/mongodb.repo << EOF
	[mongodb]
	name=MongoDB Repository
	baseurl=http://downloads-distro.mongodb.org/repo/redhat/os/x86_64/
	gpgcheck=0
	enabled=1
	EOF
elif [ $iarch == 2 ]; then
	# add mongodb to yum repo
	cat > /etc/yum.repos.d/mongodb.repo << EOF
	[mongodb]
	name=MongoDB Repository
	baseurl=http://downloads-distro.mongodb.org/repo/redhat/os/i686/
	gpgcheck=0
	enabled=1
	EOF
else
	echo "Invalid choice, exiting."
	exit 1
fi

# install MongoDB
yum install -y mongodb-org

# make it start at startup
chkconfig mongod on

#start DB
service mongod start

