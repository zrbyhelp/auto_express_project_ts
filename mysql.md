```
docker run -d \
  --name node-sever \
  -e MYSQL_ROOT_PASSWORD=MC+ywLivM4wg22k8GR6Niw== \
  -p 3306:3306 \
  -e MYSQL_DATABASE=nodesever \
  mysql:8.0
```