// Openlayers Cursor Moving Interaction of the Map
let interactionSelectPointerMove = new ol.interaction.Select({
  condition: ol.events.condition.pointerMove,
  style: new ol.style.Style({
    // fill: new ol.style.Fill({
    //   color: 'grey'
    // }),
    stroke: new ol.style.Stroke({
      color: "grey",
      width: 2
    })
  })
});

// Openlayers Select Interaction
let interactionSelect = new ol.interaction.Select({});

let container = document.getElementById('popup');
let content = document.getElementById('popup-content');
let closer = document.getElementById('popup-closer');

// Popup window of the selected polygon(s)
let overlay = new ol.Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250
  }
});

// click close button to close the popup window
closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

// Function: Create WMS source
// 1st param: layer of interest (neccessary)
// 2nd param: conditions to the view (optional)
// 3rd param: cql filter of the layer (optional)
let WMSsource_oasis = function (lyr, params = null, cqlFilter = null) {
  let source = new ol.source.TileWMS({
    url: 'http://hera1.oasis.unc.edu:8080/geoserver/hera/wms',
    projection: 'EPSG:4269',
    params: {
      "VERSION": "1.3.0",
      'LAYERS': lyr,
      // 'bbox': [-84.3664321899414,31.9729919433594,-75.3555068969727,36.6110992431641],
      'TILED': true,
      'FORMAT': 'image/png',
      'viewparams': params,
      'CQL_FILTER': cqlFilter,
    },
    serverType: 'geoserver',
    crossOrigin: 'anonymous', // Enable CQL filter on WMS
    // Countries have transparency, so do not fade tiles:
    transition: 0,
  });

  return source;
};

let basemap = new ol.layer.Tile({
  source: new ol.source.OSM()
});

// Function: create WFS source of the state boudary layer
let boundarySource = function (state) {
  return new ol.source.Vector({
    renderMode: 'image', // Vector layers are rendered as images. Better performance. Default is 'vector'.
    format: new ol.format.GeoJSON(),
    url: function (extent) {
      return 'http://hera1.oasis.unc.edu:8080/geoserver/hera/wfs?service=WFS' +
        '&version=1.0.0&request=GetFeature' +
        '&typeName=hera:tl_' + state + '_county' +
        '&outputFormat=application/json&srsname=EPSG:4326'
      // '&CQL_FILTER=stusps=%27NC%27'
    },
    strategy: ol.loadingstrategy.bbox,
  });
};

let view = new ol.View({
  center: ol.proj.fromLonLat([-79.5, 35.1]), // projection: 'EPSG:3857',
  zoom: 8

});


let map = new ol.Map({
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
          // combine: true,
          visible: true,
          layers: [
            basemap,

            new ol.layer.Tile({
              source: WMSsource_oasis('hera:tl_2019_us_state')
            }),

            new ol.layer.Vector({
              source: boundarySource('nc'),
              style: new ol.style.Style({
                fill: new ol.style.Fill({
                  color: [255, 255, 255, 0],
                }),
                stroke: new ol.style.Stroke({
                  color: '#867E77',
                  width: 0.1
                })
              }),
            }),

          ]
        }),
      ]
    }),

    new ol.layer.Group({
      title: "Layers",
      fold: 'open',
      layers: [

        new ol.layer.Tile({
          title: "2017 population",
          visible: false,
          source: WMSsource_oasis('hera:tl_nc_population_lyr')
        }),

        new ol.layer.Tile({
          title: "Winter Weather ",
          visible: false,
          source: WMSsource_oasis('hera:ww_sql', "state:nc")
        }),

        new ol.layer.Tile({
          // title: "NC Floods ",
          title: "Flooding ",
          visible: false,
          source: WMSsource_oasis('hera:floods_sql', "state:nc")
          // layers: createGroupedLyrs('hera:nc_floods_sql', "minYear:2010-01-01;maxYear:2018-12-31;sublist:'FA'\\,'CF'")
        }),

        new ol.layer.Tile({
          title: "High Wind ",
          visible: true,
          source: WMSsource_oasis('hera:hw_sql', "state:nc")
        }),

        new ol.layer.Tile({
          title: "Heat ",
          visible: false,
          source: WMSsource_oasis('hera:heats_sql', "state:nc")
        }),

        new ol.layer.Tile({
          title: "Hail ",
          visible: false,
          source: WMSsource_oasis('hera:hl_sql', "state:nc")
        }),
        
        new ol.layer.Tile({
          title: "Tornado ",
          visible: false,
          source: WMSsource_oasis('hera:tornado_sql', "state:nc")
        }),

        new ol.layer.Tile({
          title: "Hurricane ",
          visible: false,
          source: WMSsource_oasis('hera:hu_sql', "state:nc")
        }),

      ]
    }),


  ],
  overlays: [overlay],
  view: view

});

// adjust the base map color
basemap.on('postcompose', function (e) {
  greyscale(e.context);
  // document.querySelector('canvas').style.filter = "invert(90%)";
});


// grey scale function for the base map
function greyscale(context) {
  var width = context.canvas.width;
  var height = context.canvas.height;
  var inputData = context.getImageData(0, 0, width, height).data;
  // console.log('inputData.length: ' + inputData.length);

  var canvas = document.getElementsByClassName('ol-unselectable')[0];
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = "rgba(0, 0, 0, 0)"
  var myImageData = ctx.createImageData(width, height);
  var d = myImageData.data;

  for (i = 0; i < inputData.length; i += 4) {

    var r = inputData[i];
    var g = inputData[i + 1];
    var b = inputData[i + 2];
    // CIE luminance for the RGB
    var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    d[i + 0] = v; // Red
    d[i + 1] = v; // Green
    d[i + 2] = v; // Blue
    d[i + 3] = 255; // Alpha

  }
  ctx.putImageData(myImageData, 0, 0);

}

// If there is any feature at the event pixel (where the mouse points at), the pointer will change to the 'hand' symbol
map.on('pointermove', function (e) {
  if (e.dragging) {
    return;
  }
  var pixel = map.getEventPixel(e.originalEvent);
  var hit = map.hasFeatureAtPixel(pixel);

  e.map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});


let createContent = function (lyr, selected) {
  let counties = '';
  let total = 0;
  let flength = Object.keys(selected).length;
  let probaArray = [];
  let probability = 0;
  let startyear = parseInt($('.slider-time').html());
  let endyear = parseInt($('.slider-time2').html());


  Object.keys(selected).forEach(function (key) {
    switch (lyr.split(':')[1]) {
      case 'ncsc_population_lyr':
        total += selected[key]['population'];
        break;
      case 'ncsc_isa_lyr':
        total += selected[key]['percent_isa'];
        break;
      default:
        total += selected[key]['count'];
    }

    counties += selected[key]['county'] + ', ';

    Object.keys(selected[key]).filter(i =>
      endyear >= parseInt(i.slice(1)) && parseInt(i.slice(1)) >= startyear && selected[key][i] != null
    ).forEach(i => {
      if (!probaArray.includes(i)) {
        probaArray.push(i)
      }
    });
    probability = (probaArray.length / (endyear - startyear + 1) * 100).toFixed(2) + '%';
    averageCount = (total / (endyear - startyear + 1)).toFixed(2);

  })
  counties = counties.slice(0, -2);
  // console.log(counties);
  content.innerHTML = '<p class="popup-field">Selected County: </p><p class="popup-value">' + counties + '</p><br><p class="popup-field">Year: </p><p class="popup-value">' + startyear + '-' + endyear + 
  '</p><br><p class="popup-field">Total count: </p><p class="popup-value">' + total + '</p><br><p class="popup-field">Probability per year: </p><p class="popup-value">' + probability + 
  '</p><br><p class="popup-field">Frequency per year: </p><p class="popup-value">' + averageCount + '</p>';
};


let shiftPressed = false;
$(document).keydown(function (event) {
  shiftPressed = event.keyCode == 16;
});
$(document).keyup(function (event) {
  shiftPressed = false;
});

var selected = {};

let attributeDataUrl = 'http://hera1.oasis.unc.edu:8080/geoserver/hera/wfs?service=WFS' +
  '&version=1.0.0&request=GetFeature' + '&outputFormat=application/json'

map.on('singleclick', function (evt) {
  let coord = evt.coordinate;
  // console.log(coord);
  let resolution = map.getView().getResolution();
  let projection = map.getView().getProjection();
  let lyr;

  let wmslayerSource = map.forEachLayerAtPixel(evt.pixel,
    function (layer) {
      // return only layers of ol.source.TileWMS
      var source = layer.getSource();
      if (source instanceof ol.source.TileWMS) {
        lyr = source.params_.LAYERS;
        // console.log(source);
        return source;
      }
    });
  if (wmslayerSource && wmslayerSource.params_.LAYERS != 'hera:tl_2019_us_state') {
    var url = wmslayerSource.getGetFeatureInfoUrl(
      coord, resolution, projection, {
        'INFO_FORMAT': 'application/json',
      }
    );
    // console.log("shiftpressed?: ", shiftPressed);

    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        let featureid = json["features"][0]['id'];
        let properties = json["features"][0]["properties"];
        if (!shiftPressed) {
          selected = {};
          selected[featureid] = properties;
        } else if (featureid in selected) {
          delete selected[featureid];
        } else {
          selected[featureid] = properties;
        };

        // console.log(Object.keys(selected).length);

        createContent(lyr, selected);

        // Load the data of the selected county to the datatable
        let countynameArray = Object.keys(selected).map(k => selected[k]['county']);
        // Show selected county names as the subtitle of the table2
        // document.getElementById('selectedCountyName').innerHTML = countynameArray.join(',');

        let countynames = '(%27' + countynameArray.join('%27,%27') + '%27)'
        let lyrtable = 'tl_' + statepicker.value + '_' + lyr.replace('hera:', '').split('_')[0] + '_lyr';
        let datatb = $('#attributeTb2').DataTable();

        // Get the current params on the map
        let minYear = form.querySelector('.slider-time').innerHTML + '-01-01';
        let maxYear = form.querySelector('.slider-time2').innerHTML + '-12-31';
        let categories = [];

        let params = 'BETWEEN ' + minYear + ' AND ' + maxYear;
        // console.log(lyr.replace('hera:', '').split('_')[0], '_here');

        switch (lyr.replace('hera:', '').split('_')[0]) {
          case 'hw':
          case 'hl':
          case 'tornado':
            params = 'AND observ_time ' + params;
            // console.log(params);
            break;
          case 'hu':
            params = 'AND date ' + params;
            break;
          default:
            params = 'AND issued ' + params;
            // console.log(params, ' test');
        }

        // form.querySelectorAll('input[type="checkbox"]:checked').forEach(i => categories.push("'" + i.name + "'"));
        form.querySelectorAll('input[type="checkbox"]:checked:not(#checkall)').forEach(i => categories.push("%27" + i.name + "%27"));
        // let params = "minYear:" + minYear + ";maxYear:" + maxYear + ";sublist:" + "'CF'\\,'FA'";
        if (categories.length > 0) {
          switch (lyr.replace('hera:', '').split('_')[0]) {
            case 'hw':
              params += "AND wspeed_rating_mph IN (" + categories.join(",") + ")";
              break;
            case 'tornado':
              params += "AND max_category IN (" + categories.join(",") + ")";
              break;
            default:
              params += "AND phenom_subgroup IN (" + categories.join(",") + ")";
          }
        }

        datatb.ajax.url(attributeDataUrl + '&typeName=' + lyrtable + '&CQL_FILTER=county IN ' + countynames + params).load();
        
        let newlyrname = lyr.replace('hera:', '').split('_')[0];
        let newminYear = form.querySelector('.slider-time').innerHTML;
        let newmaxYear = form.querySelector('.slider-time2').innerHTML;
        let newcountynames = countynames.replaceAll('(', '').replaceAll(')', '').replaceAll(",", "%5C,").replaceAll(' ', '%20');
        
        let categoriesString = categories.length == 0? lyrSubgroup[newlyrname]: categories.join("%5C,");
        // console.log(categoriesString);

        ajaxcall(statepicker.value, newlyrname, lyrSubgroup[newlyrname], categoriesString, newminYear, newmaxYear, newcountynames).then(function (layerjson) {
            $('#attributeTb3 table').remove();
            var dummy = [];
            // console.log(layerjson)
          
            layerjson.features.forEach(
              function (i) {
                var yearlist = [];
                yearlist.push(i.properties['year_issued'], i.properties['jan'], i.properties['feb'], i.properties['mar'], i.properties['apr'], i.properties['may'],
                  i.properties['jun'], i.properties['jul'], i.properties['aug'], i.properties['sep'], i.properties['oct'], i.properties['nov'], i.properties['dec']);
                dummy.push(yearlist);
              });
            // console.log(dummy);
            createhighlight(dummy);
          });

        document.getElementById("tab-3").innerHTML = "Highlight Table: <i>(" + countynameArray.join(',') + ") " + newminYear + "-" + newmaxYear + '</i>';

      });
    overlay.setPosition(coord);
  } else {
    overlay.setPosition(undefined);
    selected.length = 0;
  }

});

let recreateDataTable = function (lyr) {
  let dataColumns;
  $('#attributeTb2').DataTable().destroy();
  $('#attributeTb2').empty();

  let lyrtable = 'tl_' + statepicker.value + '_' + lyr.replace('hera:', '').split('_')[0] + '_lyr';
  switch (lyr.replace('hera:', '').split('_')[0]) {
    case 'tornado':
      dataColumns = [{
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
          "title": "Date",
          data: "properties.observ_time",
          render: function(d){
            return moment(d).format('YYYY-MM-DD');
            },
          "class": "center"
        },
        {
          "title": "Time",
          data: "properties.observ_time",
          render: function(d){
            return moment(d).format('hh:mm A');
            },
          "class": "center"
        },
        {
          "title": "Max Category",
          data: "properties.max_category",
          "class": "center"
        },
        {
          "title": "Path Length (mi)",
          data: "properties.pathlength_mi",
          "class": "center"
        },
        {
          "title": "Path Width (ya)",
          data: "properties.pathwidth_ya",
          "class": "center"
        },
        {
          "title": "Injuries",
          data: "properties.injuries",
          "class": "center"
        },
        {
          "title": "Fatalities",
          data: "properties.fatalities",
          "class": "center"
        },
        {
          "title": "Monetary Loss",
          data: "properties.monetary_loss",
          "class": "center"
        },
      ];
      break;
    case 'hw':
      dataColumns = [{
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
          "title": "Date",
          data: "properties.observ_time",
          render: function(d){
            return moment(d).format('YYYY-MM-DD');
            },
          "class": "center"
        },
        {
          "title": "Time",
          data: "properties.observ_time",
          render: function(d){
            return moment(d).format('hh:mm A');
            },
          "class": "center"
        },
        {
          "title": "Wind Speed (knots)",
          data: "properties.wspeed_knots",
          "class": "center"
        },
        {
          "title": "Wind Speed (mph)",
          data: "properties.wspeed_mph",
          "class": "center"
        },
        {
          "title": "Wind Speed (ms)",
          data: "properties.wspeed_ms",
          "class": "center"
        },
        {
          "title": "Sub Group",
          data: "properties.wspeed_rating_mph",
          "class": "center"
        },
      ];
      break;
    case 'hl':
      dataColumns = [{
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
          "title": "Date",
          data: "properties.observ_time",
          render: function(d){
            return moment(d).format('YYYY-MM-DD');
            },
          "class": "center"
        },
        {
          "title": "Time",
          data: "properties.observ_time",
          render: function(d){
            return moment(d).format('hh:mm A');
            },
          "class": "center"
        },
        {
          "title": "Diameter (inch)",
          data: "properties.diameter_inch",
          "class": "center"
        },
        {
          "title": "Diameter (cm)",
          data: "properties.diameter_cm",
          "class": "center"
        },
        {
          "title": "Diameter (mm)",
          data: "properties.diameter_mm",
          "class": "center"
        },
      ];
      break;
    case 'hu':
      dataColumns = [{
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
          "title": "Date",
          data: "properties.date",
          render: function(d){
            return moment(d).format('YYYY-MM-DD');
            },
          "class": "center"
        },
        {
          "title": "Hurricane Name",
          data: "properties.hurricane_name",
          "class": "center"
        },
        {
          "title": "Time",
          data: "properties.time",
          "class": "center"
        },
        {
          "title": "Sub Group",
          data: "properties.phenom_subgroup",
          "class": "center"
        },
        {
          "title": "Max Wind",
          data: "properties.max_wind",
          "class": "center"
        },
      ];
      break;
    default:
      dataColumns = [{
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
          "title": "Date",
          data: "properties.issued",
          render: function(d){
            return moment(d).format('YYYY-MM-DD');
            },
          "class": "center"
        },
        {
          "title": "Time",
          data: "properties.issued",
          render: function(d){
            return moment(d).format('hh:mm A');
            },
          "class": "center"
        },
        {
          "title": "Sub Group",
          data: "properties.description",
          "class": "center"
        },
      ]
  }

  createTabTable('#attributeTb2', lyrtable, null, null, dataColumns)

};


document.getElementById("tab-1").innerHTML = "Counts by County: <i>High Wind 1998-2019</i>";
document.getElementById("tab-2").innerHTML = "Data";
document.getElementById("tab-3").innerHTML = "Highlight table: <i>High Wind (NC) 1998-2019</i>";


// Create attribute table using Jquery library DataTable
// function createTabTable(attributeTableID, layerID, properties) {
function createTabTable(attributeTableID, layerID, countyname, params, properties) {
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
      "url": attributeDataUrl +
        '&typeName=' + layerID +
        '&CQL_FILTER=county IN (%27' + countyname + '%27)' +
        '&viewparams=' + params,
      // '&CQL_FILTER=county IN (%27' + countyname + '%27)' + 'AND wspeed_rating_mph IN (%27'+ sub + '%27)' + 'AND observ_time BETWEEN' + starttime +  'AND' + endtime,
      // county IN ('Hyde') AND wspeed_rating_mph IN ('Gale Force', 'Hurricane Force') AND observ_time BETWEEN '2006-01-01T00:00:00' AND '2010-12-31T00:00:00'
      "dataSrc": "features"
    },
    "columns": properties,
  });

  return table;
};


$('#attributeTb').DataTable({
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
    "url": attributeDataUrl + '&typeName=' + 'hera:hw_sql',
    "dataSrc": "features"
  },
  "columns": [{
      "title": "County",
      data: "properties.county",
      "class": "center"
    },
    {
      "title": "Count",
      data: "properties.count",
      "class": "center"
    }
  ]

});


$('#attributeTb2').DataTable({
  "autoWidth": 'true',
  responsive: 'true',
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
    //   // Delete the limitation: maxFeatures=50
    //   // Solved from Stackoverflow questions no.48147970
    "url": attributeDataUrl + '&typeName=' + 'hera:tl_nc_hw_lyr' +
      '&CQL_FILTER=county=%27' + null + '%27',
    // '&CQL_FILTER=county IN (%27' + 'Wake' + '%27, %27' + 'Durham' + '%27)',
    "dataSrc": "features"
  },
  "columns": [{
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
      "title": "Date",
      data: "properties.observ_time", 
        render: function(d){
          return moment(d).format('YYYY-MM-DD');
          },
      "class": "center"
    },
    {
      "title": "Wind Speed (knots)",
      data: "properties.wspeed_knots",
      "class": "center"
    },
    {
      "title": "Wind Speed (mph)",
      data: "properties.wspeed_mph",
      "class": "center"
    },
    {
      "title": "Wind Speed (ms)",
      data: "properties.wspeed_ms",
      "class": "center"
    },
    {
      "title": "Sub Group",
      data: "properties.wspeed_rating_mph",
      "class": "center"
    },
  ]
})


$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  $.fn.dataTable.tables({
    visible: true,
    api: true
  }).columns.adjust();
});


let lyrSubgroup = {
  'floods':'phenom_subgroup',
  'heats':'phenom_subgroup',
  'ww':'phenom_subgroup',
  'hu':'phenom_subgroup',
  'hw':'wspeed_rating_mph',
  'tornado':'max_category',
  'hl':'diameter_inch'
}


var jsonSource = 'hera:highlightTable_sql';
// Create mock-up highlight table as tableau
function ajaxcall(state, layer, subheader ,sublist, minyear='1952', maxyear='2021', county='county') {
  // var json;
  // var layerjson;
  let lyr = layer == 'hl'? 'hails': layer;
  let highlighttb_url = 'http://hera1.oasis.unc.edu:8080/geoserver/hera/ows?service=WFS&version=1.0.0' +
  '&request=GetFeature' + '&outputFormat=application/json' + 
  '&typeName=hera:highlightTable_sql' +
  '&format_options=callback:getJson' +
  '&viewparams=' + 'state:'+ state + ';lyr:'+ lyr+ ";subheader:" + subheader +";sublist:" + sublist
  + ";minYear:"+ minyear+ ";maxYear:"+ maxyear + ";county:"+ county;
  
  // console.log(highlighttb_url);
  return $.ajax({
    // async: false, // set acync to false is BAD for browser performance!!
    url: highlighttb_url,
    dataType: 'json',
    jsonpCallback: 'getJson',    
  });
};


ajaxcall('nc', 'hw', lyrSubgroup['hw'] , lyrSubgroup['hw']).then(function (layerjson) {
  var dummy = [];

  layerjson.features.forEach(
    function (i) {
      var yearlist = [];
      yearlist.push(i.properties['year_issued'], i.properties['jan'], i.properties['feb'], i.properties['mar'], i.properties['apr'], i.properties['may'],
        i.properties['jun'], i.properties['jul'], i.properties['aug'], i.properties['sep'], i.properties['oct'], i.properties['nov'], i.properties['dec']);
      dummy.push(yearlist);
    });
  // console.log(dummy);
  createhighlight(dummy);
});


function createhighlight(dummy) {
  var rowLabel = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // var rowLabel = ['', 'J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];


  // Using RBG
  var colors = [{
    // rgb(249 251 250 / 63%)
    // r: 249,
    // g: 251,
    // b: 250,
    // a: 63%
    r: 255,
    g: 255,
    b: 255,
  }, {
    r: 59,
    g: 115,
    b: 143
  // }, {
  //   r: 59,
  //   g: 115,
  //   b: 143
  // }, {
  //   r: 59,
  //   g: 115,
  //   b: 143
  // }, {
  //   r: 59,
  //   g: 115,
  //   b: 143
  // }, {
  //   r: 59,
  //   g: 115,
  //   b: 143
  // }, {
  //   r: 59,
  //   g: 115,
  //   b: 143
  // }, {
  //   r: 59,
  //   g: 115,
  //   b: 143
  // }, {
  //   r: 59,
  //   g: 115,
  //   b: 143
  // }, {
  //   r: 59,
  //   g: 115,
  //   b: 143
  // }, {
  //   r: 59,
  //   g: 115,
  //   b: 143
  // }, {
  //   r: 59,
  //   g: 115,
  //   b: 143
  // }, {
  //   r: 59,
  //   g: 115,
  //   b: 143
  }];

  const tooltip = d3.select("#attributeTb3")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "5px");

  const mouseover = function(event,d) {
    tooltip
      .style("opacity", 1)
    d3.select(this)
    .style("stroke", "black")
    .style("opacity", 1)
  };
  const mousemove = function(event,d) {
    // console.log('event.x: ', event.x);
    // console.log('event.y: ', event.y);
    tooltip
      .html("The exact value of<br>this cell is: " + d)
      // .html("The left of<br>this cell is: " + event.x + "<br>and the top is: " + event.y)
      .style("left", (event.x) + "px")
      .style("top", (event.y)/2 + "px")
  };
  const mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
  };



  let alpha = d3.scaleLinear().domain([0, 100]).range([0, 1]);

  let d3table = d3.select("#attributeTb3").append("table").attr("width", '100%');

  thead = d3table.append("thead");
  tbody = d3table.append("tbody")


  thead.append("tr")
    .selectAll("th")
    .data(rowLabel)
    .enter()
    .append("th")
    .attr("class", "highlight-header")
    .text(function (d) {
      return d;
    })

  var rows = tbody.selectAll("tr")
    .data(dummy)
    .enter()
    .append("tr");

  var cells = rows.selectAll("td")
    .data(function (d, i) {
      // d.shift();
      //d.unshift(rowLabel[i]);
      return d;
    })
    .enter()
    .append("td")
    .attr("class", "highlight-td")
    .style('background-color', function (d, i) {
      if (i == 0) {
        return 'rgba(' + colors[i].r + ',' + colors[i].g + ',' + colors[i].b + ',' + alpha(d) + ')';
      } else {
        return 'rgba(' + colors[1].r + ',' + colors[1].g + ',' + colors[1].b + ',' + alpha(d) + ')';
      }
    })
    .text(function (d) {
      return d;
    })
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
    ;
}


// $(function () {
//   $("#dialog").dialog({
//     autoOpen: false,
//     modal: false,
//     minHeight: 300,
//     // width: 'auto',
//     minWidth: 180,
//     close: function (e, ui) {
//       $('#toggle').bootstrapToggle('off');
//       $(this).dialog("close");
//     },
//     // resizable: true
//   });
// });


let legendImg = document.getElementById("legend");
let legendSrc = "http://hera1.oasis.unc.edu:8080/geoserver/hera/wms?&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER="
let firstLyr = 'hera:hw_sql';
legendImg.src = legendSrc + firstLyr;

updateLegend = function (l) {
  firstLyr = l.getSource().params_.LAYERS;
  legendImg.src = legendSrc + firstLyr;
};

function toggleLayerInfo() {
  let layerinfo = document.getElementById('layerInfoDiv');
  let filterDiv = document.getElementById('filterDiv');
  if (!filterDiv.contains(layerinfo)){
    filterDiv.appendChild(layerinfo);
  } else{
    filterDiv.remove(layerinfo);
  }
}

$('.slider-time').html('1989'); // the years of time-slider when first loading, of high wind layer
$('.slider-time2').html('2018');

var dt_from = $('.slider-time').text() + '/01/01';
var dt_to = $('.slider-time2').text() + '/12/31';
var min_val = Date.parse(dt_from) / 1000;
var max_val = Date.parse(dt_to) / 1000;

function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

function formatDT(__dt) {
  var year = __dt.getFullYear();
  // var month = zeroPad(__dt.getMonth() + 1, 2);
  // var date = zeroPad(__dt.getDate(), 2);

  // return year + '/' + month + '/' + date;
  return year;
};

$("#slider-range").slider({
  range: true,
  min: min_val,
  max: max_val,
  // step: 10,
  values: [min_val, max_val],
  slide: function (e, ui) {
    var dt_cur_from = new Date(ui.values[0] * 1000); //.format("yyyy-mm-dd hh:ii:ss");
    $('.slider-time').html(formatDT(dt_cur_from));

    var dt_cur_to = new Date(ui.values[1] * 1000); //.format("yyyy-mm-dd hh:ii:ss");                
    $('.slider-time2').html(formatDT(dt_cur_to));
  },
});


let updateMapBtn = document.getElementById('updateMap');
let targetLayer = document.getElementById('target-layer');
let subCategory = document.getElementById('subcategory');
let check = document.getElementById('checkboxes');
let form = document.getElementById('filterForm');

document.addEventListener('mouseup', function (e) {
  if (!check.contains(e.target)) {
    check.style.display = 'none';
  }
});

// From the stackoverflow post: 
// function refreshSource(source, params) {
function refreshSource(lyrname, params, l) {
  let newurl = 'http://152.7.99.155:8080/geoserver/hera/wfs?service=WFS' +
    '&version=1.0.0&request=GetFeature' +
    '&typeName=' + lyrname +
    '&outputFormat=application/json&srsname=EPSG:4326' +
    '&bbox=-84.321821,31.995954,-75.400119,36.588137' +
    '&viewparams=' + params;

  let newsource = new ol.source.Vector({
    renderMode: 'image',
    format: new ol.format.GeoJSON(),
    url: function () {
      return newurl;
    },
    strategy: ol.loadingstrategy.bbox,
  });

  l.setSource(newsource);
}

updateMapBtn.onclick = function () {
  overlay.setPosition(undefined);
  let selectedState = form.querySelector('#state-picker').value;
  let selectedLayer = form.querySelector('#target-layer').value;
  let minYear = form.querySelector('.slider-time').innerHTML.replace(/\//g, "-");
  let maxYear = form.querySelector('.slider-time2').innerHTML.replace(/\//g, "-");
  let categories = [];
  let params = "state:" + selectedState + ";";


  form.querySelectorAll('input[type="checkbox"]:checked:not(#checkall)').forEach(i => categories.push("'" + i.name + "'"));
  // let params = "minYear:" + minYear + ";maxYear:" + maxYear + ";sublist:" + "'CF'\\,'FA'";
  if (categories.length > 0) {
    params += "minYear:" + minYear + ";maxYear:" + maxYear + ";sublist:" + categories.join("\\,");
  } else {
    params += "minYear:" + minYear + ";maxYear:" + maxYear;
  }
  // let params = "sublist:" + categories.join("\\,");
  // console.log(params);

  let lyrs = map.getLayerGroup().getLayers().array_.filter(e => {
    return e.values_.title == 'Layers'
  })[0];
  let lyrGroups = lyrs.getLayers().getArray();
  let selectedLyr = lyrGroups.filter(l => l.get('title') == selectedLayer);
  // console.log(selectedLyr);

  // Update WMS layer
  selectedLyr[0].getLayersArray()[0].getSource().updateParams({
    'viewparams': params
  });

  // Update WFS layer
  // let wfsl = selectedLyr[0].getLayersArray()[1];
  // refreshSource(lyrname, params, wfsl);

  // Update Count table
  let countTbSrc = selectedLyr[0].getLayersArray()[0].getSource().params_.LAYERS;
  let countTb = $('#attributeTb').DataTable();
  // console.log(params);
  // console.log(params.replaceAll('\\', '%5C'));
  params = params.replaceAll('\\', '%5C');
  params = params.replaceAll(' ', '%20');
  countTb.ajax.url(attributeDataUrl + '&typeName=' + countTbSrc + '&viewparams=' + params).load();

  document.getElementById("tab-1").innerHTML = "Counts by County: <i>" + selectedLayer + " " + minYear + "-" + maxYear + '</i>';
  
  // recreateDataTable(countTbSrc);

  let lyrid = countTbSrc.replace('hera:', '').split('_')[0];
  let categoriesString = categories.length == 0? lyrSubgroup[lyrid]: categories.join("%5C,");
  categoriesString = categoriesString.replaceAll('\\', '%5C').replaceAll(' ', '%20').replaceAll("'", '%27');
  
  ajaxcall(selectedState, lyrid, lyrSubgroup[lyrid], categoriesString, minYear, maxYear).then(function (layerjson) {
      $('#attributeTb3 table').remove();
      var dummy = [];
      console.log(layerjson)
    
      layerjson.features.forEach(
        function (i) {
          var yearlist = [];
          yearlist.push(i.properties['year_issued'], i.properties['jan'], i.properties['feb'], i.properties['mar'], i.properties['apr'], i.properties['may'],
            i.properties['jun'], i.properties['jul'], i.properties['aug'], i.properties['sep'], i.properties['oct'], i.properties['nov'], i.properties['dec']);
          dummy.push(yearlist);
        });
      // console.log(dummy);
      createhighlight(dummy);
    });

  document.getElementById("tab-3").innerHTML = "Highlight Table: <i>" + selectedLayer + " ("+ selectedState.toUpperCase() +") " + minYear + "-" + maxYear + '</i>';
  showSelectedTypes();
}

targetLayer.onchange = function () {
  let selectedLayer = form.querySelector('#target-layer').value;

  let lyrs = map.getLayerGroup().getLayers().array_.filter(e => {
    return e.values_.title == 'Layers'
  })[0];
  let lyrGroups = lyrs.getLayers().getArray();
  let selectedLyr = lyrGroups.filter(l => l.get('title') == selectedLayer);
  // console.log(selectedLyr);
  let nonselectedLyr = lyrGroups.filter(l => l.get('title') != selectedLayer);

  nonselectedLyr.forEach(l => l.setVisible(false));
  selectedLyr[0].getLayersArray()[0].setVisible(true);
  updateLegend(selectedLyr[0]);


  // get the initial min year and max years from the layer, and assign to the time slider
  let selectedState = form.querySelector('#state-picker').value;
  let featureInfoUrl = selectedLyr[0].getLayersArray()[0].getSource().getGetFeatureInfoUrl(
    ol.proj.transform(viewObject[selectedState], 'EPSG:4326', 'EPSG:3857'),
    map.getView().getResolution(),
    map.getView().getProjection(), {
      'INFO_FORMAT': 'application/json',
      'propertyName': 'minyear,maxyear',
    }
  );

  fetch(featureInfoUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      let currentf = json.features[0];
      let currentp = currentf.properties;
      let miny = currentp.minyear;
      let maxy = currentp.maxyear;

      $('.slider-time').html(miny);
      $('.slider-time2').html(maxy);

      $('#slider-range').slider({
        min: Date.parse(miny + '/01/01') / 1000,
        max: Date.parse(maxy + '/12/31') / 1000,
        values: [Date.parse(miny + '/01/01') / 1000, Date.parse(maxy + '/12/31') / 1000]
      });
      document.getElementById("tab-1").innerHTML = "Counts by County: <i>" + selectedLayer + " " + miny + "-" + maxy + '</i>';
      document.getElementById("tab-3").innerHTML = "Highlight Table: <i>" + selectedLayer + " ("+ selectedState.toUpperCase() +") " + miny + "-" + maxy + '</i>';

    });


  // console.log(this.value);
  check.innerHTML = '';
  // subCategory.options.length = 0;
  switch (this.value) {
    case 'Flooding ':
      sub = {
        'FA': 'Areal Flood',
        'FL': 'River Flood',
        'FF': 'Flash Flood',
        'CF': 'Coastal Flood'
      };

      break;
    case 'Winter Weather ':
      sub = {
        'BZ': 'Blizzard',
        'WC': 'Wind Chill',
        'WW': 'Winter Weather',
        'HS': 'Heavy Snow',
        'SN': 'Snow',
        'ZR': 'Freezing Rain',
        'IS': 'Ice Snow',
        'WS': 'Winter Storm'
      };

      break;
    case 'Heat ':
    case 'Hail ':
      sub = {};

      break;
    case 'High Wind ':
      sub = {
        'Gale Force': 'Gale Force',
        'Storm Force': 'Storm Force',
        'Hurricane Force': 'Hurricane Force'
      };

      break;
    case 'Tornado ':
      sub = {
        'F-0': 'F-0',
        'F-1': 'F-1',
        'F-2': 'F-2',
        'F-3': 'F-3',
        'F-4': 'F-4',
        'EF-0': 'EF-0',
        'EF-1': 'EF-1',
        'EF-2': 'EF-2',
        'EF-3': 'EF-3',
        'EF-4': 'EF-4',
      };

      case 'Hurricane ':
        sub = {
          'HU': 'Hurricane',
          'TS': 'Tropical Storm',
        };

      break;
  }

  createSelectAllbtn(Object.values(sub));

  // Loop through the subgroup keys, create and append checkboxes + label to the subgroup drop down menu 
  for (s of Object.keys(sub)) {
    var l = document.createElement('label');
    var input = document.createElement('input');
    input.value = s;
    input.id = s;
    input.name = s;
    input.type = 'checkbox';
    input.setAttribute('checked', true);
    l.setAttribute('for', s);
    l.appendChild(input);
    l.innerHTML = l.innerHTML + sub[s];

    check.appendChild(l);
    
  };

  // reload data in Count Table if layer switched
  let countTbSrc = selectedLyr[0].getLayersArray()[0].getSource().params_.LAYERS;
  let countTb = $('#attributeTb').DataTable();
  countTb.ajax.url(attributeDataUrl + '&typeName=' + countTbSrc + '&viewparams=state:' + selectedState).load();

  recreateDataTable(countTbSrc);

  // change highlight table params
  // $('#attributeTb3 tr').remove();
  lyrid = countTbSrc.replace('hera:', '').split('_')[0];
  list = '';
  for (s of Object.keys(sub)){
    list += '%27' + s + '%27%5C,' 
  };
  list = list.slice(0, -4);
  
  ajaxcall(selectedState, lyrid, lyrSubgroup[lyrid], lyrSubgroup[lyrid]).then(function (layerjson) {
    $('#attributeTb3 table').remove();
    var dummy = [];
    // console.log(layerjson)
  
    layerjson.features.forEach(
      function (i) {
        var yearlist = [];
        yearlist.push(i.properties['year_issued'], i.properties['jan'], i.properties['feb'], i.properties['mar'], i.properties['apr'], i.properties['may'],
          i.properties['jun'], i.properties['jul'], i.properties['aug'], i.properties['sep'], i.properties['oct'], i.properties['nov'], i.properties['dec']);
        dummy.push(yearlist);
      });
    console.log(dummy);
    createhighlight(dummy);
  });

  currentInnertext = document.getElementById('subcategory').selectedOptions[0].innerText = 'All Types';

  generateInfo(this.value);
  hideStates(this.value);
}

function hideStates(currentLyr){
  if (currentLyr == 'Hurricane '){
    let otherStates = form.querySelectorAll('#state-picker > option:not([value="nc"]):not([value="sc"])');
    otherStates.forEach(s => s.style.display = "none");
    // window.alert("The hurricane data for the states other than NC/SC are still in progress and not available at this time. We'll upload the layers once it's finished. Thank you for your patience. ");
  } else{
    let allStates = form.querySelectorAll('#state-picker > option');
    allStates.forEach(s => s.style.display = "block");
  }

}


let expanded = false;

// Show subgroup dropdown when the length of subcategory > 0
function showCheckboxes() {
  let checkboxes = document.getElementById("checkboxes");
  if (!expanded) {
    expanded = true;
    let subcategories = form.querySelectorAll('input[type="checkbox"]:not(#checkall)');

    if (subcategories.length > 0){
      checkboxes.style.display = "block";
    }
  } else {
    checkboxes.style.display = "none";
    expanded = false;

  }
}

// Create select all button and change the innertext of the drop down label
function createSelectAllbtn(subArray){
  let checkboxes = document.getElementById("checkboxes");
  let checkall = document.getElementById('checkall');
  if (subArray.length > 0 && checkall == null){
    let checkalldiv = document.createElement('div');
    let l = document.createElement('label');
    let input = document.createElement('input');
    let overselect = document.createElement('div');
    checkalldiv.setAttribute('id', 'checkalldiv');
    input.id = "checkall";
    input.name = "checkall";
    input.type = 'checkbox';
    input.setAttribute('checked', true);
    input.setAttribute('onclick', 'checkAll(this)');
    l.setAttribute('for', 'checkall');
    l.appendChild(input);
    l.innerHTML += "Select All";
    overselect.setAttribute('class', 'overSelect');
    overselect.setAttribute('id', 'transparentdiv');
    checkalldiv.appendChild(l);
    checkboxes.appendChild(checkalldiv);
    checkboxes.appendChild(overselect);
  }
}

// Function: toggle all the check boxes when the 'Select All' is checked/unchecked
function checkAll(e){
  let checkboxes = document.getElementById("checkboxes");
  if (e.checked == true){
    form.querySelectorAll('input[type="checkbox"]:not(#checkall)').forEach(i => i.checked = true);
  } else{
    form.querySelectorAll('input[type="checkbox"]:not(#checkall)').forEach(i => i.checked = false);
  }
  checkboxes.style.display = "block";
}

// Function: Change the subgroup drop down label innertext
//        If all the subcategories selected, shows 'All Types';
//        if some of them selected, shows 'Multi Selected';
//        else, shows the selected one
function showSelectedTypes(){
  let currentInnertext = document.getElementById('subcategory').selectedOptions[0];
  let currentOptions = form.querySelectorAll('input[type="checkbox"]:checked:not(#checkall)');
  let allOptions = form.querySelectorAll('input[type="checkbox"]:not(#checkall)');
  if (currentOptions.length == allOptions.length){
    console.log('All Types');
    currentInnertext.innerText = 'All Types';
  } else if (currentOptions.length > 1){
    console.log('Multiple Types Selected');
    currentInnertext.innerText = 'Multiple Types Selected';
  } else{
    console.log(currentOptions[0].labels[0].innerText);
    currentInnertext.innerText = currentOptions[0].labels[0].innerText;
  }

}

// Function: Export the div of interest to image
function exportToImage(divId, imgName){
  // Get all the current params
  let minYear = form.querySelector('.slider-time').innerHTML.replace(/\//g, "-");
  let maxYear = form.querySelector('.slider-time2').innerHTML.replace(/\//g, "-");
  let currentOptions = form.querySelectorAll('input[type="checkbox"]:checked:not(#checkall)');
  let selectedLayer = form.querySelector('#target-layer').value;
  let selectedState = form.querySelector('#state-picker').value;
  
  // Get the div object to be exported
  const captureElement = document.querySelector(divId);
  
  // Create title for the exported image, and append to the div
  let imginfo = document.createElement('h4');
  imginfo.id = 'imginfo';
  imginfo.innerHTML = selectedState.toUpperCase() + ' ' + selectedLayer + ' ' + minYear + ' to ' + maxYear;
  captureElement.appendChild(imginfo);

  // The function from the html2canvas library
  html2canvas(captureElement)
    .then(function(canvas) {
      canvas.style.display = "none";
      document.body.appendChild(canvas);
      return canvas
    })
    .then(function(canvas){
      const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      const a = document.createElement('a');
      a.setAttribute('download', imgName+ '.png');
      a.setAttribute('href', image);
      a.click();
      imginfo.remove();
      canvas.remove();
    })
}

function toggleInfo(divId){
  const infoPage = document.getElementById(divId);
  if (infoPage.style.display == 'none'){
    infoPage.style.display = 'block';
  } else {
    infoPage.style.display = 'none';
  }
}

// Function: toggle the data table
//        If the height of table navigation bar equals to 250 px (the table is opened), close the table; otherwise, open it.
function toggleNav() {
  navSize = document.getElementById("tableSidenav").style.height;
  if (navSize == "40%") {
    // console.log("close");
    return closeNav();
  }
  return openNav();
}

function openNav() {
  document.getElementById("tableSidenav").style.height = "40%";
  document.getElementById("map").style.marginBottom = "40%";
}

function closeNav() {
  document.getElementById("tableSidenav").style.height = "0";
  document.getElementById("map").style.marginBottom = "0";
}

// Coordinate center for the states
//      EPSG: 4326 for the map view
let viewObject = {
  'nc': [-79.5, 35.1],
  'sc': [-80.98, 33.5],
  'al': [-86.76009837890047, 32.9443670582841],
  'fl': [-81.46534257518124, 28.027774701069074],
  'ga': [-83.26866621236242, 32.68590204823714],
  'ky': [-84.88053210957419, 37.55755431646804],
  'ms': [-89.65917980802011, 32.92082460541776],
  'tn': [-86.36542223336966, 35.82748848339025],
  'va': [-78.63208332413177, 37.39087233427526]
}

let statepicker = document.getElementById('state-picker');

// State picker onchange function
statepicker.onchange = function (e) {
  let selstate = e.srcElement.value;
  let baselyrs = map.getLayerGroup().getLayers().array_.filter(e => {
    return e.values_.title == 'Base maps'
  })[0];
  let newsource = boundarySource(selstate);

  let statelyr = baselyrs.getLayersArray().filter(l => l.type == 'VECTOR')[0];
  statelyr.setSource(newsource);

  let lyrs = map.getLayerGroup().getLayers().array_.filter(e => {
    return e.values_.title == 'Layers'
  })[0];

  let lyrsArray = lyrs.getLayersArray();
  // Update all the loaded (includeing unvisible) layers to the selected state
  lyrsArray.forEach(function (l) {
    l.getSource().updateParams({
      // LAYERS: newl
      'viewparams': 'state:' + selstate
    })
  });

  // Create a new view based on the selected state
  let newView = new ol.View({
    center: ol.proj.fromLonLat(viewObject[selstate]),
    zoom: 8
  });

  // Zoom to the view of the selected state
  map.setView(newView);

  let selectedLayer = form.querySelector('#target-layer').value;
  let selectedLyr = lyrsArray.filter(l => l.get('title') == selectedLayer);
  let countTbSrc = selectedLyr[0].getLayersArray()[0].getSource().params_.LAYERS;
  
  // Update the Count Table
  $('#attributeTb').DataTable().ajax.url(attributeDataUrl + '&typeName=' + countTbSrc + '&viewparams=state:' + selstate).load();

  // Delete the current data table and reinitialize the table
  recreateDataTable(countTbSrc);

  // Get the layer url
  let featureInfoUrl = selectedLyr[0].getLayersArray()[0].getSource().getGetFeatureInfoUrl(
    ol.proj.transform(viewObject[selstate], 'EPSG:4326', 'EPSG:3857'),
    map.getView().getResolution(),
    map.getView().getProjection(), {
      'INFO_FORMAT': 'application/json',
      'propertyName': 'minyear,maxyear',
    }
  );
  // Fetch the url and get returned json
  fetch(featureInfoUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (json) {
    // Get the max and min year of the layer
    let currentf = json.features[0];
    let currentp = currentf.properties;
    let miny = currentp.minyear;
    let maxy = currentp.maxyear;

    $('.slider-time').html(miny);
    $('.slider-time2').html(maxy);
    
    // Update the max and min of the time slider
    $('#slider-range').slider({
      min: Date.parse(miny + '/01/01') / 1000,
      max: Date.parse(maxy + '/12/31') / 1000,
      values: [Date.parse(miny + '/01/01') / 1000, Date.parse(maxy + '/12/31') / 1000]
    })
    // Update the title of the navigation tab for Count Table to notify users
    document.getElementById("tab-1").innerHTML = "Counts by County: <i>" + selectedLayer + " " + miny + "-" + maxy + '</i>';

  });

  // Display the text 'All type' everytime when state picker changed
  currentInnertext = document.getElementById('subcategory').selectedOptions[0].innerText = 'All Types';
  // Check all the checkboxes when switching state
  form.querySelectorAll('input[type="checkbox"]').forEach(i => i.checked = true);
  
  // Decide to hide hurricane option or not based on the selected layer
  hideHurricane(selstate);
}

// Function: Hide hurricane option from being selected by users when they select states other than NC/SC
function hideHurricane(state){
  console.log(state, ':')
  if (state != 'sc' && state != 'nc'){
    form.querySelector('#target-layer > option[value="Hurricane "]').style.display = "none";
  }else{
    form.querySelector('#target-layer > option[value="Hurricane "]').style.display = "block";
  }
}