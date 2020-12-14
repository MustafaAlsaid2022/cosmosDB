

let options = {
  chart: {
      type: 'line',
      toolbar: {
      show: false
    }
  },

  dataLabels: {
      enabled: false
  },
  colors: ["#FF1654", "#247BA0"],
  series: [
      {
          name: "High - 2020",
          data: [28, 29, 33, 36, 9, 32]
      },
      {
          name: "Low - 2020",
          data: [12, 11, 14, 18, 17, 13, 13]
      }
  ],

  stroke: {
      curve: 'smooth'
  },

  title: {
    text: 'Average High & Low Temperature',
    align: 'center'
  },

  grid: {
    borderColor: '#e7e7e7',
    row: {
      colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
      opacity: 0.5
    },
  },

  xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      title: {
      text: 'Month'
    }
  },

  yaxis: {
    title: {
      text: 'Temperature'
    },
    min: 5,
    max: 40
  },
}

let chart = new ApexCharts(document.querySelector("#chart"), options);

chart.render();
