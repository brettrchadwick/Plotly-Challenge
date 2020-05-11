function init(){
    var dropdownMenu=d3.select("#selDataset");
    d3.json("samples.json").then((data) =>{
        data.names.forEach(function(id){
            dropdownMenu.append("option").text(id).property("value");
        })
        var firstSample=data.names[0];
        getMetadata(firstSample);
        buildPlots(firstSample);
    })
};



function getMetadata(subject){
    d3.json("samples.json").then((data) =>{
        var meta=data.metadata;
        var returned=meta.filter(entry => entry.id ==subject)[0];
        var div=d3.select("#sample-metadata");
        div.html("");
        Object.entries(returned).forEach(([key,value])=>{
            div.append("h5").text(`${key} : ${value}`)
        } );
       
        
})};

function buildPlots(sample){
    d3.json("samples.json").then(sampleData =>{
        var fullList=sampleData.samples;
        var returned=fullList.filter(entry => entry.id ==sample)[0];
        var otuLabels=returned.otu_labels;
        var sampleValues=returned.sample_values;
        var otuId=returned.otu_ids;
        var barLabel=otuId.map(otuId => `OTU ${otuId}`)
        var barLayout={
            title:`Top 10 OTU Found In ${sample}`
        }
        var barTrace=[{
            x: sampleValues.slice(0,10).reverse(),
            y:barLabel.slice(0,10).reverse(),
            text:otuLabels.slice(0,10),
            type:"bar",
            orientation:"h"
        }];
        Plotly.newPlot("bar", barTrace, barLayout);

        var bubbleTrace=[{
            mode:"markers",
            x: otuId,
            y: sampleValues,
            text:otuLabels,
            marker:{
                size: sampleValues,
                color: otuId
            }
        }]
        var bubbleLayout={
            title:"Belly Button Biodiversity"
        }
        Plotly.newPlot("bubble", bubbleTrace, bubbleLayout);
        var meta=sampleData.metadata;
        var returned=meta.filter(entry => entry.id ==sample)[0];
        var wfreq=returned.wfreq;
        var gaugeData = [
            {
              type: "indicator",
              mode: "gauge+number+delta",
              value: wfreq,
              title: { text: "Belly Button Washing Frequency: Scrubs Per Week", font: { size: 18 } },
              delta: { reference: 3, increasing: { color: "green" } },
              gauge: {
                axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
                bar: { color: "black" },
                bgcolor: "white",
                borderwidth: 2,
                bordercolor: "gray",
                steps: [
                  { range: [0, 1], color: "#f7fcfd" },
                  { range: [1, 2], color: "#e0ecf4" },
                  { range: [2, 3], color: "#bfd3e6" },
                  { range: [3, 4], color: "#9ebcda" },
                  { range: [4, 5], color: "#8c96c6" },
                  { range: [5, 6], color: "#8c6bb1" },
                  { range: [6, 7], color: "#88419d" },
                  { range: [7, 8], color: "#810f7c" },
                  { range: [8, 9], color: "#4d004b" }
                ],
                
              }
            }
          ];
          
          var gaugeLayout = {
            width: 500,
            height: 400,
            margin: { t: 25, r: 25, l: 25, b: 25 },
            paper_bgcolor: "lavender",
            font: { color: "darkblue", family: "Arial" }
          };
          
          Plotly.newPlot('gauge', gaugeData, gaugeLayout);
    })

};

function optionChanged(sampleID){
    getMetadata(sampleID);
    buildPlots(sampleID)

};

init();

