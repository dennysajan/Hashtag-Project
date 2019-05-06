var ctx = document.getElementById("myChart").getContext("2d");
function getnums(num) {
  var a = [];
  for (var i = 0; i < num; i++) {
    a.push(Math.floor(Math.random() * Math.floor(50000)));
  }
  return a;
}
var chart = new Chart(ctx, {
  // The type of chart we want to create
  type: "line",

  // The data for our dataset
  data: {
    labels: [
      "04/27",
      "04/28",
      "04/29",
      "04/30",
      "05/01",
      "05/02",
      "05/03",
      "05/04",
      "05/05",
      "05/06"
    ],
    datasets: [
      {
        label: "#MeToo tweets",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: getnums(10)
      }
    ]
  },

  // Configuration options go here
  options: {}
});
