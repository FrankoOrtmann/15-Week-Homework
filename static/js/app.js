function buildMetadata(sample) {
  d3.json(`/metadata/${sample}`).then(function(sampleData) {
  
  var panel = d3.select("#sample-metadata").html("");
  
  panel.html("");

  Object.entries(sampleData).forEach(([key, value]) => {
    panel.append('h6').text(`${key}: ${value}`);
  })   
    });
  };

function buildCharts(sample) {
 
  d3.json(`/samples/${sample}`).then(function (sampleData) {
    console.log(sampleData);
    


    var otu_ids = sampleData.otu_ids;
    var otu_labels = sampleData.otu_labels;
    var sample_values = sampleData.sample_values;

    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Electric'
      }
    }];      

    var bubbleLayout = {
      autosize: true,
      hovermode: 'closest',
      xaxis: {title: 'OTU ID'},
    };

    Plotly.plot('bubble', bubbleData, bubbleLayout);

    var pieData = [{
      values: sample_values.slice(0,10),
      labels: otu_ids.slice(0,10),
      hovertext: otu_labels.slice(0,10),
      hoverinfo: 'hovertext',
      type: 'pie'
    }];

    var pieLayout = {
      margin: {t: 0, l: 0}
    }
    console.log(pieData)
    Plotly.plot('pie', pieData, pieLayout); 

  });
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the panelboard
init();