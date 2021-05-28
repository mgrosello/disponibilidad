import Horario from "./horario";
import Hora from "./hora";
import PeriodoHoras from "./periodoHoras";

export class Tramo {
  fechaInicio = new Date();
  fechaFin = new Date();
  horario = new Horario();

  constructor(fechaInicio: Date, fechaFin: Date, horario: Horario) {
    this.fechaInicio = Tramo.fechaSinHora(fechaInicio);
    this.fechaFin = Tramo.fechaSinHora(fechaFin);
    this.horario = horario;
  }

  static fechaSinHora(fecha: Date): Date {
    fecha.setHours(0, 0, 0, 0);
    return fecha;
  }

  incluyeFecha(fecha: Date): boolean {
    const fechaSinHora = Tramo.fechaSinHora(fecha);
    return this.fechaInicio <= fechaSinHora && fechaSinHora <= this.fechaFin;
  }
}

export default class Disponibilidad {
  horariosHabituales: Horario[] = [];

  // Los tramos son excepciones a los horarios habituales. Los tramos han de ser disjuntos?
  tramos: Tramo[] = [];

  obtenerHorariosHabituales(): Horario[] {
    return this.horariosHabituales;
  }

  obtenerTramos(): Tramo[] {
    return this.tramos;
  }

  // Usar un algoritmo de compactación para no sobregenerar tramos
  añadirTramo(tramo: Tramo): void {}

  // Borrar tramos en ese rango de fechas, de forma que pasan a valer los horariosHabituales
  borrarTramos(fechaInicio: Date, fechaFin: Date): void {}

  // Para que puede servir? Check adicional, pero siempre se usará obtenerHorasDisponiblesParaFecha
  comprobarFechaHoraDisponible(fecha: Date, hora: Hora): boolean {
    // Si está disponible en algún tramo ya hemos acabado
    let incuidoEnAlgunTramo = false;
    for (const tramo of this.tramos) {
      if (tramo.incluyeFecha(fecha)) {
        incuidoEnAlgunTramo = true;
        if (tramo.horario.incluye(fecha, hora)) {
          return true;
        }
      }
    }

    // Si no está inclido en ningún tramo, comprobamos en horariosHabituales
    if (!incuidoEnAlgunTramo) {
      for (const horario of this.horariosHabituales) {
        if (horario.incluye(fecha, hora)) {
          return true;
        }
      }
    }

    return false;
  }

  obtenerHorariosParaFecha(fecha: Date): Horario[] {
    const horarios: Horario[] = [];

    // Incluir los horarios para cada tramo que incluya la fecha
    for (const tramo of this.tramos) {
      if (tramo.incluyeFecha(fecha)) {
        horarios.push(tramo.horario);
      }
    }

    // Si no hay horarios, entendemos que aplica el horario habitual. Esto implica que un tramo sin horarios es como si no existiera
    if (horarios.length == 0) {
      horarios.concat(this.horariosHabituales);
    }

    return horarios;
  }

  obtenerHorasDisponiblesParaFecha(
    fecha: Date,
    horaInicio: Hora,
    horaFin: Hora,
    minutosPeriodo: number
  ): Hora[] {
    const horas: Hora[] = [];

    // Comprobar parámetros
    if (horaInicio.compare(horaFin) <= 0) {
      // Obtener horarios que aplican para una fecha
      const horarios = this.obtenerHorariosParaFecha(fecha);

      for (
        let hora = horaInicio;
        horaInicio.compare(horaFin) <= 0;
        hora.add(minutosPeriodo)
      ) {
        for (const horario of horarios) {
          // TODO: el horario debe incluir la fecha inicio semana. Hay que inclurlo en horario
          if (horario.incluye(fecha, hora)) {
            horas.push(hora);
          }
        }
      }
    }

    return horas;
  }

  // Calcular horario para selección
  // Si no hay un único horario, hay que intentar generar un horario compatible
  // Intentar no fragmentar, igual hay que pensar un algoritmo de compactación
  // null si no es posible
  calcularHorario(fechaInicio: Date, fechaFin: Date): Horario[] | null {
    // Algoritmo lento:
    // Para cada fecha entre fechaInicio y fechaFin
    //   Buscar tramo(s). Buscar horarios. Si tramos disjuntos, solo hay que buscar un tramo
    //   Si no hay tramos, buscar horariosHabituales
    //     Si el horario es "igual" que horario hasta ahora, seguir
    //     Sino, retornar null

    // Algoritmo ràpido:
    // Buscar todos los tramos incluidos entre fechaInicio y fechaFin
    //   Si hay alguna fecha sin tramo, partir de horariosHabituales. Sino, partir de []
    //   Para cada tramo:
    //     Si el horario es "igual" que horario hasta ahora, seguir
    //     Sino, retornar null
    return null;
  }

  // Calcular tramos horarios por dia para pintar
  // Hay que entregar una lista con los PeriodoHoras diferentes, sin tener en cuenta el orden? O simplemente cachearlos
  calcularTramosHorarios(
    fechaInicio: Date,
    fechaFin: Date
  ): Map<Date, PeriodoHoras[]> | null {
    // Algoritmo lento:
    // Para cada fecha entre fechaInicio y fechaFin
    //   Buscar tramo(s). Buscar horarios. Si tramos disjuntos, solo hay que buscar un tramo
    //   Si no hay tramos, buscar horariosHabituales
    //     retornar los PeriodosHora de los horarios

    return null;
  }
}
