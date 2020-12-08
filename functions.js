var generateInfo = function (t) {
  switch (t) {
    case "2015 Impervious Surface Area ":
      return `Blizzard Warning, Freezing Rain Advisory, Heavy Snow Warning, Ice Storm Warning, Snow Advisory, Wind Chill Advisory and Warning, Winter Storm Warning, Winter Weather Advisory`
      break;
    case "2017 population ":
      return "Data for Freezing Rain are obtained from the NWS WaWA Advisories. A Freezing Rain Advisory is issued for freezing rain, freezing drizzle, and/or light ice accumulation."
      break;
    case "NC Floods ":
      return "Data from the National Weather Service (NWS) Advisories and Warnings are used as the best-available proxy for occurence of Areal, Coastal, Flash and River Floods."
      break;
    case "NC Heat ":
      return "Data for Heat are obtained from the NWS WaWA Advisories and Warnings as the best-available proxy for occurrence of heat dangerous to human health. A Heat Advisory is issued based on a heat index of 105°F but less than 115°F for less than 3 hours per day, or nighttime lows above 80°F for 2 consecutive days. An Excessive Heat Warning is issued based on a heat index of 105°F for more than 3 hours per day for 2 consecutive days, or a heat index more than 115°F for any period of time. Criteria for Heat Advisories and Excessive Heat Warnings may vary by location and be lower early in the heat season or during a multi-day heat wave."
      break;
  }
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