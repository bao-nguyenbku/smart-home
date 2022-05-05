if (location.href.includes('/statistics')) {
  const ctx = document.getElementById('elec-chart').getContext('2d');
  var gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(114, 151, 171, 0.5)');
  gradient.addColorStop(0.5, 'rgba(114, 151, 171, 0.2)');
  gradient.addColorStop(1, 'rgba(114, 151, 171, 0)');
  let options = {
    maintainAspectRatio: false,
    responsive: true,
    datasetStrokeWidth : 3,
    pointDotStrokeWidth : 4,
    plugins: {
      datalabels: {
        align: 'end',
        anchor: 'end',
        font: {
          size: 14,
          weight: 600
        }
      },
      legend: {
        align: 'end',
        labels: {
          padding: 10
        }
      }
    },
    scales: {
      y: {
        stacked: false,
        display: true,
        color: "rgba(255,99,132,0.2)",
      }
    }
  };
  Chart.register(ChartDataLabels);
  $.ajax({
    url: '/statistics/data',
    method: 'get',
    success: (res) => {
      if (res.status === 200) {
        let data = new Array(7).fill(0);
        res.data.forEach(ele => {
          data = data.map((d_e, index) => {
            let number = d_e + (ele.data[index] / 3600000 * 0.036);
            return number;
          })
        })
        let chartData = {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'kWh',
            backgroundColor: gradient,
            pointBackgroundColor: 'rgb(254, 131, 77)',
            borderWidth: 2,
            borderColor: '#283c47',
            pointStrokeColor: "#ff6c23",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "#ff6c23",
            tension: 0.4,
            fill: true,
            data: data.map(el => el.toFixed(2)),
          }]
        };
        const myChart = new Chart(ctx, {
          type: 'line',
          data: chartData,
          options: options,
          plugins: [ChartDataLabels]
        });
      }
    }
  })
  
}
