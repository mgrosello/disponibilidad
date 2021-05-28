export default class Hora {
  // minutos a partir de 0:00
  mins = 0;

  constructor(hora = 0, min = 0) {
    this.mins = hora * 60 + min;
  }

  add(mins: number): void {
    this.mins += mins;
    // TODO: check validity
  }

  substract(mins: number): void {
    this.mins -= mins;
    // TODO: check validity
  }

  toDate(): Date {
    return new Date(this.mins * 60000);
  }

  compare(hora: Hora): number {
    return this.mins - hora.mins;
  }
}
