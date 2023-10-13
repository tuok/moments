npm run build
rm -r ../moments-backend-python/static || true
mkdir -p ../moments-backend-python/static
cp -r dist/* ../moments-backend-python/static/
