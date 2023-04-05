### To start mysql:
- Copy `database/.env.example` to `database/.env` and fill appropriate values. Then run following command in terminal.
```bash
sudo docker-compose up
```

### To execute initialising sql script:
```bash
docker exec -i mysql_db mysql -p${MYSQL_ROOT_PASSWORD} < ./world.sql
```
