if (location.href.includes('/statistics')) {
  const ctx = document.getElementById('elec-chart').getContext('2d');
  const options = {
      maintainAspectRatio: false,
      plugins: {
          datalabels: {
              align: 'top',
              font: {
                  size: 17,
                  weight: 600
              }
          },
          
      },
      scales: {
        y: {
          stacked: true,
          grid: {
            display: true,
            color: "rgba(255,99,132,0.2)"
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    };
  Chart.register(ChartDataLabels);
  const myChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: [1,5,10,15,20,25,30],
          datasets: [{
              label: 'Total kWh',
              data: [123, 100, 124, 140, 160, 170, 150],
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: options,
      plugins: [ChartDataLabels]
  });
}