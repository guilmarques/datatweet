#### Autor: Guilherme Marques

---

# Real-time Twitter Source Analysis

### Requisites
- Python (3.6 or higher)
- Flask
- Docker (to run Hbase and Kafka)
- MySql
- Spark (>= 2.4.0)

### How To Run
- It's better when you run with Linux (otherwise we have to start hbase manually. See start-hbase.sh)
- Change Twitter Tokens on reader.py and mysql credentials on processor.py
- Don't forget to config your /etc/mysql/my.cnf (MySql) with `bind-address=0.0.0.0` to allow external connections from docker
- Change (IPDODOCKER var) and Copy mysqlcatalog.properties to /etc/presto/catalog (inside presto container) to make the queries from presto
- Run mysql container: `docker run --name some-mysql -p 3306:3306 -p 8080:8080 -v C:\Users\U003675\Desktop\DataEngineerTweetProcessing\mysql:/etc/mysql/conf.d -e
 MYSQL_ROOT_PASSWORD=123db4 -d mysql:latest`
- If you never run this project before type `export KAFKA_TOPICS="TweetsTopic:1:3"` it will create the Kafka Topic when the image build up (or SET instead export if you're Windows User)
- Run start_all.sh (it will start HBASE and KAFKA docker containers and services)
- Run `python reader.py` script to read the tweets and produce them using Kafka Producer.
- Run `spark-submit --packages org.apache.spark:spark-sql-kafka-0-10_2.11:2.4.0 processor.py` script to read from Kafka and process the messages
- Run `python webapp.py` script to access the page that visualizes the data

### Architecture and Tools
![Pipeline](data engineer arch.png?raw=True "Pipeline")