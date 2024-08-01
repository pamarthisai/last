! function(t, e) {
    "use strict";
    "function" != typeof t.CustomEvent && (t.CustomEvent = function(t, o) {
        o = o || {
            bubbles: !1,
            cancelable: !1,
            detail: void 0
        };
        var c = e.createEvent("CustomEvent");
        return c.initCustomEvent(t, o.bubbles, o.cancelable, o.detail), c
    }, t.CustomEvent.prototype = t.Event.prototype), e.addEventListener("touchstart", (function(t) {
        "true" !== t.target.getAttribute("data-swipe-ignore") && (n = t.target, s = Date.now(), o = t.touches[0].clientX, c = t.touches[0].clientY, a = 0, f = 0, m = t.touches.length)
    }), !1), e.addEventListener("touchmove", (function(t) {
        if (o && c) {
            var e = t.touches[0].clientX,
                s = t.touches[0].clientY;
            a = o - e, f = c - s
        }
    }), !1), e.addEventListener("touchend", (function(t) {
        if (n === t.target) {
            var d = parseInt(g(n, "data-swipe-threshold", "20"), 10),
                i = g(n, "data-swipe-unit", "px"),
                r = parseInt(g(n, "data-swipe-timeout", "500"), 10),
                v = Date.now() - s,
                l = "",
                u = t.changedTouches || t.touches || [];
            if ("vh" === i && (d = Math.round(d / 100 * e.documentElement.clientHeight)), "vw" === i && (d = Math.round(d / 100 * e.documentElement.clientWidth)), Math.abs(a) > Math.abs(f) ? Math.abs(a) > d && v < r && (l = a > 0 ? "swiped-left" : "swiped-right") : Math.abs(f) > d && v < r && (l = f > 0 ? "swiped-up" : "swiped-down"), "" !== l) {
                var h = {
                    dir: l.replace(/swiped-/, ""),
                    touchType: (u[0] || {}).touchType || "direct",
                    fingers: m,
                    xStart: parseInt(o, 10),
                    xEnd: parseInt((u[0] || {}).clientX || -1, 10),
                    yStart: parseInt(c, 10),
                    yEnd: parseInt((u[0] || {}).clientY || -1, 10)
                };
                n.dispatchEvent(new CustomEvent("swiped", {
                    bubbles: !0,
                    cancelable: !0,
                    detail: h
                })), n.dispatchEvent(new CustomEvent(l, {
                    bubbles: !0,
                    cancelable: !0,
                    detail: h
                }))
            }
            o = null, c = null, s = null
        }
    }), !1);
    var o = null,
        c = null,
        a = null,
        f = null,
        s = null,
        n = null,
        m = 0;

    function g(t, o, c) {
        for (; t && t !== e.documentElement;) {
            var a = t.getAttribute(o);
            if (a) return a;
            t = t.parentNode
        }
        return c
    }
}(window, document), (() => {
    document.getElementById("videoLocal");
    let t, e, o, c, a, f, s = document.getElementById("videoRemote");
    var n = document.getElementById("canvas"),
        m = n.getContext("2d");
    document.getElementById("vid");
    let g, d = document.getElementById("form"),
        i = document.getElementById("input"),
        r = document.getElementById("messages"),
        v = document.querySelector("h3"),
        l = document.getElementById("start"),
        u = !1,
        h = !1,
        y = !1;
    var p = [{
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e6-1f1e8.svg",
        country: "Ascension Island",
        code: "ac"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e6-1f1e9.svg",
        country: "Andorra",
        code: "ad"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e6-1f1ea.svg",
        country: "United Arab Emirates",
        code: "ae"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e6-1f1eb.svg",
        country: "Afghanistan",
        code: "af"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e6-1f1ec.svg",
        country: "Antigua & Barbuda",
        code: "ag"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e6-1f1ee.svg",
        country: "Anguilla",
        code: "ai"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e6-1f1f1.svg",
        country: "Albania",
        code: "al"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e6-1f1f2.svg",
        country: "Armenia",
        code: "am"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e6-1f1f4.svg",
        country: "Angola",
        code: "ad"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e6-1f1f6.svg",
        country: "Antarctica",
        code: "aq"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e6-1f1f7.svg",
        country: "Argentina",
        code: "ar"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e6-1f1f8.svg",
        country: "American Samoa",
        code: "as"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e6-1f1f9.svg",
        country: "Austria",
        code: "at"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e6-1f1fa.svg",
        country: "Australia",
        code: "au"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e6-1f1fc.svg",
        country: "Aruba",
        code: "aw"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e6-1f1fd.svg",
        country: "Åland Islands",
        code: "ax"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e6-1f1ff.svg",
        country: "Azerbaijan",
        code: "az"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1e6.svg",
        country: "Bosnia & Herzegovina",
        code: "ba"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1e7.svg",
        country: "Barbados",
        code: "bb"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1e9.svg",
        country: "Bangladesh",
        code: "bd"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1ea.svg",
        country: "Belgium",
        code: "be"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1eb.svg",
        country: "Burkina Faso",
        code: "bf"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1ec.svg",
        country: "Bulgaria",
        code: "bg"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1ed.svg",
        country: "Bahrain",
        code: "bh"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1ee.svg",
        country: "Burundi",
        code: "bi"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1ef.svg",
        country: "Benin",
        code: "bj"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1f1.svg",
        country: "St. Barthélemy",
        code: "bl"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1f2.svg",
        country: "Bermuda",
        code: "bm"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1f3.svg",
        country: "Brunei",
        code: "bn"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1f4.svg",
        country: "Bolivia",
        code: "bo"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1f6.svg",
        country: "Caribbean Netherlands"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1f7.svg",
        country: "Brazil",
        code: "br"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1f8.svg",
        country: "Bahamas",
        code: "bs"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1f9.svg",
        country: "Bhutan",
        code: "bt"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1fb.svg",
        country: "Bouvet Island",
        code: "bv"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1fc.svg",
        country: "Botswana",
        code: "bw"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1fe.svg",
        country: "Belarus",
        code: "by"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1ff.svg",
        country: "Belize",
        code: "bz"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1e6.svg",
        country: "Canada",
        code: "ca"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1e8.svg",
        country: "Cocos (Keeling) Islands",
        code: "cc"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1e9.svg",
        country: "Congo - Kinshasa",
        code: "cg"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1eb.svg",
        country: "Central African Republic",
        code: "cf"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1ec.svg",
        country: "Congo - Brazzaville",
        code: "cd"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1ed.svg",
        country: "Switzerland",
        code: "ch"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1ee.svg",
        country: "Côte d’Ivoire",
        code: "ci"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1f0.svg",
        country: "Cook Islands",
        code: "ck"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1f1.svg",
        country: "Chile",
        code: "cl"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1f2.svg",
        country: "Cameroon",
        code: "cm"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1f3.svg",
        country: "China",
        code: "cn"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1f4.svg",
        country: "Colombia",
        code: "co"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1f5.svg",
        country: "Clipperton Island",
        code: "cp"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1f7.svg",
        country: "Costa Rica",
        code: "cr"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1fa.svg",
        country: "Cuba",
        code: "cu"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1fb.svg",
        country: "Cape Verde",
        code: "cv"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1fc.svg",
        country: "Curaçao",
        code: "cw"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1fd.svg",
        country: "Christmas Island",
        code: "cx"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1fe.svg",
        country: "Cyprus",
        code: "cy"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e8-1f1ff.svg",
        country: "Czechia",
        code: "cz"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e9-1f1ea.svg",
        country: "Germany",
        code: "de"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e9-1f1ec.svg",
        country: "Diego Garcia",
        code: "dg"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e9-1f1ef.svg",
        country: "Djibouti",
        code: "dj"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e9-1f1f0.svg",
        country: "Denmark",
        code: "dk"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e9-1f1f2.svg",
        country: "Dominica",
        code: "dm"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e9-1f1f4.svg",
        country: "Dominican Republic",
        code: "do"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e9-1f1ff.svg",
        country: "Algeria",
        code: "dz"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ea-1f1e6.svg",
        country: "Ceuta & Melilla",
        code: "ea"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ea-1f1e8.svg",
        country: "Ecuador",
        code: "ec"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ea-1f1ea.svg",
        country: "Estonia",
        code: "ee"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ea-1f1ec.svg",
        country: "Egypt",
        code: "eg"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ea-1f1ed.svg",
        country: "Western Sahara",
        code: "eh"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ea-1f1f7.svg",
        country: "Eritrea",
        code: "er"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ea-1f1f8.svg",
        country: "Spain",
        code: "es"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ea-1f1f9.svg",
        country: "Ethiopia",
        code: "et"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ea-1f1fa.svg",
        country: "European Union",
        code: "eu"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1eb-1f1ee.svg",
        country: "Finland",
        code: "fi"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1eb-1f1ef.svg",
        country: "Fiji",
        code: "fj"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1eb-1f1f0.svg",
        country: "Falkland Islands",
        code: "fk"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1eb-1f1f2.svg",
        country: "Micronesia",
        code: "fm"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1eb-1f1f4.svg",
        country: "Faroe Islands",
        code: "fo"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1eb-1f1f7.svg",
        country: "France",
        code: "fr"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ec-1f1e6.svg",
        country: "Gabon",
        code: "ga"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ec-1f1e7.svg",
        country: "United Kingdom",
        code: "gb"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ec-1f1e9.svg",
        country: "Grenada",
        code: "gd"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ec-1f1ea.svg",
        country: "Georgia",
        code: "ge"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ec-1f1eb.svg",
        country: "French Guiana",
        code: "gf"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ec-1f1ec.svg",
        country: "Guernsey",
        code: "gg"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ec-1f1ed.svg",
        country: "Ghana",
        code: "gh"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ec-1f1ee.svg",
        country: "Gibraltar",
        code: "gi"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ec-1f1f1.svg",
        country: "Greenland",
        code: "gl"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ec-1f1f2.svg",
        country: "Gambia",
        code: "gm"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ec-1f1f3.svg",
        country: "Guinea",
        code: "gn"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ec-1f1f5.svg",
        country: "Guadeloupe",
        code: "gp"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ec-1f1f6.svg",
        country: "Equatorial Guinea",
        code: "gq"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ec-1f1f7.svg",
        country: "Greece",
        code: "gr"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ec-1f1f8.svg",
        country: "South Georgia & South', Sandwich Islands",
        code: "gs"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ec-1f1f9.svg",
        country: "Guatemala",
        code: "gt"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ec-1f1fa.svg",
        country: "Guam",
        code: "gu"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ec-1f1fc.svg",
        country: "Guinea-Bissau",
        code: "gw"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ec-1f1fe.svg",
        country: "Guyana",
        code: "gy"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ed-1f1f0.svg",
        country: "Hong Kong SAR China",
        code: "hk"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ed-1f1f2.svg",
        country: "Heard & McDonald Islands",
        code: "hm"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ed-1f1f3.svg",
        country: "Honduras",
        code: "hn"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ed-1f1f7.svg",
        country: "Croatia",
        code: "hr"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ed-1f1f9.svg",
        country: "Haiti",
        code: "ht"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ed-1f1fa.svg",
        country: "Hungary",
        code: "hu"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ee-1f1e8.svg",
        country: "Canary Islands",
        code: "ic"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ee-1f1e9.svg",
        country: "Indonesia",
        code: "id"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ee-1f1ea.svg",
        country: "Ireland",
        code: "ie"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ee-1f1f1.svg",
        country: "Israel",
        code: "il"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ee-1f1f2.svg",
        country: "Isle of Man",
        code: "im"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ee-1f1f3.svg",
        country: "India",
        code: "in"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ee-1f1f4.svg",
        country: "British Indian Ocean Territory",
        code: "io"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ee-1f1f6.svg",
        country: "Iraq",
        code: "iq"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ee-1f1f7.svg",
        country: "Iran"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ee-1f1f8.svg",
        country: "Iceland",
        code: "is"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ee-1f1f9.svg",
        country: "Italy",
        code: "it"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ef-1f1ea.svg",
        country: "Jersey",
        code: "je"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ef-1f1f2.svg",
        country: "Jamaica",
        code: "jm"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ef-1f1f4.svg",
        country: "Jordan",
        code: "jo"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ef-1f1f5.svg",
        country: "Japan",
        code: "jp"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f0-1f1ea.svg",
        country: "Kenya",
        code: "ke"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f0-1f1ec.svg",
        country: "Kyrgyzstan",
        code: "kg"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f0-1f1ed.svg",
        country: "Cambodia",
        code: "kh"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f0-1f1ee.svg",
        country: "Kiribati",
        code: "ki"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f0-1f1f2.svg",
        country: "Comoros",
        code: "km"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f0-1f1f3.svg",
        country: "St. Kitts & Nevis",
        code: "kn"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f0-1f1f5.svg",
        country: "North Korea",
        code: "kp"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f0-1f1f7.svg",
        country: "South Korea",
        code: "kr"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f0-1f1fc.svg",
        country: "Kuwait",
        code: "kw"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f0-1f1fe.svg",
        country: "Cayman Islands",
        code: "ky"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f0-1f1ff.svg",
        country: "Kazakhstan",
        code: "kz"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f1-1f1e6.svg",
        country: "Laos",
        code: "la"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f1-1f1e7.svg",
        country: "Lebanon",
        code: "lb"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f1-1f1e8.svg",
        country: "St. Lucia",
        code: "lc"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f1-1f1ee.svg",
        country: "Liechtenstein",
        code: "li"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f1-1f1f0.svg",
        country: "Sri Lanka",
        code: "lk"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f1-1f1f7.svg",
        country: "Liberia",
        code: "lr"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f1-1f1f8.svg",
        country: "Lesotho",
        code: "ls"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f1-1f1f9.svg",
        country: "Lithuania",
        code: "lt"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f1-1f1fa.svg",
        country: "Luxembourg",
        code: "lu"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f1-1f1fb.svg",
        country: "Latvia",
        code: "lv"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f1-1f1fe.svg",
        country: "Libya",
        code: "ly"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1e6.svg",
        country: "Morocco",
        code: "ma"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1e8.svg",
        country: "Monaco",
        code: "mc"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1e9.svg",
        country: "Moldova",
        code: "md"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1ea.svg",
        country: "Montenegro",
        code: "me"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1eb.svg",
        country: "St. Martin",
        code: "mf"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1ec.svg",
        country: "Madagascar",
        code: "mg"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1ed.svg",
        country: "Marshall Islands",
        code: "mh"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1f0.svg",
        country: "North Macedonia",
        code: "mk"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1f1.svg",
        country: "Mali",
        code: "ml"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1f2.svg",
        country: "Myanmar (Burma)",
        code: "mm"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1f3.svg",
        country: "Mongolia",
        code: "mn"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1f4.svg",
        country: "Macao Sar China",
        code: "mo"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1f5.svg",
        country: "Northern Mariana Islands",
        code: "mp"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1f6.svg",
        country: "Martinique",
        code: "mq"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1f7.svg",
        country: "Mauritania",
        code: "mr"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1f8.svg",
        country: "Montserrat",
        code: "ms"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1f9.svg",
        country: "Malta",
        code: "mt"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1fa.svg",
        country: "Mauritius",
        code: "mu"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1fb.svg",
        country: "Maldives",
        code: "mv"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1fc.svg",
        country: "Malawi",
        code: "mw"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1fd.svg",
        country: "Mexico",
        code: "mx"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1fe.svg",
        country: "Malaysia",
        code: "my"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f2-1f1ff.svg",
        country: "Mozambique",
        code: "mz"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f3-1f1e6.svg",
        country: "Namibia",
        code: "na"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f3-1f1e8.svg",
        country: "New Caledonia",
        code: "nc"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f3-1f1ea.svg",
        country: "Niger",
        code: "ne"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f3-1f1eb.svg",
        country: "Norfolk Island",
        code: "nf"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f3-1f1ec.svg",
        country: "Nigeria",
        code: "ng"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f3-1f1ee.svg",
        country: "Nicaragua",
        code: "ni"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f3-1f1f1.svg",
        country: "Netherlands",
        code: "nl"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f3-1f1f4.svg",
        country: "Norway",
        code: "no"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f3-1f1f5.svg",
        country: "Nepal",
        code: "np"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f3-1f1f7.svg",
        country: "Nauru",
        code: "nr"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f3-1f1fa.svg",
        country: "Niue",
        code: "nu"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f3-1f1ff.svg",
        country: "New Zealand",
        code: "nz"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f4-1f1f2.svg",
        country: "Oman",
        code: "om"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f5-1f1e6.svg",
        country: "Panama",
        code: "pa"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f5-1f1ea.svg",
        country: "Peru",
        code: "pe"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f5-1f1eb.svg",
        country: "French Polynesia",
        code: "pf"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f5-1f1ec.svg",
        country: "Papua New Guinea",
        code: "pg"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f5-1f1ed.svg",
        country: "Philippines",
        code: "ph"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f5-1f1f0.svg",
        country: "Pakistan",
        code: "pk"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f5-1f1f1.svg",
        country: "Poland",
        code: "pl"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f5-1f1f2.svg",
        country: "St. Pierre & Miquelon",
        code: "pm"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f5-1f1f3.svg",
        country: "Pitcairn Islands",
        code: "pn"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f5-1f1f7.svg",
        country: "Puerto Rico",
        code: "pr"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f5-1f1f8.svg",
        country: "Palestinian Territories",
        code: "ps"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f5-1f1f9.svg",
        country: "Portugal",
        code: "pt"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f5-1f1fc.svg",
        country: "Palau",
        code: "pw"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f5-1f1fe.svg",
        country: "Paraguay",
        code: "py"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f6-1f1e6.svg",
        country: "Qatar",
        code: "qa"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f7-1f1ea.svg",
        country: "Réunion",
        code: "re"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f7-1f1f4.svg",
        country: "Romania",
        code: "ro"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f7-1f1f8.svg",
        country: "Serbia",
        code: "yu"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f7-1f1fa.svg",
        country: "Russia",
        code: "ru"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f7-1f1fc.svg",
        country: "Rwanda",
        code: "rw"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1e6.svg",
        country: "Saudi Arabia",
        code: "sa"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1e7.svg",
        country: "Solomon Islands",
        code: "sb"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1e8.svg",
        country: "Seychelles",
        code: "sc"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1e9.svg",
        country: "Sudan",
        code: "sd"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1ea.svg",
        country: "Sweden",
        code: "se"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1ec.svg",
        country: "Singapore",
        code: "sg"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1ed.svg",
        country: "St. Helena",
        code: "sh"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1ee.svg",
        country: "Slovenia",
        code: "si"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1ef.svg",
        country: "Svalbard & Jan Mayen",
        code: "sj"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1f0.svg",
        country: "Slovakia",
        code: "sk"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1f1.svg",
        country: "Sierra Leone",
        code: "sl"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1f2.svg",
        country: "San Marino",
        code: "sm"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1f3.svg",
        country: "Senegal",
        code: "sn"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1f4.svg",
        country: "Somalia",
        code: "so"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1f7.svg",
        country: "Suriname",
        code: "sr"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1f8.svg",
        country: "South Sudan",
        code: "ss"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1f9.svg",
        country: "São Tomé & Príncipe",
        code: "st"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1fb.svg",
        country: "El Salvador",
        code: "sv"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1fd.svg",
        country: "Sint Maarten",
        code: "sx"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1fe.svg",
        country: "Syria",
        code: "sy"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f8-1f1ff.svg",
        country: "Eswatini",
        code: "sz"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f9-1f1e6.svg",
        country: "Tristan Da Cunha",
        code: "sh"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f9-1f1e8.svg",
        country: "Turks & Caicos Islands",
        code: "tc"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f9-1f1e9.svg",
        country: "Chad",
        code: "td"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f9-1f1eb.svg",
        country: "French Southern Territories",
        code: "tf"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f9-1f1ec.svg",
        country: "Togo",
        code: "tg"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f9-1f1ed.svg",
        country: "Thailand",
        code: "th"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f9-1f1ef.svg",
        country: "Tajikistan",
        code: "tj"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f9-1f1f0.svg",
        country: "Tokelau",
        code: "tk"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f9-1f1f1.svg",
        country: "Timor-Leste",
        code: "tl"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f9-1f1f2.svg",
        country: "Turkmenistan",
        code: "tm"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f9-1f1f3.svg",
        country: "Tunisia",
        code: "tn"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f9-1f1f4.svg",
        country: "Tonga",
        code: "to"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f9-1f1f7.svg",
        country: "Turkey",
        code: "tr"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f9-1f1f9.svg",
        country: "Trinidad & Tobago",
        code: "tt"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f9-1f1fb.svg",
        country: "Tuvalu",
        code: "tv"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f9-1f1fc.svg",
        country: "Taiwan",
        code: "tw"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1f9-1f1ff.svg",
        country: "Tanzania",
        code: "tz"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1fa-1f1e6.svg",
        country: "Ukraine",
        code: "ua"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1fa-1f1ec.svg",
        country: "Uganda",
        code: "ug"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1fa-1f1f2.svg",
        country: "U.S. Outlying Islands",
        code: "um"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1fa-1f1f3.svg",
        country: "United Nations",
        code: "un"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1fa-1f1f8.svg",
        country: "United States",
        code: "us"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1fa-1f1fe.svg",
        country: "Uruguay",
        code: "uy"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1fa-1f1ff.svg",
        country: "Uzbekistan",
        code: "uz"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1fb-1f1e6.svg",
        country: "Vatican City",
        code: "va"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1fb-1f1e8.svg",
        country: "St. Vincent & Grenadines",
        code: "vc"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1fb-1f1ea.svg",
        country: "Venezuela",
        code: "ve"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1fb-1f1ec.svg",
        country: "British Virgin Islands",
        code: "vg"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1fb-1f1ee.svg",
        country: "U.S. Virgin Islands",
        code: "vi"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1fb-1f1f3.svg",
        country: "Vietnam",
        code: "vn"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1fb-1f1fa.svg",
        country: "Vanuatu",
        code: "vu"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1fc-1f1eb.svg",
        country: "Wallis & Futuna",
        code: "wf"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1fc-1f1f8.svg",
        country: "Samoa",
        code: "ws"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1fd-1f1f0.svg",
        country: "Kosovo",
        code: "xk"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1fe-1f1ea.svg",
        country: "Yemen",
        code: "ye"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1fe-1f1f9.svg",
        country: "Mayotte",
        code: "yt"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ff-1f1e6.svg",
        country: "South Africa",
        code: "za"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ff-1f1f2.svg",
        country: "Zambia",
        code: "zm"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ff-1f1fc.svg",
        country: "Zimbabwe",
        code: "zw"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f3f4-e0067-e0062-e0065-e006e-e0067-e007f.svg",
        country: "England",
        code: "uk"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f3f4-e0067-e0062-e0073-e0063-e0074-e007f.svg",
        country: "Scotland",
        code: "uk"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f3f4-e0067-e0062-e0077-e006c-e0073-e007f.svg",
        country: "Wales",
        code: "uk"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e6-1f1f4.svg",
        country: "Angola",
        code: "an"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1ee-1f1f7.svg",
        country: "Iran",
        code: "ir"
    }, {
        flag: "https://twemoji.maxcdn.com/2/svg/1f1e7-1f1f6.svg",
        country: "Caribbean Netherlands",
        code: "bq"
    }];
    const w = io.connect("wss://omegly.icaell.com"),
        j = new Peer;

    function x(t, e) {
        let o = document.createElement("li");
        o.innerHTML = `<div id='server'>\n    <div>\n      <img id='avatar' src='assets/img/icon.png' style="padding-top: 5px;">\n    </div>\n  <div style="display: inline;justify-items: center;margin-left: 10px;">\n    ${t}${e?`<br> <img id='flag-stanger' src=${function(t){if(!t)return"";for(var e=0;e<p.length;e++)if(p[e].country&&p[e].country.toLowerCase()===t.toLowerCase())return p[e].flag;return""}(e)} style="padding: 5px 5px 0 0;">`+e:""}\n  </div>`, messages.appendChild(o), r.scrollTo(0, r.scrollHeight)
    }

    function b() {
        n.width = window.innerWidth, n.height = window.innerHeight
    }(async () => {
        const t = await (async () => {
                const t = await fetch("https://api.ipify.org?format=json");
                return (await t.json()).ip
            })(),
            e = await (async t => {
                const e = `/location/${t}`,
                    o = await fetch(e);
                return (await o.json()).country_name
            })(t);
        c = e
    })(), w.on("oc", (t => {
        v.innerHTML = "Users online: " + t
    })), d.addEventListener("submit", (function(t) {
        if (t.preventDefault(), "" !== i.value && h) {
            let t = i.value;
            w.emit("message", t);
            let e = document.createElement("li");
            e.innerHTML = "<h4 id='you'>You: </h4>" + t, messages.appendChild(e), i.value = "", r.scrollTo(0, r.scrollHeight)
        }
    })), w.on("message", (function(t, e) {
        e ? x(t) : function(t) {
            let e = document.createElement("li");
            e.innerHTML = "<h4>Stranger: </h4>" + t, messages.appendChild(e), r.scrollTo(0, r.scrollHeight)
        }(t)
    })), j.on("open", (t => {
        o = t
    })), w.on("connect", (() => {
        navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia, navigator.mediaDevices.getUserMedia({
            video: {
                width: {
                    min: 480,
                    max: 1280
                },
                aspectRatio: 1.33333
            },
            audio: !0
        }).then((e => {
            t = e, document.getElementById("local-video").srcObject = t, t.active ? g = !0 : (g = !1, x("Webcam not detected, please refresh page and make sure your webcam permission are correctly set! (Chrome works best)"), t = {})
        })).catch((t => {
            console.error("Error accessing media devices.", t), g = !1, x("Webcam not detected, please refresh page and make sure your webcam permission are correctly set! (Chrome works best)")
        }))
    })), window.stopStream = function() {
        w.emit("stop", o, g), u = !1, r.innerHTML = "", document.getElementById("remote-video").srcObject = void 0, h = !1, document.getElementById("vidoff").innerHTML = "", l.innerHTML = "Start", document.getElementById("standby").style.display = "block", document.getElementById("liveStream").style.display = "none", document.getElementById("canvas").style.display = "block", document.getElementById("stop").style.backgroundColor = "rgba(255, 0, 0, 0.2)"
    }, window.joinRoom = function() {
        u = !0, l.innerHTML = "Next", document.getElementById("standby").style.display = "none", document.getElementById("liveStream").style.display = "block", document.getElementById("canvas").style.display = "block", document.getElementById("stop").style.backgroundColor = "rgba(255, 0, 0, 0.5)", x("Searching for a stranger..."), y = !0, h = !1, w.emit("join room", o, g, c), document.getElementById("remote-video").srcObject = void 0, j.on("call", (e => {
            e.answer(t), e.on("stream", (t => {
                document.getElementById("remote-video").srcObject = t
            }))
        }))
    }, w.on("user joined", ((c, s, n, m) => {
        a = s, f = m, w.emit("send peerid", c, o, m), r.innerHTML = "";
        try {
            ! function(t, e) {
                const o = j.call(t, e);
                o.on("stream", (t => {
                    document.getElementById("remote-video").srcObject = t
                }))
            }(s, t)
        } catch (t) {
            x("Media connection not established due to your webcam having an issue, Chat only."), w.emit("message", "Media connection not established due to stranger having a webcam error, He cannot see or hear you, Chat only.", !0)
        }
        x("Connection estabilished", m), document.getElementById("canvas").style.display = "none", h = !0, y = !1, n || (document.getElementById("vidoff").innerHTML = "Stranger has no video"), e = c
    })), w.on("other user", ((t, o) => {
        r.innerHTML = "", h = !0, y = !1, document.getElementById("canvas").style.display = "none", o || (document.getElementById("vidoff").innerHTML = "Stranger has no video"), e = t
    })), w.on("dc", (t => {
        document.getElementById("canvas").style.display = "block", document.getElementById("remote-video").srcObject = void 0, h = !1, r.innerHTML = "", joinRoom()
    })), w.on("other peer", ((t, e) => {
        a = t, f = e, x("Connection estabilished", e)
    })), document.querySelectorAll("span"), b(), window.onresize = b;
    var I = !0;
    ! function t() {
        (I = !I) || function(t) {
            for (var e = t.canvas.width, o = t.canvas.height, c = t.createImageData(e, o), a = new Uint32Array(c.data.buffer), f = a.length, s = 0; s < f;) a[s++] = (255 * Math.random() | 0) << 24;
            t.putImageData(c, 0, 0)
        }(m), requestAnimationFrame(t)
    }(), s.addEventListener("swiped-left", (function(t) {
        joinRoom()
    })), s.addEventListener("swiped-right", (function(t) {
        stopStream()
    }))
})();