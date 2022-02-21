let generateInfo = function (t) {
  let layerInfoContent = document.getElementById('layerInfoContent');
  let infoText = '';
  switch (t) {
    case "Flooding ":
      infoText = "Data from the National Weather Service (NWS) Advisories and Warnings are used as the best-available proxy for occurence of Areal, Coastal, Flash and River Floods."
        + "<br><b>Areal Floods: </b>An Areal Flood Advisory is issued for gradual, minor flooding – usually from prolonged or persistent moderate to heavy rainfall – that results in ponding or buildup of water in low-lying, flood prone areas, such as streets, urban storm drains, creeks, and small streams. An Areal Flood Warning is issued for gradual, more severe flooding resulting in significant impacts."
        + "<br><b>River Floods: </b>A Flood Warning is issued for river flooding at one or more forecast points along a river."
        + "<br><b>Flash Floods: </b>A Flash Flood Warning is issued for rapid flooding – usually within six hours of intense or heavy rainfall – just about anywhere, including streams, roadways, and cities."
        + "<br><b>Coastal Floods: </b>A Coastal Flood Advisory is issued for minor or nuisance flooding along the coast. A Coastal Flood Warning is issued for moderate to major flooding along the coast.";
      break;
    case "Winter Weather ":
      infoText = "Data from the National Weather Service (NWS) Advisories and Warnings are used as the best-available proxy for occurrence of winter weather potentially resulting in human health impacts, property damage, and business disruption. Winter weather may be displayed in subcategories including: Blizzard, Freezing Rain, Heavy Snow, Ice Storm, Snow, Wind Chill, Winter Storm, and Winter Weather."
        + "<br><b>Wind Chill: </b>A Wind Chill Advisory is issued when the wind chill is low enough, based on local criteria, to cause a threat to human health. A Wind Chill Warning is issued when the wind chill is low enough, based on local criteria, to be life-threatening."
        + "<br><b>Snow: </b>A Snow Advisory is issued when snow is the only expected winter weather hazard in an area, and criteria vary by location."
        + "<br><b>Freezing Rain: </b>A Freezing Rain Advisory is issued for freezing rain, freezing drizzle, and/or light ice accumulation."
        + "<br><b>Winter Storm: </b>A Winter Storm Warning is issued for significant winter weather conditions based on local criteria and wind speeds below blizzard conditions.";
      break;
    case "Heat ":
      infoText = "Data from the National Weather Service (NWS) Advisories and Warnings are used as the best-available proxy for occurrence of heat events dangerous to human health: a heat index of equal to or greater than 105°F for at least 3 hours per day for one or more days, a heat index equal to or greater than 115°F for any period of time, and/or nighttime low equal to or greater than 80°F for consecutive days. Criteria for Heat Advisories and Excessive Heat Warnings may vary by location and be lower early in the heat season or during a multi-day heat wave."
      break;
    case "High Wind ":
      infoText = "Data for high winds are obtained from Local Storm Reports (LSR). High winds may be displayed in three subcategories: Gale Force (40-57 mph), Storm Force (58-73 mph), and Hurricane Force (74+ mph)."
      break;
    case "Hail ":
      infoText = "Data for hail equal to or greater than 1 inch are obtained from Local Storm Reports (LSR)."
      break;
    case "Tornado ":
      infoText = "Data for tornadoes are obtained from Local Storm Reports (LSR). Tornadoes may be displayed in five subcategories based on the Enhanced Fujita scale (2007 onward) or the Fujita (before 2007) scale: E/F-0 (65-85 mph/<73 mph); E/F-1 (86-110 mph/73-112 mph); E/F-2 (111-135 mph/113-157 mph); E/F-3 (136-165 mph/158-206 mph); and E/F-4 (166-200 mph/207-260 mph)."
      break;
    case "Hurricane ":
      infoText = "Data for hurricanes and tropical storms are obtained from the National Hurricane Center (NHC) Best Track Data (HURDAT2). The location of hurricane and tropical storm tracks every six hours was used to ascertain the proximity to county centroids. If hurricanes or tropical storms were found to be within 75 miles of a county centroid, they were counted for that county."
        + "<p style='font-size:12px; color:#f53737'><i>The hurricane data for the states other than NC/SC are still in progress and not available at this time. We'll upload the layers once it's finished. Thank you for your patience. </i></p>"
      break;
  }
  layerInfoContent.innerHTML = infoText;
};

var clickInfo = function () {
  var parentDiv = this.parentNode;
  var labeltitle = parentDiv.querySelector('label');
  console.log(labeltitle.textContent);

  var infohover = document.createElement('span');
  infohover.className = 'tooltiptext';
  infohover.style.font = '10pt Verdana, Geneva, sans-serif';
  infohover.textContent = generateInfo(labeltitle.textContent);
  infohover.style.backgroundColor = '#858481';
  infohover.style.color = 'white';
  infohover.style.position = 'absolute';
  infohover.style.marginLeft = '-30%';
  infohover.style.marginRight = '10px';
  infohover.style.marginTop = '20px';
  infohover.style.padding = '6px';
  infohover.style.maxWidth = "250px";
  infohover.style.borderRadius = '8px';

  if (!this.getAttribute('hovered')) {
    this.appendChild(infohover);
    this.setAttribute('hovered', true);
  }
  $(this).children('.tooltiptext').show();
};

var unclickInfo = function () {
  $(this).children('.tooltiptext').hide();
}

let changeContent = function(currentDiv, targetDiv){
  document.getElementById(currentDiv).style.display = 'none';
  document.getElementById(targetDiv).style.display = 'block';
  // let dataSrcDiv = document.getElementById(targetDiv).innerHTML;
  // document.getElementById('infoPage').innerHTML = dataSrcDiv;
}