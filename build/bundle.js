(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/alea/alea.js
  var require_alea = __commonJS({
    "node_modules/alea/alea.js"(exports, module) {
      (function(root, factory) {
        if (typeof exports === "object") {
          module.exports = factory();
        } else if (typeof define === "function" && define.amd) {
          define(factory);
        } else {
          root.Alea = factory();
        }
      })(exports, function() {
        "use strict";
        Alea.importState = function(i) {
          var random2 = new Alea();
          random2.importState(i);
          return random2;
        };
        return Alea;
        function Alea() {
          return function(args) {
            var s0 = 0;
            var s1 = 0;
            var s2 = 0;
            var c = 1;
            if (args.length == 0) {
              args = [+/* @__PURE__ */ new Date()];
            }
            var mash = Mash();
            s0 = mash(" ");
            s1 = mash(" ");
            s2 = mash(" ");
            for (var i = 0; i < args.length; i++) {
              s0 -= mash(args[i]);
              if (s0 < 0) {
                s0 += 1;
              }
              s1 -= mash(args[i]);
              if (s1 < 0) {
                s1 += 1;
              }
              s2 -= mash(args[i]);
              if (s2 < 0) {
                s2 += 1;
              }
            }
            mash = null;
            var random2 = function() {
              var t = 2091639 * s0 + c * 23283064365386963e-26;
              s0 = s1;
              s1 = s2;
              return s2 = t - (c = t | 0);
            };
            random2.next = random2;
            random2.uint32 = function() {
              return random2() * 4294967296;
            };
            random2.fract53 = function() {
              return random2() + (random2() * 2097152 | 0) * 11102230246251565e-32;
            };
            random2.version = "Alea 0.9";
            random2.args = args;
            random2.exportState = function() {
              return [s0, s1, s2, c];
            };
            random2.importState = function(i2) {
              s0 = +i2[0] || 0;
              s1 = +i2[1] || 0;
              s2 = +i2[2] || 0;
              c = +i2[3] || 0;
            };
            return random2;
          }(Array.prototype.slice.call(arguments));
        }
        function Mash() {
          var n = 4022871197;
          var mash = function(data) {
            data = data.toString();
            for (var i = 0; i < data.length; i++) {
              n += data.charCodeAt(i);
              var h = 0.02519603282416938 * n;
              n = h >>> 0;
              h -= n;
              h *= n;
              n = h >>> 0;
              h -= n;
              n += h * 4294967296;
            }
            return (n >>> 0) * 23283064365386963e-26;
          };
          mash.version = "Mash 0.9";
          return mash;
        }
      });
    }
  });

  // node_modules/gl-matrix/esm/common.js
  var EPSILON = 1e-6;
  var ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array;
  var RANDOM = Math.random;
  var degree = Math.PI / 180;
  if (!Math.hypot)
    Math.hypot = function() {
      var y = 0, i = arguments.length;
      while (i--) {
        y += arguments[i] * arguments[i];
      }
      return Math.sqrt(y);
    };

  // node_modules/gl-matrix/esm/mat4.js
  var mat4_exports = {};
  __export(mat4_exports, {
    add: () => add,
    adjoint: () => adjoint,
    clone: () => clone,
    copy: () => copy,
    create: () => create,
    determinant: () => determinant,
    equals: () => equals,
    exactEquals: () => exactEquals,
    frob: () => frob,
    fromQuat: () => fromQuat,
    fromQuat2: () => fromQuat2,
    fromRotation: () => fromRotation,
    fromRotationTranslation: () => fromRotationTranslation,
    fromRotationTranslationScale: () => fromRotationTranslationScale,
    fromRotationTranslationScaleOrigin: () => fromRotationTranslationScaleOrigin,
    fromScaling: () => fromScaling,
    fromTranslation: () => fromTranslation,
    fromValues: () => fromValues,
    fromXRotation: () => fromXRotation,
    fromYRotation: () => fromYRotation,
    fromZRotation: () => fromZRotation,
    frustum: () => frustum,
    getRotation: () => getRotation,
    getScaling: () => getScaling,
    getTranslation: () => getTranslation,
    identity: () => identity,
    invert: () => invert,
    lookAt: () => lookAt,
    mul: () => mul,
    multiply: () => multiply,
    multiplyScalar: () => multiplyScalar,
    multiplyScalarAndAdd: () => multiplyScalarAndAdd,
    ortho: () => ortho,
    orthoNO: () => orthoNO,
    orthoZO: () => orthoZO,
    perspective: () => perspective,
    perspectiveFromFieldOfView: () => perspectiveFromFieldOfView,
    perspectiveNO: () => perspectiveNO,
    perspectiveZO: () => perspectiveZO,
    rotate: () => rotate,
    rotateX: () => rotateX,
    rotateY: () => rotateY,
    rotateZ: () => rotateZ,
    scale: () => scale,
    set: () => set,
    str: () => str,
    sub: () => sub,
    subtract: () => subtract,
    targetTo: () => targetTo,
    translate: () => translate,
    transpose: () => transpose
  });
  function create() {
    var out = new ARRAY_TYPE(16);
    if (ARRAY_TYPE != Float32Array) {
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[11] = 0;
      out[12] = 0;
      out[13] = 0;
      out[14] = 0;
    }
    out[0] = 1;
    out[5] = 1;
    out[10] = 1;
    out[15] = 1;
    return out;
  }
  function clone(a) {
    var out = new ARRAY_TYPE(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  }
  function copy(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  }
  function fromValues(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    var out = new ARRAY_TYPE(16);
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m03;
    out[4] = m10;
    out[5] = m11;
    out[6] = m12;
    out[7] = m13;
    out[8] = m20;
    out[9] = m21;
    out[10] = m22;
    out[11] = m23;
    out[12] = m30;
    out[13] = m31;
    out[14] = m32;
    out[15] = m33;
    return out;
  }
  function set(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m03;
    out[4] = m10;
    out[5] = m11;
    out[6] = m12;
    out[7] = m13;
    out[8] = m20;
    out[9] = m21;
    out[10] = m22;
    out[11] = m23;
    out[12] = m30;
    out[13] = m31;
    out[14] = m32;
    out[15] = m33;
    return out;
  }
  function identity(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function transpose(out, a) {
    if (out === a) {
      var a01 = a[1], a02 = a[2], a03 = a[3];
      var a12 = a[6], a13 = a[7];
      var a23 = a[11];
      out[1] = a[4];
      out[2] = a[8];
      out[3] = a[12];
      out[4] = a01;
      out[6] = a[9];
      out[7] = a[13];
      out[8] = a02;
      out[9] = a12;
      out[11] = a[14];
      out[12] = a03;
      out[13] = a13;
      out[14] = a23;
    } else {
      out[0] = a[0];
      out[1] = a[4];
      out[2] = a[8];
      out[3] = a[12];
      out[4] = a[1];
      out[5] = a[5];
      out[6] = a[9];
      out[7] = a[13];
      out[8] = a[2];
      out[9] = a[6];
      out[10] = a[10];
      out[11] = a[14];
      out[12] = a[3];
      out[13] = a[7];
      out[14] = a[11];
      out[15] = a[15];
    }
    return out;
  }
  function invert(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    var b00 = a00 * a11 - a01 * a10;
    var b01 = a00 * a12 - a02 * a10;
    var b02 = a00 * a13 - a03 * a10;
    var b03 = a01 * a12 - a02 * a11;
    var b04 = a01 * a13 - a03 * a11;
    var b05 = a02 * a13 - a03 * a12;
    var b06 = a20 * a31 - a21 * a30;
    var b07 = a20 * a32 - a22 * a30;
    var b08 = a20 * a33 - a23 * a30;
    var b09 = a21 * a32 - a22 * a31;
    var b10 = a21 * a33 - a23 * a31;
    var b11 = a22 * a33 - a23 * a32;
    var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det) {
      return null;
    }
    det = 1 / det;
    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return out;
  }
  function adjoint(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
    out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
    out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
    out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
    out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
    out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
    return out;
  }
  function determinant(a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    var b00 = a00 * a11 - a01 * a10;
    var b01 = a00 * a12 - a02 * a10;
    var b02 = a00 * a13 - a03 * a10;
    var b03 = a01 * a12 - a02 * a11;
    var b04 = a01 * a13 - a03 * a11;
    var b05 = a02 * a13 - a03 * a12;
    var b06 = a20 * a31 - a21 * a30;
    var b07 = a20 * a32 - a22 * a30;
    var b08 = a20 * a33 - a23 * a30;
    var b09 = a21 * a32 - a22 * a31;
    var b10 = a21 * a33 - a23 * a31;
    var b11 = a22 * a33 - a23 * a32;
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  }
  function multiply(out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return out;
  }
  function translate(out, a, v) {
    var x = v[0], y = v[1], z = v[2];
    var a00, a01, a02, a03;
    var a10, a11, a12, a13;
    var a20, a21, a22, a23;
    if (a === out) {
      out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
      out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
      out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
      out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
      a00 = a[0];
      a01 = a[1];
      a02 = a[2];
      a03 = a[3];
      a10 = a[4];
      a11 = a[5];
      a12 = a[6];
      a13 = a[7];
      a20 = a[8];
      a21 = a[9];
      a22 = a[10];
      a23 = a[11];
      out[0] = a00;
      out[1] = a01;
      out[2] = a02;
      out[3] = a03;
      out[4] = a10;
      out[5] = a11;
      out[6] = a12;
      out[7] = a13;
      out[8] = a20;
      out[9] = a21;
      out[10] = a22;
      out[11] = a23;
      out[12] = a00 * x + a10 * y + a20 * z + a[12];
      out[13] = a01 * x + a11 * y + a21 * z + a[13];
      out[14] = a02 * x + a12 * y + a22 * z + a[14];
      out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }
    return out;
  }
  function scale(out, a, v) {
    var x = v[0], y = v[1], z = v[2];
    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  }
  function rotate(out, a, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2];
    var len2 = Math.hypot(x, y, z);
    var s, c, t;
    var a00, a01, a02, a03;
    var a10, a11, a12, a13;
    var a20, a21, a22, a23;
    var b00, b01, b02;
    var b10, b11, b12;
    var b20, b21, b22;
    if (len2 < EPSILON) {
      return null;
    }
    len2 = 1 / len2;
    x *= len2;
    y *= len2;
    z *= len2;
    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    b00 = x * x * t + c;
    b01 = y * x * t + z * s;
    b02 = z * x * t - y * s;
    b10 = x * y * t - z * s;
    b11 = y * y * t + c;
    b12 = z * y * t + x * s;
    b20 = x * z * t + y * s;
    b21 = y * z * t - x * s;
    b22 = z * z * t + c;
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;
    if (a !== out) {
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    return out;
  }
  function rotateX(out, a, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var a10 = a[4];
    var a11 = a[5];
    var a12 = a[6];
    var a13 = a[7];
    var a20 = a[8];
    var a21 = a[9];
    var a22 = a[10];
    var a23 = a[11];
    if (a !== out) {
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
  }
  function rotateY(out, a, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var a00 = a[0];
    var a01 = a[1];
    var a02 = a[2];
    var a03 = a[3];
    var a20 = a[8];
    var a21 = a[9];
    var a22 = a[10];
    var a23 = a[11];
    if (a !== out) {
      out[4] = a[4];
      out[5] = a[5];
      out[6] = a[6];
      out[7] = a[7];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
  }
  function rotateZ(out, a, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var a00 = a[0];
    var a01 = a[1];
    var a02 = a[2];
    var a03 = a[3];
    var a10 = a[4];
    var a11 = a[5];
    var a12 = a[6];
    var a13 = a[7];
    if (a !== out) {
      out[8] = a[8];
      out[9] = a[9];
      out[10] = a[10];
      out[11] = a[11];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
  }
  function fromTranslation(out, v) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
  }
  function fromScaling(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = v[1];
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = v[2];
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function fromRotation(out, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2];
    var len2 = Math.hypot(x, y, z);
    var s, c, t;
    if (len2 < EPSILON) {
      return null;
    }
    len2 = 1 / len2;
    x *= len2;
    y *= len2;
    z *= len2;
    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;
    out[0] = x * x * t + c;
    out[1] = y * x * t + z * s;
    out[2] = z * x * t - y * s;
    out[3] = 0;
    out[4] = x * y * t - z * s;
    out[5] = y * y * t + c;
    out[6] = z * y * t + x * s;
    out[7] = 0;
    out[8] = x * z * t + y * s;
    out[9] = y * z * t - x * s;
    out[10] = z * z * t + c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function fromXRotation(out, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = c;
    out[6] = s;
    out[7] = 0;
    out[8] = 0;
    out[9] = -s;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function fromYRotation(out, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    out[0] = c;
    out[1] = 0;
    out[2] = -s;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = s;
    out[9] = 0;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function fromZRotation(out, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    out[0] = c;
    out[1] = s;
    out[2] = 0;
    out[3] = 0;
    out[4] = -s;
    out[5] = c;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function fromRotationTranslation(out, q, v) {
    var x = q[0], y = q[1], z = q[2], w = q[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
  }
  function fromQuat2(out, a) {
    var translation = new ARRAY_TYPE(3);
    var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7];
    var magnitude = bx * bx + by * by + bz * bz + bw * bw;
    if (magnitude > 0) {
      translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2 / magnitude;
      translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2 / magnitude;
      translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2 / magnitude;
    } else {
      translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
      translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
      translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
    }
    fromRotationTranslation(out, a, translation);
    return out;
  }
  function getTranslation(out, mat) {
    out[0] = mat[12];
    out[1] = mat[13];
    out[2] = mat[14];
    return out;
  }
  function getScaling(out, mat) {
    var m11 = mat[0];
    var m12 = mat[1];
    var m13 = mat[2];
    var m21 = mat[4];
    var m22 = mat[5];
    var m23 = mat[6];
    var m31 = mat[8];
    var m32 = mat[9];
    var m33 = mat[10];
    out[0] = Math.hypot(m11, m12, m13);
    out[1] = Math.hypot(m21, m22, m23);
    out[2] = Math.hypot(m31, m32, m33);
    return out;
  }
  function getRotation(out, mat) {
    var scaling = new ARRAY_TYPE(3);
    getScaling(scaling, mat);
    var is1 = 1 / scaling[0];
    var is2 = 1 / scaling[1];
    var is3 = 1 / scaling[2];
    var sm11 = mat[0] * is1;
    var sm12 = mat[1] * is2;
    var sm13 = mat[2] * is3;
    var sm21 = mat[4] * is1;
    var sm22 = mat[5] * is2;
    var sm23 = mat[6] * is3;
    var sm31 = mat[8] * is1;
    var sm32 = mat[9] * is2;
    var sm33 = mat[10] * is3;
    var trace = sm11 + sm22 + sm33;
    var S = 0;
    if (trace > 0) {
      S = Math.sqrt(trace + 1) * 2;
      out[3] = 0.25 * S;
      out[0] = (sm23 - sm32) / S;
      out[1] = (sm31 - sm13) / S;
      out[2] = (sm12 - sm21) / S;
    } else if (sm11 > sm22 && sm11 > sm33) {
      S = Math.sqrt(1 + sm11 - sm22 - sm33) * 2;
      out[3] = (sm23 - sm32) / S;
      out[0] = 0.25 * S;
      out[1] = (sm12 + sm21) / S;
      out[2] = (sm31 + sm13) / S;
    } else if (sm22 > sm33) {
      S = Math.sqrt(1 + sm22 - sm11 - sm33) * 2;
      out[3] = (sm31 - sm13) / S;
      out[0] = (sm12 + sm21) / S;
      out[1] = 0.25 * S;
      out[2] = (sm23 + sm32) / S;
    } else {
      S = Math.sqrt(1 + sm33 - sm11 - sm22) * 2;
      out[3] = (sm12 - sm21) / S;
      out[0] = (sm31 + sm13) / S;
      out[1] = (sm23 + sm32) / S;
      out[2] = 0.25 * S;
    }
    return out;
  }
  function fromRotationTranslationScale(out, q, v, s) {
    var x = q[0], y = q[1], z = q[2], w = q[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    var sx = s[0];
    var sy = s[1];
    var sz = s[2];
    out[0] = (1 - (yy + zz)) * sx;
    out[1] = (xy + wz) * sx;
    out[2] = (xz - wy) * sx;
    out[3] = 0;
    out[4] = (xy - wz) * sy;
    out[5] = (1 - (xx + zz)) * sy;
    out[6] = (yz + wx) * sy;
    out[7] = 0;
    out[8] = (xz + wy) * sz;
    out[9] = (yz - wx) * sz;
    out[10] = (1 - (xx + yy)) * sz;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
  }
  function fromRotationTranslationScaleOrigin(out, q, v, s, o) {
    var x = q[0], y = q[1], z = q[2], w = q[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    var sx = s[0];
    var sy = s[1];
    var sz = s[2];
    var ox = o[0];
    var oy = o[1];
    var oz = o[2];
    var out0 = (1 - (yy + zz)) * sx;
    var out1 = (xy + wz) * sx;
    var out2 = (xz - wy) * sx;
    var out4 = (xy - wz) * sy;
    var out5 = (1 - (xx + zz)) * sy;
    var out6 = (yz + wx) * sy;
    var out8 = (xz + wy) * sz;
    var out9 = (yz - wx) * sz;
    var out10 = (1 - (xx + yy)) * sz;
    out[0] = out0;
    out[1] = out1;
    out[2] = out2;
    out[3] = 0;
    out[4] = out4;
    out[5] = out5;
    out[6] = out6;
    out[7] = 0;
    out[8] = out8;
    out[9] = out9;
    out[10] = out10;
    out[11] = 0;
    out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
    out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
    out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
    out[15] = 1;
    return out;
  }
  function fromQuat(out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var yx = y * x2;
    var yy = y * y2;
    var zx = z * x2;
    var zy = z * y2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;
    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;
    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function frustum(out, left, right, bottom, top, near, far) {
    var rl = 1 / (right - left);
    var tb = 1 / (top - bottom);
    var nf = 1 / (near - far);
    out[0] = near * 2 * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = near * 2 * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = far * near * 2 * nf;
    out[15] = 0;
    return out;
  }
  function perspectiveNO(out, fovy, aspect, near, far) {
    var f = 1 / Math.tan(fovy / 2), nf;
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
      nf = 1 / (near - far);
      out[10] = (far + near) * nf;
      out[14] = 2 * far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -2 * near;
    }
    return out;
  }
  var perspective = perspectiveNO;
  function perspectiveZO(out, fovy, aspect, near, far) {
    var f = 1 / Math.tan(fovy / 2), nf;
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
      nf = 1 / (near - far);
      out[10] = far * nf;
      out[14] = far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -near;
    }
    return out;
  }
  function perspectiveFromFieldOfView(out, fov, near, far) {
    var upTan = Math.tan(fov.upDegrees * Math.PI / 180);
    var downTan = Math.tan(fov.downDegrees * Math.PI / 180);
    var leftTan = Math.tan(fov.leftDegrees * Math.PI / 180);
    var rightTan = Math.tan(fov.rightDegrees * Math.PI / 180);
    var xScale = 2 / (leftTan + rightTan);
    var yScale = 2 / (upTan + downTan);
    out[0] = xScale;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = yScale;
    out[6] = 0;
    out[7] = 0;
    out[8] = -((leftTan - rightTan) * xScale * 0.5);
    out[9] = (upTan - downTan) * yScale * 0.5;
    out[10] = far / (near - far);
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = far * near / (near - far);
    out[15] = 0;
    return out;
  }
  function orthoNO(out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right);
    var bt = 1 / (bottom - top);
    var nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
  }
  var ortho = orthoNO;
  function orthoZO(out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right);
    var bt = 1 / (bottom - top);
    var nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = near * nf;
    out[15] = 1;
    return out;
  }
  function lookAt(out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len2;
    var eyex = eye[0];
    var eyey = eye[1];
    var eyez = eye[2];
    var upx = up[0];
    var upy = up[1];
    var upz = up[2];
    var centerx = center[0];
    var centery = center[1];
    var centerz = center[2];
    if (Math.abs(eyex - centerx) < EPSILON && Math.abs(eyey - centery) < EPSILON && Math.abs(eyez - centerz) < EPSILON) {
      return identity(out);
    }
    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;
    len2 = 1 / Math.hypot(z0, z1, z2);
    z0 *= len2;
    z1 *= len2;
    z2 *= len2;
    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len2 = Math.hypot(x0, x1, x2);
    if (!len2) {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    } else {
      len2 = 1 / len2;
      x0 *= len2;
      x1 *= len2;
      x2 *= len2;
    }
    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;
    len2 = Math.hypot(y0, y1, y2);
    if (!len2) {
      y0 = 0;
      y1 = 0;
      y2 = 0;
    } else {
      len2 = 1 / len2;
      y0 *= len2;
      y1 *= len2;
      y2 *= len2;
    }
    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;
    return out;
  }
  function targetTo(out, eye, target, up) {
    var eyex = eye[0], eyey = eye[1], eyez = eye[2], upx = up[0], upy = up[1], upz = up[2];
    var z0 = eyex - target[0], z1 = eyey - target[1], z2 = eyez - target[2];
    var len2 = z0 * z0 + z1 * z1 + z2 * z2;
    if (len2 > 0) {
      len2 = 1 / Math.sqrt(len2);
      z0 *= len2;
      z1 *= len2;
      z2 *= len2;
    }
    var x0 = upy * z2 - upz * z1, x1 = upz * z0 - upx * z2, x2 = upx * z1 - upy * z0;
    len2 = x0 * x0 + x1 * x1 + x2 * x2;
    if (len2 > 0) {
      len2 = 1 / Math.sqrt(len2);
      x0 *= len2;
      x1 *= len2;
      x2 *= len2;
    }
    out[0] = x0;
    out[1] = x1;
    out[2] = x2;
    out[3] = 0;
    out[4] = z1 * x2 - z2 * x1;
    out[5] = z2 * x0 - z0 * x2;
    out[6] = z0 * x1 - z1 * x0;
    out[7] = 0;
    out[8] = z0;
    out[9] = z1;
    out[10] = z2;
    out[11] = 0;
    out[12] = eyex;
    out[13] = eyey;
    out[14] = eyez;
    out[15] = 1;
    return out;
  }
  function str(a) {
    return "mat4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ", " + a[9] + ", " + a[10] + ", " + a[11] + ", " + a[12] + ", " + a[13] + ", " + a[14] + ", " + a[15] + ")";
  }
  function frob(a) {
    return Math.hypot(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15]);
  }
  function add(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    out[4] = a[4] + b[4];
    out[5] = a[5] + b[5];
    out[6] = a[6] + b[6];
    out[7] = a[7] + b[7];
    out[8] = a[8] + b[8];
    out[9] = a[9] + b[9];
    out[10] = a[10] + b[10];
    out[11] = a[11] + b[11];
    out[12] = a[12] + b[12];
    out[13] = a[13] + b[13];
    out[14] = a[14] + b[14];
    out[15] = a[15] + b[15];
    return out;
  }
  function subtract(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    out[4] = a[4] - b[4];
    out[5] = a[5] - b[5];
    out[6] = a[6] - b[6];
    out[7] = a[7] - b[7];
    out[8] = a[8] - b[8];
    out[9] = a[9] - b[9];
    out[10] = a[10] - b[10];
    out[11] = a[11] - b[11];
    out[12] = a[12] - b[12];
    out[13] = a[13] - b[13];
    out[14] = a[14] - b[14];
    out[15] = a[15] - b[15];
    return out;
  }
  function multiplyScalar(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    out[4] = a[4] * b;
    out[5] = a[5] * b;
    out[6] = a[6] * b;
    out[7] = a[7] * b;
    out[8] = a[8] * b;
    out[9] = a[9] * b;
    out[10] = a[10] * b;
    out[11] = a[11] * b;
    out[12] = a[12] * b;
    out[13] = a[13] * b;
    out[14] = a[14] * b;
    out[15] = a[15] * b;
    return out;
  }
  function multiplyScalarAndAdd(out, a, b, scale3) {
    out[0] = a[0] + b[0] * scale3;
    out[1] = a[1] + b[1] * scale3;
    out[2] = a[2] + b[2] * scale3;
    out[3] = a[3] + b[3] * scale3;
    out[4] = a[4] + b[4] * scale3;
    out[5] = a[5] + b[5] * scale3;
    out[6] = a[6] + b[6] * scale3;
    out[7] = a[7] + b[7] * scale3;
    out[8] = a[8] + b[8] * scale3;
    out[9] = a[9] + b[9] * scale3;
    out[10] = a[10] + b[10] * scale3;
    out[11] = a[11] + b[11] * scale3;
    out[12] = a[12] + b[12] * scale3;
    out[13] = a[13] + b[13] * scale3;
    out[14] = a[14] + b[14] * scale3;
    out[15] = a[15] + b[15] * scale3;
    return out;
  }
  function exactEquals(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
  }
  function equals(a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    var a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7];
    var a8 = a[8], a9 = a[9], a10 = a[10], a11 = a[11];
    var a12 = a[12], a13 = a[13], a14 = a[14], a15 = a[15];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    var b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7];
    var b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11];
    var b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= EPSILON * Math.max(1, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= EPSILON * Math.max(1, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= EPSILON * Math.max(1, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= EPSILON * Math.max(1, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= EPSILON * Math.max(1, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= EPSILON * Math.max(1, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= EPSILON * Math.max(1, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= EPSILON * Math.max(1, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= EPSILON * Math.max(1, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= EPSILON * Math.max(1, Math.abs(a15), Math.abs(b15));
  }
  var mul = multiply;
  var sub = subtract;

  // node_modules/gl-matrix/esm/vec3.js
  var vec3_exports = {};
  __export(vec3_exports, {
    add: () => add2,
    angle: () => angle,
    bezier: () => bezier,
    ceil: () => ceil,
    clone: () => clone2,
    copy: () => copy2,
    create: () => create2,
    cross: () => cross,
    dist: () => dist,
    distance: () => distance,
    div: () => div,
    divide: () => divide,
    dot: () => dot,
    equals: () => equals2,
    exactEquals: () => exactEquals2,
    floor: () => floor,
    forEach: () => forEach,
    fromValues: () => fromValues2,
    hermite: () => hermite,
    inverse: () => inverse,
    len: () => len,
    length: () => length,
    lerp: () => lerp,
    max: () => max,
    min: () => min,
    mul: () => mul2,
    multiply: () => multiply2,
    negate: () => negate,
    normalize: () => normalize,
    random: () => random,
    rotateX: () => rotateX2,
    rotateY: () => rotateY2,
    rotateZ: () => rotateZ2,
    round: () => round,
    scale: () => scale2,
    scaleAndAdd: () => scaleAndAdd,
    set: () => set2,
    sqrDist: () => sqrDist,
    sqrLen: () => sqrLen,
    squaredDistance: () => squaredDistance,
    squaredLength: () => squaredLength,
    str: () => str2,
    sub: () => sub2,
    subtract: () => subtract2,
    transformMat3: () => transformMat3,
    transformMat4: () => transformMat4,
    transformQuat: () => transformQuat,
    zero: () => zero
  });
  function create2() {
    var out = new ARRAY_TYPE(3);
    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
    }
    return out;
  }
  function clone2(a) {
    var out = new ARRAY_TYPE(3);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
  }
  function length(a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    return Math.hypot(x, y, z);
  }
  function fromValues2(x, y, z) {
    var out = new ARRAY_TYPE(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  }
  function copy2(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
  }
  function set2(out, x, y, z) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  }
  function add2(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
  }
  function subtract2(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
  }
  function multiply2(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    return out;
  }
  function divide(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    return out;
  }
  function ceil(out, a) {
    out[0] = Math.ceil(a[0]);
    out[1] = Math.ceil(a[1]);
    out[2] = Math.ceil(a[2]);
    return out;
  }
  function floor(out, a) {
    out[0] = Math.floor(a[0]);
    out[1] = Math.floor(a[1]);
    out[2] = Math.floor(a[2]);
    return out;
  }
  function min(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    return out;
  }
  function max(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    return out;
  }
  function round(out, a) {
    out[0] = Math.round(a[0]);
    out[1] = Math.round(a[1]);
    out[2] = Math.round(a[2]);
    return out;
  }
  function scale2(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    return out;
  }
  function scaleAndAdd(out, a, b, scale3) {
    out[0] = a[0] + b[0] * scale3;
    out[1] = a[1] + b[1] * scale3;
    out[2] = a[2] + b[2] * scale3;
    return out;
  }
  function distance(a, b) {
    var x = b[0] - a[0];
    var y = b[1] - a[1];
    var z = b[2] - a[2];
    return Math.hypot(x, y, z);
  }
  function squaredDistance(a, b) {
    var x = b[0] - a[0];
    var y = b[1] - a[1];
    var z = b[2] - a[2];
    return x * x + y * y + z * z;
  }
  function squaredLength(a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    return x * x + y * y + z * z;
  }
  function negate(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    return out;
  }
  function inverse(out, a) {
    out[0] = 1 / a[0];
    out[1] = 1 / a[1];
    out[2] = 1 / a[2];
    return out;
  }
  function normalize(out, a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var len2 = x * x + y * y + z * z;
    if (len2 > 0) {
      len2 = 1 / Math.sqrt(len2);
    }
    out[0] = a[0] * len2;
    out[1] = a[1] * len2;
    out[2] = a[2] * len2;
    return out;
  }
  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }
  function cross(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2];
    var bx = b[0], by = b[1], bz = b[2];
    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
  }
  function lerp(out, a, b, t) {
    var ax = a[0];
    var ay = a[1];
    var az = a[2];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    return out;
  }
  function hermite(out, a, b, c, d, t) {
    var factorTimes2 = t * t;
    var factor1 = factorTimes2 * (2 * t - 3) + 1;
    var factor2 = factorTimes2 * (t - 2) + t;
    var factor3 = factorTimes2 * (t - 1);
    var factor4 = factorTimes2 * (3 - 2 * t);
    out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
    out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
    out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
    return out;
  }
  function bezier(out, a, b, c, d, t) {
    var inverseFactor = 1 - t;
    var inverseFactorTimesTwo = inverseFactor * inverseFactor;
    var factorTimes2 = t * t;
    var factor1 = inverseFactorTimesTwo * inverseFactor;
    var factor2 = 3 * t * inverseFactorTimesTwo;
    var factor3 = 3 * factorTimes2 * inverseFactor;
    var factor4 = factorTimes2 * t;
    out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
    out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
    out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
    return out;
  }
  function random(out, scale3) {
    scale3 = scale3 || 1;
    var r = RANDOM() * 2 * Math.PI;
    var z = RANDOM() * 2 - 1;
    var zScale = Math.sqrt(1 - z * z) * scale3;
    out[0] = Math.cos(r) * zScale;
    out[1] = Math.sin(r) * zScale;
    out[2] = z * scale3;
    return out;
  }
  function transformMat4(out, a, m) {
    var x = a[0], y = a[1], z = a[2];
    var w = m[3] * x + m[7] * y + m[11] * z + m[15];
    w = w || 1;
    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
    return out;
  }
  function transformMat3(out, a, m) {
    var x = a[0], y = a[1], z = a[2];
    out[0] = x * m[0] + y * m[3] + z * m[6];
    out[1] = x * m[1] + y * m[4] + z * m[7];
    out[2] = x * m[2] + y * m[5] + z * m[8];
    return out;
  }
  function transformQuat(out, a, q) {
    var qx = q[0], qy = q[1], qz = q[2], qw = q[3];
    var x = a[0], y = a[1], z = a[2];
    var uvx = qy * z - qz * y, uvy = qz * x - qx * z, uvz = qx * y - qy * x;
    var uuvx = qy * uvz - qz * uvy, uuvy = qz * uvx - qx * uvz, uuvz = qx * uvy - qy * uvx;
    var w2 = qw * 2;
    uvx *= w2;
    uvy *= w2;
    uvz *= w2;
    uuvx *= 2;
    uuvy *= 2;
    uuvz *= 2;
    out[0] = x + uvx + uuvx;
    out[1] = y + uvy + uuvy;
    out[2] = z + uvz + uuvz;
    return out;
  }
  function rotateX2(out, a, b, rad) {
    var p = [], r = [];
    p[0] = a[0] - b[0];
    p[1] = a[1] - b[1];
    p[2] = a[2] - b[2];
    r[0] = p[0];
    r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
    r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad);
    out[0] = r[0] + b[0];
    out[1] = r[1] + b[1];
    out[2] = r[2] + b[2];
    return out;
  }
  function rotateY2(out, a, b, rad) {
    var p = [], r = [];
    p[0] = a[0] - b[0];
    p[1] = a[1] - b[1];
    p[2] = a[2] - b[2];
    r[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad);
    r[1] = p[1];
    r[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad);
    out[0] = r[0] + b[0];
    out[1] = r[1] + b[1];
    out[2] = r[2] + b[2];
    return out;
  }
  function rotateZ2(out, a, b, rad) {
    var p = [], r = [];
    p[0] = a[0] - b[0];
    p[1] = a[1] - b[1];
    p[2] = a[2] - b[2];
    r[0] = p[0] * Math.cos(rad) - p[1] * Math.sin(rad);
    r[1] = p[0] * Math.sin(rad) + p[1] * Math.cos(rad);
    r[2] = p[2];
    out[0] = r[0] + b[0];
    out[1] = r[1] + b[1];
    out[2] = r[2] + b[2];
    return out;
  }
  function angle(a, b) {
    var ax = a[0], ay = a[1], az = a[2], bx = b[0], by = b[1], bz = b[2], mag1 = Math.sqrt(ax * ax + ay * ay + az * az), mag2 = Math.sqrt(bx * bx + by * by + bz * bz), mag = mag1 * mag2, cosine = mag && dot(a, b) / mag;
    return Math.acos(Math.min(Math.max(cosine, -1), 1));
  }
  function zero(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    return out;
  }
  function str2(a) {
    return "vec3(" + a[0] + ", " + a[1] + ", " + a[2] + ")";
  }
  function exactEquals2(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
  }
  function equals2(a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2];
    var b0 = b[0], b1 = b[1], b2 = b[2];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2));
  }
  var sub2 = subtract2;
  var mul2 = multiply2;
  var div = divide;
  var dist = distance;
  var sqrDist = squaredDistance;
  var len = length;
  var sqrLen = squaredLength;
  var forEach = function() {
    var vec = create2();
    return function(a, stride, offset, count, fn, arg) {
      var i, l;
      if (!stride) {
        stride = 3;
      }
      if (!offset) {
        offset = 0;
      }
      if (count) {
        l = Math.min(count * stride + offset, a.length);
      } else {
        l = a.length;
      }
      for (i = offset; i < l; i += stride) {
        vec[0] = a[i];
        vec[1] = a[i + 1];
        vec[2] = a[i + 2];
        fn(vec, vec, arg);
        a[i] = vec[0];
        a[i + 1] = vec[1];
        a[i + 2] = vec[2];
      }
      return a;
    };
  }();

  // node_modules/simplex-noise/dist/esm/simplex-noise.js
  var F2 = 0.5 * (Math.sqrt(3) - 1);
  var G2 = (3 - Math.sqrt(3)) / 6;
  var F3 = 1 / 3;
  var G3 = 1 / 6;
  var F4 = (Math.sqrt(5) - 1) / 4;
  var G4 = (5 - Math.sqrt(5)) / 20;
  var fastFloor = (x) => Math.floor(x) | 0;
  var grad2 = /* @__PURE__ */ new Float64Array([
    1,
    1,
    -1,
    1,
    1,
    -1,
    -1,
    -1,
    1,
    0,
    -1,
    0,
    1,
    0,
    -1,
    0,
    0,
    1,
    0,
    -1,
    0,
    1,
    0,
    -1
  ]);
  function createNoise2D(random2 = Math.random) {
    const perm = buildPermutationTable(random2);
    const permGrad2x = new Float64Array(perm).map((v) => grad2[v % 12 * 2]);
    const permGrad2y = new Float64Array(perm).map((v) => grad2[v % 12 * 2 + 1]);
    return function noise2D(x, y) {
      let n0 = 0;
      let n1 = 0;
      let n2 = 0;
      const s = (x + y) * F2;
      const i = fastFloor(x + s);
      const j = fastFloor(y + s);
      const t = (i + j) * G2;
      const X0 = i - t;
      const Y0 = j - t;
      const x0 = x - X0;
      const y0 = y - Y0;
      let i1, j1;
      if (x0 > y0) {
        i1 = 1;
        j1 = 0;
      } else {
        i1 = 0;
        j1 = 1;
      }
      const x1 = x0 - i1 + G2;
      const y1 = y0 - j1 + G2;
      const x2 = x0 - 1 + 2 * G2;
      const y2 = y0 - 1 + 2 * G2;
      const ii = i & 255;
      const jj = j & 255;
      let t0 = 0.5 - x0 * x0 - y0 * y0;
      if (t0 >= 0) {
        const gi0 = ii + perm[jj];
        const g0x = permGrad2x[gi0];
        const g0y = permGrad2y[gi0];
        t0 *= t0;
        n0 = t0 * t0 * (g0x * x0 + g0y * y0);
      }
      let t1 = 0.5 - x1 * x1 - y1 * y1;
      if (t1 >= 0) {
        const gi1 = ii + i1 + perm[jj + j1];
        const g1x = permGrad2x[gi1];
        const g1y = permGrad2y[gi1];
        t1 *= t1;
        n1 = t1 * t1 * (g1x * x1 + g1y * y1);
      }
      let t2 = 0.5 - x2 * x2 - y2 * y2;
      if (t2 >= 0) {
        const gi2 = ii + 1 + perm[jj + 1];
        const g2x = permGrad2x[gi2];
        const g2y = permGrad2y[gi2];
        t2 *= t2;
        n2 = t2 * t2 * (g2x * x2 + g2y * y2);
      }
      return 70 * (n0 + n1 + n2);
    };
  }
  function buildPermutationTable(random2) {
    const tableSize = 512;
    const p = new Uint8Array(tableSize);
    for (let i = 0; i < tableSize / 2; i++) {
      p[i] = i;
    }
    for (let i = 0; i < tableSize / 2 - 1; i++) {
      const r = i + ~~(random2() * (256 - i));
      const aux = p[i];
      p[i] = p[r];
      p[r] = aux;
    }
    for (let i = 256; i < tableSize; i++) {
      p[i] = p[i - 256];
    }
    return p;
  }

  // src/scene.ts
  var import_alea = __toESM(require_alea());
  var SpotLight = class {
    constructor(pos, dir, color, luminance) {
      this.pos = pos;
      this.dir = dir;
      this.color = color;
      this.luminance = luminance;
    }
    encode() {
      return [...this.pos, 0, ...this.color, this.luminance];
    }
    shadow_view() {
      const perspective2 = mat4_exports.create();
      mat4_exports.perspective(perspective2, Math.PI / 2, 1, 1, 200);
      const look_at = vec3_exports.create();
      vec3_exports.add(look_at, this.pos, this.dir);
      const view = mat4_exports.create();
      mat4_exports.lookAt(view, this.pos, look_at, [0, 0, 1]);
      const mvp_shadow = mat4_exports.create();
      mat4_exports.mul(mvp_shadow, perspective2, view);
      return mvp_shadow;
    }
  };
  var NoiseOctave = class {
    constructor(f, s_x, s_y, s_z) {
      this.f = f;
      this.s_x = s_x;
      this.s_y = s_y;
      this.s_z = s_z;
    }
    at(x, y) {
      return (this.f(x * this.s_x, y * this.s_y) + 1) * this.s_z;
    }
  };
  var Ground = class {
    dim_x;
    dim_y;
    res_x;
    res_y;
    major_octave;
    minor_octave;
    texture_octave;
    constructor() {
      this.dim_x = 300;
      this.dim_y = 300;
      this.res_x = 0.3;
      this.res_y = 0.3;
      this.major_octave = new NoiseOctave(createNoise2D((0, import_alea.default)(10)), 0.01, 0.01, 5);
      this.minor_octave = new NoiseOctave(createNoise2D((0, import_alea.default)(20)), 0.1, 0.1, 2);
      this.texture_octave = new NoiseOctave(createNoise2D((0, import_alea.default)(30)), 1, 1, 0.02);
    }
    encode_vertices() {
      let vertices = [];
      for (let yi = 0; yi < this.dim_y; yi++) {
        for (let xi = 0; xi < this.dim_x; xi++) {
          const x = xi * this.res_x;
          const y = yi * this.res_y;
          const h = this.height(x, y);
          const { dx, dy } = this.dheight(x, y);
          const n = vec3_exports.fromValues(dx, dy, 1);
          vec3_exports.normalize(n, n);
          let color = [1, 1, 1, 0];
          if (h == 3) {
            color = [38 / 255, 113 / 255, 170 / 255, 0];
          } else {
            color = [0.2, 0.5, 0.2, 0];
          }
          vertices.push(x, y, h, ...n, ...color);
        }
      }
      for (let xi = 0; xi < this.dim_x; xi++) {
        const x = xi * this.res_x;
        const y = 0;
        const h = -2;
        const n = [0, 1, 0];
        let color = [0, 0, 0, 0];
        vertices.push(x, y, h, ...n, ...color);
      }
      for (let xi = 0; xi < this.dim_x; xi++) {
        const x = xi * this.res_x;
        const y = (this.dim_y - 1) * this.res_y;
        const h = -2;
        const n = [0, 1, 0];
        let color = [0, 0, 0, 0];
        vertices.push(x, y, h, ...n, ...color);
      }
      for (let yi = 0; yi < this.dim_y; yi++) {
        const x = 0;
        const y = yi * this.res_y;
        const h = -2;
        const n = [0, 1, 0];
        let color = [0, 0, 0, 0];
        vertices.push(x, y, h, ...n, ...color);
      }
      for (let yi = 0; yi < this.dim_y; yi++) {
        const x = (this.dim_x - 1) * this.res_x;
        const y = yi * this.res_y;
        const h = -2;
        const n = [0, 1, 0];
        let color = [0, 0, 0, 0];
        vertices.push(x, y, h, ...n, ...color);
      }
      vertices.push(0, 0, -2, 0, 0, -1, 0, 0, 0, 0);
      vertices.push(this.res_x * this.dim_x, 0, -2, 0, 0, -1, 0, 0, 0, 0);
      vertices.push(0, this.res_y * this.dim_y, -2, 0, 0, -1, 0, 0, 0, 0);
      vertices.push(this.res_x * this.dim_x, this.res_y * this.dim_y, -2, 0, 0, -1, 0, 0, 0, 0);
      let indices = [];
      const ct = this.dim_x * this.dim_y;
      for (let x = 0; x < this.dim_x - 1; x++) {
        for (let y = 0; y < this.dim_y - 1; y++) {
          indices.push(x + y * this.dim_x);
          indices.push(x + 1 + y * this.dim_x);
          indices.push(x + (y + 1) * this.dim_x);
          indices.push(x + 1 + y * this.dim_x);
          indices.push(x + 1 + (y + 1) * this.dim_x);
          indices.push(x + (y + 1) * this.dim_x);
        }
      }
      for (let x = 0; x < this.dim_x - 1; x++) {
        indices.push(x + 1 + 0 * this.dim_x);
        indices.push(x + 0 * this.dim_x);
        indices.push(ct + x + 0 * this.dim_x);
        indices.push(x + 1 + 0 * this.dim_x);
        indices.push(ct + x + 0 * this.dim_x);
        indices.push(ct + (x + 1) + 0 * this.dim_x);
      }
      for (let x = 0; x < this.dim_x - 1; x++) {
        indices.push(x + 1 + (this.dim_y - 1) * this.dim_x);
        indices.push(ct + x + this.dim_x);
        indices.push(x + (this.dim_y - 1) * this.dim_x);
        indices.push(x + 1 + (this.dim_y - 1) * this.dim_x);
        indices.push(ct + (x + 1) + this.dim_x);
        indices.push(ct + x + this.dim_x);
      }
      for (let y = 0; y < this.dim_y - 1; y++) {
        indices.push(y * this.dim_x);
        indices.push((y + 1) * this.dim_x);
        indices.push(ct + this.dim_x * 2 + y);
        indices.push(ct + this.dim_x * 2 + y);
        indices.push((y + 1) * this.dim_x);
        indices.push(ct + 1 + this.dim_x * 2 + y);
      }
      for (let y = 0; y < this.dim_y - 1; y++) {
        indices.push(this.dim_x - 1 + y * this.dim_x);
        indices.push(ct + this.dim_x * 2 + this.dim_y + y);
        indices.push(this.dim_x - 1 + (y + 1) * this.dim_x);
        indices.push(this.dim_x - 1 + (y + 1) * this.dim_x);
        indices.push(ct + this.dim_x * 2 + this.dim_y + y);
        indices.push(ct + 1 + this.dim_x * 2 + this.dim_y + y);
      }
      const ct2 = ct + this.dim_x * 2 + this.dim_y * 2;
      indices.push(ct2);
      indices.push(ct2 + 2);
      indices.push(ct2 + 1);
      indices.push(ct2 + 2);
      indices.push(ct2 + 3);
      indices.push(ct2 + 1);
      console.log(`${vertices.length / 10} verts, ${indices.length} indices`);
      return { vertices: new Float32Array(vertices), indices: new Uint32Array(indices) };
    }
    height(x, y) {
      const major = this.major_octave.at(x, y);
      const minor = this.minor_octave.at(x, y);
      const texture = this.texture_octave.at(x, y);
      if (major + minor < 3) {
        return 3;
      }
      return major + minor + texture;
    }
    dheight(x, y) {
      const h = this.height(x, y);
      const ep = 1e-3;
      return { dx: -(this.height(x + ep, y) - h) / ep, dy: -(this.height(x, y + ep) - h) / ep };
    }
  };
  var Scene = class {
    lights;
    ground;
    ambient_light;
    constructor() {
      this.lights = [new SpotLight([5, -10, 10], [0, 1, 0], [1, 1, 1], 1)];
      this.ground = new Ground();
      this.ambient_light = 0.1;
    }
    encode_ground_vertices() {
      return this.ground.encode_vertices();
    }
    encode_lights() {
      return new Float32Array(this.lights.flatMap((s) => s.encode()));
    }
    shadow_perspectives() {
      return this.lights[0].shadow_view();
    }
    light_count() {
      return this.lights.length;
    }
    ambient_luminance() {
      return this.ambient_light;
    }
  };

  // src/shaders/postprocess.wgpu
  var postprocess_default = "@group(0) @binding(0)\r\nvar tex_sampler: sampler;\r\n\r\n@group(0) @binding(1)\r\nvar color_tex: texture_2d<f32>;\r\n\r\n@group(0) @binding(2)\r\nvar position_tex: texture_2d<f32>;\r\n\r\n@group(0) @binding(3)\r\nvar normal_tex: texture_2d<f32>;\r\n\r\nstruct VertexOut {\r\n  @builtin(position) position : vec4f,\r\n  @location(0) uv: vec2f,\r\n}\r\n\r\nconst PI = 3.1415926;\r\n\r\n@vertex\r\nfn vertex_main(@location(0) position: vec2f, @location(1) uv: vec2f) -> VertexOut\r\n{\r\n  var output : VertexOut;\r\n  output.position = vec4f(position, 1,1);\r\n  output.uv = uv;\r\n  return output;\r\n}\r\n\r\nfn average_kernal(start: vec2u, size: vec2u) -> vec4f {\r\n    var sum = vec4f();\r\n    for(var x: u32 = 0; x < size.x; x++){\r\n        for(var y: u32 = 0; y < size.y; y++){\r\n            sum += textureLoad(color_tex, start + vec2u(x,y), 0);\r\n        }\r\n    }\r\n    return sum / f32(size.x * size.y);\r\n}\r\n\r\nfn gauss(x: i32, y: i32, a: f32) -> f32{\r\n    return exp(-f32(x*x+y*y)/(2.0 * a*a));\r\n}\r\n\r\nfn gauss_kernal(start: vec2u, radius: u32, a: f32) -> vec4f {\r\n    var sum = vec4f();\r\n    var coeff_sum = 0.0;\r\n    let r = i32(radius);\r\n    let start_depth = textureLoad(position_tex, start, 0).w;\r\n    for(var x: i32 = -r + 1; x < r; x++){\r\n        for(var y: i32 = -r + 1; y < r; y++){\r\n            let g = gauss(x,y,a);\r\n            let depth = textureLoad(position_tex, vec2i(start) + vec2i(x,y), 0).w;\r\n            if(depth + 1 > start_depth){\r\n                sum += g * textureLoad(color_tex, vec2i(start) + vec2i(x,y), 0);\r\n                coeff_sum += g;\r\n            }\r\n        }\r\n    }\r\n    return sum / coeff_sum;\r\n}\r\n\r\nfn luminance(color: vec4f) -> f32{\r\n    return color.x + color.y + color.z;\r\n}\r\n\r\noverride kernalx: u32 = 4;\r\noverride kernaly: u32 = 4;\r\n\r\n@fragment\r\nfn fragment_main(fragData: VertexOut) -> @location(0) vec4f\r\n{\r\n    let dim = textureDimensions(color_tex);\r\n    let iuv = vec2u(fragData.uv * vec2f(dim));\r\n    let pos = textureLoad(position_tex, iuv, 0);\r\n    let norm = textureLoad(normal_tex, iuv, 0);\r\n    let ambient = 0.5;\r\n    let directional = max(dot(norm.xyz, vec3(0, 0.3, 0.9)), 0);\r\n    let light = ambient + directional * 0.5;\r\n    let depth = pos.w;\r\n    var color = vec3f();\r\n    if(depth > 200){\r\n        color = gauss_kernal(iuv, kernalx, depth/300).xyz;\r\n    } else {\r\n        color = textureLoad(color_tex, iuv, 0).xyz;\r\n    }\r\n    return vec4(color.xyz * light, 1.0);\r\n}\r\n";

  // src/shaders/compute.wgpu
  var compute_default = "@group(0) @binding(0)\r\nvar input_image : texture_2d<f32>;\r\n\r\n@group(0) @binding(1)\r\nvar output_image : texture_storage_2d<rgba8unorm, write>;\r\n\r\noverride dimx: u32;\r\noverride dimy: u32;\r\n\r\nstruct Settings {\r\n  output_size: vec2u,\r\n}\r\n\r\nfn reduce(a: vec4f, b: vec4f) -> vec4f {\r\n  return a+b;\r\n}\r\n\r\n@compute @workgroup_size(dimx, dimy)\r\nfn main(\r\n  @builtin(global_invocation_id)\r\n  global_id : vec3u,\r\n\r\n  @builtin(local_invocation_id)\r\n  local_id : vec3u,\r\n) {\r\n  let dims = textureDimensions(output_image);\r\n  if(local_id.x >= dims.x || local_id.y >= dims.y){\r\n    return;\r\n  }\r\n  var val = vec4f(0,0,0,0);\r\n  for(var x:u32 = 0; x < 2; x++){\r\n    for(var y:u32 = 0; y < 2; y++){\r\n      val = reduce(val, textureLoad(input_image, global_id.xy*2+vec2u(x,y), 0));\r\n    }\r\n  }\r\n  textureStore(output_image, global_id.xy, val/4.0);\r\n}";

  // src/shaders/color.wgpu
  var color_default = "@group(0) @binding(0)\r\nvar<uniform> camera: mat4x4f;\r\n\r\n@group(0) @binding(1)\r\nvar tex_sampler: sampler; \r\n\r\n@group(1) @binding(2)\r\nvar diffuse_texture : texture_2d<f32>;\r\n\r\n@group(1) @binding(3)\r\nvar opacity_texture : texture_2d<f32>;\r\n\r\noverride has_opacity: bool;\r\n\r\nstruct VertexOut {\r\n  @builtin(position) position : vec4f,\r\n  @location(0) normal : vec3f,\r\n  @location(1) uv : vec2f,\r\n}\r\n\r\n@vertex\r\nfn vertex_main(@location(0) position: vec3f,\r\n               @location(1) normal: vec3f,\r\n               @location(2) uv: vec2f) -> VertexOut\r\n{\r\n  var output : VertexOut;\r\n  output.position = (camera * vec4f(position, 1));\r\n  output.normal = normal;\r\n  output.uv = vec2(uv.x, 1-uv.y);\r\n  return output;\r\n}\r\n\r\nstruct FragmentOut {\r\n  @location(0) color: vec4f,\r\n  @location(1) position: vec4f,\r\n  @location(2) normal: vec4f,\r\n};\r\n\r\n@fragment\r\nfn fragment_main(fragData: VertexOut) -> FragmentOut\r\n{\r\n  let color = textureSample(diffuse_texture, tex_sampler, fragData.uv);\r\n  var opacity = color.w; \r\n  if(has_opacity){\r\n    opacity = textureSample(opacity_texture, tex_sampler, fragData.uv).w;\r\n  }\r\n  if(opacity < 0.01){\r\n    discard;\r\n  }\r\n\r\n  /*let directional_light = dot(fragData.normal, vec3(0.0,0.3,0.9))*0.5;\r\n  let ambient_light = 0.5;\r\n  let lighted_color = color * (directional_light + ambient_light);\r\n*/\r\n  var frag = FragmentOut();\r\n  frag.color = vec4(color.xyz, opacity);\r\n  frag.normal = vec4f(fragData.normal,0.0);\r\n  frag.position = fragData.position;\r\n  return frag;\r\n}";

  // src/shaders/skybox.wgpu
  var skybox_default = "struct VertexOut {\r\n  @builtin(position) position : vec4f,\r\n  @location(0) uv: vec2f,\r\n}\r\n\r\n@vertex\r\nfn vertex_main(@location(0) position: vec2f, @location(1) uv: vec2f) -> VertexOut\r\n{\r\n  var output : VertexOut;\r\n  output.position = vec4f(position, 1,1);\r\n  output.uv = uv;\r\n  return output;\r\n}\r\n\r\nstruct FragmentOut {\r\n  @location(0) color: vec4f,\r\n  @location(1) position: vec4f,\r\n  @location(2) normal: vec4f,\r\n};\r\n\r\n@fragment\r\nfn fragment_main(fragData: VertexOut) -> FragmentOut\r\n{\r\n  var frag = FragmentOut();\r\n  frag.color = vec4f(135.0/255.0,206.0/255.0, 235.0/255.0,1);\r\n  frag.position = vec4f(0,0,0,10000);\r\n  return frag;\r\n}\r\n";

  // src/ShaderSrc.ts
  function compute_shader_src() {
    return compute_default;
  }
  function color_shader_src() {
    return color_default;
  }
  function skybox_shader_src() {
    return skybox_default;
  }
  function postprocess_shader_src() {
    return postprocess_default;
  }

  // src/MergedBuffer.ts
  var FLOAT_SIZE = 4;
  var U32_SIZE = 4;
  var MergedBufer = class {
    merged_vertices;
    merged_indices;
    vertex_size;
    index_size;
    vertex_cap;
    index_cap;
    index_starts;
    vertex_buffer;
    index_buffer;
    device;
    constructor(device, initial_size = 1024) {
      if (initial_size < 128)
        initial_size = 128;
      this.device = device;
      this.merged_vertices = new Float32Array(initial_size);
      this.merged_indices = new Uint32Array(initial_size);
      this.vertex_buffer = this.device.createBuffer({
        size: FLOAT_SIZE * initial_size,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX
      });
      this.index_buffer = this.device.createBuffer({
        size: FLOAT_SIZE * initial_size,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.INDEX
      });
      this.vertex_size = 0;
      this.index_size = 0;
      this.vertex_cap = initial_size;
      this.index_cap = initial_size;
    }
    add_geometry(vertices, indices) {
      indices = indices.slice();
      for (let i = 0; i < indices.length; i++) {
        indices[i] += this.index_size;
      }
      let vertex_offset = this.push_vertices(vertices);
      let index_offset = this.push_indices(indices);
      return { vertices: { start: vertex_offset, count: vertices.length }, indices: { start: index_offset, count: indices.length } };
    }
    rearange(ordered_ranges) {
      let new_indices = new Uint32Array(this.index_cap);
      let new_vertices = new Float32Array(this.vertex_cap);
      let index_ptr = 0;
      let vertex_ptr = 0;
      let new_ranges = ordered_ranges.map((range) => {
        new_indices.set(this.merged_indices.subarray(range.indices.start, range.indices.start + range.indices.count), index_ptr);
        new_vertices.set(this.merged_vertices.subarray(range.vertices.start, range.vertices.start + range.vertices.count), vertex_ptr);
        let new_range = { indices: { start: index_ptr, count: range.indices.count }, vertices: { start: vertex_ptr, count: range.vertices.count } };
        index_ptr += range.indices.count;
        vertex_ptr += range.vertices.count;
        for (let i = new_range.indices.start; i < new_range.indices.start + new_range.indices.count; i++) {
          new_indices[i] += new_range.indices.start - range.indices.start;
        }
        return new_range;
      });
      this.merged_indices = new_indices;
      this.merged_vertices = new_vertices;
      this.device.queue.writeBuffer(this.index_buffer, 0, new_indices);
      this.device.queue.writeBuffer(this.vertex_buffer, 0, new_vertices);
      return new_ranges;
    }
    new_cap(current_cap, required_size) {
      return Math.max(current_cap * 2, required_size);
    }
    push_indices(indices) {
      let push_index = this.index_size;
      if (this.index_size + indices.length > this.index_cap) {
        this.index_cap = this.new_cap(this.index_cap, this.index_size + indices.length);
        let new_merged_indices = new Uint32Array(this.index_cap);
        new_merged_indices.set(this.merged_indices);
        this.merged_indices = new_merged_indices;
        this.index_buffer.destroy();
        this.index_buffer = this.device.createBuffer({
          size: this.index_cap * U32_SIZE,
          usage: this.index_buffer.usage
        });
        this.device.queue.writeBuffer(this.index_buffer, 0, this.merged_indices);
      }
      this.device.queue.writeBuffer(this.index_buffer, this.index_size * U32_SIZE, indices);
      this.merged_indices.set(indices, this.index_size);
      this.index_size += indices.length;
      return push_index;
    }
    push_vertices(vertices) {
      let push_index = this.vertex_size;
      if (this.vertex_size + vertices.length > this.vertex_cap) {
        this.vertex_cap = this.new_cap(this.vertex_cap, this.vertex_size + vertices.length);
        let new_merged_vertices = new Float32Array(this.vertex_cap);
        new_merged_vertices.set(this.merged_vertices);
        this.merged_vertices = new_merged_vertices;
        this.vertex_buffer.destroy();
        this.vertex_buffer = this.device.createBuffer({
          size: this.vertex_cap * FLOAT_SIZE,
          usage: this.vertex_buffer.usage
        });
        this.device.queue.writeBuffer(this.vertex_buffer, 0, this.merged_vertices);
      }
      this.device.queue.writeBuffer(this.vertex_buffer, this.vertex_size * FLOAT_SIZE, vertices);
      this.merged_vertices.set(vertices, this.vertex_size);
      this.vertex_size += vertices.length;
      return push_index;
    }
  };

  // src/BindGroupCache.ts
  var BindGroupCache = class {
    device;
    cache;
    cache_size;
    constructor(device) {
      this.device = device;
      this.cache = /* @__PURE__ */ new Map();
      this.cache_size = 0;
    }
    key_equal(a, b) {
      if (a.length != b.length)
        return false;
      a.sort((x, y) => x.binding - y.binding);
      b.sort((x, y) => x.binding - y.binding);
      for (let i = 0; i < a.length; i++) {
        if (a[i].binding != b[i].binding)
          return false;
        if (a[i].resource != b[i].resource)
          return false;
      }
      return true;
    }
    createBindGroup(descriptor) {
      let bucket = this.cache.get(descriptor.layout);
      if (bucket) {
        let entry = bucket.bind_groups.find((v) => this.key_equal(v.key, descriptor.entries));
        if (entry) {
          return entry.value;
        }
      } else {
        this.cache.set(descriptor.layout, { bind_groups: [] });
      }
      let bind_group = this.device.createBindGroup(descriptor);
      bind_group.label = "" + this.cache_size;
      this.cache_size++;
      this.cache.get(descriptor.layout).bind_groups.push({ key: descriptor.entries, value: bind_group });
      return bind_group;
    }
  };

  // src/MipMapper.ts
  var MipMaper = class {
    device;
    shader;
    pipeline;
    bind_layout;
    wg_dimension = [16, 16];
    constructor(device) {
      this.device = device;
      this.shader = this.device.createShaderModule({ code: compute_shader_src(), label: "compute shader" });
      this.pipeline = this.device.createComputePipeline({
        layout: "auto",
        compute: {
          module: this.shader,
          entryPoint: "main",
          constants: {
            dimx: this.wg_dimension[0],
            dimy: this.wg_dimension[1]
          }
        }
      });
      this.bind_layout = this.pipeline.getBindGroupLayout(0);
    }
    isPow2(v) {
      return v && !(v & v - 1);
    }
    mip_level_count(width, height) {
      if (!this.isPow2(width) || !this.isPow2(height) || width < 2 || height < 2) {
        return 1;
      }
      return Math.floor(Math.min(Math.log2(width), Math.log2(height)));
    }
    generate_mip_maps(tex) {
      if (!this.isPow2(tex.width) || !this.isPow2(tex.height) || tex.width < 2 || tex.height < 2) {
        return tex;
      }
      for (let i = 0; i < tex.mipLevelCount - 1; i++) {
        let src_level = tex.createView({
          baseMipLevel: i,
          mipLevelCount: 1
        });
        let dst_level = tex.createView({
          baseMipLevel: i + 1,
          mipLevelCount: 1
        });
        let binding = this.device.createBindGroup({
          layout: this.bind_layout,
          entries: [
            {
              binding: 0,
              resource: src_level
            },
            {
              binding: 1,
              resource: dst_level
            }
          ]
        });
        let command_encoder = this.device.createCommandEncoder();
        let compute_pass = command_encoder.beginComputePass();
        compute_pass.setPipeline(this.pipeline);
        compute_pass.setBindGroup(0, binding);
        compute_pass.dispatchWorkgroups(Math.ceil(tex.width / (2 << i) / this.wg_dimension[0]), Math.ceil(tex.height / (2 << i) / this.wg_dimension[1]));
        compute_pass.end();
        this.device.queue.submit([command_encoder.finish()]);
      }
    }
  };

  // src/App.ts
  var FLOAT_SIZE2 = 4;
  var App = class {
    constructor(device, context, res_x, res_y) {
      this.device = device;
      this.context = context;
      this.res_x = res_x;
      this.res_y = res_y;
      this.scene = new Scene();
      this.bind_group_cache = new BindGroupCache(device);
      this.camera = this.make_camera();
      this.raster = this.setup_raster();
      this.mipmapper = new MipMaper(this.device);
      ;
    }
    camera;
    scene;
    raster;
    mipmapper;
    clear_color = { r: 0, g: 0.5, b: 1, a: 1 };
    texture_cache = /* @__PURE__ */ new Map();
    forward_layout;
    bind_group_cache;
    get_texture(texture) {
      if (!this.texture_cache.get(texture.data)) {
        let tex = this.device.createTexture({
          size: [texture.width, texture.height],
          format: "rgba8unorm",
          usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.STORAGE_BINDING,
          mipLevelCount: this.mipmapper.mip_level_count(texture.width, texture.height)
        });
        if (texture.data) {
          this.device.queue.copyExternalImageToTexture({ source: texture.data }, { texture: tex }, { width: texture.width, height: texture.height });
        }
        this.mipmapper.generate_mip_maps(tex);
        let view = tex.createView();
        this.texture_cache.set(texture.data, { tex, view });
      }
      return this.texture_cache.get(texture.data);
    }
    make_camera() {
      let mat = mat4_exports.create();
      mat4_exports.identity(mat);
      const buffer = this.device.createBuffer({
        size: mat.length * FLOAT_SIZE2,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM
      });
      this.device.queue.writeBuffer(buffer, 0, new Float32Array(mat));
      return { mat, buffer };
    }
    set_camera(mat) {
      this.camera.mat = mat;
      this.device.queue.writeBuffer(this.camera.buffer, 0, new Float32Array(mat));
    }
    add_mesh(mesh) {
      let vertices = new Float32Array(mesh.vertices.length / 3 * 8);
      let indices = new Uint32Array(mesh.indices);
      for (let i = 0; i < mesh.vertices.length / 3; i++) {
        vertices[i * 8 + 0] = mesh.vertices[i * 3 + 0] / 50;
        vertices[i * 8 + 1] = mesh.vertices[i * 3 + 2] / 50;
        vertices[i * 8 + 2] = mesh.vertices[i * 3 + 1] / 50;
        vertices[i * 8 + 3] = mesh.normals[i * 3 + 0];
        vertices[i * 8 + 4] = mesh.normals[i * 3 + 1];
        vertices[i * 8 + 5] = mesh.normals[i * 3 + 2];
        vertices[i * 8 + 6] = mesh.uvs[i * 2 + 0];
        vertices[i * 8 + 7] = mesh.uvs[i * 2 + 1];
      }
      let diffuse = this.get_texture(mesh.material.diffuse);
      let bind_group;
      let opacity = mesh.material.opacity ? this.get_texture(mesh.material.opacity) : diffuse;
      bind_group = this.bind_group_cache.createBindGroup({
        layout: this.forward_layout,
        entries: [
          {
            binding: 2,
            //diffuse view
            resource: diffuse.view
          },
          {
            binding: 3,
            //opacity view
            resource: opacity.view
          }
        ]
      });
      if (mesh.material.opacity) {
        let range = this.raster.forward_diffuse_opacity_pass.geometry_buffer.add_geometry(vertices, indices);
        let geo = {
          range,
          bind_groups: [bind_group]
        };
        this.raster.forward_diffuse_opacity_pass.geometries.push(geo);
      } else {
        let range = this.raster.forward_diffuse_pass.geometry_buffer.add_geometry(vertices, indices);
        let geo = {
          range,
          bind_groups: [bind_group]
        };
        this.raster.forward_diffuse_pass.geometries.push(geo);
      }
    }
    optimize_buffers() {
      this.optimize_pass_buffers(this.raster.forward_diffuse_opacity_pass);
      this.optimize_pass_buffers(this.raster.forward_diffuse_pass);
    }
    sort_materials(pass) {
      pass.geometries.sort((a, b) => a.bind_groups[0].label.localeCompare(b.bind_groups[0].label));
    }
    optimize_pass_buffers(pass) {
      this.sort_materials(pass);
      let ranges = pass.geometries.map((g) => g.range);
      let new_ranges = pass.geometry_buffer.rearange(ranges);
      for (let i = 0; i < new_ranges.length; i++) {
        pass.geometries[i].range = new_ranges[i];
      }
      pass.optimized_geometries = this.merge_geometries(pass.geometries);
    }
    setup_raster() {
      const forward_shader = this.device.createShaderModule({ code: color_shader_src(), label: "color shader" });
      const postprocess_shader = this.device.createShaderModule({ code: postprocess_shader_src(), label: "postprocess shader" });
      const skybox_shader = this.device.createShaderModule({ code: skybox_shader_src(), label: "skybox shader" });
      const full_screen_verts = new Float32Array([
        1,
        3,
        1,
        -1,
        -3,
        -1,
        -1,
        1,
        1,
        -1,
        1,
        1
      ]);
      const fullscreen_indices = new Uint32Array([
        0,
        1,
        2
      ]);
      let gbuffer_dimensions = [this.context.canvas.width, this.context.canvas.height];
      let depth_buffer = this.device.createTexture({
        size: gbuffer_dimensions,
        format: "depth32float",
        usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
        label: "depth buffer"
      });
      const gbuffer_color = this.device.createTexture({
        size: gbuffer_dimensions,
        usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
        format: navigator.gpu.getPreferredCanvasFormat(),
        label: "gbuffer color"
      });
      console.log("Canvas format ", navigator.gpu.getPreferredCanvasFormat());
      const gbuffer_position = this.device.createTexture({
        size: gbuffer_dimensions,
        usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
        format: "rgba32float",
        label: "gbuffer position"
      });
      const gbuffer_normal = this.device.createTexture({
        size: gbuffer_dimensions,
        usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
        format: "rgba16float",
        label: "gbuffer normal"
      });
      let filtering_tex_sampler = this.device.createSampler({
        addressModeU: "repeat",
        addressModeV: "repeat",
        magFilter: "linear",
        minFilter: "linear"
      });
      let nearest_tex_sampler = this.device.createSampler({
        magFilter: "nearest",
        minFilter: "nearest"
      });
      const uv_2d_vertex_layout = [
        {
          attributes: [
            {
              shaderLocation: 0,
              // position
              offset: 0,
              format: "float32x2"
            },
            {
              shaderLocation: 1,
              offset: 2 * FLOAT_SIZE2,
              format: "float32x2"
            }
          ],
          arrayStride: 4 * FLOAT_SIZE2,
          stepMode: "vertex"
        }
      ];
      const forward_vertex_layout = [
        {
          attributes: [
            {
              shaderLocation: 0,
              // position
              offset: 0,
              format: "float32x3"
            },
            {
              shaderLocation: 1,
              // normal
              offset: 12,
              format: "float32x3"
            },
            {
              shaderLocation: 2,
              // uv
              offset: 24,
              format: "float32x2"
            }
          ],
          arrayStride: 32,
          stepMode: "vertex"
        }
      ];
      const skybox_bind_group_layout = this.device.createBindGroupLayout({
        entries: [],
        label: "skybox bind group layout"
      });
      const postprocess_bind_group_layout = this.device.createBindGroupLayout({
        entries: [
          {
            binding: 0,
            visibility: GPUShaderStage.FRAGMENT,
            sampler: {
              type: "filtering"
            }
          },
          {
            binding: 1,
            visibility: GPUShaderStage.FRAGMENT,
            texture: {
              sampleType: "float",
              viewDimension: "2d"
            }
          },
          {
            binding: 2,
            visibility: GPUShaderStage.FRAGMENT,
            texture: {
              sampleType: "unfilterable-float",
              viewDimension: "2d"
            }
          },
          {
            binding: 3,
            visibility: GPUShaderStage.FRAGMENT,
            texture: {
              sampleType: "unfilterable-float",
              viewDimension: "2d"
            }
          }
        ],
        label: "postprocess bind group layout"
      });
      const forward_bind_group_frame_layout = this.device.createBindGroupLayout({
        entries: [
          {
            binding: 0,
            //camera
            visibility: GPUShaderStage.VERTEX,
            buffer: {
              type: "uniform"
            }
          },
          {
            binding: 1,
            //sampler
            visibility: GPUShaderStage.FRAGMENT,
            sampler: {
              type: "filtering"
            }
          }
        ],
        label: "forward bind group layout"
      });
      const forward_bind_group_material_layout = this.device.createBindGroupLayout({
        entries: [
          {
            binding: 2,
            //diffuse tex
            visibility: GPUShaderStage.FRAGMENT,
            texture: {
              sampleType: "float",
              viewDimension: "2d",
              multisampled: false
            }
          },
          {
            binding: 3,
            //opacity tex
            visibility: GPUShaderStage.FRAGMENT,
            texture: {
              sampleType: "float",
              viewDimension: "2d",
              multisampled: false
            }
          }
        ],
        label: "forward bind group material layout"
      });
      this.forward_layout = forward_bind_group_material_layout;
      const postprocess_layout = this.device.createPipelineLayout({
        bindGroupLayouts: [postprocess_bind_group_layout],
        label: "postprocess layout"
      });
      const skybox_layout = this.device.createPipelineLayout({
        bindGroupLayouts: [skybox_bind_group_layout],
        label: "skybox layout"
      });
      const forward_layout = this.device.createPipelineLayout({
        bindGroupLayouts: [forward_bind_group_frame_layout, forward_bind_group_material_layout],
        label: "forward layout"
      });
      const skybox_bind_group = this.bind_group_cache.createBindGroup({
        layout: skybox_bind_group_layout,
        entries: []
      });
      const forward_bind_group = this.bind_group_cache.createBindGroup({
        layout: forward_bind_group_frame_layout,
        entries: [
          {
            binding: 0,
            //camera
            resource: {
              buffer: this.camera.buffer
            }
          },
          {
            binding: 1,
            //tex sampler
            resource: filtering_tex_sampler
          }
        ]
      });
      const postprocess_bind_group = this.bind_group_cache.createBindGroup({
        layout: postprocess_bind_group_layout,
        entries: [
          {
            binding: 0,
            resource: nearest_tex_sampler
          },
          {
            binding: 1,
            resource: gbuffer_color.createView()
          },
          {
            binding: 2,
            resource: gbuffer_position.createView()
          },
          {
            binding: 3,
            resource: gbuffer_normal.createView()
          }
        ]
      });
      const blend_mode = {
        alpha: {
          srcFactor: "src-alpha",
          dstFactor: "one-minus-src-alpha",
          operation: "add"
        },
        color: {
          srcFactor: "src-alpha",
          dstFactor: "one-minus-src-alpha",
          operation: "add"
        }
      };
      const pass1_targets = [
        { format: navigator.gpu.getPreferredCanvasFormat(), blend: blend_mode },
        { format: gbuffer_position.format },
        { format: gbuffer_normal.format }
      ];
      const canvas_target = [
        { format: navigator.gpu.getPreferredCanvasFormat() }
      ];
      const postprocess_pipeline_descriptor = {
        vertex: {
          module: postprocess_shader,
          entryPoint: "vertex_main",
          buffers: uv_2d_vertex_layout
        },
        fragment: {
          module: postprocess_shader,
          entryPoint: "fragment_main",
          targets: canvas_target
        },
        primitive: {
          topology: "triangle-list",
          cullMode: "none"
        },
        layout: postprocess_layout,
        label: "postprocess pipeline descriptor"
      };
      const skybox_pipeline_descriptor = {
        vertex: {
          module: skybox_shader,
          entryPoint: "vertex_main",
          buffers: uv_2d_vertex_layout
        },
        fragment: {
          module: skybox_shader,
          entryPoint: "fragment_main",
          targets: pass1_targets
        },
        primitive: {
          topology: "triangle-list",
          cullMode: "none"
        },
        depthStencil: {
          format: "depth32float",
          depthWriteEnabled: false,
          depthCompare: "less-equal"
        },
        layout: skybox_layout,
        label: "skybox pipieline descriptor"
      };
      const forward_diffuse_pipeline_descriptor = {
        vertex: {
          module: forward_shader,
          entryPoint: "vertex_main",
          buffers: forward_vertex_layout
        },
        fragment: {
          module: forward_shader,
          entryPoint: "fragment_main",
          targets: pass1_targets,
          constants: {
            has_opacity: 0
          }
        },
        primitive: {
          topology: "triangle-list",
          cullMode: "back"
        },
        depthStencil: {
          format: "depth32float",
          depthWriteEnabled: true,
          depthCompare: "less"
        },
        layout: forward_layout,
        label: "forward pipeline descriptor"
      };
      const forward_diffuse_opacity_pipeline_descriptor = {
        vertex: {
          module: forward_shader,
          entryPoint: "vertex_main",
          buffers: forward_vertex_layout
        },
        fragment: {
          module: forward_shader,
          entryPoint: "fragment_main",
          targets: pass1_targets,
          constants: {
            has_opacity: 1
          }
        },
        primitive: {
          topology: "triangle-list",
          cullMode: "back"
        },
        depthStencil: {
          format: "depth32float",
          depthWriteEnabled: true,
          depthCompare: "less"
        },
        layout: forward_layout,
        label: "forward pipeline descriptor"
      };
      const postprocess_render_pipeline = this.device.createRenderPipeline(postprocess_pipeline_descriptor);
      const forward_diffuse_render_pipeline = this.device.createRenderPipeline(forward_diffuse_pipeline_descriptor);
      const forward_diffuse_opacity_render_pipeline = this.device.createRenderPipeline(forward_diffuse_opacity_pipeline_descriptor);
      const skybox_render_pipeline = this.device.createRenderPipeline(skybox_pipeline_descriptor);
      const forward_color_attachment = {
        view: gbuffer_color.createView(),
        loadOp: "clear",
        storeOp: "store"
      };
      const forward_position_attachment = {
        view: gbuffer_position.createView(),
        loadOp: "clear",
        storeOp: "store"
      };
      const forward_normal_attachment = {
        view: gbuffer_normal.createView(),
        loadOp: "clear",
        storeOp: "store"
      };
      const forward_attachments = [forward_color_attachment, forward_position_attachment, forward_normal_attachment];
      const forward_depth_attachment = {
        view: depth_buffer.createView(),
        depthClearValue: 1,
        depthLoadOp: "clear",
        depthStoreOp: "discard"
      };
      const postprocess_color_attachmet = "canvas";
      let fullscreen_buffer = new MergedBufer(this.device);
      let fullscreen_range = fullscreen_buffer.add_geometry(full_screen_verts, fullscreen_indices);
      return {
        forward_diffuse_pass: {
          shader: forward_shader,
          pipeline: forward_diffuse_render_pipeline,
          bind_groups: [forward_bind_group],
          geometry_buffer: new MergedBufer(this.device),
          vertex_size: forward_vertex_layout[0].arrayStride,
          geometries: [],
          color_attachments: forward_attachments,
          depth_attachment: forward_depth_attachment
        },
        forward_diffuse_opacity_pass: {
          shader: forward_shader,
          pipeline: forward_diffuse_opacity_render_pipeline,
          bind_groups: [forward_bind_group],
          geometry_buffer: new MergedBufer(this.device),
          vertex_size: forward_vertex_layout[0].arrayStride,
          geometries: [],
          color_attachments: forward_attachments,
          depth_attachment: forward_depth_attachment
        },
        skybox_pass: {
          shader: skybox_shader,
          pipeline: skybox_render_pipeline,
          bind_groups: [skybox_bind_group],
          vertex_size: uv_2d_vertex_layout[0].arrayStride,
          geometries: [{
            range: fullscreen_range,
            bind_groups: []
          }],
          geometry_buffer: fullscreen_buffer,
          color_attachments: forward_attachments,
          depth_attachment: forward_depth_attachment
        },
        postprocess_pass: {
          shader: postprocess_shader,
          pipeline: postprocess_render_pipeline,
          bind_groups: [postprocess_bind_group],
          vertex_size: uv_2d_vertex_layout[0].arrayStride,
          geometries: [{
            range: fullscreen_range,
            bind_groups: []
          }],
          geometry_buffer: fullscreen_buffer,
          color_attachments: [postprocess_color_attachmet]
        },
        depth_buffer
      };
    }
    verify_attachments(passes) {
      for (let i = 1; i < passes.length; i++) {
        if (passes[i].color_attachments != passes[i - 1].color_attachments)
          throw new Error("mismatch pass");
      }
    }
    make_pass_descriptor(passes) {
      this.verify_attachments(passes);
      return {
        colorAttachments: passes[0].color_attachments.map((a) => {
          return a == "canvas" ? {
            view: this.context.getCurrentTexture().createView(),
            clearValue: this.clear_color,
            loadOp: "clear",
            storeOp: "store"
          } : a;
        }),
        depthStencilAttachment: passes[0].depth_attachment,
        label: "render pass descriptor"
      };
    }
    merge_geometries(geos) {
      let cmp_bindgroups = (a, b) => {
        if (a.length != b.length) {
          return false;
        }
        for (let i = 0; i < a.length; i++) {
          if (a[i] != b[i])
            return false;
        }
        return true;
      };
      let ret = [];
      for (let i = 0; i < geos.length; i++) {
        if (ret.length == 0) {
          ret.push(geos[i]);
        } else {
          let prev = ret[ret.length - 1];
          if (prev.range.indices.count + prev.range.indices.start == geos[i].range.indices.start && cmp_bindgroups(prev.bind_groups, geos[i].bind_groups)) {
            prev.range.indices.count += geos[i].range.indices.count;
          } else {
            let r = geos[i].range;
            let range = { indices: { start: r.indices.start, count: r.indices.count }, vertices: r.vertices };
            ret.push({ bind_groups: geos[i].bind_groups, range });
          }
        }
      }
      return ret;
    }
    encode_render_passes(passes, encoder) {
      const pass_descriptor = this.make_pass_descriptor(passes);
      let tris_rendered = 0;
      let bind_groups_bound = 0;
      let draw_calls = 0;
      const pass_encoder = encoder.beginRenderPass(pass_descriptor);
      passes.forEach((pass) => {
        pass_encoder.setPipeline(pass.pipeline);
        pass.bind_groups.forEach((group, idx) => pass_encoder.setBindGroup(idx, group));
        pass_encoder.setVertexBuffer(0, pass.geometry_buffer.vertex_buffer);
        pass_encoder.setIndexBuffer(pass.geometry_buffer.index_buffer, "uint32");
        let existing_bind_groups = [null, null, null, null, null];
        (pass.optimized_geometries || pass.geometries).forEach((geom) => {
          geom.bind_groups.forEach((group, idx) => {
            if (existing_bind_groups[idx + pass.bind_groups.length] != group) {
              pass_encoder.setBindGroup(idx + pass.bind_groups.length, group);
              existing_bind_groups[idx + pass.bind_groups.length] = group;
              bind_groups_bound++;
            }
          });
          pass_encoder.drawIndexed(geom.range.indices.count, 1, geom.range.indices.start, 0);
          tris_rendered += geom.range.indices.count / 3;
          draw_calls++;
        });
      });
      pass_encoder.end();
    }
    draw_raster() {
      const command_encoder = this.device.createCommandEncoder();
      this.encode_render_passes([
        this.raster.forward_diffuse_pass,
        this.raster.forward_diffuse_opacity_pass,
        this.raster.skybox_pass
      ], command_encoder);
      this.encode_render_passes([
        this.raster.postprocess_pass
      ], command_encoder);
      this.device.queue.submit([command_encoder.finish()]);
    }
  };

  // src/camera.ts
  var Camera = class {
    keymap;
    pos;
    speed = 100;
    pitch_sensitivity = 0.01;
    yaw_sensitivity = 0.01;
    pitch = 0;
    yaw = 0;
    constructor() {
      this.keymap = /* @__PURE__ */ new Map();
      this.pos = vec3_exports.fromValues(20, 20, 20);
      document.addEventListener("keydown", (ev) => {
        this.handle_evenet(ev, true);
      });
      document.addEventListener("keyup", (ev) => {
        this.handle_evenet(ev, false);
      });
      document.addEventListener("mousemove", (ev) => {
        this.handle_mouse(ev);
      });
    }
    set_pos(pos) {
      this.pos = pos;
    }
    handle_evenet(ev, pressed) {
      this.keymap.set(ev.key, pressed);
    }
    handle_mouse(ev) {
      this.yaw += this.yaw_sensitivity * -ev.movementX;
      this.pitch += this.pitch_sensitivity * -ev.movementY;
      this.pitch = Math.max(Math.min(1.3, this.pitch), -1.3);
    }
    update(dt) {
      let movement = vec3_exports.create();
      if (this.keymap.get("w"))
        movement[1] += 1;
      if (this.keymap.get("s"))
        movement[1] -= 1;
      if (this.keymap.get("d"))
        movement[0] += 1;
      if (this.keymap.get("a"))
        movement[0] -= 1;
      if (this.keymap.get("e"))
        movement[2] += 1;
      if (this.keymap.get("q"))
        movement[2] -= 1;
      vec3_exports.rotateZ(movement, movement, [0, 0, 0], this.yaw);
      vec3_exports.scale(movement, movement, dt * this.speed);
      vec3_exports.add(this.pos, this.pos, movement);
    }
    view() {
      const m = mat4_exports.create();
      const focus = vec3_exports.fromValues(0, 1, 0);
      vec3_exports.rotateX(focus, focus, [0, 0, 0], this.pitch);
      vec3_exports.rotateZ(focus, focus, [0, 0, 0], this.yaw);
      vec3_exports.add(focus, focus, this.pos);
      return mat4_exports.lookAt(m, this.pos, focus, [0, 0, 1]);
    }
  };

  // src/ModelLoad.ts
  async function load_material(mat, parent_path) {
    let diffuse;
    let opacity;
    if (mat.diffuse) {
      try {
        diffuse = await load_texture(parent_path + "/" + mat.diffuse);
      } catch (e) {
        diffuse = await blank_texture();
        console.log(`Error loading ${mat.diffuse}`);
      }
    } else {
      diffuse = await blank_texture();
    }
    if (mat.opacity) {
      try {
        opacity = await load_texture(parent_path + "/" + mat.opacity);
      } catch (e) {
        console.log(`Error loading ${mat.opacity}`);
      }
    }
    return { diffuse, opacity };
  }
  async function load_texture(path) {
    let blob = await (await fetch(path)).blob();
    let img = await createImageBitmap(blob, { colorSpaceConversion: "none" });
    return {
      width: img.width,
      height: img.height,
      data: img
    };
  }
  async function blank_texture() {
    return await load_texture("missing.png");
  }
  async function load_json_model(path) {
    let model = await (await fetch(path + "/verts.json")).json();
    let materials = await Promise.all(model.materials.map((m) => {
      return load_material(m, path);
    }));
    return model.meshes.map((m) => {
      let verts = [];
      let norms = [];
      let uvs = [];
      for (let i = 0; i < m.vertices.length; i += 8) {
        verts.push(m.vertices[i]);
        verts.push(m.vertices[i + 1]);
        verts.push(m.vertices[i + 2]);
        norms.push(m.vertices[i + 3]);
        norms.push(m.vertices[i + 4]);
        norms.push(m.vertices[i + 5]);
        uvs.push(m.vertices[i + 6]);
        uvs.push(m.vertices[i + 7]);
      }
      return {
        vertices: verts,
        normals: norms,
        uvs,
        indices: m.indices,
        material: materials[m.material_index],
        name: m.name
      };
    });
  }

  // src/main.ts
  async function main() {
    const canvas = document.getElementById("gpuCanvas");
    const context = canvas.getContext("webgpu");
    const gpu = navigator.gpu;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const adapter = await gpu.requestAdapter({ powerPreference: "high-performance" });
    console.log("Supported Features: {");
    adapter.features.forEach((a) => console.log(a));
    console.log("}");
    const device = await adapter.requestDevice({ label: "GPU device" });
    console.log("Device Features: {");
    device.features.forEach((a) => console.log(a));
    console.log("}");
    console.log(`${canvas.width}x${canvas.height}`);
    context.configure({
      device,
      format: gpu.getPreferredCanvasFormat(),
      alphaMode: "premultiplied"
    });
    const RES_X = canvas.width;
    const RES_Y = canvas.height;
    const app = new App(device, context, RES_X, RES_Y);
    const perspective2 = mat4_exports.create();
    mat4_exports.perspective(perspective2, Math.PI / 2, RES_X / RES_Y, 0.1, null);
    load_json_model("Windfall").then((meshes) => {
      meshes.forEach((mesh) => {
        if (mesh.indices.length > 0) {
          app.add_mesh(mesh);
        }
      });
      app.optimize_buffers();
    });
    const camera = new Camera();
    let frame_count = 0;
    let last_time = 0;
    const run = () => {
      requestAnimationFrame(run);
      camera.update(8e-3);
      let mvp = mat4_exports.create();
      const view = camera.view();
      mat4_exports.multiply(mvp, perspective2, view);
      app.set_camera(mvp);
      app.draw_raster();
      frame_count++;
      if (frame_count % 300 == 0) {
        console.log("FPS ", 300 / ((performance.now() - last_time) / 1e3));
        last_time = performance.now();
      }
    };
    requestAnimationFrame(run);
  }
  main();
})();
//# sourceMappingURL=bundle.js.map
