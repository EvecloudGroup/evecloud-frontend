! function(e) {
    var t = {};

    function n(i) {
        if (t[i]) return t[i].exports;
        var r = t[i] = {
            i: i,
            l: !1,
            exports: {}
        };
        return e[i].call(r.exports, r, r.exports, n), r.l = !0, r.exports
    }
    n.m = e, n.c = t, n.d = function(e, t, i) {
        n.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: i
        })
    }, n.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }, n.t = function(e, t) {
        if (1 & t && (e = n(e)), 8 & t) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var i = Object.create(null);
        if (n.r(i), Object.defineProperty(i, "default", {
                enumerable: !0,
                value: e
            }), 2 & t && "string" != typeof e)
            for (var r in e) n.d(i, r, function(t) {
                return e[t]
            }.bind(null, r));
        return i
    }, n.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        } : function() {
            return e
        };
        return n.d(t, "a", t), t
    }, n.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, n.p = "", n(n.s = 1)
}([function(e, t) {
    e.exports = Quill
}, function(e, t, n) {
    "use strict";
    n.r(t);
    var i = n(0),
        r = n.n(i),
        o = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var i = t[n];
                    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
                }
            }
            return function(t, n, i) {
                return n && e(t.prototype, n), i && e(t, i), t
            }
        }(),
        a = function e(t, n, i) {
            null === t && (t = Function.prototype);
            var r = Object.getOwnPropertyDescriptor(t, n);
            if (void 0 === r) {
                var o = Object.getPrototypeOf(t);
                return null === o ? void 0 : e(o, n, i)
            }
            if ("value" in r) return r.value;
            var a = r.get;
            return void 0 !== a ? a.call(i) : void 0
        };

    function l(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }

    function s(e, t) {
        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !t || "object" != typeof t && "function" != typeof t ? e : t
    }
    var u = function(e) {
        function t() {
            return l(this, t), s(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
        }
        return function(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }(t, e), o(t, [{
            key: "deleteAt",
            value: function(e, n) {
                a(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "deleteAt", this).call(this, e, n), this.cache = {}
            }
        }], [{
            key: "create",
            value: function(e) {
                var n = a(t.__proto__ || Object.getPrototypeOf(t), "create", this).call(this, e);
                if (!0 === e) return n;
                var i = document.createElement("img");
                return i.setAttribute("src", e), n.appendChild(i), n
            }
        }, {
            key: "value",
            value: function(e) {
                var t = e.dataset;
                return {
                    src: t.src,
                    custom: t.custom
                }
            }
        }]), t
    }(r.a.import("blots/block"));
    u.blotName = "imageBlot", u.className = "image-uploading", u.tagName = "span", r.a.register({
        "formats/imageBlot": u
    });
    var c = u,
        f = (n(3), function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var i = t[n];
                    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
                }
            }
            return function(t, n, i) {
                return n && e(t.prototype, n), i && e(t, i), t
            }
        }());
    var d = function() {
        function e(t, n) {
            ! function(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, e), this.quill = t, this.options = n, this.range = null, "function" != typeof this.options.upload && console.warn("[Missing config] upload function that returns a promise is required"), this.quill.getModule("toolbar").addHandler("image", this.selectLocalImage.bind(this)), this.handleDrop = this.handleDrop.bind(this), this.handlePaste = this.handlePaste.bind(this), this.quill.root.addEventListener("drop", this.handleDrop, !1), this.quill.root.addEventListener("paste", this.handlePaste, !1)
        }
        return f(e, [{
            key: "selectLocalImage",
            value: function() {
                var e = this;
                this.range = this.quill.getSelection(), this.fileHolder = document.createElement("input"), this.fileHolder.setAttribute("type", "file"), this.fileHolder.setAttribute("accept", "image/*"), this.fileHolder.setAttribute("style", "visibility:hidden"), this.fileHolder.onchange = this.fileChanged.bind(this), document.body.appendChild(this.fileHolder), this.fileHolder.click(), window.requestAnimationFrame((function() {
                    document.body.removeChild(e.fileHolder)
                }))
            }
        }, {
            key: "handleDrop",
            value: function(e) {
                var t = this;
                if (e.stopPropagation(), e.preventDefault(), e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
                    if (document.caretRangeFromPoint) {
                        var n = document.getSelection(),
                            i = document.caretRangeFromPoint(e.clientX, e.clientY);
                        n && i && n.setBaseAndExtent(i.startContainer, i.startOffset, i.startContainer, i.startOffset)
                    } else {
                        var r = document.getSelection(),
                            o = document.caretPositionFromPoint(e.clientX, e.clientY);
                        r && o && r.setBaseAndExtent(o.offsetNode, o.offset, o.offsetNode, o.offset)
                    }
                    this.range = this.quill.getSelection();
                    var a = e.dataTransfer.files[0];
                    setTimeout((function() {
                        t.range = t.quill.getSelection(), t.readAndUploadFile(a)
                    }), 0)
                }
            }
        }, {
            key: "handlePaste",
            value: function(e) {
                var t = this,
                    n = e.clipboardData || window.clipboardData;
                if (n && (n.items || n.files))
                    for (var i = n.items || n.files, r = /^image\/(jpe?g|gif|png|svg|webp)$/i, o = 0; o < i.length; o++) r.test(i[o].type) && function() {
                        var n = i[o].getAsFile ? i[o].getAsFile() : i[o];
                        n && (t.range = t.quill.getSelection(), e.preventDefault(), setTimeout((function() {
                            t.range = t.quill.getSelection(), t.readAndUploadFile(n)
                        }), 0))
                    }()
            }
        }, {
            key: "readAndUploadFile",
            value: function(e) {
                var t = this,
                    n = !1,
                    i = new FileReader;
                i.addEventListener("load", (function() {
                    if (!n) {
                        var e = i.result;
                        t.insertBase64Image(e)
                    }
                }), !1), e && i.readAsDataURL(e), this.options.upload(e).then((function(e) {
                    t.insertToEditor(e)
                }), (function(e) {
                    n = !0, t.removeBase64Image(), console.warn(e)
                }))
            }
        }, {
            key: "fileChanged",
            value: function() {
                var e = this.fileHolder.files[0];
                this.readAndUploadFile(e)
            }
        }, {
            key: "insertBase64Image",
            value: function(e) {
                var t = this.range;
                this.quill.insertEmbed(t.index, c.blotName, "" + e, "user")
            }
        }, {
            key: "insertToEditor",
            value: function(e) {
                var t = this.range;
                this.quill.deleteText(t.index, 3, "user"), this.quill.insertEmbed(t.index, "image", "" + e, "user"), t.index++, this.quill.setSelection(t, "user")
            }
        }, {
            key: "removeBase64Image",
            value: function() {
                var e = this.range;
                this.quill.deleteText(e.index, 3, "user")
            }
        }]), e
    }();
    window.ImageUploader = d;
    t.default = d
}, , function(e, t) {}]);