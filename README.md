# K5Journals

Serve the application with specific IP address
ng serve --host 10.10.70.153

Serve the application with specific IP address and proxy conf
ng serve --host 10.10.70.153 --proxy-config proxy.conf.json

## Upgrade angular-cli
npm uninstall -g @angular/cli
npm cache clean
npm install -g @angular/cli@latest
rm -rf node_modules dist
npm install
