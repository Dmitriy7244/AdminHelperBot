ENV=".env"

if [ ! -f $ENV ]; then
  echo "You must create file '$ENV'"
  return
fi

docker compose up --build --remove-orphans
