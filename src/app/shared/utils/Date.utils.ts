export function getCurrentDate() {
  const fechaActual = new Date();
  const año = fechaActual.getFullYear();
  const mes = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Aseguramos que el mes tenga 2 dígitos
  const día = String(fechaActual.getDate()).padStart(2, '0'); // Aseguramos que el día tenga 2 dígitos

  return `${año}-${mes}-${día}`;
}
