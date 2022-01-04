let generateInfo = function (t) {
  let layerInfoContent = document.getElementById('layerInfoContent');
  let infoText = '';
  switch (t) {
    case "Flooding ":
      infoText = "Data from the National Weather Service (NWS) Advisories and Warnings are used as the best-available proxy for occurence of Areal, Coastal, Flash and River Floods."
      break;
    case "Winter Weather ":
      infoText = "Data from the National Weather Service (NWS) Advisories and Warnings are used as the best-available proxy for occurrence of winter weather potentially resulting in human health impacts, property damage, and business disruption. Winter weather may be displayed in subcategories including: Blizzard, Freezing Rain, Heavy Snow, Ice Storm, Snow, Wind Chill, Winter Storm, and Winter Weather."
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
  }
  layerInfoContent.innerText = infoText;
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