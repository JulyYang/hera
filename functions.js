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