var interactionSelectPointerMove = new ol.interaction.Select({
  condition: ol.events.condition.pointerMove
});

var interactionSelect = new ol.interaction.Select({});

var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');


var overlay = new ol.Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250
  }
});

// function styleFunction(scheme){
//   let color;
//   switch (scheme) {
//     case 'darkmint':
//       // if (){};

//   }

//   let reStyle = new ol.style.Style({
//     // image: new ol.style.Circle({
//     //      radius: 5,
//          fill: new ol.style.Fill({
//              color: color
//          }),
//          stroke: new ol.style.Stroke({
//            color:'#867E77',
//            width: 0.1
//          })
//     // })
//  });
//  return reStyle;
// }

// click close button to close the popup window
closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

var wmsSource = new ol.source.TileWMS({
  url: 'http://152.7.99.155:8080/geoserver/hera/wms',
  projection: 'EPSG:4269',
  params: {
    "VERSION": "1.3.0",
    'LAYERS': 'hera:ncsc_population_lyr',
    // 'bbox': [-84.3664321899414,31.9729919433594,-75.3555068969727,36.6110992431641],
    'TILED': true,
    'FORMAT': 'image/png'
  },
  serverType: 'geoserver',
  // Countries have transparency, so do not fade tiles:
  transition: 0,
});

var wmsSource2 = new ol.source.TileWMS({
  url: 'http://152.7.99.155:8080/geoserver/hera/wms',
  projection: 'EPSG:4269',
  params: {
    "VERSION": "1.3.0",
    'LAYERS': 'hera:ncsc_isa_lyr',
    // 'bbox': [-84.3664321899414,31.9729919433594,-75.3555068969727,36.6110992431641],
    'TILED': true,
    'FORMAT': 'image/png'
  },
  serverType: 'geoserver',
  // Countries have transparency, so do not fade tiles:
  transition: 0,
});

var boundarySource = new ol.source.TileWMS({
  url: 'http://152.7.99.155:8080/geoserver/hera/wms',
  projection: 'EPSG:4269',
  params: {
    "VERSION": "1.3.0",
    'LAYERS': 'hera:ncsc_county',
    // 'bbox': [-84.3664321899414,31.9729919433594,-75.3555068969727,36.6110992431641],
    'TILED': true,
    'FORMAT': 'image/png'
  },
  serverType: 'geoserver',
  // Countries have transparency, so do not fade tiles:
  transition: 0,
});

// new ol.source.Vector({
//   renderMode: 'image', // Vector layers are rendered as images. Better performance. Default is 'vector'.
//   format: new ol.format.GeoJSON(),
//   url: function(extent) {
//     return  'http://152.7.99.155:8080/geoserver/hera/wfs?service=WFS' +
//             '&version=1.0.0&request=GetFeature'+
//             '&typeName=hera:ncsc_county' +
//            '&outputFormat=application/json&srsname=EPSG:4326' +
//           //  '&bbox=-124.73142200000001, 24.955967, -66.969849, 49.371735'
//            '&bbox=-84.3664321899414,31.9729919433594,-75.3555068969727,36.6110992431641'
//           // + '&bbox=' + extent.join(',') + ',EPSG:3857'; // CQL filter and bbox are mutually exclusive. comment this to enable cql filter
//   },
//   strategy: ol.loadingstrategy.bbox,
// }),

var view = new ol.View({
  // projection: 'EPSG:3857',
  center: ol.proj.fromLonLat([-79.5, 34.1]),
  zoom: 7

})


var map = new ol.Map({
  target: 'map',
  loadTilesWhileAnimating: true,
  loadTilesWhileInteracting: true,
  controls: [
    new ol.control.OverviewMap(),
    new ol.control.Zoom(),
    new ol.control.ScaleLine(),
  ],
  interactions: [
    interactionSelectPointerMove,
    new ol.interaction.MouseWheelZoom(),
    new ol.interaction.DragPan(),
    interactionSelect,
  ],
  layers: [
    new ol.layer.Group({
      title: "Base maps",
      fold: 'open',
      layers: [
        new ol.layer.Group({
          title: "North and South Carolina county",
          type: 'base',
          combine: true,
          visible: true,
          layers: [
            new ol.layer.Tile({
              // title: "Open Street Map",
              // type: "base",
              // visible: true,
              source: new ol.source.OSM()
            }),

            new ol.layer.Tile({
              // title: 'NC SC County',
              // type: "base",
              // visible: true,
              source: boundarySource,
            })
          ]
        }),
      ]
    }),

    new ol.layer.Group({
      title: "Layers",
      fold: 'open',
      layers: [

        new ol.layer.Group({
          title: "2017 population - group",
          combine: true,
          visible: true,
          layers: [
            new ol.layer.Tile({
              // title: "2017 population",
              source: wmsSource
            }),

            new ol.layer.Vector({
              // title: "NC SC population - Vector",
              // title: featurestatus,
              source: new ol.source.Vector({
                renderMode: 'image', // Vector layers are rendered as images. Better performance. Default is 'vector'.
                format: new ol.format.GeoJSON(),
                url: function (extent) {
                  return 'http://152.7.99.155:8080/geoserver/hera/wfs?service=WFS' +
                    '&version=1.0.0&request=GetFeature' +
                    '&typeName=hera:ncsc_population_lyr' +
                    '&outputFormat=application/json&srsname=EPSG:4326' +
                    //  '&bbox=-124.73142200000001, 24.955967, -66.969849, 49.371735'
                    '&bbox=-84.3664321899414,31.9729919433594,-75.3555068969727,36.6110992431641'
                  // + '&bbox=' + extent.join(',') + ',EPSG:3857'; // CQL filter and bbox are mutually exclusive. comment this to enable cql filter
                },
                strategy: ol.loadingstrategy.bbox,
              }),
              style: new ol.style.Style({
                fill: new ol.style.Fill({
                  color: [255, 255, 255, 0],
                  // opacity: 1
                }),
                stroke: new ol.style.Stroke({
                  color: '#867E77',
                  width: 0.1
                })
              }),
            }),
          ]
        }),
        // new ol.layer.Tile({
        //   title:"US County",
        //   source: new ol.source.TileArcGISRest({
        //       url: "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer",
        //   }),
        //   style: new ol.style.Style({
        //   })
        // }),


        // new ol.layer.Vector({
        //     title: "NC SC County- Vector",
        //     // title: featurestatus,
        //     source: new ol.source.Vector({
        //       renderMode: 'image', // Vector layers are rendered as images. Better performance. Default is 'vector'.
        //       format: new ol.format.GeoJSON(),
        //       url: function(extent) {
        //         return  'http://152.7.99.155:8080/geoserver/hera/wfs?service=WFS' +
        //                 '&version=1.0.0&request=GetFeature'+
        //                 '&typeName=hera:ncsc_county' +
        //                '&outputFormat=application/json&srsname=EPSG:4326' +
        //               //  '&bbox=-124.73142200000001, 24.955967, -66.969849, 49.371735'
        //                '&bbox=-84.3664321899414,31.9729919433594,-75.3555068969727,36.6110992431641'
        //               // + '&bbox=' + extent.join(',') + ',EPSG:3857'; // CQL filter and bbox are mutually exclusive. comment this to enable cql filter
        //       },
        //       strategy: ol.loadingstrategy.bbox,
        //     }),
        //     // style: styleFunction, // Setting style in GeoServer SLD files 
        //   }),

        // new ol.layer.Vector({
        //   title: "NC SC population - Vector",
        //   // title: featurestatus,
        //   source: new ol.source.Vector({
        //     renderMode: 'image', // Vector layers are rendered as images. Better performance. Default is 'vector'.
        //     format: new ol.format.GeoJSON(),
        //     url: function (extent) {
        //       return 'http://152.7.99.155:8080/geoserver/hera/wfs?service=WFS' +
        //         '&version=1.0.0&request=GetFeature' +
        //         '&typeName=hera:ncsc_population_lyr' +
        //         '&outputFormat=application/json&srsname=EPSG:4326' +
        //         //  '&bbox=-124.73142200000001, 24.955967, -66.969849, 49.371735'
        //         '&bbox=-84.3664321899414,31.9729919433594,-75.3555068969727,36.6110992431641'
        //       // + '&bbox=' + extent.join(',') + ',EPSG:3857'; // CQL filter and bbox are mutually exclusive. comment this to enable cql filter
        //     },
        //     strategy: ol.loadingstrategy.bbox,
        //   }),
        //   // style: styleFunction, // Setting style in GeoServer SLD files 
        // }),

        new ol.layer.Vector({
          title: "NC SC ISA - Vector",
          // title: featurestatus,
          source: new ol.source.Vector({
            renderMode: 'image', // Vector layers are rendered as images. Better performance. Default is 'vector'.
            format: new ol.format.GeoJSON(),
            url: function (extent) {
              return 'http://152.7.99.155:8080/geoserver/hera/wfs?service=WFS' +
                '&version=1.0.0&request=GetFeature' +
                '&typeName=hera:ncsc_isa_lyr' +
                '&outputFormat=application/json&srsname=EPSG:4326' +
                //  '&bbox=-124.73142200000001, 24.955967, -66.969849, 49.371735'
                '&bbox=-84.3664321899414,31.9729919433594,-75.3555068969727,36.6110992431641'
              // + '&bbox=' + extent.join(',') + ',EPSG:3857'; // CQL filter and bbox are mutually exclusive. comment this to enable cql filter
            },
            strategy: ol.loadingstrategy.bbox,
          }),
          // style: styleFunction, // Setting style in GeoServer SLD files 
        }),


        // new ol.layer.Tile({
        //   title: "2017 population",
        //   source: wmsSource
        //   // source: new ol.source.TileWMS({
        //   //   url: 'http://152.7.99.155:8080/geoserver/hera/wms',
        //   //   projection: 'EPSG:4269',
        //   //   params: {"VERSION": "1.3.0",
        //   //           'LAYERS': 'hera:ncsc_population_lyr',
        //   //           // 'bbox': [-84.3664321899414,31.9729919433594,-75.3555068969727,36.6110992431641],
        //   //           'TILED': true,
        //   //           'FORMAT': 'image/png'},
        //   //   serverType: 'geoserver',
        //   //   // Countries have transparency, so do not fade tiles:
        //   //   transition: 0,
        //   // }),
        // }),

        new ol.layer.Tile({
          title: "2015 Impervious Surface Area",
          source: wmsSource2
        }),

        // new ol.layer.Tile({
        //   title:"Test ESRI MapServer",
        //   source: new ol.source.TileArcGISRest({
        //     url: 'https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Observations/radar_base_reflectivity/MapServer',
        //   }),
        // }),

      ]
    })

  ],
  overlays: [overlay],
  // view: new ol.View({
  //   // projection: 'EPSG:3857',
  //   center: ol.proj.fromLonLat([-80,35.5]),
  //   zoom: 7

  view: view

  // })
});


// If there is any feature at the event pixel (where the mouse points at), the pointer will change to the 'hand' symbol
map.on('pointermove', function (e) {
  if (e.dragging) {
    return;
  }
  var pixel = map.getEventPixel(e.originalEvent);
  var hit = map.hasFeatureAtPixel(pixel);

  e.map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});

map.on('singleclick', function (evt) {
  var coord = evt.coordinate;
  var features = map.getFeaturesAtPixel(evt.pixel);
  // let resolution = map.getView().getResolution();
  // let projection = map.getView().getProjection();
  // // var url = '';
  // // var vistaResolution = /** @type {number} */ (vista.getResolution());
  // var url = wmsSource.getGetFeatureInfoUrl(
  //     coord, resolution, projection,
  //     {'INFO_FORMAT': 'application/json',}
  //       // 'propertyName': 'fips, county, population'}
  // );

  if (features) {
    // if (features.length > 1){

    //   } else {
    var countyname = features[0].get('county');
    var geoid = features[0].get('fips');
    var population = features[0].get('population');

    //   }
    content.innerHTML = '<h3>' + countyname + '</h3><br><p>geoid: ' + geoid + '</p>' + '<p>population: ' + population + '</p>';
    //   // overlay.setPosition(ol.proj.fromLonLat([lon,lat]));
    overlay.setPosition(coord);
  } else {
    // else if (url) {
    let resolution = map.getView().getResolution();
    let projection = map.getView().getProjection();
    // var url = '';
    // var vistaResolution = /** @type {number} */ (vista.getResolution());
    var url = wmsSource.getGetFeatureInfoUrl(
      coord, resolution, projection, {
        'INFO_FORMAT': 'application/json',
      }
      // 'propertyName': 'fips, county, population'}
    );

    if (url) {
      fetch(url)
        .then(function (response) {
          return response.json();
        })
        .then(function (json) {
          var lyrId = json['features'][0]['id'].split('.')[0];
          if (lyrId = 'ncsc_population_lyr') {
            content.innerHTML = '<h3>population:' + json["features"][0]["properties"]["population"] + '</h3>' + 'county name:' + json["features"][0]["properties"]["county"];
            console.log(json);
          } else if (lyrId = 'ncsc_isa_lyr') {
            content.innerHTML = '<h3>population:' + json["features"][0]["properties"]["percent_isa"] + '</h3>' + 'county name:' + json["features"][0]["properties"]["county"];
            console.log(json);
          }
        });
      // }
      overlay.setPosition(coord);
    }
  }
  // else {
  //   overlay.setPosition(undefined);
  // }
});



var sidebar = new ol.control.Sidebar({
  element: 'sidebar',
  position: 'right'
});
var toc = document.getElementById("layers");
ol.control.LayerSwitcher.renderPanel(map, toc);
map.addControl(sidebar);

document.getElementById("tab-1").innerHTML = "2017 population";
document.getElementById("tab-2").innerHTML = "2015 Impervious Surface Area";


// Create attribute table using Jquery library DataTable
function createTabTable(attributeTableID, layerID, properties) {
  // Use the new 'DataTable' function rather than the older one 'dataTable'
  var table = $(attributeTableID).DataTable({
    responsive: 'true',
    // dom: 'iBfrtlp',
    "dom": '<"top"fB>rt<"bottom"lip>',
    buttons: [
      'csv',
      {
        extend: 'excelHtml5',
        exportOptions: {
          columns: ':visible'
        }
      }
    ],
    "scrollX": true,
    "ajax": {
      // Delete the limitation: maxFeatures=50
      // Solved from Stackoverflow questions no.48147970
      "url": 'http://152.7.99.155:8080/geoserver/hera/wfs?service=WFS' +
        '&version=1.0.0&request=GetFeature' +
        '&typeName=hera:' + layerID +
        '&outputFormat=application/json',
      "dataSrc": "features"
    },
    "columns": properties,
  });

  return table;
};

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  $.fn.dataTable.tables({
    visible: true,
    api: true
  }).columns.adjust();
});

createTabTable('#attributeTb', 'ncsc_population_lyr', [{
    "title": "FIPS",
    data: "properties.fips",
    "class": "center"
  },
  {
    "title": "Population",
    data: "properties.population",
    "class": "center"
  },
  {
    "title": "State",
    data: "properties.stusps",
    "class": "center"
  },
], );

createTabTable('#attributeTb2', 'ncsc_isa_lyr', [{
    "title": "FIPS",
    data: "properties.fips",
    "class": "center"
  },
  {
    "title": "County",
    data: "properties.county",
    "class": "center"
  },
  {
    "title": "Percent ISA",
    data: "properties.percent_isa",
    "class": "center"
  },
], );


// Create mock-up highlight table as tableau

var dummy = [

  ['2006', 10, 30, 40, 40, 55, 36, 74, 39, 29],
  ['2007', 32, 22, 33, 24, 35, 36, 57, 28, 29],
  ['2008', 34, 13, 43, 43, 25, 46, 67, 48, 59],
  ['2009', 44, 25, 33, 24, 15, 26, 74, 48, 59],
  ['2010', 55, 62, 53, 44, 53, 56, 47, 83, 92],
  ['2011', 67, 23, 23, 34, 56, 26, 77, 78, 79],
  ['2012', 87, 42, 53, 84, 75, 66, 75, 28, 91],
  ['2013', 88, 62, 37, 44, 53, 46, 73, 28, 19],
  ['2014', 150, 26, 63, 44, 35, 62, 27, 82, 19]

];
var rowLabel = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];


// Using RBG
var colors = [{
    r: 255,
    g: 255,
    b: 255
  },
  {
    r: 59,
    g: 115,
    b: 143
  }, {
    r: 59,
    g: 115,
    b: 143
  }, {
    r: 59,
    g: 115,
    b: 143
  }, {
    r: 59,
    g: 115,
    b: 143
  }, {
    r: 59,
    g: 115,
    b: 143
  }, {
    r: 59,
    g: 115,
    b: 143
  }, {
    r: 59,
    g: 115,
    b: 143
  }, {
    r: 59,
    g: 115,
    b: 143
  }, {
    r: 59,
    g: 115,
    b: 143
  }, {
    r: 59,
    g: 115,
    b: 143
  }, {
    r: 59,
    g: 115,
    b: 143
  }, {
    r: 59,
    g: 115,
    b: 143
  }
];

var alpha = d3.scaleLinear().domain([0, 100]).range([0, 1]);

var d3table = d3.select("#chart").append("table");

thead = d3table.append("thead");
tbody = d3table.append("tbody")


thead.append("tr")
  .selectAll("th")
  .data(rowLabel)
  .enter()
  .append("th")
  .text(function (d) {
    return d;
  })

var rows = tbody.selectAll("tr")
  .data(dummy)
  .enter()
  .append("tr");

var cells = rows.selectAll("td")
  .data(function (d, i) {
    //d.shift();
    //d.unshift(rowLabel[i]);
    return d;
  })
  .enter()
  .append("td")
  .style('background-color', function (d, i) {
    return 'rgba(' + colors[i].r + ',' + colors[i].g + ',' + colors[i].b + ',' + alpha(d) + ')';
  })
  .text(function (d) {
    return d;
  });

$(function () {
  $("#dialog").dialog({
    autoOpen: true,
    modal: false,
    minHeight: 400
  });
});

let legendBtn = document.getElementById("updateLegend");
let legendImg = document.getElementById("legend");
let legendSrc = "http://152.7.99.155:8080/geoserver/hera/wms?&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER="
legendImg.src = legendSrc + "hera:ncsc_isa_lyr";

legendBtn.onclick = function () {
  let currentLyrList = map.getLayerGroup().getLayersArray();
  let firstLyr = currentLyrList[currentLyrList.length - 1].getSource().params_.LAYERS;
  let lyrVis = map.getLayerGroup().getLayers().item(1).getLayers().item(3).state_['visible'];
  if (!lyrVis) {
    firstLyr = currentLyrList[currentLyrList.length - 1 - 1].getSource().params_.LAYERS;
    legendImg.src = legendSrc + firstLyr;
  } else {
    legendImg.src = legendSrc + firstLyr;
  }
  console.log("legend");
  // console.log(firstLyr);
};


var listItems = document.querySelectorAll('li.layer');
for (let i = 0; i < listItems.length - 1; i++) {
  var info = document.createElement('i');
  info.className = "fa fa-info-circle";
  info.setAttribute('aria-hidden', "true");
  info.setAttribute('id', 'info-' + i.toString());
  listItems[i].appendChild(info);
  // alert(listItems[i].textContent);
}


// var infoBox = document.getElementById('info');

// infoBox.onclick = function () {
//   console.log('info clicked')
// };

// ol.control.LayerSwitcher.prototype.renderLayer_ = function () {
//   // var lyrLogos = ['hi', 'test', 'label', 'hi', 'test', 'label', 'hi', 'test', 'label'];

//   // var lyrTitle = lyrLogos[idx] + '&nbsp' + lyr.get('title');
//   // var getT = lyr.get('title')
//   // console.log(getT);

//   var listItems = document.querySelectorAll('li.layer');
//   for (let i = 0; i < listItems.length - 1; i++) {
//     var info = document.createElement('i');
//     info.className = "fa fa-info-circle";
//     info.setAttribute('aria-hidden', "true");
//     info.setAttribute('id', 'info-' + i.toString());
//     listItems[i].appendChild(info);
//     // alert(listItems[i].textContent);
//   }

//   // ListeningStateChangedEvent.appendChild(info);

// }

/* <i class="fa fa-info-circle" aria-hidden="true" id="info"></i> */

// ol.control.LayerSwitcher.renderPanel(map, toc);