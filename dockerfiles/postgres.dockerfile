FROM docker.io/pgvector/pgvector:pg17

ENV TZ Europe/Warsaw

RUN apt update && apt install postgis postgresql-17-postgis-3 -y
