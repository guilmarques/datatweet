var config = {
    type: 'doughnut',
    data: {
        datasets: [{
            data: [],
            backgroundColor: [
                window.chartColors.red,
                window.chartColors.blue,
                window.chartColors.green,
                window.chartColors.yellow,
                window.chartColors.orange,
                window.chartColors.grey,
                window.chartColors.black
            ],
            label: 'Dataset 1'
        }],
        labels: [
            'IPHONE Percentage',
            'ANDROID Percentage',
            'IPAD Percentage',
            'MAC Percentage',
            'WINDOWS Percentage',
            'WEB Percentage',
            'OTHERS Percentage'
        ]
    },
    options: {
        responsive: true,
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Tweets % Source Chart'
        },
        animation: {
            animateScale: true,
            animateRotate: true
        }
    }
};

document.getElementById('changeCircleSize').addEventListener('click', function() {
    if (window.myDoughnut.options.circumference === Math.PI) {
        window.myDoughnut.options.circumference = 2 * Math.PI;
        window.myDoughnut.options.rotation = -Math.PI / 2;
    } else {
        window.myDoughnut.options.circumference = Math.PI;
        window.myDoughnut.options.rotation = -Math.PI;
    }

    window.myDoughnut.update();
});

var color = Chart.helpers.color;
var barChartData = {
    labels: ["Source"],
    datasets: [{
        label: 'IPHONE Tweets',
        backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
        borderWidth: 1,
        data: []
    }, {
        label: 'ANDROID Tweets',
        backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
        borderWidth: 1,
        data: []
    }, {
        label: 'IPAD Tweets',
        backgroundColor: color(window.chartColors.green).alpha(0.5).rgbString(),
        borderWidth: 1,
        data: []
    }, {
        label: 'MAC Tweets',
        backgroundColor: color(window.chartColors.orange).alpha(0.5).rgbString(),
        borderWidth: 1,
        data: []
    }, {
        label: 'WINDOWS Tweets',
        backgroundColor: color(window.chartColors.grey).alpha(0.5).rgbString(),
        borderWidth: 1,
        data: []
    }, {
        label: 'WEB Tweets',
        backgroundColor: color(window.chartColors.yellow).alpha(0.5).rgbString(),
        borderWidth: 1,
        data: []
    }, {
        label: 'OTHERS Devices Tweets',
        backgroundColor: color(window.chartColors.black).alpha(0.5).rgbString(),
        borderWidth: 1,
        data: []
    }]

};

var lineChartData = {
    labels: [],
    datasets: [{
        label: 'IPHONE Tweets',
        borderColor: window.chartColors.green,
        backgroundColor: window.chartColors.green,
        fill: false,
        data: [],
        yAxisID: 'y-axis-1',
    }, {
        label: 'ANDROID Tweets',
        borderColor: window.chartColors.blue,
        backgroundColor: window.chartColors.blue,
        fill: false,
        data: [],
        yAxisID: 'y-axis-2'
    }, {
        label: 'IPAD Tweets',
        borderColor: window.chartColors.red,
        backgroundColor: window.chartColors.red,
        fill: false,
        data: [],
        yAxisID: 'y-axis-3'
    }, {
        label: 'MAC Tweets',
        borderColor: window.chartColors.orange,
        backgroundColor: window.chartColors.orange,
        fill: false,
        data: [],
        yAxisID: 'y-axis-4'
    }, {
        label: 'WINDOWS Tweets',
        borderColor: window.chartColors.black,
        backgroundColor: window.chartColors.black,
        fill: false,
        data: [],
        yAxisID: 'y-axis-5'
    }, {
        label: 'WEB Tweets',
        borderColor: window.chartColors.yellow,
        backgroundColor: window.chartColors.yellow,
        fill: false,
        data: [],
        yAxisID: 'y-axis-6'
    }, {
        label: 'OTHERS Devices Tweets',
        borderColor: window.chartColors.grey,
        backgroundColor: window.chartColors.grey,
        fill: false,
        data: [],
        yAxisID: 'y-axis-7'
    }]
};

window.onload = function() {
    var ctx1 = document.getElementById('chart-area').getContext('2d');
    window.myDoughnut = new Chart(ctx1, config);
    var ctx2 = document.getElementById('canvas2').getContext('2d');
    window.myBar = new Chart(ctx2, {
        type: 'bar',
        data: barChartData,
        options: {
            responsive: true,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Tweets per Source'
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    updateCharts();
    setInterval(updateCharts,5000);
};

function updateCharts(){
    $.getJSON('/refresh', {}, function(data) {
        var sp_data = [];
        var po_data = [];
        var en_data = [];
        var ar_data = [];
        var ed_data = [];
        var af_data = [];
        var ot_data = []
        var total = 0;
        var sp_count = 0;
        var po_count = 0;
        var en_count = 0;
        var ar_count = 0;
        var ed_count = 0;
        var af_count = 0;
        var ot_count = 0;
        var size = 0;
        console.log(JSON.stringify(data));
        var json_data = data;
		for (var key in data) {
			if (data.hasOwnProperty(key)) {
				var obj_data = data[key];
				switch (obj_data[0]) {
                  case "ANDROID":
                    po_data.push(parseInt(obj_data[1]));
                    break;
                  case "IPHONE":
                    sp_data.push(parseInt(obj_data[1]));
                    break;
                  case "IPAD":
                     en_data.push(parseInt(obj_data[1]));
                    break;
                  case "MAC":
                    ar_data.push(parseInt(obj_data[1]));
                    break;
                  case "WINDOWS":
                    ed_data.push(parseInt(obj_data[1]));
                    break;
                  case "WEB":
                    af_data.push(parseInt(obj_data[1]));
                    break;
                  case "Others":
                    ot_data.push(parseInt(obj_data[1]));
                }
				total += parseInt(obj_data[1]);
				size++;
				while (size > 7){
					sp_data= sp_data.slice(-7);
					po_data= po_data.slice(-7);
					en_data= en_data.slice(-7);
					ar_data= ar_data.slice(-7);
					ed_data= ed_data.slice(-7);
					af_data= af_data.slice(-7);
					ot_data= ot_data.slice(-7);
					size=7;
				}
			}
		}

        window.myBar.data.datasets[0].data = sp_data;
        window.myBar.data.datasets[1].data = po_data;
        window.myBar.data.datasets[2].data = en_data;
        window.myBar.data.datasets[3].data = ar_data;
        window.myBar.data.datasets[4].data = ed_data;
        window.myBar.data.datasets[5].data = af_data;
        window.myBar.data.datasets[6].data = ot_data;
        window.myBar.update();
        sp_count = (sp_data / total) * 100
        po_count = (po_data / total) * 100
        en_count = (en_data / total) * 100
        ar_count = (ar_data / total) * 100
        ed_count = (ed_data / total) * 100
        af_count = (af_data / total) * 100
        ot_count = (ot_data / total) * 100
        window.myDoughnut.data.datasets[0].data = [Math.round( sp_count * 10 ) / 10,
                                                   Math.round( po_count * 10 ) / 10,
                                                   Math.round( en_count * 10 ) / 10,
                                                   Math.round( ar_count * 10 ) / 10,
                                                   Math.round( ed_count * 10 ) / 10,
                                                   Math.round( af_count * 10 ) / 10,
                                                   Math.round( ot_count * 10 ) / 10];
        window.myDoughnut.update();
    });
}