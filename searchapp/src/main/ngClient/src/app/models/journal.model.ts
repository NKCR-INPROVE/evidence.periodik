
export class Journal{
    pid: string =null;
    title: string = null;
    root_pid: string = null;
    root_title: string = null;
    model: string = null;
    details: any = null;
    siblings: any[] = [];
    mods: any = null;
    genres : string[] = [];
    genresObject: any = {};
  constructor(){
    
  }
  
  
}