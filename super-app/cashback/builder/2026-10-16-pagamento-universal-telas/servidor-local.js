// Servidor estático mínimo, só leitura, só 127.0.0.1, servindo a pasta passada como argumento.
const http=require("http"),fs=require("fs"),path=require("path");
const root=path.resolve(process.argv[2]); const port=+process.argv[3]||8765;
const tipos={".html":"text/html; charset=utf-8",".css":"text/css",".js":"text/javascript",".png":"image/png",".svg":"image/svg+xml"};
http.createServer((q,r)=>{let p=path.normalize(path.join(root,decodeURIComponent(q.url.split("?")[0])));
 if(!p.startsWith(root)){r.writeHead(403);return r.end();}
 fs.readFile(p,(e,d)=>{if(e){r.writeHead(404);return r.end("404");} r.writeHead(200,{"Content-Type":tipos[path.extname(p)]||"application/octet-stream"}); r.end(d);});
}).listen(port,"127.0.0.1",()=>console.log("servindo",root,"em http://127.0.0.1:"+port));
