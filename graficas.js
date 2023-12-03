/* global Chart */
const chartCanvas = document.getElementById('tempChart')
const ctx = chartCanvas.getContext('2d')

export const tempChart = new Chart(ctx, {
  type: 'line',
  data: {
    // labels:'',
    datasets: [
      {
        label: 'Temperatura (°C)',
        // data: undefined,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Temperatura (°C)',
        // data: undefined,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false // Puedes establecer esto en false para ocultar la leyenda completa del gráfico
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Hora'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Temperatura (°C)'
        }
      }
    }
  }
})
