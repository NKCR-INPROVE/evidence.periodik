
export class Journal{
    pid: string =null;
    parent: string;
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
  
  setArticles(res1) {
    if(!res1 || !res1.hasOwnProperty('response')){ 
      return; 
    }
    let res = res1['response']['docs'];
    for (let i in res) {
      let art = res[i];
      if (art && art['pid']) {
        art['mods'] = JSON.parse(art['mods']);
          //let mods = bmods["mods:modsCollection"]["mods:mods"];
        if (art['mods'].hasOwnProperty("mods:genre")) {
          let genre = art['mods']['mods:genre'];
          if (genre.hasOwnProperty('type')) {
            art['genre'] = genre['type'];
          } else if (genre.hasOwnProperty('length')) {
            for (let i in genre) {
              art['genre'] = genre[i]['type'];
            }
          }
          if (this.isGenreVisible(art['genre'])) {
            if (this.genresObject.hasOwnProperty(art['genre'])) {
              this.genresObject[art['genre']]['articles'].push(art);
            } else {
              this.genres.push(art['genre']);
              this.genresObject[art['genre']] = {};
              this.genresObject[art['genre']]['articles'] = [];
              this.genresObject[art['genre']]['articles'].push(art);
            }
          }
        }
      }
    }
  }
  

  isGenreVisible(genre: string): boolean {
    return genre !== 'cover' &&
      genre !== 'advertisement' &&
      genre !== 'colophon';
  }
  
  
}