import products from './products.js';

const purchases = {};
for (let i = 0; i < 10; i++) {
  const randomProduct = products[Math.floor(Math.random() * products.length)];
  purchases[randomProduct.id] = (purchases[randomProduct.id] || 0) + 1;
}

const chartData = products.map(product => {
  const quantity = purchases[product.id] || 0;
  return {
    label: `Товар ${product.name}`,
    quantity: quantity,
    price: parseFloat(product.price)
  };
}).filter(data => data.quantity > 0);

const labels = chartData.map(d => d.label);
const quantities = chartData.map(d => d.quantity);

const chartConfigs = {
  bar: {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Кількість продажів',
        data: quantities,
        backgroundColor: '#75543e'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  },
  pie: {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: 'Кількість продажів',
        data: quantities,
        backgroundColor: [ '#FF6384', '#36A2EB', '#FFCE56', '#8BC34A', '#FF9800',
                '#9C27B0', '#009688', '#795548', '#CDDC39']
      }]
    },
    options: {
      responsive: true
    }
  },
  line: {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Кількість продажів',
        data: quantities,
        borderColor: 'rgba(153, 102, 255, 1)',
        fill: false
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  }
};

const barCtx = document.getElementById('barChart');
const pieCtx = document.getElementById('pieChart');
const lineCtx = document.getElementById('lineChart');

const charts = {
  bar: new Chart(barCtx, chartConfigs.bar),
  pie: new Chart(pieCtx, chartConfigs.pie),
  line: new Chart(lineCtx, chartConfigs.line)
};

function showChart(type) {
  document.querySelectorAll('.chart-container').forEach(container => container.style.display = 'none');
  document.getElementById(type + 'Container').style.display = 'block';
}

document.getElementById('chartTypeSelector').addEventListener('change', (e) => {
  showChart(e.target.value);
});

showChart('bar'); // Показати за замовчуванням
