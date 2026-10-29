import {cp,readdir,readFile,mkdir,writeFile,rm} from 'node:fs/promises';import path from 'node:path';
await rm('public',{recursive:true,force:true});await cp('src','public',{recursive:true});for(const f of await readdir('assets')){for(const [name,data] of Object.entries(JSON.parse(await readFile('assets/'+f,'utf8')))){const dest=path.join('public',name);await mkdir(path.dirname(dest),{recursive:true});await writeFile(dest,Buffer.from(data,'base64'));}}
console.log('Storly preview built');
