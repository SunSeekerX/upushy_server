##

构建命令

```shell
docker build -f Dockerfile.single -t upushy .
```

启动容器命令

```shell
docker run -d -p 3000:3000 --name=upushy --restart=always upushy

docker run -d -p 3000:3000 --name=upushy -v /mnt/w/code/nodejs/uni-pushy-server/.env.production:/.env.production --restart=always upushy
```
