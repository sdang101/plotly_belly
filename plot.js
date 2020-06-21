function init() {
    // Variable "selector" assigned dropdown menu ("#selDataset")
    var selector = d3.select("#selDataset");
    
    // d3.json() method used to read the data from "samples.json"
    d3.json("samples.json").then((data) => {
      console.log(data);
      // Varibale "sampleNames" assigned array of "names"
      var sampleNames = data.names;
      // forEach() method called on "sampleNames" array
      // For each element in the array, a dropdown menu option is appeneded
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  })}
  
  init();

// "optionChanged() function called in "index.html"
// "newSample" argument refers to the values of the selected menu option aka ID Number of individual
function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
  }

// Takes in ID number (sample) as arguement
// Dropdown menu option is selected, the ID number is passes in as "sample"
function buildMetadata(sample) {
// d3.json() pulls dataset from "sample.json"
// Once data read in, it's referred to as "data"
    d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter for object in the array whose ID matches the ID number passed
    // into buildMetadata() as sample
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html(""); // clear any previous record in panel
    Object.entries(result).forEach(([i,j]) =>{  //entries returns Array, then use foeEach to string
      var resultKey = i;
      var resultVal = j;
      PANEL.append("h6").text(resultKey.toLowerCase() + ": " + resultVal);
    });
});
}

function buildCharts(id) {
  d3.json("samples.json").then((data) =>{
      var samplesData =  data.samples;
      var sampleResultArray = samplesData.filter(sampleObj => sampleObj.id == id);
      var sampleResult = sampleResultArray[0];
      
      var barXdata = sampleResult.sample_values.map((val) => parseInt(val)).slice(0,10);
      var barYdata = sampleResult.otu_ids.map((oi) => "OTU " + oi).slice(0,10);
      var barHoverText = sampleResult.otu_labels.slice(0,10);
      
      var barTrace = {
          x:barXdata, 
          y: barYdata, 
          text: barHoverText, 
          type: "bar", 
          orientation: "h"
      };
      var barLayout = {
          title: "Top 10 Bacterial Species (OTUs)",
          xaxis: {title: "Sample Values"},
          yaxis: {autorange: "reversed"}
      };
      // Bar Chart 
      Plotly.newPlot("bar", [barTrace], barLayout);

  
      var bubbleXdata = sampleResult.otu_ids;
      var bubbleYdata = sampleResult.sample_values;
      var bubbleHover = sampleResult.otu_labels;

      var bubbleTrace = {
          x: bubbleXdata, 
          y: bubbleYdata, 
          text:bubbleHover,
          mode:"markers", 
          marker:{
              size: bubbleYdata,
              color:bubbleXdata
          }
      };
      var bubbleLayout = {
          title: "Bubble Samples (OTU)",
          xaxis: {title: "OTU ID"}
      };

      // Bubble Chart
      Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout)
      
      
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == id);
      var result = resultArray[0];
      var gaugeData = parseInt(result.wfreq);

      var gaugeTrace = {
          type: "indicator",
          mode:"gauge",
          value: gaugeData,
          gauge:{
            axis: {
              range: [0, 9],
              tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
              ticks: "outside"
            },
            steps: [{range: [0,1], color:"#e2e2e2"},
                    {range: [1,2], color:"#c8ced3"},
                    {range: [2,3], color:"#afbac4"},
                    {range: [3,4], color:"#96a6b5"},
                    {range: [4,5], color:"#7d93a6"},
                    {range: [5,6], color:"#648197"},
                    {range: [6,7], color:"#4a6f89"},
                    {range: [7,8], color:"#2e5d7b"},
                    {range: [8,9], color:"#004c6d"}
                    ],
                    threshold: {
                      line: { color: "gray", width: 4 },
                      thickness: 1,
                      value: gaugeData
                    }
        }
      };
      var gaugeLayout = {
          title: "Belly Button Washing Frequency<br>Scrubs per Week",
      };

     // Gauge Chart
      Plotly.newPlot("gauge", [gaugeTrace],gaugeLayout);

  });
}
