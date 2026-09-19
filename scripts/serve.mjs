import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(fileURLToPath(new URL('../',import.meta.url)));
const base='/RhymeStudyGuide/';
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.xml':'application/xml','.json':'application/json','.txt':'text/plain'};
const server=http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://localhost');
    if(url.pathname==='/'){res.writeHead(302,{Location:base});res.end();return}
    if(url.pathname===base.slice(0,-1)){res.writeHead(301,{Location:base});res.end();return}
    if(!url.pathname.startsWith(base))throw Error('not found');
    const relative=decodeURIComponent(url.pathname.slice(base.length));
    let file=path.resolve(root,relative);
    if((file!==root&&!file.startsWith(root+path.sep))||relative.split('/').some(x=>x.startsWith('.')))throw Error('not found');
    const info=await stat(file);
    if(info.isDirectory()){
      if(!url.pathname.endsWith('/')){res.writeHead(301,{Location:url.pathname+'/'});res.end();return}
      file=path.join(file,'index.html');
    }
    const data=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]??'application/octet-stream','Cache-Control':'no-store'});res.end(data);
  }catch{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(await readFile(path.join(root,'404.html')))}
});
server.listen(Number(process.env.PORT??4173),'127.0.0.1',()=>console.log(`Ready: http://127.0.0.1:${server.address().port}${base}`));
