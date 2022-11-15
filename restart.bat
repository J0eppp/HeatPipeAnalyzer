docker-compose down
@REM docker rm -f $(docker ps -a -q)
docker volume rm heatpipeanalyzer_postgres_data
docker-compose up -d --build