/**
 * Created by Md.Abdullah Al Mamun.
 * Project: amarroom
 * File: storage.js
 * Email: mamun1214@gmail.com
 * Date: 12/22/18
 */

class Storage {
    constructor() {

    }

    getStorage(storage, key) {
        var $data;
        switch (storage) {
            case 'local':
                $data = window.localStorage.getItem(key);
                if (this.isJson($data)) {
                    $data = $.parseJSON($data);
                }
                break;
            case 'session':
                $data = window.sessionStorage.getItem(key);
                if (this.isJson($data)) {
                    $data = $.parseJSON($data);
                }
                break;
        }
        if ($data == null) {
            return {};
        }
        if ($data.hasOwnProperty('expiresAt')) {
            if (this.hasExpire($data.expiresAt)) {
                this.removeStorage(storage, key);
                return {};
            }
        } else if (this.isString($data)) {
            var $token = this.jwtDecode($data);
            if (this.isObject($token)) {
                var exp = new Date($token.exp * 1000);
                var $end = moment(exp);
                var $start = moment();
                var duration = moment.duration($end.diff($start));
                if (duration.hours() <= 0) {
                    this.removeStorage(storage, key);
                    return {};
                }
            }
        }

        return $data;
    };

    saveStorage(storage, key, value) {
        switch (storage) {
            case 'local':
                value.expiresAt = moment().utc().add(18 * 60 * 60, 'seconds');
                window.localStorage.setItem(key, JSON.stringify(value));
                break;
            case 'session':
                value.expiresAt = moment().utc().add(9 * 60 * 60, 'seconds');
                window.sessionStorage.setItem(key, JSON.stringify(value));
                break;
        }
    };

    removeStorage(storage, key) {
        switch (storage) {
            case 'local':
                return window.localStorage.removeItem(key);
                break;
            case 'session':
                return window.sessionStorage.removeItem(key);
                break;
        }
    };

    removeLocalStorages($key) {
        $.each($key, function (k, v) {
            window.localStorage.removeItem(v);
        });
    };

    removeSessionStorages($key) {
        $.each($key, function (k, v) {
            window.sessionStorage.removeItem(v);
        });
    };

    clearStorage() {
        window.localStorage.clear();
        window.sessionStorage.clear();
    };

    hasExpire($expireAt) {
        var $start = moment();
        var $end = moment($expireAt);
        var duration = moment.duration($end.diff($start));
        if (duration.minutes() > 0) {
            return false;
        } else {
            return true;
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

    isObject($value) {
        return $value && typeof $value === 'object' && $value.constructor === Object;
    }

    isBase64(str) {
        if (str === '' || str.trim() === '') {
            return false;
        }
        try {
            return btoa(atob(str)) == str;
        } catch (err) {
            return false;
        }
    }

    jwtDecode($token) {
        var $base64Str = $token.split(".");
        if ($base64Str.length == 0) {
            return {};
        }
        var $base64 = $base64Str[1].replace("-", "+").replace("_", "/");
        if (this.isString($base64)) {
            try {
                return $.parseJSON(window.atob($base64));
            } catch (e) {
                return {};
            }
        }
    };

}