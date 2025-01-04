npm install
npm run build
rm -rf ../moments-backend-python/static || true
mkdir -p ../moments-backend-python/static
cp -r dist/* ../moments-backend-python/static/
