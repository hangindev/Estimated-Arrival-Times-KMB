var bus_no;

function saveBusNo() {
    bus_no = $("#bus_route").val().toUpperCase();
};

$('#form-container').submit(saveBusNo);

function getETA(id) {

    var $etasessions = $('#etasessions');

    $etasessions.text("");

    var bus_route = $("#bus_route").val().toUpperCase();
    var station = $("#station").val();
    var jsonurl = "http://search.kmb.hk/KMBWebSite/Function/FunctionRequest.ashx/";
    var currenttime = new Date();
    var dd = currenttime.getDate();
    var mm = currenttime.getMonth()+1;
    var yyyy = currenttime.getFullYear();
    if(dd<10) dd='0'+dd;
    if(mm<10) mm='0'+mm;
    today = yyyy+'-'+mm+'-'+dd;

    var bound= (Math.floor(id/1000)+1).toString();
    var seq = (id%1000).toString();;

    jsonurl += '?' + $.param({
        'action': "geteta",
        'lang': "1",
        'route': bus_no,
        'bound': bound,
        'servicetype': "1",
        'bsiCode': "KW07T11000",
        'seq': seq
    });

    $.mobile.loading("show");
    $.ajax({
        url: jsonurl,
        type:'get',
        success: function (data) {
            results = data.data.response;
            for (var i = 0; i < results.length; i++) {
                var item = results[i]
                var formattedeta = today+"T"+item.t.split("　")[0]+":00.sZ";
                var eta = new Date(parseISO8601(formattedeta));
                var timediff = eta-currenttime;
                if((item.t.search("Scheduled")) > -1 ) { var result = msToTime(timediff) + " - Scheduled"; }
                else { var result = msToTime(timediff); }
                if (result === -1) { continue; }
                var HTMLetaresult = '<li id="eta-result">%data%</li>'
                var formattedataresult = HTMLetaresult.replace("%data%", result);
                $etasessions.append(formattedataresult);
                $.mobile.loading("hide");
            };
            console.log("1 "+$('#etasessions').text());
            $etasessions.listview("refresh");
        }
    });
};

function msToTime(s) {
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;
  if (mins < 0) return -1;
  else if (mins < 1) return 'Arrive';
  else return mins + ' mins';
}

/**Parses string formatted as YYYY-MM-DDThh:mm:ss.sZ
 * or YYYY-MM-DDThh:mm:ssZ (for IE8), to a Date object.
 * If the supplied string does not match the format, an
 * invalid Date (value NaN) is returned.
 * @param {string} dateStringInRange format YYYY-MM-DDThh:mm:ss.sZ,
 * or YYYY-MM-DDThh:mm:ssZ - Zulu (UTC) Time Only,
 * with year in range of 0000-9999, inclusive.
 * @return {Date} Date object representing the string.
 */
function parseISO8601(dateStringInRange) {
    var isoExp = /^\s*(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d).*Z\s*$/,
        date = new Date(NaN), month,
        parts = isoExp.exec(dateStringInRange);
    if (parts) {
        month = +parts[2];
        date.setUTCFullYear(parts[1], month - 1, parts[3]);
        date.setUTCHours(parts[4] - 8); //set to HK time zone UTC+08:00
        date.setUTCMinutes(parts[5]);
        date.setUTCSeconds(parts[6]);
        if(month != date.getMonth() + 1) {
            date.setTime(NaN);
        }
    }
    return date;
}

