#! /bin/bash

app=bulade-admin-ui
ds=$(date +"%Y%m%d%H%M%S")
root_dir=/home/ubuntu/workspace/$app
deploy_dir=$root_dir/releases/$ds
app_dir=$root_dir/application
server=bulade-dev

ssh $server << SCRIPT
echo deploy to $deploy_dir
mkdir -p $deploy_dir
mkdir -p $app_dir
ls -lha $root_dir/releases
SCRIPT

tar -czvf $app.tar.gz ./dist/*
scp $app.tar.gz $server:$deploy_dir
rm $app.tar.gz

ssh $server << SCRIPT
cd $deploy_dir
tar -xvf $app.tar.gz
rm -rf $app.tar.gz
mv dist/* ./
rm -rf dist $app_dir/*
cp -r $deploy_dir/* $app_dir/

chmod 755 $app_dir
chmod 644 $app_dir/*
chmod 755 $app_dir/assets
chmod 644 $app_dir/assets/*

echo list application dir
ls -l $app_dir
SCRIPT
