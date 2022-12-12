docker-compose down
docker rm -f $(docker ps -a -q)
# docker volume rm heatpipeanalyzer_postgres_data
docker volume rm $(docker volume ls -q)
docker-compose up --build