#!/usr/bin/python
#
# import.py // db host auto-scanner
###########################
# ColdBlue USA
# Peter Christian Fraedrich
###########################
#
#

# imports
from pymongo import MongoClient
import sys
import os
import datetime
from datetime import datetime
import socket

# write to log @ start
f = open('logfile','a')
f.write(str(datetime.now().strftime("%m/%d/%Y %H:%M:%S")) + " : Import service started successfully.\n")
f.close()

# for color-y texty goodness
class bcolors:
    grey = '\033[0;30m'
    greybold = '\033[1;30m'
    red = '\033[0;31m'
    redbold = '\033[1;30m'
    green = '\033[0;32m'
    greenbold = '\033[1;32m'
    ENDC = '\033[0m'

    def disable(self):
        self.END = ''
        self.greybold = ''
        self.red = ''
        self.redbold = ''
        self.green = ''
        self.greenbold = ''

# get args
if len(sys.argv) > 1 :
    if sys.argv[1] == "-h" :
        print "Import supports the following format for imported files:"
        print "  [ipaddress],[hostname],[subnet mask],[VLAN],[login]"
        print "  ex.: 10.10.0.1,Test Computer,255.255.0.0,10,username/password"
        sys.exit() 
    elif sys.argv[1] == "help" :
        print "Import supports the following format for imported files:"
        print "  [ipaddress],[hostname],[subnet mask],[VLAN],[login]"
        print "  ex.: 10.10.0.1,Test Computer,255.255.0.0,10,username/password"
        sys.exit()
    else:
        print "Import supports the following format for imported files:"
        print "  [ipaddress],[hostname],[subnet mask],[VLAN],[login]"
        print "  ex.: 10.10.0.1,Test Computer,255.255.0.0,10,username/password"
        sys.exit() 

######### import options from config file
optionfile = [line.strip() for line in open('cambridge_conf')]

# check for enterprise lic
if optionfile[1] == "4444026290" :
    enterprise = True

# sets how long to keep dead hosts before removal
config_keephosts = optionfile[4]

# enable using external DB for enterprise versions
if enterprise == True :
    config_dburl = optionfile[7]
else:
    config_dburl = "mongodb://localhost:27017"

# MongoDB connection
client = MongoClient(config_dburl)
db = client.stv2
coll = db.hosts

added = 0

print ""
path = raw_input("Type the ABSOLUTE path to the delimeated list you wish to import: ")
delimeator = raw_input("What character is used to separate the items (comma or semicolon is recommended)? ")
exit = raw_input(bcolors.red + "These hosts will be assumed to be up. Do you wish to continue? (y/n) " + bcolors.ENDC)

if exit != 'y' :
    sys.exit()

csv = [line.strip() for line in open(path)]

#print csv

for i in csv :

    split = i.split(delimeator)
    ipaddr = split[0]
    hostname = split[1]
    subnet = split[2]
    vlan = split[3]
    login = split[4]
    date = str(datetime.now().strftime("%m/%d/%Y %H:%M:%S"))

    save = ({
        "ipaddr": ipaddr,
        "hostname": hostname,
        "subnet": subnet,
        "vlan": vlan,
        "login": login,
        "user": "system import",
        "alive": "True",
        "ping": "0",
        "pingfail": "0",
        "added": date,
        "lastalive": date,
        "lastscan": date,
        "health": "100",
        "tidyflag": "False",
        "reserved": "False"
        })

    #print save
    coll.insert(save)
    added = added + 1
    print bcolors.green + "   Host " + ipaddr + " / " + hostname + " added to the DB." + bcolors.ENDC


# write to log @ start
f = open('logfile','a')
f.write(str(datetime.now().strftime("%m/%d/%Y %H:%M:%S")) + " : Import service imported " + str(added) + " hosts.\n")
f.close()








