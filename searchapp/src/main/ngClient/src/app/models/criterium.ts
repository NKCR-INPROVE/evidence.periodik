export class Criterium {
  field: string;
  value: string;
  operator: string = 'AND';

  constructor() { }

  fromUrl(j: string) {
    this.field = j['f'];
    this.value = j['v'];
    this.operator = j['o'];
  }

  toUrl(): any {
    return {
      f: this.field,
      v: this.value,
      o: this.operator
    };
  }
}
