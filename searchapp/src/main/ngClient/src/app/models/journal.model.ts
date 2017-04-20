

export class Journal implements Journal{
    pid: string;
    title: string;
    root_pid: string;
    root_title: string;
    model: string;
    details: any;
    siblings: any[];
    mods: any;
    genres : string[];
    genresObject: any;
  constructor(){
    return {
    pid: null, title:null, root_pid:null, root_title:null, model:null, 
      details:null, siblings: null, mods: null, genres  : [],
      genresObject : {}
    }
  }
}