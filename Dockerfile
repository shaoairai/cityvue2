FROM python:3.9.17-slim-bullseye

WORKDIR /app

ADD ./ /app

RUN pip install -r requirements.txt

# EXPOSE 5000

# docker build -t shaoairai/city:v1 .   docker push shaoairai/city:v1

# docker run -d -p 5329:5015 -it  --restart=always -v C:\project\240304_城鄉計畫\city:/app  --name city shaoairai/city bash -c "flask run --no-debugger --port 5015 --host 0.0.0.0"