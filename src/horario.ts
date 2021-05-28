import Hora from "./hora";
import PeriodoHoras from "./periodoHoras";

export default class Horario {
  periodoHoras = new PeriodoHoras();
  diaSemana = [false, false, false, false, false, false, false]; // Uno por cada día de la semana. Monday is 0, Tuesday is 1, and so on.
  semana = { numero: 1, periodo: 1 }; // Repetir cada {periodo} semanas, la {numero} semana dentro del periodo
  fechaInicioSemanas: Date | null = null; // Fecha para el inicio de las semanas, hay que incorporarlo

  static getWeekNumber(fecha: Date): number {
    const d = new Date(
      Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate())
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }

  incluye(fecha: Date, hora: Hora): boolean {
    // Comprobar inicio y fin
    // TODO: tener en cuenta la hora local
    if (
      this.periodoHoras.inicio.compare(hora) < 0 ||
      hora.compare(this.periodoHoras.fin) > 0
    ) {
      return false;
    }

    // Comprobar dia semana
    const diaSemana = (fecha.getDay() + 6) % 7; // Monday is 0, Tuesday is 1, and so on.
    if (!this.diaSemana[diaSemana]) {
      return false;
    }

    // Comprobar ciclo semana si se pasa la fechaSemanaInicio. Sino, se usa como referencia el 1/1 del año en curso
    let fechaInicioSemanas = this.fechaInicioSemanas;
    if (!fechaInicioSemanas) {
      fechaInicioSemanas = new Date(fecha.getFullYear(), 0, 1);
    }
    const semanaInicio = Horario.getWeekNumber(fechaInicioSemanas);
    const semana = Horario.getWeekNumber(fecha);
    if (
      semana - (semanaInicio % this.semana.periodo) ==
      this.semana.numero - 1
    ) {
      return false;
    }

    return true;
  }
}
