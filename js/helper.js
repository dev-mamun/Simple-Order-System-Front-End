/**
 * Created by Md.Abdullah Al Mamun.
 * Project: amarroom
 * File:
 * Email: mamun1214@gmail.com
 * Date: 9/27/18
 */
class Helper {

    constructor() {
        var $this = this;
        this._storage = new Storage();
        this._api = "http://localhost:8000";
        this._user = this.storage.getStorage('session', 'user');
        document.cookie = "XDEBUG_SESSION=PHPSTORM";
        $.ajaxSetup({
            beforeSend: function (xhr, settings) {
                if ($this.isLoggedIn()) {
                    xhr.setRequestHeader("Authorization", $this.token());
                }
            }
        });
    }

    set api($val) {
        this._api = $val;
    }

    get api() {
        return this._api;
    };

    get storage() {
        return this._storage;
    };


    bytesToSize(bytes, decimals) {
        if (bytes == 0) return '0 Byte';
        var k = 1000;
        var dm = decimals + 1 || 2;
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    removeItem(items, removeItem) {
        return jQuery.grep(items, function (value) {
            return value != removeItem;
        });
    };

    unset(array, index) {
        return array.splice(index, 1);
    };

    getType(p) {
        if (Array.isArray(p)) {
            return 'array';
        } else if (typeof p == 'string') {
            return 'string';
        } else if (p != null && typeof p == 'object') {
            return 'object';
        } else {
            return 'other';
        }
    };

    stripTags(str) {
        if ((str === null) || (str === ''))
            return false;
        else
            str = str.toString();
        return str.replace(/<[^>]*>/g, '');
    };

    date($date, $old, $new) {
        return moment($date, $old).format($new);
    };

    parseURL(url) {
        var $url = url || document.URL;
        var parser = document.createElement('a'),
            searchObject = {},
            queries, split, i;
        // Let the browser do the work
        parser.href = $url;
        // Convert query string to object
        queries = parser.search.replace(/^\?/, '').split('&');
        for (i = 0; i < queries.length; i++) {
            split = queries[i].split('=');
            searchObject[split[0]] = split[1];
        }
        return {
            protocol: parser.protocol,
            host: parser.host,
            hostname: parser.hostname,
            port: parser.port,
            pathname: parser.pathname,
            search: parser.search,
            searchObject: searchObject,
            hash: parser.hash
        };
    };

    dayDiff($options) {
        var $format = "DD-MM-YYYY";
        var $return = 'days';
        if ($options.format) {
            $format = $options.format;
        }
        if ($options.return) {
            $return = $options.return;
        }
        var $start = moment($options.start, $format); //todays date
        var $end = moment($options.end, $format); // another date
        var duration = moment.duration($end.diff($start));
        switch ($return) {
            case 'days':
                return duration.asDays();
                break;
            case 'hours':
                return duration.asHours();
                break;
            case 'humanize':
                return duration.humanize();
                break;
        }
    };

    getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };

    getUrlParams(url) {
        // get query string from url (optional) or window
        var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
        // we'll store the parameters here
        var obj = {};
        // if query string exists
        if (queryString) {
            // stuff after # is not part of query string, so get rid of it
            queryString = queryString.split('#')[0];
            // split our query string into its component parts
            var arr = queryString.split('&');
            for (var i = 0; i < arr.length; i++) {
                // separate the keys and the values
                var a = arr[i].split('=');
                // in case params look like: list[]=thing1&list[]=thing2
                var paramNum = undefined;
                var paramName = a[0].replace(/\[\d*\]/, function (v) {
                    paramNum = v.slice(1, -1);
                    return '';
                });
                // set parameter value (use 'true' if empty)
                var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
                // (optional) keep case consistent
                paramName = paramName.toLowerCase();
                paramValue = decodeURIComponent(paramValue.toLowerCase());
                // if parameter name already exists
                if (obj[paramName]) {
                    // convert value to array (if still string)
                    if (typeof obj[paramName] === 'string') {
                        obj[paramName] = [obj[paramName]];
                    }
                    // if no array index number specified...
                    if (typeof paramNum === 'undefined') {
                        // put the value on the end of the array
                        obj[paramName].push(paramValue);
                    }
                    // if array index number specified...
                    else {
                        // put the value at that index number
                        obj[paramName][paramNum] = paramValue;
                    }
                }
                // if param name doesn't exist yet, set it
                else {
                    obj[paramName] = paramValue;
                }
            }
        }
        return obj;
    };

    httpRequest(url, method, inputs, contentType) {
        var $this = this;
        method = method || 'GET';
        inputs = inputs || '';
        if ($.type(contentType) == 'undefined') {
            contentType = "application/json";
        }
        var obj = {
            url: url,
            type: method,
            data: inputs,
            cache: true,
            crossDomain: true,
            ifModified: true,
            dataType: 'json',
            contentType: contentType,
        };
        if (contentType == false) {
            delete obj['dataType'];
            obj.processData = false;
        }
        return $.ajax(obj);
    };

    httpFileRequest(url, method, inputs, contentType) {
        method = method || 'GET';
        inputs = inputs || '';
        contentType = contentType || "application/json";
        return $.ajax({
            url: url,
            type: method,
            data: inputs,
            cache: true,
            crossDomain: true,
            ifModified: true,
        });
    };

    utcToLocal(data, newFormat, oldFormat) {
        oldFormat = oldFormat || "MM/DD/YYYY h:mm A";
        newFormat = newFormat || "MMMM Do YYYY";
        if (data == null) {
            return 'N/A';
        }
        var localTime = moment.utc(data, oldFormat).toDate();
        localTime = moment(localTime).format(newFormat);
        return localTime;
    };

    localToUTC(data, oldFormat, newFormat) {
        oldFormat = oldFormat || "DD/MM/YYYY hh:mm A";
        newFormat = newFormat || "YYYY-MM-DD HH:mm:ss";
        var date = moment(data, oldFormat).utcOffset('+00').format(newFormat);
        return date;
    };

    rgb2hex(orig) {
        var rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+)/i);
        return (rgb && rgb.length === 4) ? "" +
            ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : orig;
    };

    makeSlug($str) {
        return $str.toLowerCase().replace(/\s/g, '_').replace(/[#_'&/"]/g, "");
    };

    buildUrl(base, params) {
        var sep = (base.indexOf('?') > -1) ? '&' : '?';
        return base + sep + $.param(params);
    };

    imageExists($imageUrl) {
        var http = new XMLHttpRequest();
        http.open('GET', $imageUrl, false);
        http.send();
        return http.status != 404;
    };

    nl2br($str) {
        return $str.replace(/\r\n/g, "<br/>");
    };

    ucWord($str) {
        return $str.toLowerCase().replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function ($1) {
            return $1.toUpperCase()
        });
    };

    makeStringToList(string) {
        var str_html = '', str_arr = [];
        str_arr = string.split('\n');
        $.each(str_arr, function (k, v) {
            var b = v.replace(/[↵#]/g, '');
            var a = `<li class="package-li"><i class="far fa-check-circle text-success"></i>${b.trim()}</li>`;
            str_html += a;
        });
        return str_html;
    };

    GetURLParameter(sParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) {
                return sParameterName[1];
            }
        }
    };

    makeCurrencyFormat(num) {
        return parseFloat(num).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })
    };

    makeCurrencyFormatNonFractional(num) {
        return parseFloat(num).toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        })
    };

    removeClick($element) {
        if ($element.hasClass('disabled')) {
            return false;
        } else if ($element.is('[disabled=disabled]')) {
            return false;
        }
    };

    jwtDecode($token) {
        var base64Url = $token.split(".")[1];
        var base64 = base64Url.replace("-", "+").replace("_", "/");
        return JSON.parse(window.atob(base64));
    };

    isTokenExpire() {
        var $token = this.storage.getStorage('local', STORAGE_TOKEN_KEY);
        if (!$.isEmptyObject($token)) {
            $token = this.jwtDecode($token);
            var $start = moment();
            var $end = moment(new Date($token.exp * 1000));
            var duration = moment.duration($end.diff($start));
            console.log(duration.asHours());
        }
    };

    isJson($json) {
        try {
            $.parseJSON($json);
        } catch (e) {
            return false;
        }
        return true;
    };

    isString($value) {
        return typeof $value === 'string' || $value instanceof String;
    };

    isNumber($value) {
        return typeof $value === 'number' && isFinite($value);
    };

    isBase64(str) {
        try {
            return btoa(atob(str)) == str;
        } catch (err) {
            return false;
        }
    };

    isIPaddress(ipaddress) {
        if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
            return true;
        }
        return false;
    };

    isValidDomain(address) {
        var pattern = new RegExp('((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,})', 'i'); // fragment locator
        return !!pattern.test(address);
    };

    isPhoneNumber(number) {
        if (/^(\8801[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9])$/.test(number)) {
            return true;
        }
        return false;
    };

    isLoggedIn() {
        if ($.isEmptyObject(this._user)) {
            return false;
        }
        return true;
    };

    token() {
        if ($.isEmptyObject(this._user)) {
            return ''
        }
        return this._user.token;
    };

}

class User extends Helper {
    constructor() {
        super();
        this._user = this.storage.getStorage('session', 'user');
        this._agent = new Agent(this.storage.getStorage('local', 'agent'));
    }

    get isAdmin() {
        if (this._user.is_admin) {
            return true;
        }
        return false;
    };

    get isCustomer() {
        if (this._user.is_admin) {
            return false;
        }
        return true;
    };

    get isAgent() {
        if (this._user.is_agent) {
            return true;
        }
        return false;
    };

    get isGuest() {
        if (this._user.is_agent || this._user.is_admin) {
            return false;
        }
        return true;
    };

    get isActive() {
        return this._user.is_active;
    };

    get firstName() {
        return this._user.first_name;
    };

    get lastName() {
        return this._user.last_name;
    };

    get name() {
        return this.firstName + ' ' + this.lastName;
    };

    get phone() {
        return this._user.phone;
    };

    get id() {
        return this._user.id;
    };

    get email() {
        return this._user.email;
    };

    get agent() {
        return this._agent;
    };

    get isAlive() {
        if ($.isEmptyObject(this._user)) {
            return false;
        }
        return true;
    };
};

