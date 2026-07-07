/* Invoice Forge */
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// (disabled):crypto
var require_crypto = __commonJS({
  "(disabled):crypto"() {
  }
});

// node_modules/tweetnacl/nacl-fast.js
var require_nacl_fast = __commonJS({
  "node_modules/tweetnacl/nacl-fast.js"(exports, module2) {
    (function(nacl2) {
      "use strict";
      var gf = function(init) {
        var i, r = new Float64Array(16);
        if (init) for (i = 0; i < init.length; i++) r[i] = init[i];
        return r;
      };
      var randombytes = function() {
        throw new Error("no PRNG");
      };
      var _0 = new Uint8Array(16);
      var _9 = new Uint8Array(32);
      _9[0] = 9;
      var gf0 = gf(), gf1 = gf([1]), _121665 = gf([56129, 1]), D = gf([30883, 4953, 19914, 30187, 55467, 16705, 2637, 112, 59544, 30585, 16505, 36039, 65139, 11119, 27886, 20995]), D2 = gf([61785, 9906, 39828, 60374, 45398, 33411, 5274, 224, 53552, 61171, 33010, 6542, 64743, 22239, 55772, 9222]), X = gf([54554, 36645, 11616, 51542, 42930, 38181, 51040, 26924, 56412, 64982, 57905, 49316, 21502, 52590, 14035, 8553]), Y = gf([26200, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214]), I = gf([41136, 18958, 6951, 50414, 58488, 44335, 6150, 12099, 55207, 15867, 153, 11085, 57099, 20417, 9344, 11139]);
      function ts64(x, i, h, l) {
        x[i] = h >> 24 & 255;
        x[i + 1] = h >> 16 & 255;
        x[i + 2] = h >> 8 & 255;
        x[i + 3] = h & 255;
        x[i + 4] = l >> 24 & 255;
        x[i + 5] = l >> 16 & 255;
        x[i + 6] = l >> 8 & 255;
        x[i + 7] = l & 255;
      }
      function vn(x, xi, y, yi, n) {
        var i, d = 0;
        for (i = 0; i < n; i++) d |= x[xi + i] ^ y[yi + i];
        return (1 & d - 1 >>> 8) - 1;
      }
      function crypto_verify_16(x, xi, y, yi) {
        return vn(x, xi, y, yi, 16);
      }
      function crypto_verify_32(x, xi, y, yi) {
        return vn(x, xi, y, yi, 32);
      }
      function core_salsa20(o, p, k, c) {
        var j0 = c[0] & 255 | (c[1] & 255) << 8 | (c[2] & 255) << 16 | (c[3] & 255) << 24, j1 = k[0] & 255 | (k[1] & 255) << 8 | (k[2] & 255) << 16 | (k[3] & 255) << 24, j2 = k[4] & 255 | (k[5] & 255) << 8 | (k[6] & 255) << 16 | (k[7] & 255) << 24, j3 = k[8] & 255 | (k[9] & 255) << 8 | (k[10] & 255) << 16 | (k[11] & 255) << 24, j4 = k[12] & 255 | (k[13] & 255) << 8 | (k[14] & 255) << 16 | (k[15] & 255) << 24, j5 = c[4] & 255 | (c[5] & 255) << 8 | (c[6] & 255) << 16 | (c[7] & 255) << 24, j6 = p[0] & 255 | (p[1] & 255) << 8 | (p[2] & 255) << 16 | (p[3] & 255) << 24, j7 = p[4] & 255 | (p[5] & 255) << 8 | (p[6] & 255) << 16 | (p[7] & 255) << 24, j8 = p[8] & 255 | (p[9] & 255) << 8 | (p[10] & 255) << 16 | (p[11] & 255) << 24, j9 = p[12] & 255 | (p[13] & 255) << 8 | (p[14] & 255) << 16 | (p[15] & 255) << 24, j10 = c[8] & 255 | (c[9] & 255) << 8 | (c[10] & 255) << 16 | (c[11] & 255) << 24, j11 = k[16] & 255 | (k[17] & 255) << 8 | (k[18] & 255) << 16 | (k[19] & 255) << 24, j12 = k[20] & 255 | (k[21] & 255) << 8 | (k[22] & 255) << 16 | (k[23] & 255) << 24, j13 = k[24] & 255 | (k[25] & 255) << 8 | (k[26] & 255) << 16 | (k[27] & 255) << 24, j14 = k[28] & 255 | (k[29] & 255) << 8 | (k[30] & 255) << 16 | (k[31] & 255) << 24, j15 = c[12] & 255 | (c[13] & 255) << 8 | (c[14] & 255) << 16 | (c[15] & 255) << 24;
        var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7, x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14, x15 = j15, u;
        for (var i = 0; i < 20; i += 2) {
          u = x0 + x12 | 0;
          x4 ^= u << 7 | u >>> 32 - 7;
          u = x4 + x0 | 0;
          x8 ^= u << 9 | u >>> 32 - 9;
          u = x8 + x4 | 0;
          x12 ^= u << 13 | u >>> 32 - 13;
          u = x12 + x8 | 0;
          x0 ^= u << 18 | u >>> 32 - 18;
          u = x5 + x1 | 0;
          x9 ^= u << 7 | u >>> 32 - 7;
          u = x9 + x5 | 0;
          x13 ^= u << 9 | u >>> 32 - 9;
          u = x13 + x9 | 0;
          x1 ^= u << 13 | u >>> 32 - 13;
          u = x1 + x13 | 0;
          x5 ^= u << 18 | u >>> 32 - 18;
          u = x10 + x6 | 0;
          x14 ^= u << 7 | u >>> 32 - 7;
          u = x14 + x10 | 0;
          x2 ^= u << 9 | u >>> 32 - 9;
          u = x2 + x14 | 0;
          x6 ^= u << 13 | u >>> 32 - 13;
          u = x6 + x2 | 0;
          x10 ^= u << 18 | u >>> 32 - 18;
          u = x15 + x11 | 0;
          x3 ^= u << 7 | u >>> 32 - 7;
          u = x3 + x15 | 0;
          x7 ^= u << 9 | u >>> 32 - 9;
          u = x7 + x3 | 0;
          x11 ^= u << 13 | u >>> 32 - 13;
          u = x11 + x7 | 0;
          x15 ^= u << 18 | u >>> 32 - 18;
          u = x0 + x3 | 0;
          x1 ^= u << 7 | u >>> 32 - 7;
          u = x1 + x0 | 0;
          x2 ^= u << 9 | u >>> 32 - 9;
          u = x2 + x1 | 0;
          x3 ^= u << 13 | u >>> 32 - 13;
          u = x3 + x2 | 0;
          x0 ^= u << 18 | u >>> 32 - 18;
          u = x5 + x4 | 0;
          x6 ^= u << 7 | u >>> 32 - 7;
          u = x6 + x5 | 0;
          x7 ^= u << 9 | u >>> 32 - 9;
          u = x7 + x6 | 0;
          x4 ^= u << 13 | u >>> 32 - 13;
          u = x4 + x7 | 0;
          x5 ^= u << 18 | u >>> 32 - 18;
          u = x10 + x9 | 0;
          x11 ^= u << 7 | u >>> 32 - 7;
          u = x11 + x10 | 0;
          x8 ^= u << 9 | u >>> 32 - 9;
          u = x8 + x11 | 0;
          x9 ^= u << 13 | u >>> 32 - 13;
          u = x9 + x8 | 0;
          x10 ^= u << 18 | u >>> 32 - 18;
          u = x15 + x14 | 0;
          x12 ^= u << 7 | u >>> 32 - 7;
          u = x12 + x15 | 0;
          x13 ^= u << 9 | u >>> 32 - 9;
          u = x13 + x12 | 0;
          x14 ^= u << 13 | u >>> 32 - 13;
          u = x14 + x13 | 0;
          x15 ^= u << 18 | u >>> 32 - 18;
        }
        x0 = x0 + j0 | 0;
        x1 = x1 + j1 | 0;
        x2 = x2 + j2 | 0;
        x3 = x3 + j3 | 0;
        x4 = x4 + j4 | 0;
        x5 = x5 + j5 | 0;
        x6 = x6 + j6 | 0;
        x7 = x7 + j7 | 0;
        x8 = x8 + j8 | 0;
        x9 = x9 + j9 | 0;
        x10 = x10 + j10 | 0;
        x11 = x11 + j11 | 0;
        x12 = x12 + j12 | 0;
        x13 = x13 + j13 | 0;
        x14 = x14 + j14 | 0;
        x15 = x15 + j15 | 0;
        o[0] = x0 >>> 0 & 255;
        o[1] = x0 >>> 8 & 255;
        o[2] = x0 >>> 16 & 255;
        o[3] = x0 >>> 24 & 255;
        o[4] = x1 >>> 0 & 255;
        o[5] = x1 >>> 8 & 255;
        o[6] = x1 >>> 16 & 255;
        o[7] = x1 >>> 24 & 255;
        o[8] = x2 >>> 0 & 255;
        o[9] = x2 >>> 8 & 255;
        o[10] = x2 >>> 16 & 255;
        o[11] = x2 >>> 24 & 255;
        o[12] = x3 >>> 0 & 255;
        o[13] = x3 >>> 8 & 255;
        o[14] = x3 >>> 16 & 255;
        o[15] = x3 >>> 24 & 255;
        o[16] = x4 >>> 0 & 255;
        o[17] = x4 >>> 8 & 255;
        o[18] = x4 >>> 16 & 255;
        o[19] = x4 >>> 24 & 255;
        o[20] = x5 >>> 0 & 255;
        o[21] = x5 >>> 8 & 255;
        o[22] = x5 >>> 16 & 255;
        o[23] = x5 >>> 24 & 255;
        o[24] = x6 >>> 0 & 255;
        o[25] = x6 >>> 8 & 255;
        o[26] = x6 >>> 16 & 255;
        o[27] = x6 >>> 24 & 255;
        o[28] = x7 >>> 0 & 255;
        o[29] = x7 >>> 8 & 255;
        o[30] = x7 >>> 16 & 255;
        o[31] = x7 >>> 24 & 255;
        o[32] = x8 >>> 0 & 255;
        o[33] = x8 >>> 8 & 255;
        o[34] = x8 >>> 16 & 255;
        o[35] = x8 >>> 24 & 255;
        o[36] = x9 >>> 0 & 255;
        o[37] = x9 >>> 8 & 255;
        o[38] = x9 >>> 16 & 255;
        o[39] = x9 >>> 24 & 255;
        o[40] = x10 >>> 0 & 255;
        o[41] = x10 >>> 8 & 255;
        o[42] = x10 >>> 16 & 255;
        o[43] = x10 >>> 24 & 255;
        o[44] = x11 >>> 0 & 255;
        o[45] = x11 >>> 8 & 255;
        o[46] = x11 >>> 16 & 255;
        o[47] = x11 >>> 24 & 255;
        o[48] = x12 >>> 0 & 255;
        o[49] = x12 >>> 8 & 255;
        o[50] = x12 >>> 16 & 255;
        o[51] = x12 >>> 24 & 255;
        o[52] = x13 >>> 0 & 255;
        o[53] = x13 >>> 8 & 255;
        o[54] = x13 >>> 16 & 255;
        o[55] = x13 >>> 24 & 255;
        o[56] = x14 >>> 0 & 255;
        o[57] = x14 >>> 8 & 255;
        o[58] = x14 >>> 16 & 255;
        o[59] = x14 >>> 24 & 255;
        o[60] = x15 >>> 0 & 255;
        o[61] = x15 >>> 8 & 255;
        o[62] = x15 >>> 16 & 255;
        o[63] = x15 >>> 24 & 255;
      }
      function core_hsalsa20(o, p, k, c) {
        var j0 = c[0] & 255 | (c[1] & 255) << 8 | (c[2] & 255) << 16 | (c[3] & 255) << 24, j1 = k[0] & 255 | (k[1] & 255) << 8 | (k[2] & 255) << 16 | (k[3] & 255) << 24, j2 = k[4] & 255 | (k[5] & 255) << 8 | (k[6] & 255) << 16 | (k[7] & 255) << 24, j3 = k[8] & 255 | (k[9] & 255) << 8 | (k[10] & 255) << 16 | (k[11] & 255) << 24, j4 = k[12] & 255 | (k[13] & 255) << 8 | (k[14] & 255) << 16 | (k[15] & 255) << 24, j5 = c[4] & 255 | (c[5] & 255) << 8 | (c[6] & 255) << 16 | (c[7] & 255) << 24, j6 = p[0] & 255 | (p[1] & 255) << 8 | (p[2] & 255) << 16 | (p[3] & 255) << 24, j7 = p[4] & 255 | (p[5] & 255) << 8 | (p[6] & 255) << 16 | (p[7] & 255) << 24, j8 = p[8] & 255 | (p[9] & 255) << 8 | (p[10] & 255) << 16 | (p[11] & 255) << 24, j9 = p[12] & 255 | (p[13] & 255) << 8 | (p[14] & 255) << 16 | (p[15] & 255) << 24, j10 = c[8] & 255 | (c[9] & 255) << 8 | (c[10] & 255) << 16 | (c[11] & 255) << 24, j11 = k[16] & 255 | (k[17] & 255) << 8 | (k[18] & 255) << 16 | (k[19] & 255) << 24, j12 = k[20] & 255 | (k[21] & 255) << 8 | (k[22] & 255) << 16 | (k[23] & 255) << 24, j13 = k[24] & 255 | (k[25] & 255) << 8 | (k[26] & 255) << 16 | (k[27] & 255) << 24, j14 = k[28] & 255 | (k[29] & 255) << 8 | (k[30] & 255) << 16 | (k[31] & 255) << 24, j15 = c[12] & 255 | (c[13] & 255) << 8 | (c[14] & 255) << 16 | (c[15] & 255) << 24;
        var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7, x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14, x15 = j15, u;
        for (var i = 0; i < 20; i += 2) {
          u = x0 + x12 | 0;
          x4 ^= u << 7 | u >>> 32 - 7;
          u = x4 + x0 | 0;
          x8 ^= u << 9 | u >>> 32 - 9;
          u = x8 + x4 | 0;
          x12 ^= u << 13 | u >>> 32 - 13;
          u = x12 + x8 | 0;
          x0 ^= u << 18 | u >>> 32 - 18;
          u = x5 + x1 | 0;
          x9 ^= u << 7 | u >>> 32 - 7;
          u = x9 + x5 | 0;
          x13 ^= u << 9 | u >>> 32 - 9;
          u = x13 + x9 | 0;
          x1 ^= u << 13 | u >>> 32 - 13;
          u = x1 + x13 | 0;
          x5 ^= u << 18 | u >>> 32 - 18;
          u = x10 + x6 | 0;
          x14 ^= u << 7 | u >>> 32 - 7;
          u = x14 + x10 | 0;
          x2 ^= u << 9 | u >>> 32 - 9;
          u = x2 + x14 | 0;
          x6 ^= u << 13 | u >>> 32 - 13;
          u = x6 + x2 | 0;
          x10 ^= u << 18 | u >>> 32 - 18;
          u = x15 + x11 | 0;
          x3 ^= u << 7 | u >>> 32 - 7;
          u = x3 + x15 | 0;
          x7 ^= u << 9 | u >>> 32 - 9;
          u = x7 + x3 | 0;
          x11 ^= u << 13 | u >>> 32 - 13;
          u = x11 + x7 | 0;
          x15 ^= u << 18 | u >>> 32 - 18;
          u = x0 + x3 | 0;
          x1 ^= u << 7 | u >>> 32 - 7;
          u = x1 + x0 | 0;
          x2 ^= u << 9 | u >>> 32 - 9;
          u = x2 + x1 | 0;
          x3 ^= u << 13 | u >>> 32 - 13;
          u = x3 + x2 | 0;
          x0 ^= u << 18 | u >>> 32 - 18;
          u = x5 + x4 | 0;
          x6 ^= u << 7 | u >>> 32 - 7;
          u = x6 + x5 | 0;
          x7 ^= u << 9 | u >>> 32 - 9;
          u = x7 + x6 | 0;
          x4 ^= u << 13 | u >>> 32 - 13;
          u = x4 + x7 | 0;
          x5 ^= u << 18 | u >>> 32 - 18;
          u = x10 + x9 | 0;
          x11 ^= u << 7 | u >>> 32 - 7;
          u = x11 + x10 | 0;
          x8 ^= u << 9 | u >>> 32 - 9;
          u = x8 + x11 | 0;
          x9 ^= u << 13 | u >>> 32 - 13;
          u = x9 + x8 | 0;
          x10 ^= u << 18 | u >>> 32 - 18;
          u = x15 + x14 | 0;
          x12 ^= u << 7 | u >>> 32 - 7;
          u = x12 + x15 | 0;
          x13 ^= u << 9 | u >>> 32 - 9;
          u = x13 + x12 | 0;
          x14 ^= u << 13 | u >>> 32 - 13;
          u = x14 + x13 | 0;
          x15 ^= u << 18 | u >>> 32 - 18;
        }
        o[0] = x0 >>> 0 & 255;
        o[1] = x0 >>> 8 & 255;
        o[2] = x0 >>> 16 & 255;
        o[3] = x0 >>> 24 & 255;
        o[4] = x5 >>> 0 & 255;
        o[5] = x5 >>> 8 & 255;
        o[6] = x5 >>> 16 & 255;
        o[7] = x5 >>> 24 & 255;
        o[8] = x10 >>> 0 & 255;
        o[9] = x10 >>> 8 & 255;
        o[10] = x10 >>> 16 & 255;
        o[11] = x10 >>> 24 & 255;
        o[12] = x15 >>> 0 & 255;
        o[13] = x15 >>> 8 & 255;
        o[14] = x15 >>> 16 & 255;
        o[15] = x15 >>> 24 & 255;
        o[16] = x6 >>> 0 & 255;
        o[17] = x6 >>> 8 & 255;
        o[18] = x6 >>> 16 & 255;
        o[19] = x6 >>> 24 & 255;
        o[20] = x7 >>> 0 & 255;
        o[21] = x7 >>> 8 & 255;
        o[22] = x7 >>> 16 & 255;
        o[23] = x7 >>> 24 & 255;
        o[24] = x8 >>> 0 & 255;
        o[25] = x8 >>> 8 & 255;
        o[26] = x8 >>> 16 & 255;
        o[27] = x8 >>> 24 & 255;
        o[28] = x9 >>> 0 & 255;
        o[29] = x9 >>> 8 & 255;
        o[30] = x9 >>> 16 & 255;
        o[31] = x9 >>> 24 & 255;
      }
      function crypto_core_salsa20(out, inp, k, c) {
        core_salsa20(out, inp, k, c);
      }
      function crypto_core_hsalsa20(out, inp, k, c) {
        core_hsalsa20(out, inp, k, c);
      }
      var sigma = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);
      function crypto_stream_salsa20_xor(c, cpos, m, mpos, b, n, k) {
        var z = new Uint8Array(16), x = new Uint8Array(64);
        var u, i;
        for (i = 0; i < 16; i++) z[i] = 0;
        for (i = 0; i < 8; i++) z[i] = n[i];
        while (b >= 64) {
          crypto_core_salsa20(x, z, k, sigma);
          for (i = 0; i < 64; i++) c[cpos + i] = m[mpos + i] ^ x[i];
          u = 1;
          for (i = 8; i < 16; i++) {
            u = u + (z[i] & 255) | 0;
            z[i] = u & 255;
            u >>>= 8;
          }
          b -= 64;
          cpos += 64;
          mpos += 64;
        }
        if (b > 0) {
          crypto_core_salsa20(x, z, k, sigma);
          for (i = 0; i < b; i++) c[cpos + i] = m[mpos + i] ^ x[i];
        }
        return 0;
      }
      function crypto_stream_salsa20(c, cpos, b, n, k) {
        var z = new Uint8Array(16), x = new Uint8Array(64);
        var u, i;
        for (i = 0; i < 16; i++) z[i] = 0;
        for (i = 0; i < 8; i++) z[i] = n[i];
        while (b >= 64) {
          crypto_core_salsa20(x, z, k, sigma);
          for (i = 0; i < 64; i++) c[cpos + i] = x[i];
          u = 1;
          for (i = 8; i < 16; i++) {
            u = u + (z[i] & 255) | 0;
            z[i] = u & 255;
            u >>>= 8;
          }
          b -= 64;
          cpos += 64;
        }
        if (b > 0) {
          crypto_core_salsa20(x, z, k, sigma);
          for (i = 0; i < b; i++) c[cpos + i] = x[i];
        }
        return 0;
      }
      function crypto_stream(c, cpos, d, n, k) {
        var s = new Uint8Array(32);
        crypto_core_hsalsa20(s, n, k, sigma);
        var sn = new Uint8Array(8);
        for (var i = 0; i < 8; i++) sn[i] = n[i + 16];
        return crypto_stream_salsa20(c, cpos, d, sn, s);
      }
      function crypto_stream_xor(c, cpos, m, mpos, d, n, k) {
        var s = new Uint8Array(32);
        crypto_core_hsalsa20(s, n, k, sigma);
        var sn = new Uint8Array(8);
        for (var i = 0; i < 8; i++) sn[i] = n[i + 16];
        return crypto_stream_salsa20_xor(c, cpos, m, mpos, d, sn, s);
      }
      var poly1305 = function(key) {
        this.buffer = new Uint8Array(16);
        this.r = new Uint16Array(10);
        this.h = new Uint16Array(10);
        this.pad = new Uint16Array(8);
        this.leftover = 0;
        this.fin = 0;
        var t0, t1, t2, t3, t4, t5, t6, t7;
        t0 = key[0] & 255 | (key[1] & 255) << 8;
        this.r[0] = t0 & 8191;
        t1 = key[2] & 255 | (key[3] & 255) << 8;
        this.r[1] = (t0 >>> 13 | t1 << 3) & 8191;
        t2 = key[4] & 255 | (key[5] & 255) << 8;
        this.r[2] = (t1 >>> 10 | t2 << 6) & 7939;
        t3 = key[6] & 255 | (key[7] & 255) << 8;
        this.r[3] = (t2 >>> 7 | t3 << 9) & 8191;
        t4 = key[8] & 255 | (key[9] & 255) << 8;
        this.r[4] = (t3 >>> 4 | t4 << 12) & 255;
        this.r[5] = t4 >>> 1 & 8190;
        t5 = key[10] & 255 | (key[11] & 255) << 8;
        this.r[6] = (t4 >>> 14 | t5 << 2) & 8191;
        t6 = key[12] & 255 | (key[13] & 255) << 8;
        this.r[7] = (t5 >>> 11 | t6 << 5) & 8065;
        t7 = key[14] & 255 | (key[15] & 255) << 8;
        this.r[8] = (t6 >>> 8 | t7 << 8) & 8191;
        this.r[9] = t7 >>> 5 & 127;
        this.pad[0] = key[16] & 255 | (key[17] & 255) << 8;
        this.pad[1] = key[18] & 255 | (key[19] & 255) << 8;
        this.pad[2] = key[20] & 255 | (key[21] & 255) << 8;
        this.pad[3] = key[22] & 255 | (key[23] & 255) << 8;
        this.pad[4] = key[24] & 255 | (key[25] & 255) << 8;
        this.pad[5] = key[26] & 255 | (key[27] & 255) << 8;
        this.pad[6] = key[28] & 255 | (key[29] & 255) << 8;
        this.pad[7] = key[30] & 255 | (key[31] & 255) << 8;
      };
      poly1305.prototype.blocks = function(m, mpos, bytes) {
        var hibit = this.fin ? 0 : 1 << 11;
        var t0, t1, t2, t3, t4, t5, t6, t7, c;
        var d0, d1, d2, d3, d4, d5, d6, d7, d8, d9;
        var h0 = this.h[0], h1 = this.h[1], h2 = this.h[2], h3 = this.h[3], h4 = this.h[4], h5 = this.h[5], h6 = this.h[6], h7 = this.h[7], h8 = this.h[8], h9 = this.h[9];
        var r0 = this.r[0], r1 = this.r[1], r2 = this.r[2], r3 = this.r[3], r4 = this.r[4], r5 = this.r[5], r6 = this.r[6], r7 = this.r[7], r8 = this.r[8], r9 = this.r[9];
        while (bytes >= 16) {
          t0 = m[mpos + 0] & 255 | (m[mpos + 1] & 255) << 8;
          h0 += t0 & 8191;
          t1 = m[mpos + 2] & 255 | (m[mpos + 3] & 255) << 8;
          h1 += (t0 >>> 13 | t1 << 3) & 8191;
          t2 = m[mpos + 4] & 255 | (m[mpos + 5] & 255) << 8;
          h2 += (t1 >>> 10 | t2 << 6) & 8191;
          t3 = m[mpos + 6] & 255 | (m[mpos + 7] & 255) << 8;
          h3 += (t2 >>> 7 | t3 << 9) & 8191;
          t4 = m[mpos + 8] & 255 | (m[mpos + 9] & 255) << 8;
          h4 += (t3 >>> 4 | t4 << 12) & 8191;
          h5 += t4 >>> 1 & 8191;
          t5 = m[mpos + 10] & 255 | (m[mpos + 11] & 255) << 8;
          h6 += (t4 >>> 14 | t5 << 2) & 8191;
          t6 = m[mpos + 12] & 255 | (m[mpos + 13] & 255) << 8;
          h7 += (t5 >>> 11 | t6 << 5) & 8191;
          t7 = m[mpos + 14] & 255 | (m[mpos + 15] & 255) << 8;
          h8 += (t6 >>> 8 | t7 << 8) & 8191;
          h9 += t7 >>> 5 | hibit;
          c = 0;
          d0 = c;
          d0 += h0 * r0;
          d0 += h1 * (5 * r9);
          d0 += h2 * (5 * r8);
          d0 += h3 * (5 * r7);
          d0 += h4 * (5 * r6);
          c = d0 >>> 13;
          d0 &= 8191;
          d0 += h5 * (5 * r5);
          d0 += h6 * (5 * r4);
          d0 += h7 * (5 * r3);
          d0 += h8 * (5 * r2);
          d0 += h9 * (5 * r1);
          c += d0 >>> 13;
          d0 &= 8191;
          d1 = c;
          d1 += h0 * r1;
          d1 += h1 * r0;
          d1 += h2 * (5 * r9);
          d1 += h3 * (5 * r8);
          d1 += h4 * (5 * r7);
          c = d1 >>> 13;
          d1 &= 8191;
          d1 += h5 * (5 * r6);
          d1 += h6 * (5 * r5);
          d1 += h7 * (5 * r4);
          d1 += h8 * (5 * r3);
          d1 += h9 * (5 * r2);
          c += d1 >>> 13;
          d1 &= 8191;
          d2 = c;
          d2 += h0 * r2;
          d2 += h1 * r1;
          d2 += h2 * r0;
          d2 += h3 * (5 * r9);
          d2 += h4 * (5 * r8);
          c = d2 >>> 13;
          d2 &= 8191;
          d2 += h5 * (5 * r7);
          d2 += h6 * (5 * r6);
          d2 += h7 * (5 * r5);
          d2 += h8 * (5 * r4);
          d2 += h9 * (5 * r3);
          c += d2 >>> 13;
          d2 &= 8191;
          d3 = c;
          d3 += h0 * r3;
          d3 += h1 * r2;
          d3 += h2 * r1;
          d3 += h3 * r0;
          d3 += h4 * (5 * r9);
          c = d3 >>> 13;
          d3 &= 8191;
          d3 += h5 * (5 * r8);
          d3 += h6 * (5 * r7);
          d3 += h7 * (5 * r6);
          d3 += h8 * (5 * r5);
          d3 += h9 * (5 * r4);
          c += d3 >>> 13;
          d3 &= 8191;
          d4 = c;
          d4 += h0 * r4;
          d4 += h1 * r3;
          d4 += h2 * r2;
          d4 += h3 * r1;
          d4 += h4 * r0;
          c = d4 >>> 13;
          d4 &= 8191;
          d4 += h5 * (5 * r9);
          d4 += h6 * (5 * r8);
          d4 += h7 * (5 * r7);
          d4 += h8 * (5 * r6);
          d4 += h9 * (5 * r5);
          c += d4 >>> 13;
          d4 &= 8191;
          d5 = c;
          d5 += h0 * r5;
          d5 += h1 * r4;
          d5 += h2 * r3;
          d5 += h3 * r2;
          d5 += h4 * r1;
          c = d5 >>> 13;
          d5 &= 8191;
          d5 += h5 * r0;
          d5 += h6 * (5 * r9);
          d5 += h7 * (5 * r8);
          d5 += h8 * (5 * r7);
          d5 += h9 * (5 * r6);
          c += d5 >>> 13;
          d5 &= 8191;
          d6 = c;
          d6 += h0 * r6;
          d6 += h1 * r5;
          d6 += h2 * r4;
          d6 += h3 * r3;
          d6 += h4 * r2;
          c = d6 >>> 13;
          d6 &= 8191;
          d6 += h5 * r1;
          d6 += h6 * r0;
          d6 += h7 * (5 * r9);
          d6 += h8 * (5 * r8);
          d6 += h9 * (5 * r7);
          c += d6 >>> 13;
          d6 &= 8191;
          d7 = c;
          d7 += h0 * r7;
          d7 += h1 * r6;
          d7 += h2 * r5;
          d7 += h3 * r4;
          d7 += h4 * r3;
          c = d7 >>> 13;
          d7 &= 8191;
          d7 += h5 * r2;
          d7 += h6 * r1;
          d7 += h7 * r0;
          d7 += h8 * (5 * r9);
          d7 += h9 * (5 * r8);
          c += d7 >>> 13;
          d7 &= 8191;
          d8 = c;
          d8 += h0 * r8;
          d8 += h1 * r7;
          d8 += h2 * r6;
          d8 += h3 * r5;
          d8 += h4 * r4;
          c = d8 >>> 13;
          d8 &= 8191;
          d8 += h5 * r3;
          d8 += h6 * r2;
          d8 += h7 * r1;
          d8 += h8 * r0;
          d8 += h9 * (5 * r9);
          c += d8 >>> 13;
          d8 &= 8191;
          d9 = c;
          d9 += h0 * r9;
          d9 += h1 * r8;
          d9 += h2 * r7;
          d9 += h3 * r6;
          d9 += h4 * r5;
          c = d9 >>> 13;
          d9 &= 8191;
          d9 += h5 * r4;
          d9 += h6 * r3;
          d9 += h7 * r2;
          d9 += h8 * r1;
          d9 += h9 * r0;
          c += d9 >>> 13;
          d9 &= 8191;
          c = (c << 2) + c | 0;
          c = c + d0 | 0;
          d0 = c & 8191;
          c = c >>> 13;
          d1 += c;
          h0 = d0;
          h1 = d1;
          h2 = d2;
          h3 = d3;
          h4 = d4;
          h5 = d5;
          h6 = d6;
          h7 = d7;
          h8 = d8;
          h9 = d9;
          mpos += 16;
          bytes -= 16;
        }
        this.h[0] = h0;
        this.h[1] = h1;
        this.h[2] = h2;
        this.h[3] = h3;
        this.h[4] = h4;
        this.h[5] = h5;
        this.h[6] = h6;
        this.h[7] = h7;
        this.h[8] = h8;
        this.h[9] = h9;
      };
      poly1305.prototype.finish = function(mac, macpos) {
        var g = new Uint16Array(10);
        var c, mask, f, i;
        if (this.leftover) {
          i = this.leftover;
          this.buffer[i++] = 1;
          for (; i < 16; i++) this.buffer[i] = 0;
          this.fin = 1;
          this.blocks(this.buffer, 0, 16);
        }
        c = this.h[1] >>> 13;
        this.h[1] &= 8191;
        for (i = 2; i < 10; i++) {
          this.h[i] += c;
          c = this.h[i] >>> 13;
          this.h[i] &= 8191;
        }
        this.h[0] += c * 5;
        c = this.h[0] >>> 13;
        this.h[0] &= 8191;
        this.h[1] += c;
        c = this.h[1] >>> 13;
        this.h[1] &= 8191;
        this.h[2] += c;
        g[0] = this.h[0] + 5;
        c = g[0] >>> 13;
        g[0] &= 8191;
        for (i = 1; i < 10; i++) {
          g[i] = this.h[i] + c;
          c = g[i] >>> 13;
          g[i] &= 8191;
        }
        g[9] -= 1 << 13;
        mask = (c ^ 1) - 1;
        for (i = 0; i < 10; i++) g[i] &= mask;
        mask = ~mask;
        for (i = 0; i < 10; i++) this.h[i] = this.h[i] & mask | g[i];
        this.h[0] = (this.h[0] | this.h[1] << 13) & 65535;
        this.h[1] = (this.h[1] >>> 3 | this.h[2] << 10) & 65535;
        this.h[2] = (this.h[2] >>> 6 | this.h[3] << 7) & 65535;
        this.h[3] = (this.h[3] >>> 9 | this.h[4] << 4) & 65535;
        this.h[4] = (this.h[4] >>> 12 | this.h[5] << 1 | this.h[6] << 14) & 65535;
        this.h[5] = (this.h[6] >>> 2 | this.h[7] << 11) & 65535;
        this.h[6] = (this.h[7] >>> 5 | this.h[8] << 8) & 65535;
        this.h[7] = (this.h[8] >>> 8 | this.h[9] << 5) & 65535;
        f = this.h[0] + this.pad[0];
        this.h[0] = f & 65535;
        for (i = 1; i < 8; i++) {
          f = (this.h[i] + this.pad[i] | 0) + (f >>> 16) | 0;
          this.h[i] = f & 65535;
        }
        mac[macpos + 0] = this.h[0] >>> 0 & 255;
        mac[macpos + 1] = this.h[0] >>> 8 & 255;
        mac[macpos + 2] = this.h[1] >>> 0 & 255;
        mac[macpos + 3] = this.h[1] >>> 8 & 255;
        mac[macpos + 4] = this.h[2] >>> 0 & 255;
        mac[macpos + 5] = this.h[2] >>> 8 & 255;
        mac[macpos + 6] = this.h[3] >>> 0 & 255;
        mac[macpos + 7] = this.h[3] >>> 8 & 255;
        mac[macpos + 8] = this.h[4] >>> 0 & 255;
        mac[macpos + 9] = this.h[4] >>> 8 & 255;
        mac[macpos + 10] = this.h[5] >>> 0 & 255;
        mac[macpos + 11] = this.h[5] >>> 8 & 255;
        mac[macpos + 12] = this.h[6] >>> 0 & 255;
        mac[macpos + 13] = this.h[6] >>> 8 & 255;
        mac[macpos + 14] = this.h[7] >>> 0 & 255;
        mac[macpos + 15] = this.h[7] >>> 8 & 255;
      };
      poly1305.prototype.update = function(m, mpos, bytes) {
        var i, want;
        if (this.leftover) {
          want = 16 - this.leftover;
          if (want > bytes)
            want = bytes;
          for (i = 0; i < want; i++)
            this.buffer[this.leftover + i] = m[mpos + i];
          bytes -= want;
          mpos += want;
          this.leftover += want;
          if (this.leftover < 16)
            return;
          this.blocks(this.buffer, 0, 16);
          this.leftover = 0;
        }
        if (bytes >= 16) {
          want = bytes - bytes % 16;
          this.blocks(m, mpos, want);
          mpos += want;
          bytes -= want;
        }
        if (bytes) {
          for (i = 0; i < bytes; i++)
            this.buffer[this.leftover + i] = m[mpos + i];
          this.leftover += bytes;
        }
      };
      function crypto_onetimeauth(out, outpos, m, mpos, n, k) {
        var s = new poly1305(k);
        s.update(m, mpos, n);
        s.finish(out, outpos);
        return 0;
      }
      function crypto_onetimeauth_verify(h, hpos, m, mpos, n, k) {
        var x = new Uint8Array(16);
        crypto_onetimeauth(x, 0, m, mpos, n, k);
        return crypto_verify_16(h, hpos, x, 0);
      }
      function crypto_secretbox(c, m, d, n, k) {
        var i;
        if (d < 32) return -1;
        crypto_stream_xor(c, 0, m, 0, d, n, k);
        crypto_onetimeauth(c, 16, c, 32, d - 32, c);
        for (i = 0; i < 16; i++) c[i] = 0;
        return 0;
      }
      function crypto_secretbox_open(m, c, d, n, k) {
        var i;
        var x = new Uint8Array(32);
        if (d < 32) return -1;
        crypto_stream(x, 0, 32, n, k);
        if (crypto_onetimeauth_verify(c, 16, c, 32, d - 32, x) !== 0) return -1;
        crypto_stream_xor(m, 0, c, 0, d, n, k);
        for (i = 0; i < 32; i++) m[i] = 0;
        return 0;
      }
      function set25519(r, a) {
        var i;
        for (i = 0; i < 16; i++) r[i] = a[i] | 0;
      }
      function car25519(o) {
        var i, v, c = 1;
        for (i = 0; i < 16; i++) {
          v = o[i] + c + 65535;
          c = Math.floor(v / 65536);
          o[i] = v - c * 65536;
        }
        o[0] += c - 1 + 37 * (c - 1);
      }
      function sel25519(p, q, b) {
        var t, c = ~(b - 1);
        for (var i = 0; i < 16; i++) {
          t = c & (p[i] ^ q[i]);
          p[i] ^= t;
          q[i] ^= t;
        }
      }
      function pack25519(o, n) {
        var i, j, b;
        var m = gf(), t = gf();
        for (i = 0; i < 16; i++) t[i] = n[i];
        car25519(t);
        car25519(t);
        car25519(t);
        for (j = 0; j < 2; j++) {
          m[0] = t[0] - 65517;
          for (i = 1; i < 15; i++) {
            m[i] = t[i] - 65535 - (m[i - 1] >> 16 & 1);
            m[i - 1] &= 65535;
          }
          m[15] = t[15] - 32767 - (m[14] >> 16 & 1);
          b = m[15] >> 16 & 1;
          m[14] &= 65535;
          sel25519(t, m, 1 - b);
        }
        for (i = 0; i < 16; i++) {
          o[2 * i] = t[i] & 255;
          o[2 * i + 1] = t[i] >> 8;
        }
      }
      function neq25519(a, b) {
        var c = new Uint8Array(32), d = new Uint8Array(32);
        pack25519(c, a);
        pack25519(d, b);
        return crypto_verify_32(c, 0, d, 0);
      }
      function par25519(a) {
        var d = new Uint8Array(32);
        pack25519(d, a);
        return d[0] & 1;
      }
      function unpack25519(o, n) {
        var i;
        for (i = 0; i < 16; i++) o[i] = n[2 * i] + (n[2 * i + 1] << 8);
        o[15] &= 32767;
      }
      function A(o, a, b) {
        for (var i = 0; i < 16; i++) o[i] = a[i] + b[i];
      }
      function Z(o, a, b) {
        for (var i = 0; i < 16; i++) o[i] = a[i] - b[i];
      }
      function M(o, a, b) {
        var v, c, t0 = 0, t1 = 0, t2 = 0, t3 = 0, t4 = 0, t5 = 0, t6 = 0, t7 = 0, t8 = 0, t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0, t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0, t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0, b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7], b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11], b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
        v = a[0];
        t0 += v * b0;
        t1 += v * b1;
        t2 += v * b2;
        t3 += v * b3;
        t4 += v * b4;
        t5 += v * b5;
        t6 += v * b6;
        t7 += v * b7;
        t8 += v * b8;
        t9 += v * b9;
        t10 += v * b10;
        t11 += v * b11;
        t12 += v * b12;
        t13 += v * b13;
        t14 += v * b14;
        t15 += v * b15;
        v = a[1];
        t1 += v * b0;
        t2 += v * b1;
        t3 += v * b2;
        t4 += v * b3;
        t5 += v * b4;
        t6 += v * b5;
        t7 += v * b6;
        t8 += v * b7;
        t9 += v * b8;
        t10 += v * b9;
        t11 += v * b10;
        t12 += v * b11;
        t13 += v * b12;
        t14 += v * b13;
        t15 += v * b14;
        t16 += v * b15;
        v = a[2];
        t2 += v * b0;
        t3 += v * b1;
        t4 += v * b2;
        t5 += v * b3;
        t6 += v * b4;
        t7 += v * b5;
        t8 += v * b6;
        t9 += v * b7;
        t10 += v * b8;
        t11 += v * b9;
        t12 += v * b10;
        t13 += v * b11;
        t14 += v * b12;
        t15 += v * b13;
        t16 += v * b14;
        t17 += v * b15;
        v = a[3];
        t3 += v * b0;
        t4 += v * b1;
        t5 += v * b2;
        t6 += v * b3;
        t7 += v * b4;
        t8 += v * b5;
        t9 += v * b6;
        t10 += v * b7;
        t11 += v * b8;
        t12 += v * b9;
        t13 += v * b10;
        t14 += v * b11;
        t15 += v * b12;
        t16 += v * b13;
        t17 += v * b14;
        t18 += v * b15;
        v = a[4];
        t4 += v * b0;
        t5 += v * b1;
        t6 += v * b2;
        t7 += v * b3;
        t8 += v * b4;
        t9 += v * b5;
        t10 += v * b6;
        t11 += v * b7;
        t12 += v * b8;
        t13 += v * b9;
        t14 += v * b10;
        t15 += v * b11;
        t16 += v * b12;
        t17 += v * b13;
        t18 += v * b14;
        t19 += v * b15;
        v = a[5];
        t5 += v * b0;
        t6 += v * b1;
        t7 += v * b2;
        t8 += v * b3;
        t9 += v * b4;
        t10 += v * b5;
        t11 += v * b6;
        t12 += v * b7;
        t13 += v * b8;
        t14 += v * b9;
        t15 += v * b10;
        t16 += v * b11;
        t17 += v * b12;
        t18 += v * b13;
        t19 += v * b14;
        t20 += v * b15;
        v = a[6];
        t6 += v * b0;
        t7 += v * b1;
        t8 += v * b2;
        t9 += v * b3;
        t10 += v * b4;
        t11 += v * b5;
        t12 += v * b6;
        t13 += v * b7;
        t14 += v * b8;
        t15 += v * b9;
        t16 += v * b10;
        t17 += v * b11;
        t18 += v * b12;
        t19 += v * b13;
        t20 += v * b14;
        t21 += v * b15;
        v = a[7];
        t7 += v * b0;
        t8 += v * b1;
        t9 += v * b2;
        t10 += v * b3;
        t11 += v * b4;
        t12 += v * b5;
        t13 += v * b6;
        t14 += v * b7;
        t15 += v * b8;
        t16 += v * b9;
        t17 += v * b10;
        t18 += v * b11;
        t19 += v * b12;
        t20 += v * b13;
        t21 += v * b14;
        t22 += v * b15;
        v = a[8];
        t8 += v * b0;
        t9 += v * b1;
        t10 += v * b2;
        t11 += v * b3;
        t12 += v * b4;
        t13 += v * b5;
        t14 += v * b6;
        t15 += v * b7;
        t16 += v * b8;
        t17 += v * b9;
        t18 += v * b10;
        t19 += v * b11;
        t20 += v * b12;
        t21 += v * b13;
        t22 += v * b14;
        t23 += v * b15;
        v = a[9];
        t9 += v * b0;
        t10 += v * b1;
        t11 += v * b2;
        t12 += v * b3;
        t13 += v * b4;
        t14 += v * b5;
        t15 += v * b6;
        t16 += v * b7;
        t17 += v * b8;
        t18 += v * b9;
        t19 += v * b10;
        t20 += v * b11;
        t21 += v * b12;
        t22 += v * b13;
        t23 += v * b14;
        t24 += v * b15;
        v = a[10];
        t10 += v * b0;
        t11 += v * b1;
        t12 += v * b2;
        t13 += v * b3;
        t14 += v * b4;
        t15 += v * b5;
        t16 += v * b6;
        t17 += v * b7;
        t18 += v * b8;
        t19 += v * b9;
        t20 += v * b10;
        t21 += v * b11;
        t22 += v * b12;
        t23 += v * b13;
        t24 += v * b14;
        t25 += v * b15;
        v = a[11];
        t11 += v * b0;
        t12 += v * b1;
        t13 += v * b2;
        t14 += v * b3;
        t15 += v * b4;
        t16 += v * b5;
        t17 += v * b6;
        t18 += v * b7;
        t19 += v * b8;
        t20 += v * b9;
        t21 += v * b10;
        t22 += v * b11;
        t23 += v * b12;
        t24 += v * b13;
        t25 += v * b14;
        t26 += v * b15;
        v = a[12];
        t12 += v * b0;
        t13 += v * b1;
        t14 += v * b2;
        t15 += v * b3;
        t16 += v * b4;
        t17 += v * b5;
        t18 += v * b6;
        t19 += v * b7;
        t20 += v * b8;
        t21 += v * b9;
        t22 += v * b10;
        t23 += v * b11;
        t24 += v * b12;
        t25 += v * b13;
        t26 += v * b14;
        t27 += v * b15;
        v = a[13];
        t13 += v * b0;
        t14 += v * b1;
        t15 += v * b2;
        t16 += v * b3;
        t17 += v * b4;
        t18 += v * b5;
        t19 += v * b6;
        t20 += v * b7;
        t21 += v * b8;
        t22 += v * b9;
        t23 += v * b10;
        t24 += v * b11;
        t25 += v * b12;
        t26 += v * b13;
        t27 += v * b14;
        t28 += v * b15;
        v = a[14];
        t14 += v * b0;
        t15 += v * b1;
        t16 += v * b2;
        t17 += v * b3;
        t18 += v * b4;
        t19 += v * b5;
        t20 += v * b6;
        t21 += v * b7;
        t22 += v * b8;
        t23 += v * b9;
        t24 += v * b10;
        t25 += v * b11;
        t26 += v * b12;
        t27 += v * b13;
        t28 += v * b14;
        t29 += v * b15;
        v = a[15];
        t15 += v * b0;
        t16 += v * b1;
        t17 += v * b2;
        t18 += v * b3;
        t19 += v * b4;
        t20 += v * b5;
        t21 += v * b6;
        t22 += v * b7;
        t23 += v * b8;
        t24 += v * b9;
        t25 += v * b10;
        t26 += v * b11;
        t27 += v * b12;
        t28 += v * b13;
        t29 += v * b14;
        t30 += v * b15;
        t0 += 38 * t16;
        t1 += 38 * t17;
        t2 += 38 * t18;
        t3 += 38 * t19;
        t4 += 38 * t20;
        t5 += 38 * t21;
        t6 += 38 * t22;
        t7 += 38 * t23;
        t8 += 38 * t24;
        t9 += 38 * t25;
        t10 += 38 * t26;
        t11 += 38 * t27;
        t12 += 38 * t28;
        t13 += 38 * t29;
        t14 += 38 * t30;
        c = 1;
        v = t0 + c + 65535;
        c = Math.floor(v / 65536);
        t0 = v - c * 65536;
        v = t1 + c + 65535;
        c = Math.floor(v / 65536);
        t1 = v - c * 65536;
        v = t2 + c + 65535;
        c = Math.floor(v / 65536);
        t2 = v - c * 65536;
        v = t3 + c + 65535;
        c = Math.floor(v / 65536);
        t3 = v - c * 65536;
        v = t4 + c + 65535;
        c = Math.floor(v / 65536);
        t4 = v - c * 65536;
        v = t5 + c + 65535;
        c = Math.floor(v / 65536);
        t5 = v - c * 65536;
        v = t6 + c + 65535;
        c = Math.floor(v / 65536);
        t6 = v - c * 65536;
        v = t7 + c + 65535;
        c = Math.floor(v / 65536);
        t7 = v - c * 65536;
        v = t8 + c + 65535;
        c = Math.floor(v / 65536);
        t8 = v - c * 65536;
        v = t9 + c + 65535;
        c = Math.floor(v / 65536);
        t9 = v - c * 65536;
        v = t10 + c + 65535;
        c = Math.floor(v / 65536);
        t10 = v - c * 65536;
        v = t11 + c + 65535;
        c = Math.floor(v / 65536);
        t11 = v - c * 65536;
        v = t12 + c + 65535;
        c = Math.floor(v / 65536);
        t12 = v - c * 65536;
        v = t13 + c + 65535;
        c = Math.floor(v / 65536);
        t13 = v - c * 65536;
        v = t14 + c + 65535;
        c = Math.floor(v / 65536);
        t14 = v - c * 65536;
        v = t15 + c + 65535;
        c = Math.floor(v / 65536);
        t15 = v - c * 65536;
        t0 += c - 1 + 37 * (c - 1);
        c = 1;
        v = t0 + c + 65535;
        c = Math.floor(v / 65536);
        t0 = v - c * 65536;
        v = t1 + c + 65535;
        c = Math.floor(v / 65536);
        t1 = v - c * 65536;
        v = t2 + c + 65535;
        c = Math.floor(v / 65536);
        t2 = v - c * 65536;
        v = t3 + c + 65535;
        c = Math.floor(v / 65536);
        t3 = v - c * 65536;
        v = t4 + c + 65535;
        c = Math.floor(v / 65536);
        t4 = v - c * 65536;
        v = t5 + c + 65535;
        c = Math.floor(v / 65536);
        t5 = v - c * 65536;
        v = t6 + c + 65535;
        c = Math.floor(v / 65536);
        t6 = v - c * 65536;
        v = t7 + c + 65535;
        c = Math.floor(v / 65536);
        t7 = v - c * 65536;
        v = t8 + c + 65535;
        c = Math.floor(v / 65536);
        t8 = v - c * 65536;
        v = t9 + c + 65535;
        c = Math.floor(v / 65536);
        t9 = v - c * 65536;
        v = t10 + c + 65535;
        c = Math.floor(v / 65536);
        t10 = v - c * 65536;
        v = t11 + c + 65535;
        c = Math.floor(v / 65536);
        t11 = v - c * 65536;
        v = t12 + c + 65535;
        c = Math.floor(v / 65536);
        t12 = v - c * 65536;
        v = t13 + c + 65535;
        c = Math.floor(v / 65536);
        t13 = v - c * 65536;
        v = t14 + c + 65535;
        c = Math.floor(v / 65536);
        t14 = v - c * 65536;
        v = t15 + c + 65535;
        c = Math.floor(v / 65536);
        t15 = v - c * 65536;
        t0 += c - 1 + 37 * (c - 1);
        o[0] = t0;
        o[1] = t1;
        o[2] = t2;
        o[3] = t3;
        o[4] = t4;
        o[5] = t5;
        o[6] = t6;
        o[7] = t7;
        o[8] = t8;
        o[9] = t9;
        o[10] = t10;
        o[11] = t11;
        o[12] = t12;
        o[13] = t13;
        o[14] = t14;
        o[15] = t15;
      }
      function S(o, a) {
        M(o, a, a);
      }
      function inv25519(o, i) {
        var c = gf();
        var a;
        for (a = 0; a < 16; a++) c[a] = i[a];
        for (a = 253; a >= 0; a--) {
          S(c, c);
          if (a !== 2 && a !== 4) M(c, c, i);
        }
        for (a = 0; a < 16; a++) o[a] = c[a];
      }
      function pow2523(o, i) {
        var c = gf();
        var a;
        for (a = 0; a < 16; a++) c[a] = i[a];
        for (a = 250; a >= 0; a--) {
          S(c, c);
          if (a !== 1) M(c, c, i);
        }
        for (a = 0; a < 16; a++) o[a] = c[a];
      }
      function crypto_scalarmult(q, n, p) {
        var z = new Uint8Array(32);
        var x = new Float64Array(80), r, i;
        var a = gf(), b = gf(), c = gf(), d = gf(), e = gf(), f = gf();
        for (i = 0; i < 31; i++) z[i] = n[i];
        z[31] = n[31] & 127 | 64;
        z[0] &= 248;
        unpack25519(x, p);
        for (i = 0; i < 16; i++) {
          b[i] = x[i];
          d[i] = a[i] = c[i] = 0;
        }
        a[0] = d[0] = 1;
        for (i = 254; i >= 0; --i) {
          r = z[i >>> 3] >>> (i & 7) & 1;
          sel25519(a, b, r);
          sel25519(c, d, r);
          A(e, a, c);
          Z(a, a, c);
          A(c, b, d);
          Z(b, b, d);
          S(d, e);
          S(f, a);
          M(a, c, a);
          M(c, b, e);
          A(e, a, c);
          Z(a, a, c);
          S(b, a);
          Z(c, d, f);
          M(a, c, _121665);
          A(a, a, d);
          M(c, c, a);
          M(a, d, f);
          M(d, b, x);
          S(b, e);
          sel25519(a, b, r);
          sel25519(c, d, r);
        }
        for (i = 0; i < 16; i++) {
          x[i + 16] = a[i];
          x[i + 32] = c[i];
          x[i + 48] = b[i];
          x[i + 64] = d[i];
        }
        var x32 = x.subarray(32);
        var x16 = x.subarray(16);
        inv25519(x32, x32);
        M(x16, x16, x32);
        pack25519(q, x16);
        return 0;
      }
      function crypto_scalarmult_base(q, n) {
        return crypto_scalarmult(q, n, _9);
      }
      function crypto_box_keypair(y, x) {
        randombytes(x, 32);
        return crypto_scalarmult_base(y, x);
      }
      function crypto_box_beforenm(k, y, x) {
        var s = new Uint8Array(32);
        crypto_scalarmult(s, x, y);
        return crypto_core_hsalsa20(k, _0, s, sigma);
      }
      var crypto_box_afternm = crypto_secretbox;
      var crypto_box_open_afternm = crypto_secretbox_open;
      function crypto_box(c, m, d, n, y, x) {
        var k = new Uint8Array(32);
        crypto_box_beforenm(k, y, x);
        return crypto_box_afternm(c, m, d, n, k);
      }
      function crypto_box_open(m, c, d, n, y, x) {
        var k = new Uint8Array(32);
        crypto_box_beforenm(k, y, x);
        return crypto_box_open_afternm(m, c, d, n, k);
      }
      var K = [
        1116352408,
        3609767458,
        1899447441,
        602891725,
        3049323471,
        3964484399,
        3921009573,
        2173295548,
        961987163,
        4081628472,
        1508970993,
        3053834265,
        2453635748,
        2937671579,
        2870763221,
        3664609560,
        3624381080,
        2734883394,
        310598401,
        1164996542,
        607225278,
        1323610764,
        1426881987,
        3590304994,
        1925078388,
        4068182383,
        2162078206,
        991336113,
        2614888103,
        633803317,
        3248222580,
        3479774868,
        3835390401,
        2666613458,
        4022224774,
        944711139,
        264347078,
        2341262773,
        604807628,
        2007800933,
        770255983,
        1495990901,
        1249150122,
        1856431235,
        1555081692,
        3175218132,
        1996064986,
        2198950837,
        2554220882,
        3999719339,
        2821834349,
        766784016,
        2952996808,
        2566594879,
        3210313671,
        3203337956,
        3336571891,
        1034457026,
        3584528711,
        2466948901,
        113926993,
        3758326383,
        338241895,
        168717936,
        666307205,
        1188179964,
        773529912,
        1546045734,
        1294757372,
        1522805485,
        1396182291,
        2643833823,
        1695183700,
        2343527390,
        1986661051,
        1014477480,
        2177026350,
        1206759142,
        2456956037,
        344077627,
        2730485921,
        1290863460,
        2820302411,
        3158454273,
        3259730800,
        3505952657,
        3345764771,
        106217008,
        3516065817,
        3606008344,
        3600352804,
        1432725776,
        4094571909,
        1467031594,
        275423344,
        851169720,
        430227734,
        3100823752,
        506948616,
        1363258195,
        659060556,
        3750685593,
        883997877,
        3785050280,
        958139571,
        3318307427,
        1322822218,
        3812723403,
        1537002063,
        2003034995,
        1747873779,
        3602036899,
        1955562222,
        1575990012,
        2024104815,
        1125592928,
        2227730452,
        2716904306,
        2361852424,
        442776044,
        2428436474,
        593698344,
        2756734187,
        3733110249,
        3204031479,
        2999351573,
        3329325298,
        3815920427,
        3391569614,
        3928383900,
        3515267271,
        566280711,
        3940187606,
        3454069534,
        4118630271,
        4000239992,
        116418474,
        1914138554,
        174292421,
        2731055270,
        289380356,
        3203993006,
        460393269,
        320620315,
        685471733,
        587496836,
        852142971,
        1086792851,
        1017036298,
        365543100,
        1126000580,
        2618297676,
        1288033470,
        3409855158,
        1501505948,
        4234509866,
        1607167915,
        987167468,
        1816402316,
        1246189591
      ];
      function crypto_hashblocks_hl(hh, hl, m, n) {
        var wh = new Int32Array(16), wl = new Int32Array(16), bh0, bh1, bh2, bh3, bh4, bh5, bh6, bh7, bl0, bl1, bl2, bl3, bl4, bl5, bl6, bl7, th, tl, i, j, h, l, a, b, c, d;
        var ah0 = hh[0], ah1 = hh[1], ah2 = hh[2], ah3 = hh[3], ah4 = hh[4], ah5 = hh[5], ah6 = hh[6], ah7 = hh[7], al0 = hl[0], al1 = hl[1], al2 = hl[2], al3 = hl[3], al4 = hl[4], al5 = hl[5], al6 = hl[6], al7 = hl[7];
        var pos = 0;
        while (n >= 128) {
          for (i = 0; i < 16; i++) {
            j = 8 * i + pos;
            wh[i] = m[j + 0] << 24 | m[j + 1] << 16 | m[j + 2] << 8 | m[j + 3];
            wl[i] = m[j + 4] << 24 | m[j + 5] << 16 | m[j + 6] << 8 | m[j + 7];
          }
          for (i = 0; i < 80; i++) {
            bh0 = ah0;
            bh1 = ah1;
            bh2 = ah2;
            bh3 = ah3;
            bh4 = ah4;
            bh5 = ah5;
            bh6 = ah6;
            bh7 = ah7;
            bl0 = al0;
            bl1 = al1;
            bl2 = al2;
            bl3 = al3;
            bl4 = al4;
            bl5 = al5;
            bl6 = al6;
            bl7 = al7;
            h = ah7;
            l = al7;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = (ah4 >>> 14 | al4 << 32 - 14) ^ (ah4 >>> 18 | al4 << 32 - 18) ^ (al4 >>> 41 - 32 | ah4 << 32 - (41 - 32));
            l = (al4 >>> 14 | ah4 << 32 - 14) ^ (al4 >>> 18 | ah4 << 32 - 18) ^ (ah4 >>> 41 - 32 | al4 << 32 - (41 - 32));
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            h = ah4 & ah5 ^ ~ah4 & ah6;
            l = al4 & al5 ^ ~al4 & al6;
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            h = K[i * 2];
            l = K[i * 2 + 1];
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            h = wh[i % 16];
            l = wl[i % 16];
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            th = c & 65535 | d << 16;
            tl = a & 65535 | b << 16;
            h = th;
            l = tl;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = (ah0 >>> 28 | al0 << 32 - 28) ^ (al0 >>> 34 - 32 | ah0 << 32 - (34 - 32)) ^ (al0 >>> 39 - 32 | ah0 << 32 - (39 - 32));
            l = (al0 >>> 28 | ah0 << 32 - 28) ^ (ah0 >>> 34 - 32 | al0 << 32 - (34 - 32)) ^ (ah0 >>> 39 - 32 | al0 << 32 - (39 - 32));
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            h = ah0 & ah1 ^ ah0 & ah2 ^ ah1 & ah2;
            l = al0 & al1 ^ al0 & al2 ^ al1 & al2;
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            bh7 = c & 65535 | d << 16;
            bl7 = a & 65535 | b << 16;
            h = bh3;
            l = bl3;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = th;
            l = tl;
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            bh3 = c & 65535 | d << 16;
            bl3 = a & 65535 | b << 16;
            ah1 = bh0;
            ah2 = bh1;
            ah3 = bh2;
            ah4 = bh3;
            ah5 = bh4;
            ah6 = bh5;
            ah7 = bh6;
            ah0 = bh7;
            al1 = bl0;
            al2 = bl1;
            al3 = bl2;
            al4 = bl3;
            al5 = bl4;
            al6 = bl5;
            al7 = bl6;
            al0 = bl7;
            if (i % 16 === 15) {
              for (j = 0; j < 16; j++) {
                h = wh[j];
                l = wl[j];
                a = l & 65535;
                b = l >>> 16;
                c = h & 65535;
                d = h >>> 16;
                h = wh[(j + 9) % 16];
                l = wl[(j + 9) % 16];
                a += l & 65535;
                b += l >>> 16;
                c += h & 65535;
                d += h >>> 16;
                th = wh[(j + 1) % 16];
                tl = wl[(j + 1) % 16];
                h = (th >>> 1 | tl << 32 - 1) ^ (th >>> 8 | tl << 32 - 8) ^ th >>> 7;
                l = (tl >>> 1 | th << 32 - 1) ^ (tl >>> 8 | th << 32 - 8) ^ (tl >>> 7 | th << 32 - 7);
                a += l & 65535;
                b += l >>> 16;
                c += h & 65535;
                d += h >>> 16;
                th = wh[(j + 14) % 16];
                tl = wl[(j + 14) % 16];
                h = (th >>> 19 | tl << 32 - 19) ^ (tl >>> 61 - 32 | th << 32 - (61 - 32)) ^ th >>> 6;
                l = (tl >>> 19 | th << 32 - 19) ^ (th >>> 61 - 32 | tl << 32 - (61 - 32)) ^ (tl >>> 6 | th << 32 - 6);
                a += l & 65535;
                b += l >>> 16;
                c += h & 65535;
                d += h >>> 16;
                b += a >>> 16;
                c += b >>> 16;
                d += c >>> 16;
                wh[j] = c & 65535 | d << 16;
                wl[j] = a & 65535 | b << 16;
              }
            }
          }
          h = ah0;
          l = al0;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[0];
          l = hl[0];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[0] = ah0 = c & 65535 | d << 16;
          hl[0] = al0 = a & 65535 | b << 16;
          h = ah1;
          l = al1;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[1];
          l = hl[1];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[1] = ah1 = c & 65535 | d << 16;
          hl[1] = al1 = a & 65535 | b << 16;
          h = ah2;
          l = al2;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[2];
          l = hl[2];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[2] = ah2 = c & 65535 | d << 16;
          hl[2] = al2 = a & 65535 | b << 16;
          h = ah3;
          l = al3;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[3];
          l = hl[3];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[3] = ah3 = c & 65535 | d << 16;
          hl[3] = al3 = a & 65535 | b << 16;
          h = ah4;
          l = al4;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[4];
          l = hl[4];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[4] = ah4 = c & 65535 | d << 16;
          hl[4] = al4 = a & 65535 | b << 16;
          h = ah5;
          l = al5;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[5];
          l = hl[5];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[5] = ah5 = c & 65535 | d << 16;
          hl[5] = al5 = a & 65535 | b << 16;
          h = ah6;
          l = al6;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[6];
          l = hl[6];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[6] = ah6 = c & 65535 | d << 16;
          hl[6] = al6 = a & 65535 | b << 16;
          h = ah7;
          l = al7;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[7];
          l = hl[7];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[7] = ah7 = c & 65535 | d << 16;
          hl[7] = al7 = a & 65535 | b << 16;
          pos += 128;
          n -= 128;
        }
        return n;
      }
      function crypto_hash(out, m, n) {
        var hh = new Int32Array(8), hl = new Int32Array(8), x = new Uint8Array(256), i, b = n;
        hh[0] = 1779033703;
        hh[1] = 3144134277;
        hh[2] = 1013904242;
        hh[3] = 2773480762;
        hh[4] = 1359893119;
        hh[5] = 2600822924;
        hh[6] = 528734635;
        hh[7] = 1541459225;
        hl[0] = 4089235720;
        hl[1] = 2227873595;
        hl[2] = 4271175723;
        hl[3] = 1595750129;
        hl[4] = 2917565137;
        hl[5] = 725511199;
        hl[6] = 4215389547;
        hl[7] = 327033209;
        crypto_hashblocks_hl(hh, hl, m, n);
        n %= 128;
        for (i = 0; i < n; i++) x[i] = m[b - n + i];
        x[n] = 128;
        n = 256 - 128 * (n < 112 ? 1 : 0);
        x[n - 9] = 0;
        ts64(x, n - 8, b / 536870912 | 0, b << 3);
        crypto_hashblocks_hl(hh, hl, x, n);
        for (i = 0; i < 8; i++) ts64(out, 8 * i, hh[i], hl[i]);
        return 0;
      }
      function add(p, q) {
        var a = gf(), b = gf(), c = gf(), d = gf(), e = gf(), f = gf(), g = gf(), h = gf(), t = gf();
        Z(a, p[1], p[0]);
        Z(t, q[1], q[0]);
        M(a, a, t);
        A(b, p[0], p[1]);
        A(t, q[0], q[1]);
        M(b, b, t);
        M(c, p[3], q[3]);
        M(c, c, D2);
        M(d, p[2], q[2]);
        A(d, d, d);
        Z(e, b, a);
        Z(f, d, c);
        A(g, d, c);
        A(h, b, a);
        M(p[0], e, f);
        M(p[1], h, g);
        M(p[2], g, f);
        M(p[3], e, h);
      }
      function cswap(p, q, b) {
        var i;
        for (i = 0; i < 4; i++) {
          sel25519(p[i], q[i], b);
        }
      }
      function pack(r, p) {
        var tx = gf(), ty = gf(), zi = gf();
        inv25519(zi, p[2]);
        M(tx, p[0], zi);
        M(ty, p[1], zi);
        pack25519(r, ty);
        r[31] ^= par25519(tx) << 7;
      }
      function scalarmult(p, q, s) {
        var b, i;
        set25519(p[0], gf0);
        set25519(p[1], gf1);
        set25519(p[2], gf1);
        set25519(p[3], gf0);
        for (i = 255; i >= 0; --i) {
          b = s[i / 8 | 0] >> (i & 7) & 1;
          cswap(p, q, b);
          add(q, p);
          add(p, p);
          cswap(p, q, b);
        }
      }
      function scalarbase(p, s) {
        var q = [gf(), gf(), gf(), gf()];
        set25519(q[0], X);
        set25519(q[1], Y);
        set25519(q[2], gf1);
        M(q[3], X, Y);
        scalarmult(p, q, s);
      }
      function crypto_sign_keypair(pk, sk, seeded) {
        var d = new Uint8Array(64);
        var p = [gf(), gf(), gf(), gf()];
        var i;
        if (!seeded) randombytes(sk, 32);
        crypto_hash(d, sk, 32);
        d[0] &= 248;
        d[31] &= 127;
        d[31] |= 64;
        scalarbase(p, d);
        pack(pk, p);
        for (i = 0; i < 32; i++) sk[i + 32] = pk[i];
        return 0;
      }
      var L = new Float64Array([237, 211, 245, 92, 26, 99, 18, 88, 214, 156, 247, 162, 222, 249, 222, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16]);
      function modL(r, x) {
        var carry, i, j, k;
        for (i = 63; i >= 32; --i) {
          carry = 0;
          for (j = i - 32, k = i - 12; j < k; ++j) {
            x[j] += carry - 16 * x[i] * L[j - (i - 32)];
            carry = Math.floor((x[j] + 128) / 256);
            x[j] -= carry * 256;
          }
          x[j] += carry;
          x[i] = 0;
        }
        carry = 0;
        for (j = 0; j < 32; j++) {
          x[j] += carry - (x[31] >> 4) * L[j];
          carry = x[j] >> 8;
          x[j] &= 255;
        }
        for (j = 0; j < 32; j++) x[j] -= carry * L[j];
        for (i = 0; i < 32; i++) {
          x[i + 1] += x[i] >> 8;
          r[i] = x[i] & 255;
        }
      }
      function reduce(r) {
        var x = new Float64Array(64), i;
        for (i = 0; i < 64; i++) x[i] = r[i];
        for (i = 0; i < 64; i++) r[i] = 0;
        modL(r, x);
      }
      function crypto_sign(sm, m, n, sk) {
        var d = new Uint8Array(64), h = new Uint8Array(64), r = new Uint8Array(64);
        var i, j, x = new Float64Array(64);
        var p = [gf(), gf(), gf(), gf()];
        crypto_hash(d, sk, 32);
        d[0] &= 248;
        d[31] &= 127;
        d[31] |= 64;
        var smlen = n + 64;
        for (i = 0; i < n; i++) sm[64 + i] = m[i];
        for (i = 0; i < 32; i++) sm[32 + i] = d[32 + i];
        crypto_hash(r, sm.subarray(32), n + 32);
        reduce(r);
        scalarbase(p, r);
        pack(sm, p);
        for (i = 32; i < 64; i++) sm[i] = sk[i];
        crypto_hash(h, sm, n + 64);
        reduce(h);
        for (i = 0; i < 64; i++) x[i] = 0;
        for (i = 0; i < 32; i++) x[i] = r[i];
        for (i = 0; i < 32; i++) {
          for (j = 0; j < 32; j++) {
            x[i + j] += h[i] * d[j];
          }
        }
        modL(sm.subarray(32), x);
        return smlen;
      }
      function unpackneg(r, p) {
        var t = gf(), chk = gf(), num = gf(), den = gf(), den2 = gf(), den4 = gf(), den6 = gf();
        set25519(r[2], gf1);
        unpack25519(r[1], p);
        S(num, r[1]);
        M(den, num, D);
        Z(num, num, r[2]);
        A(den, r[2], den);
        S(den2, den);
        S(den4, den2);
        M(den6, den4, den2);
        M(t, den6, num);
        M(t, t, den);
        pow2523(t, t);
        M(t, t, num);
        M(t, t, den);
        M(t, t, den);
        M(r[0], t, den);
        S(chk, r[0]);
        M(chk, chk, den);
        if (neq25519(chk, num)) M(r[0], r[0], I);
        S(chk, r[0]);
        M(chk, chk, den);
        if (neq25519(chk, num)) return -1;
        if (par25519(r[0]) === p[31] >> 7) Z(r[0], gf0, r[0]);
        M(r[3], r[0], r[1]);
        return 0;
      }
      function crypto_sign_open(m, sm, n, pk) {
        var i;
        var t = new Uint8Array(32), h = new Uint8Array(64);
        var p = [gf(), gf(), gf(), gf()], q = [gf(), gf(), gf(), gf()];
        if (n < 64) return -1;
        if (unpackneg(q, pk)) return -1;
        for (i = 0; i < n; i++) m[i] = sm[i];
        for (i = 0; i < 32; i++) m[i + 32] = pk[i];
        crypto_hash(h, m, n);
        reduce(h);
        scalarmult(p, q, h);
        scalarbase(q, sm.subarray(32));
        add(p, q);
        pack(t, p);
        n -= 64;
        if (crypto_verify_32(sm, 0, t, 0)) {
          for (i = 0; i < n; i++) m[i] = 0;
          return -1;
        }
        for (i = 0; i < n; i++) m[i] = sm[i + 64];
        return n;
      }
      var crypto_secretbox_KEYBYTES = 32, crypto_secretbox_NONCEBYTES = 24, crypto_secretbox_ZEROBYTES = 32, crypto_secretbox_BOXZEROBYTES = 16, crypto_scalarmult_BYTES = 32, crypto_scalarmult_SCALARBYTES = 32, crypto_box_PUBLICKEYBYTES = 32, crypto_box_SECRETKEYBYTES = 32, crypto_box_BEFORENMBYTES = 32, crypto_box_NONCEBYTES = crypto_secretbox_NONCEBYTES, crypto_box_ZEROBYTES = crypto_secretbox_ZEROBYTES, crypto_box_BOXZEROBYTES = crypto_secretbox_BOXZEROBYTES, crypto_sign_BYTES = 64, crypto_sign_PUBLICKEYBYTES = 32, crypto_sign_SECRETKEYBYTES = 64, crypto_sign_SEEDBYTES = 32, crypto_hash_BYTES = 64;
      nacl2.lowlevel = {
        crypto_core_hsalsa20,
        crypto_stream_xor,
        crypto_stream,
        crypto_stream_salsa20_xor,
        crypto_stream_salsa20,
        crypto_onetimeauth,
        crypto_onetimeauth_verify,
        crypto_verify_16,
        crypto_verify_32,
        crypto_secretbox,
        crypto_secretbox_open,
        crypto_scalarmult,
        crypto_scalarmult_base,
        crypto_box_beforenm,
        crypto_box_afternm,
        crypto_box,
        crypto_box_open,
        crypto_box_keypair,
        crypto_hash,
        crypto_sign,
        crypto_sign_keypair,
        crypto_sign_open,
        crypto_secretbox_KEYBYTES,
        crypto_secretbox_NONCEBYTES,
        crypto_secretbox_ZEROBYTES,
        crypto_secretbox_BOXZEROBYTES,
        crypto_scalarmult_BYTES,
        crypto_scalarmult_SCALARBYTES,
        crypto_box_PUBLICKEYBYTES,
        crypto_box_SECRETKEYBYTES,
        crypto_box_BEFORENMBYTES,
        crypto_box_NONCEBYTES,
        crypto_box_ZEROBYTES,
        crypto_box_BOXZEROBYTES,
        crypto_sign_BYTES,
        crypto_sign_PUBLICKEYBYTES,
        crypto_sign_SECRETKEYBYTES,
        crypto_sign_SEEDBYTES,
        crypto_hash_BYTES,
        gf,
        D,
        L,
        pack25519,
        unpack25519,
        M,
        A,
        S,
        Z,
        pow2523,
        add,
        set25519,
        modL,
        scalarmult,
        scalarbase
      };
      function checkLengths(k, n) {
        if (k.length !== crypto_secretbox_KEYBYTES) throw new Error("bad key size");
        if (n.length !== crypto_secretbox_NONCEBYTES) throw new Error("bad nonce size");
      }
      function checkBoxLengths(pk, sk) {
        if (pk.length !== crypto_box_PUBLICKEYBYTES) throw new Error("bad public key size");
        if (sk.length !== crypto_box_SECRETKEYBYTES) throw new Error("bad secret key size");
      }
      function checkArrayTypes() {
        for (var i = 0; i < arguments.length; i++) {
          if (!(arguments[i] instanceof Uint8Array))
            throw new TypeError("unexpected type, use Uint8Array");
        }
      }
      function cleanup(arr) {
        for (var i = 0; i < arr.length; i++) arr[i] = 0;
      }
      nacl2.randomBytes = function(n) {
        var b = new Uint8Array(n);
        randombytes(b, n);
        return b;
      };
      nacl2.secretbox = function(msg, nonce, key) {
        checkArrayTypes(msg, nonce, key);
        checkLengths(key, nonce);
        var m = new Uint8Array(crypto_secretbox_ZEROBYTES + msg.length);
        var c = new Uint8Array(m.length);
        for (var i = 0; i < msg.length; i++) m[i + crypto_secretbox_ZEROBYTES] = msg[i];
        crypto_secretbox(c, m, m.length, nonce, key);
        return c.subarray(crypto_secretbox_BOXZEROBYTES);
      };
      nacl2.secretbox.open = function(box, nonce, key) {
        checkArrayTypes(box, nonce, key);
        checkLengths(key, nonce);
        var c = new Uint8Array(crypto_secretbox_BOXZEROBYTES + box.length);
        var m = new Uint8Array(c.length);
        for (var i = 0; i < box.length; i++) c[i + crypto_secretbox_BOXZEROBYTES] = box[i];
        if (c.length < 32) return null;
        if (crypto_secretbox_open(m, c, c.length, nonce, key) !== 0) return null;
        return m.subarray(crypto_secretbox_ZEROBYTES);
      };
      nacl2.secretbox.keyLength = crypto_secretbox_KEYBYTES;
      nacl2.secretbox.nonceLength = crypto_secretbox_NONCEBYTES;
      nacl2.secretbox.overheadLength = crypto_secretbox_BOXZEROBYTES;
      nacl2.scalarMult = function(n, p) {
        checkArrayTypes(n, p);
        if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error("bad n size");
        if (p.length !== crypto_scalarmult_BYTES) throw new Error("bad p size");
        var q = new Uint8Array(crypto_scalarmult_BYTES);
        crypto_scalarmult(q, n, p);
        return q;
      };
      nacl2.scalarMult.base = function(n) {
        checkArrayTypes(n);
        if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error("bad n size");
        var q = new Uint8Array(crypto_scalarmult_BYTES);
        crypto_scalarmult_base(q, n);
        return q;
      };
      nacl2.scalarMult.scalarLength = crypto_scalarmult_SCALARBYTES;
      nacl2.scalarMult.groupElementLength = crypto_scalarmult_BYTES;
      nacl2.box = function(msg, nonce, publicKey, secretKey) {
        var k = nacl2.box.before(publicKey, secretKey);
        return nacl2.secretbox(msg, nonce, k);
      };
      nacl2.box.before = function(publicKey, secretKey) {
        checkArrayTypes(publicKey, secretKey);
        checkBoxLengths(publicKey, secretKey);
        var k = new Uint8Array(crypto_box_BEFORENMBYTES);
        crypto_box_beforenm(k, publicKey, secretKey);
        return k;
      };
      nacl2.box.after = nacl2.secretbox;
      nacl2.box.open = function(msg, nonce, publicKey, secretKey) {
        var k = nacl2.box.before(publicKey, secretKey);
        return nacl2.secretbox.open(msg, nonce, k);
      };
      nacl2.box.open.after = nacl2.secretbox.open;
      nacl2.box.keyPair = function() {
        var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
        var sk = new Uint8Array(crypto_box_SECRETKEYBYTES);
        crypto_box_keypair(pk, sk);
        return { publicKey: pk, secretKey: sk };
      };
      nacl2.box.keyPair.fromSecretKey = function(secretKey) {
        checkArrayTypes(secretKey);
        if (secretKey.length !== crypto_box_SECRETKEYBYTES)
          throw new Error("bad secret key size");
        var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
        crypto_scalarmult_base(pk, secretKey);
        return { publicKey: pk, secretKey: new Uint8Array(secretKey) };
      };
      nacl2.box.publicKeyLength = crypto_box_PUBLICKEYBYTES;
      nacl2.box.secretKeyLength = crypto_box_SECRETKEYBYTES;
      nacl2.box.sharedKeyLength = crypto_box_BEFORENMBYTES;
      nacl2.box.nonceLength = crypto_box_NONCEBYTES;
      nacl2.box.overheadLength = nacl2.secretbox.overheadLength;
      nacl2.sign = function(msg, secretKey) {
        checkArrayTypes(msg, secretKey);
        if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
          throw new Error("bad secret key size");
        var signedMsg = new Uint8Array(crypto_sign_BYTES + msg.length);
        crypto_sign(signedMsg, msg, msg.length, secretKey);
        return signedMsg;
      };
      nacl2.sign.open = function(signedMsg, publicKey) {
        checkArrayTypes(signedMsg, publicKey);
        if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
          throw new Error("bad public key size");
        var tmp = new Uint8Array(signedMsg.length);
        var mlen = crypto_sign_open(tmp, signedMsg, signedMsg.length, publicKey);
        if (mlen < 0) return null;
        var m = new Uint8Array(mlen);
        for (var i = 0; i < m.length; i++) m[i] = tmp[i];
        return m;
      };
      nacl2.sign.detached = function(msg, secretKey) {
        var signedMsg = nacl2.sign(msg, secretKey);
        var sig = new Uint8Array(crypto_sign_BYTES);
        for (var i = 0; i < sig.length; i++) sig[i] = signedMsg[i];
        return sig;
      };
      nacl2.sign.detached.verify = function(msg, sig, publicKey) {
        checkArrayTypes(msg, sig, publicKey);
        if (sig.length !== crypto_sign_BYTES)
          throw new Error("bad signature size");
        if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
          throw new Error("bad public key size");
        var sm = new Uint8Array(crypto_sign_BYTES + msg.length);
        var m = new Uint8Array(crypto_sign_BYTES + msg.length);
        var i;
        for (i = 0; i < crypto_sign_BYTES; i++) sm[i] = sig[i];
        for (i = 0; i < msg.length; i++) sm[i + crypto_sign_BYTES] = msg[i];
        return crypto_sign_open(m, sm, sm.length, publicKey) >= 0;
      };
      nacl2.sign.keyPair = function() {
        var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
        var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
        crypto_sign_keypair(pk, sk);
        return { publicKey: pk, secretKey: sk };
      };
      nacl2.sign.keyPair.fromSecretKey = function(secretKey) {
        checkArrayTypes(secretKey);
        if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
          throw new Error("bad secret key size");
        var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
        for (var i = 0; i < pk.length; i++) pk[i] = secretKey[32 + i];
        return { publicKey: pk, secretKey: new Uint8Array(secretKey) };
      };
      nacl2.sign.keyPair.fromSeed = function(seed) {
        checkArrayTypes(seed);
        if (seed.length !== crypto_sign_SEEDBYTES)
          throw new Error("bad seed size");
        var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
        var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
        for (var i = 0; i < 32; i++) sk[i] = seed[i];
        crypto_sign_keypair(pk, sk, true);
        return { publicKey: pk, secretKey: sk };
      };
      nacl2.sign.publicKeyLength = crypto_sign_PUBLICKEYBYTES;
      nacl2.sign.secretKeyLength = crypto_sign_SECRETKEYBYTES;
      nacl2.sign.seedLength = crypto_sign_SEEDBYTES;
      nacl2.sign.signatureLength = crypto_sign_BYTES;
      nacl2.hash = function(msg) {
        checkArrayTypes(msg);
        var h = new Uint8Array(crypto_hash_BYTES);
        crypto_hash(h, msg, msg.length);
        return h;
      };
      nacl2.hash.hashLength = crypto_hash_BYTES;
      nacl2.verify = function(x, y) {
        checkArrayTypes(x, y);
        if (x.length === 0 || y.length === 0) return false;
        if (x.length !== y.length) return false;
        return vn(x, 0, y, 0, x.length) === 0 ? true : false;
      };
      nacl2.setPRNG = function(fn) {
        randombytes = fn;
      };
      (function() {
        var crypto = typeof self !== "undefined" ? self.crypto || self.msCrypto : null;
        if (crypto && crypto.getRandomValues) {
          var QUOTA = 65536;
          nacl2.setPRNG(function(x, n) {
            var i, v = new Uint8Array(n);
            for (i = 0; i < n; i += QUOTA) {
              crypto.getRandomValues(v.subarray(i, i + Math.min(n - i, QUOTA)));
            }
            for (i = 0; i < n; i++) x[i] = v[i];
            cleanup(v);
          });
        } else if (typeof require !== "undefined") {
          crypto = require_crypto();
          if (crypto && crypto.randomBytes) {
            nacl2.setPRNG(function(x, n) {
              var i, v = crypto.randomBytes(n);
              for (i = 0; i < n; i++) x[i] = v[i];
              cleanup(v);
            });
          }
        }
      })();
    })(typeof module2 !== "undefined" && module2.exports ? module2.exports : self.nacl = self.nacl || {});
  }
});

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => InvoiceForgePlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian6 = require("obsidian");

// src/settings.ts
var PRO_PRICE = "$15 one-time";
var DEFAULT_BUSINESS = {
  name: "",
  email: "",
  address: "",
  logoUrl: "",
  defaultRate: 75,
  currency: "USD",
  taxRate: 0,
  taxLabel: "Tax",
  notes: "Payment due within 14 days. Thank you for your business."
};
var DEFAULT_SETTINGS = {
  licenseKey: "",
  isPro: false,
  licenseEmail: "",
  purchaseUrl: "https://buymeacoffee.com/vaultspotlight/e/554726",
  pendingInvoice: null,
  business: DEFAULT_BUSINESS,
  clients: [],
  invoiceFolder: "Invoices",
  numberTemplate: "INV-{YYYY}-{seq:4}",
  nextSeq: 1,
  dueInDays: 14,
  openAfterCreate: true,
  reminderEnabled: false,
  reminderDaysBefore: 3,
  defaultPeriodDays: 30
};
function slugify(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "client";
}

// src/ui/SettingTab.ts
var import_obsidian2 = require("obsidian");

// src/ui/ClientEditModal.ts
var import_obsidian = require("obsidian");
var ClientEditModal = class extends import_obsidian.Modal {
  constructor(app, plugin, client, onSave) {
    super(app);
    this.plugin = plugin;
    this.isNew = client === null;
    this.originalId = client ? client.id : null;
    this.onSave = onSave;
    this.working = client ? { ...client } : { id: "", name: "", email: "", address: "", defaultRate: null, currency: null, taxRate: null };
  }
  onOpen() {
    this.titleEl.setText(this.isNew ? "Add client" : "Edit client");
    const { contentEl } = this;
    contentEl.empty();
    new import_obsidian.Setting(contentEl).setName("Name").addText(
      (t) => t.setValue(this.working.name).onChange((v) => this.working.name = v)
    );
    new import_obsidian.Setting(contentEl).setName("Tag slug").setDesc("Used as #client/<slug> in your notes. Leave blank to auto-generate from the name.").addText((t) => t.setPlaceholder("acme").setValue(this.working.id).onChange((v) => this.working.id = v.trim()));
    new import_obsidian.Setting(contentEl).setName("Email").addText(
      (t) => t.setValue(this.working.email).onChange((v) => this.working.email = v)
    );
    new import_obsidian.Setting(contentEl).setName("Address").addTextArea(
      (t) => t.setValue(this.working.address).onChange((v) => this.working.address = v)
    );
    new import_obsidian.Setting(contentEl).setName("Default hourly rate").setDesc("Blank uses the business default rate.").addText(
      (t) => {
        var _a, _b;
        return t.setPlaceholder(String(this.plugin.settings.business.defaultRate)).setValue((_b = (_a = this.working.defaultRate) == null ? void 0 : _a.toString()) != null ? _b : "").onChange((v) => this.working.defaultRate = parseNumberOrNull(v));
      }
    );
    new import_obsidian.Setting(contentEl).setName("Currency").setDesc("ISO code (USD, EUR, GBP\u2026). Blank uses the business default.").addText(
      (t) => {
        var _a;
        return t.setPlaceholder(this.plugin.settings.business.currency).setValue((_a = this.working.currency) != null ? _a : "").onChange((v) => this.working.currency = v.trim() ? v.trim().toUpperCase() : null);
      }
    );
    const taxSetting = new import_obsidian.Setting(contentEl).setName("Tax rate %").setDesc(this.plugin.settings.isPro ? "Blank uses the business tax rate." : "Per-client tax is a Pro feature.");
    if (this.plugin.settings.isPro) {
      taxSetting.addText(
        (t) => {
          var _a, _b;
          return t.setValue((_b = (_a = this.working.taxRate) == null ? void 0 : _a.toString()) != null ? _b : "").onChange((v) => this.working.taxRate = parseNumberOrNull(v));
        }
      );
    } else {
      taxSetting.settingEl.addClass("if-locked");
    }
    new import_obsidian.Setting(contentEl).addButton(
      (b) => b.setButtonText("Save").setCta().onClick(() => this.save())
    );
  }
  save() {
    if (!this.working.name.trim()) {
      new import_obsidian.Notice("Client needs a name.");
      return;
    }
    if (this.working.defaultRate !== null && this.working.defaultRate < 0) {
      new import_obsidian.Notice("Default rate must be 0 or more.");
      return;
    }
    if (this.working.taxRate !== null && (this.working.taxRate < 0 || this.working.taxRate > 100)) {
      new import_obsidian.Notice("Tax rate must be between 0 and 100.");
      return;
    }
    if (!this.working.id) this.working.id = slugify(this.working.name);
    else this.working.id = slugify(this.working.id);
    const clients = this.plugin.settings.clients;
    if (clients.some((c) => c.id === this.working.id && c.id !== this.originalId)) {
      new import_obsidian.Notice(`A client with slug "${this.working.id}" already exists.`);
      return;
    }
    const idx = this.originalId ? clients.findIndex((c) => c.id === this.originalId) : -1;
    if (idx !== -1) clients[idx] = this.working;
    else clients.push(this.working);
    void this.plugin.saveSettings().then(() => {
      this.onSave();
      this.close();
    });
  }
};
function parseNumberOrNull(value) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

// src/ui/SettingTab.ts
var InvoiceForgeSettingTab = class extends import_obsidian2.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    const s = this.plugin.settings;
    const freshInstall = !s.business.name.trim() && s.clients.length === 0 && s.nextSeq === 1;
    if (freshInstall) {
      const help = containerEl.createDiv({ cls: "if-onboarding" });
      help.createEl("p", { text: "Welcome to Invoice Forge. Three steps to your first invoice:" });
      const ol = help.createEl("ol");
      ol.createEl("li", { text: "Set your business name and default rate below." });
      ol.createEl("li", { text: "In any note, add a line like: - #billable #client/acme 2h Work done" });
      ol.createEl("li", { text: "Run the Create invoice command (or the ribbon icon), pick the client and dates." });
    }
    new import_obsidian2.Setting(containerEl).setName("License key").setDesc("Enter your Pro license key. Verified offline \u2014 no account or server required.").addText(
      (text) => text.setPlaceholder("payload.signature").setValue(this.plugin.settings.licenseKey).onChange((value) => {
        this.plugin.settings.licenseKey = value;
        void this.plugin.refreshLicense().then(() => {
          this.plugin.reminders.start();
          this.display();
        });
      })
    );
    const status = containerEl.createDiv({ cls: "if-license-status" });
    if (this.plugin.settings.isPro) {
      status.createEl("p", {
        text: `Pro active${this.plugin.settings.licenseEmail ? ` (${this.plugin.settings.licenseEmail})` : ""}.`
      });
    } else {
      status.createEl("p", {
        text: `Free tier active. Pro (${PRO_PRICE}) unlocks PDF/print export, tax & multi-currency, billing reminders, and your logo on invoices.`
      });
      const link = status.createEl("a", {
        text: `Get Invoice Forge Pro \u2014 ${PRO_PRICE}`,
        href: this.plugin.settings.purchaseUrl
      });
      link.setAttr("target", "_blank");
      link.setAttr("rel", "noopener");
    }
    new import_obsidian2.Setting(containerEl).setName("Purchase page URL").setDesc("Link shown for Pro upgrades.").addText(
      (text) => text.setPlaceholder(DEFAULT_SETTINGS.purchaseUrl).setValue(this.plugin.settings.purchaseUrl).onChange((value) => {
        this.plugin.settings.purchaseUrl = value.trim() || DEFAULT_SETTINGS.purchaseUrl;
        void this.plugin.saveSettings();
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Your business").setHeading();
    const biz = this.plugin.settings.business;
    this.textRow(containerEl, "Business name", biz.name, (v) => biz.name = v);
    this.textRow(containerEl, "Business email", biz.email, (v) => biz.email = v);
    new import_obsidian2.Setting(containerEl).setName("Business address").addTextArea(
      (t) => t.setValue(biz.address).onChange((v) => {
        biz.address = v;
        void this.plugin.saveSettings();
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Default hourly rate").addText(
      (t) => t.setValue(String(biz.defaultRate)).onChange((v) => {
        const n = Number(v);
        if (v.trim() !== "" && (!Number.isFinite(n) || n < 0)) {
          new import_obsidian2.Notice("Default rate must be a number of 0 or more.");
          return;
        }
        biz.defaultRate = v.trim() === "" ? 0 : n;
        void this.plugin.saveSettings();
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Default currency").setDesc("ISO code, e.g. USD, EUR, GBP.").addText(
      (t) => t.setValue(biz.currency).onChange((v) => {
        biz.currency = v.trim().toUpperCase() || "USD";
        void this.plugin.saveSettings();
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Invoice footer / payment terms").addTextArea(
      (t) => t.setValue(biz.notes).onChange((v) => {
        biz.notes = v;
        void this.plugin.saveSettings();
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Invoices").setHeading();
    new import_obsidian2.Setting(containerEl).setName("Invoice folder").setDesc("Folder where generated invoice notes are saved.").addText(
      (t) => t.setValue(this.plugin.settings.invoiceFolder).onChange((v) => {
        this.plugin.settings.invoiceFolder = v.trim() || "Invoices";
        void this.plugin.saveSettings();
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Number template").setDesc("Tokens: {YYYY} {YY} {MM} {DD} {seq} {seq:4}").addText(
      (t) => t.setValue(this.plugin.settings.numberTemplate).onChange((v) => {
        this.plugin.settings.numberTemplate = v.trim() || DEFAULT_SETTINGS.numberTemplate;
        void this.plugin.saveSettings();
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Next invoice number").setDesc("The sequence used for the next generated invoice.").addText(
      (t) => t.setValue(String(this.plugin.settings.nextSeq)).onChange((v) => {
        const n = parseInt(v, 10);
        if (!Number.isNaN(n) && n > 0) {
          this.plugin.settings.nextSeq = n;
          void this.plugin.saveSettings();
        }
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Payment terms (days)").setDesc("Due date = issue date + this many days.").addText(
      (t) => t.setValue(String(this.plugin.settings.dueInDays)).onChange((v) => {
        const n = parseInt(v, 10);
        if (!Number.isNaN(n) && n >= 0) {
          this.plugin.settings.dueInDays = n;
          void this.plugin.saveSettings();
        }
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Open invoice after creating").addToggle(
      (t) => t.setValue(this.plugin.settings.openAfterCreate).onChange((v) => {
        this.plugin.settings.openAfterCreate = v;
        void this.plugin.saveSettings();
      })
    );
    new import_obsidian2.Setting(containerEl).setName("Tax & branding (Pro)").setHeading();
    this.proText(containerEl, "Tax label", biz.taxLabel, "e.g. VAT, GST, Sales tax", (v) => biz.taxLabel = v);
    this.proText(containerEl, "Default tax rate %", String(biz.taxRate), "0 for none", (v) => {
      const n = Number(v);
      if (v.trim() !== "" && (!Number.isFinite(n) || n < 0 || n > 100)) {
        new import_obsidian2.Notice("Tax rate must be between 0 and 100.");
        return;
      }
      biz.taxRate = v.trim() === "" ? 0 : n;
    });
    this.proText(containerEl, "Logo URL or path", biz.logoUrl, "Shown on PDF/print invoices", (v) => biz.logoUrl = v);
    new import_obsidian2.Setting(containerEl).setName("Billing reminders (Pro)").setHeading();
    const reminderSetting = new import_obsidian2.Setting(containerEl).setName("Enable due-date reminders").setDesc("Notifies you of unpaid invoices that are due soon or overdue.");
    if (this.plugin.settings.isPro) {
      reminderSetting.addToggle(
        (t) => t.setValue(this.plugin.settings.reminderEnabled).onChange((v) => {
          this.plugin.settings.reminderEnabled = v;
          void this.plugin.saveSettings().then(() => this.plugin.reminders.start());
        })
      );
      new import_obsidian2.Setting(containerEl).setName("Remind this many days before due").addText(
        (t) => t.setValue(String(this.plugin.settings.reminderDaysBefore)).onChange((v) => {
          const n = parseInt(v, 10);
          if (!Number.isNaN(n) && n >= 0) {
            this.plugin.settings.reminderDaysBefore = n;
            void this.plugin.saveSettings();
          }
        })
      );
    } else {
      reminderSetting.settingEl.addClass("if-locked");
      reminderSetting.descEl.appendText(
        this.plugin.settings.reminderEnabled ? " (Pro \u2014 saved as on, resumes when you upgrade)" : " (Pro)"
      );
    }
    new import_obsidian2.Setting(containerEl).setName("Clients").setHeading();
    new import_obsidian2.Setting(containerEl).setName("Add client").setDesc("Configured clients get default rate, currency, address, and #client/<slug> resolution.").addButton(
      (b) => b.setButtonText("Add client").setCta().onClick(() => new ClientEditModal(this.app, this.plugin, null, () => this.display()).open())
    );
    const list = containerEl.createDiv();
    if (this.plugin.settings.clients.length === 0) {
      list.createEl("p", { text: "No clients yet.", cls: "if-muted" });
    }
    for (const client of this.plugin.settings.clients) {
      const row = new import_obsidian2.Setting(list).setName(client.name).setDesc(`#client/${client.id}${client.defaultRate ? ` \xB7 ${client.defaultRate}/h` : ""}${client.currency ? ` \xB7 ${client.currency}` : ""}`);
      row.addButton(
        (b) => b.setButtonText("Edit").onClick(() => new ClientEditModal(this.app, this.plugin, client, () => this.display()).open())
      );
      row.addButton(
        (b) => b.setButtonText("Remove").setWarning().onClick(() => {
          this.plugin.settings.clients = this.plugin.settings.clients.filter((c) => c.id !== client.id);
          void this.plugin.saveSettings().then(() => this.display());
        })
      );
    }
  }
  textRow(containerEl, name, value, set) {
    new import_obsidian2.Setting(containerEl).setName(name).addText(
      (t) => t.setValue(value).onChange((v) => {
        set(v);
        void this.plugin.saveSettings();
      })
    );
  }
  proText(containerEl, name, value, desc, set) {
    const setting = new import_obsidian2.Setting(containerEl).setName(name).setDesc(desc);
    if (!this.plugin.settings.isPro) {
      setting.settingEl.addClass("if-locked");
      setting.descEl.appendText(" (Pro)");
      return;
    }
    setting.addText(
      (t) => t.setValue(value).onChange((v) => {
        set(v);
        void this.plugin.saveSettings();
      })
    );
  }
};

// src/ui/InvoiceModal.ts
var import_obsidian3 = require("obsidian");

// src/invoice/money.ts
function formatMoney(amount, currency) {
  const code = (currency || "USD").toUpperCase();
  try {
    return new Intl.NumberFormat(void 0, {
      style: "currency",
      currency: code
    }).format(amount);
  } catch (e) {
    return `${code} ${amount.toFixed(2)}`;
  }
}
function round2(n) {
  if (!Number.isFinite(n)) return 0;
  const sign = n < 0 ? -1 : 1;
  return sign * Math.round((Math.abs(n) + Number.EPSILON) * 100) / 100;
}

// src/invoice/InvoiceBuilder.ts
function filterEntries(entries, client, clientName, periodStart, periodEnd) {
  const targetName = clientName.toLowerCase();
  return entries.filter((e) => {
    if (client) {
      if (e.clientId === client.id) return true;
      return e.clientName.toLowerCase() === client.name.toLowerCase();
    }
    return e.clientName.toLowerCase() === targetName;
  }).filter((e) => e.date >= periodStart && e.date <= periodEnd).sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0);
}
function finite(n, fallback) {
  return Number.isFinite(n) ? n : fallback;
}
function summarizeEntries(entries, baseRate, taxRate) {
  const safeBase = finite(baseRate, 0);
  const safeTaxRate = finite(taxRate, 0);
  const lines = entries.map((e) => {
    var _a;
    const rate = finite((_a = e.rate) != null ? _a : safeBase, safeBase);
    const amount = round2(e.hours * rate);
    return { date: e.date, description: e.description || "Work", hours: e.hours, rate, amount };
  });
  const subtotal = round2(lines.reduce((sum, l) => sum + l.amount, 0));
  const taxAmount = round2(subtotal * safeTaxRate / 100);
  const total = round2(subtotal + taxAmount);
  return { lines, subtotal, taxAmount, total };
}
function resolveRates(client, business, isPro) {
  var _a, _b;
  return {
    baseRate: (_a = client && client.defaultRate) != null ? _a : business.defaultRate,
    taxRate: isPro ? (_b = client && client.taxRate) != null ? _b : business.taxRate : 0,
    currency: isPro ? client && client.currency || business.currency : business.currency
  };
}
function buildInvoice(entries, client, business, opts) {
  var _a, _b;
  const { baseRate, taxRate, currency } = resolveRates(client, business, opts.isPro);
  const { lines, subtotal, taxAmount, total } = summarizeEntries(entries, baseRate, taxRate);
  return {
    number: opts.number,
    clientId: client ? client.id : null,
    clientName: client ? client.name : (_b = (_a = entries[0]) == null ? void 0 : _a.clientName) != null ? _b : "Unassigned",
    clientEmail: client ? client.email : "",
    clientAddress: client ? client.address : "",
    currency,
    issueDate: opts.issueDate,
    dueDate: addDays(opts.issueDate, opts.dueInDays),
    periodStart: opts.periodStart,
    periodEnd: opts.periodEnd,
    lines,
    subtotal,
    taxRate,
    taxLabel: business.taxLabel || "Tax",
    taxAmount,
    total,
    notes: business.notes,
    status: "unpaid"
  };
}
function isValidISODate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  if (m < 1 || m > 12 || d < 1 || d > 31) return false;
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
}
function addDays(iso, days) {
  const d = /* @__PURE__ */ new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  return toISODate(d);
}
function toISODate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// src/ui/InvoiceModal.ts
var InvoiceModal = class extends import_obsidian3.Modal {
  constructor(app, plugin) {
    super(app);
    this.entries = [];
    this.clientKey = "";
    this.lastInvoice = null;
    this.lastFile = null;
    this.plugin = plugin;
    const end = /* @__PURE__ */ new Date();
    const start = /* @__PURE__ */ new Date();
    start.setDate(start.getDate() - (plugin.settings.defaultPeriodDays || 30));
    this.periodStart = toISODate(start);
    this.periodEnd = toISODate(end);
  }
  onOpen() {
    this.titleEl.setText("Create invoice");
    this.contentEl.createEl("p", { text: "Scanning vault for #billable entries\u2026", cls: "if-muted" });
    void this.loadEntries();
  }
  async loadEntries() {
    this.entries = await this.plugin.scanner.scan(this.plugin.settings.clients);
    this.render();
  }
  clientOptions() {
    const opts = [];
    for (const c of this.plugin.settings.clients) opts.push({ key: c.id, label: c.name });
    const known = new Set(this.plugin.settings.clients.map((c) => c.name.toLowerCase()));
    const seen = /* @__PURE__ */ new Set();
    for (const e of this.entries) {
      if (e.clientId) continue;
      const lower = e.clientName.toLowerCase();
      if (known.has(lower) || seen.has(lower)) continue;
      seen.add(lower);
      opts.push({ key: `name:${e.clientName}`, label: `${e.clientName} (unconfigured)` });
    }
    return opts;
  }
  resolveClient() {
    var _a;
    if (this.clientKey.startsWith("name:")) {
      return { client: null, clientName: this.clientKey.slice(5) };
    }
    const client = this.plugin.getClient(this.clientKey);
    return { client, clientName: (_a = client == null ? void 0 : client.name) != null ? _a : "" };
  }
  render() {
    const { contentEl } = this;
    contentEl.empty();
    const unparsed = this.plugin.scanner.lastUnparsed;
    if (unparsed.length > 0) {
      contentEl.createDiv({ cls: "if-warn" }).createEl("p", {
        text: `\u26A0 ${unparsed.length} #billable line(s) couldn't be read (missing or invalid time) and were skipped. Fix the time on those lines so the work is billed.`
      });
    }
    const options = this.clientOptions();
    if (options.length === 0) {
      contentEl.createEl("p", {
        text: "No billable work found yet. Tag a line in any note with #billable and a time, then come back \u2014 for example:",
        cls: "if-muted"
      });
      contentEl.createEl("code", { text: "- #billable #client/acme 09:00-11:30 Built the thing" });
      contentEl.createEl("p", {
        text: "Tip: you don't need to set up a client first \u2014 a #client/<name> is billed at your default rate.",
        cls: "if-muted"
      });
      new import_obsidian3.Setting(contentEl).addButton(
        (b) => b.setButtonText("Insert an example line").setCta().onClick(() => {
          void this.plugin.insertExampleNote();
          this.close();
        })
      );
      return;
    }
    if (!this.clientKey) this.clientKey = options[0].key;
    if (!this.plugin.settings.business.name.trim()) {
      contentEl.createDiv({ cls: "if-muted" }).createEl("p", { text: "Tip: set your business name in Settings \u2192 Invoice Forge so it appears on the invoice." });
    }
    new import_obsidian3.Setting(contentEl).setName("Client").setDesc("Configured clients use their default rate, currency, and address.").addDropdown((dd) => {
      for (const o of options) dd.addOption(o.key, o.label);
      dd.setValue(this.clientKey).onChange((v) => {
        this.clientKey = v;
        this.renderPreview();
      });
    });
    new import_obsidian3.Setting(contentEl).setName("Period start").addText(
      (t) => t.setPlaceholder("YYYY-MM-DD").setValue(this.periodStart).onChange((v) => {
        this.periodStart = v.trim();
        this.renderPreview();
      })
    );
    new import_obsidian3.Setting(contentEl).setName("Period end").addText(
      (t) => t.setPlaceholder("YYYY-MM-DD").setValue(this.periodEnd).onChange((v) => {
        this.periodEnd = v.trim();
        this.renderPreview();
      })
    );
    this.previewEl = contentEl.createDiv({ cls: "if-preview" });
    this.renderPreview();
    const actions = new import_obsidian3.Setting(contentEl);
    actions.addButton((b) => {
      this.createBtn = b;
      b.setButtonText("Create invoice").setCta().onClick(() => void this.create());
      return b;
    });
    if (this.plugin.settings.isPro && !import_obsidian3.Platform.isMobile) {
      actions.addButton(
        (b) => b.setButtonText("Export PDF / print").onClick(() => {
          if (!this.lastInvoice) {
            new import_obsidian3.Notice("Create the invoice first, then export.");
            return;
          }
          this.plugin.exportInvoiceHtml(this.lastInvoice);
        })
      );
    } else if (this.plugin.settings.isPro) {
      actions.descEl.setText("PDF / print export is available on desktop.");
    } else {
      actions.descEl.setText(`PDF / print export, tax, and reminders are Pro features (${PRO_PRICE}). `);
      const link = actions.descEl.createEl("a", {
        text: "Unlock Invoice Forge Pro",
        href: this.plugin.settings.purchaseUrl
      });
      link.setAttr("target", "_blank");
      link.setAttr("rel", "noopener");
    }
  }
  renderPreview() {
    if (!this.previewEl) return;
    this.previewEl.empty();
    if (!isValidISODate(this.periodStart) || !isValidISODate(this.periodEnd)) {
      this.previewEl.createEl("p", { text: "Enter both dates as a valid date (YYYY-MM-DD).", cls: "if-muted" });
      return;
    }
    if (this.periodStart > this.periodEnd) {
      this.previewEl.createEl("p", { text: "Start date must be on or before the end date.", cls: "if-muted" });
      return;
    }
    const { client, clientName } = this.resolveClient();
    const matched = filterEntries(this.entries, client, clientName, this.periodStart, this.periodEnd);
    if (matched.length === 0) {
      const allForClient = filterEntries(this.entries, client, clientName, "0000-01-01", "9999-12-31");
      if (allForClient.length > 0) {
        const dates = allForClient.map((e) => e.date).sort();
        this.previewEl.createEl("p", {
          text: `No entries in this period. This client has ${allForClient.length} entr${allForClient.length === 1 ? "y" : "ies"} dated ${dates[0]} to ${dates[dates.length - 1]} \u2014 widen the period.`,
          cls: "if-muted"
        });
      } else {
        this.previewEl.createEl("p", { text: "No entries match this client and date range.", cls: "if-muted" });
      }
      return;
    }
    const totalHours = matched.reduce((s, e) => s + e.hours, 0);
    const { baseRate, taxRate, currency } = resolveRates(client, this.plugin.settings.business, this.plugin.settings.isPro);
    const totals = summarizeEntries(matched, baseRate, taxRate);
    let text = `${matched.length} entries \xB7 ${round2(totalHours)}h \xB7 subtotal ${formatMoney(totals.subtotal, currency)}`;
    if (totals.taxAmount > 0) {
      text += ` \xB7 +${formatMoney(totals.taxAmount, currency)} tax \xB7 total ${formatMoney(totals.total, currency)}`;
    }
    this.previewEl.createEl("p", { text });
  }
  async create() {
    var _a, _b;
    if (!isValidISODate(this.periodStart) || !isValidISODate(this.periodEnd)) {
      new import_obsidian3.Notice("Enter both dates as a valid date (YYYY-MM-DD).");
      return;
    }
    if (this.periodStart > this.periodEnd) {
      new import_obsidian3.Notice("Start date must be on or before the end date.");
      return;
    }
    (_a = this.createBtn) == null ? void 0 : _a.setDisabled(true);
    const { client, clientName } = this.resolveClient();
    try {
      const { file, invoice } = await this.plugin.createInvoice(client, clientName, this.periodStart, this.periodEnd);
      this.lastInvoice = invoice;
      this.lastFile = file;
      new import_obsidian3.Notice(`Created ${invoice.number} \u2014 ${formatMoney(invoice.total, invoice.currency)}`);
      if (this.plugin.settings.openAfterCreate) {
        await this.app.workspace.getLeaf(true).openFile(file);
      }
      if (!this.plugin.settings.isPro) this.close();
    } catch (err) {
      new import_obsidian3.Notice(err instanceof Error ? err.message : "Could not create invoice.");
    } finally {
      (_b = this.createBtn) == null ? void 0 : _b.setDisabled(false);
    }
  }
};

// src/license/LicenseManager.ts
var import_tweetnacl = __toESM(require_nacl_fast(), 1);

// src/license/publicKey.ts
var LICENSE_PUBLIC_KEY = "qvEc7BGWh4S4TO7yFq/21LaEaP3zhIl1JIwVRxrKVtQ=";

// src/license/LicenseManager.ts
var _LicenseManager = class _LicenseManager {
  static verify(licenseKey) {
    const trimmed = licenseKey.trim();
    if (!trimmed) {
      return { valid: false, error: "No license key provided." };
    }
    const parts = trimmed.split(".");
    if (parts.length !== 2) {
      return { valid: false, error: "Invalid license format." };
    }
    try {
      const payloadBytes = base64ToBytes(parts[0]);
      const signature = base64ToBytes(parts[1]);
      const publicKey = base64ToBytes(LICENSE_PUBLIC_KEY);
      if (!import_tweetnacl.default.sign.detached.verify(payloadBytes, signature, publicKey)) {
        return { valid: false, error: "Invalid license signature." };
      }
      const payload = JSON.parse(new TextDecoder().decode(payloadBytes));
      if (payload.product !== _LicenseManager.PRODUCT) {
        return { valid: false, error: "License is for a different product." };
      }
      return { valid: true, email: payload.email };
    } catch (e) {
      return { valid: false, error: "Could not parse license key." };
    }
  }
};
_LicenseManager.PRODUCT = "invoice-forge";
var LicenseManager = _LicenseManager;
function base64ToBytes(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// src/time/VaultScanner.ts
var import_obsidian4 = require("obsidian");

// src/time/duration.ts
var HM_RE = /^(?:(\d+(?:\.\d+)?)\s*h)?\s*(?:(\d+)\s*m)?$/i;
var RANGE_RE = /^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/;
function parseTimeRange(token) {
  const m = RANGE_RE.exec(token.trim());
  if (!m) return null;
  const [, h1, m1, h2, m2] = m;
  if (Number(h1) > 23 || Number(h2) > 23 || Number(m1) > 59 || Number(m2) > 59) return null;
  let start = Number(h1) * 60 + Number(m1);
  let end = Number(h2) * 60 + Number(m2);
  if (end < start) end += 24 * 60;
  const minutes = end - start;
  if (minutes <= 0) return null;
  return round2(minutes / 60);
}
function parseDuration(token) {
  const trimmed = token.trim();
  if (!trimmed) return null;
  const range = parseTimeRange(trimmed);
  if (range !== null) return range;
  if (/^\d+(?:\.\d+)?$/.test(trimmed)) {
    const n = Number(trimmed);
    return n > 0 ? round2(n) : null;
  }
  const m = HM_RE.exec(trimmed);
  if (!m || m[1] === void 0 && m[2] === void 0) return null;
  const hours = m[1] !== void 0 ? Number(m[1]) : 0;
  const mins = m[2] !== void 0 ? Number(m[2]) : 0;
  if (m[1] !== void 0 && mins >= 60) return null;
  const total = hours + mins / 60;
  return total > 0 ? round2(total) : null;
}

// src/time/entryParser.ts
var INVOICE_FIELD = "invoice";
var BILLABLE_RE = /(^|\s)#billable\b/i;
var CLIENT_TAG_RE = /(^|\s)#client\/([A-Za-z0-9_-]+)/;
var INLINE_FIELD_RE = /\[([a-z]+)::\s*([^\]]+)\]/gi;
var TIME_RANGE_RE = /\b\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}\b/;
var DURATION_RE = /\b\d+(?:\.\d+)?h(?:\s*\d+m)?\b|\b\d+m\b/i;
var DATE_RE = /\b(\d{4}-\d{2}-\d{2})\b/;
function parseBillableLine(rawLine, ctx) {
  var _a, _b, _c;
  const line = rawLine.replace(/^[\s>*+-]*(?:\[[ xX/-]\]\s*)?/, "");
  if (!BILLABLE_RE.test(rawLine)) return null;
  let working = line;
  const fields = {};
  working = working.replace(INLINE_FIELD_RE, (_, key, value) => {
    fields[key.toLowerCase()] = value.trim();
    return " ";
  });
  if (fields[INVOICE_FIELD]) return null;
  let clientId = null;
  let clientName = "";
  const clientTag = CLIENT_TAG_RE.exec(working);
  if (clientTag) {
    clientId = clientTag[2].toLowerCase();
    clientName = (_a = ctx.clientNames[clientId]) != null ? _a : clientTag[2];
    working = working.replace(clientTag[0], " ");
  } else if (fields.client) {
    clientName = fields.client;
  }
  let date = ctx.defaultDate;
  const fieldDate = fields.date ? DATE_RE.exec(fields.date) : null;
  if (fieldDate && isValidISODate(fieldDate[1])) {
    date = fieldDate[1];
  } else {
    const inline = DATE_RE.exec(working);
    if (inline && isValidISODate(inline[1]) && !isProseDate(working, inline)) {
      date = inline[1];
      working = working.replace(inline[0], " ");
    }
  }
  let rate = null;
  if (fields.rate !== void 0) {
    const r = Number(fields.rate.replace(/[^0-9.]/g, ""));
    if (!Number.isNaN(r) && r > 0) rate = r;
  }
  let hours = null;
  const durField = (_c = (_b = fields.time) != null ? _b : fields.hours) != null ? _c : fields.duration;
  if (durField) {
    hours = parseDuration(durField);
  }
  if (hours === null) {
    const range = TIME_RANGE_RE.exec(working);
    if (range) {
      hours = parseDuration(range[0]);
      working = working.replace(range[0], " ");
    }
  }
  if (hours === null) {
    const dur = DURATION_RE.exec(working);
    if (dur) {
      hours = parseDuration(dur[0]);
      working = working.replace(dur[0], " ");
    }
  }
  if (hours === null || hours <= 0) return null;
  const description = working.replace(/(^|\s)#billable\b/gi, " ").replace(/(^|\s)#[A-Za-z0-9_/-]+/g, " ").replace(/\s+/g, " ").trim();
  if (!clientName) clientName = "Unassigned";
  return { clientId, clientName, date, hours, rate, description };
}
function isProseDate(working, match) {
  var _a, _b;
  const before = working.slice(0, match.index).trimEnd();
  const after = working.slice(match.index + match[0].length).trimStart();
  const prevToken = (_a = before.split(/\s+/).pop()) != null ? _a : "";
  const nextToken = (_b = after.split(/\s+/)[0]) != null ? _b : "";
  const isPlainWord = (token) => /^[A-Za-z]{2,}$/.test(token);
  return isPlainWord(prevToken) && isPlainWord(nextToken);
}
function markLineBilled(rawLine, invoiceNumber) {
  if (!BILLABLE_RE.test(rawLine) || new RegExp(`\\[${INVOICE_FIELD}::`, "i").test(rawLine)) return rawLine;
  return `${rawLine.trimEnd()} [${INVOICE_FIELD}:: ${invoiceNumber}]`;
}
function unmarkLineBilled(rawLine, invoiceNumber) {
  const re = new RegExp(`\\s*\\[${INVOICE_FIELD}::\\s*${escapeRegExp(invoiceNumber)}\\s*\\]`, "gi");
  return rawLine.replace(re, "");
}
function lineMatchesEntry(rawLine, entryRaw) {
  return rawLine.trimEnd() === entryRaw.trimEnd();
}
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// src/time/VaultScanner.ts
var DAILY_NOTE_DATE_RE = /(\d{4}-\d{2}-\d{2})/;
var VaultScanner = class {
  constructor(app) {
    this.app = app;
    // Populated by the most recent scan(): #billable lines that looked billable
    // but didn't parse. Callers can warn the user instead of losing the work.
    this.lastUnparsed = [];
  }
  async scan(clients) {
    const clientNames = {};
    for (const c of clients) clientNames[c.id] = c.name;
    const entries = [];
    const unparsed = [];
    const files = this.app.vault.getMarkdownFiles();
    for (const file of files) {
      const content = await this.app.vault.cachedRead(file);
      if (!/#billable/i.test(content)) continue;
      const cache = this.app.metadataCache.getFileCache(file);
      const defaultDate = this.resolveNoteDate(file, cache);
      const ctx = { defaultDate, clientNames };
      const fileLines = content.split(/\r?\n/);
      let inFrontmatter = false;
      let inFence = false;
      for (let i = 0; i < fileLines.length; i++) {
        const line = fileLines[i];
        if (i === 0 && line.trim() === "---") {
          inFrontmatter = true;
          continue;
        }
        if (inFrontmatter) {
          if (line.trim() === "---") inFrontmatter = false;
          continue;
        }
        if (/^\s*(```|~~~)/.test(line)) {
          inFence = !inFence;
          continue;
        }
        if (inFence) continue;
        const parsed = parseBillableLine(line, ctx);
        if (!parsed) {
          if (/(^|\s)#billable\b/i.test(line) && !/\[invoice::/i.test(line)) {
            unparsed.push({ path: file.path, line: i, text: line.trim() });
          }
          continue;
        }
        entries.push({
          clientId: parsed.clientId,
          clientName: parsed.clientName,
          date: parsed.date,
          hours: parsed.hours,
          rate: parsed.rate,
          description: parsed.description,
          sourcePath: file.path,
          line: i,
          raw: line
        });
      }
    }
    this.lastUnparsed = unparsed;
    return entries;
  }
  groupByPath(entries) {
    var _a;
    const byPath = /* @__PURE__ */ new Map();
    for (const entry of entries) {
      const group = (_a = byPath.get(entry.sourcePath)) != null ? _a : [];
      group.push(entry);
      byPath.set(entry.sourcePath, group);
    }
    return byPath;
  }
  // Mark every source line billed, transactionally. Phase 1 validates that
  // every line still exists AND still matches its entry (so drift can't mark
  // the wrong line); nothing is written unless the whole set validates. Phase 2
  // applies the marks per file (each file atomic via vault.process) and rolls
  // back any files already written if a later file fails — so we never end up
  // with some entries billed and others not.
  async markBilled(entries, invoiceNumber) {
    const byPath = this.groupByPath(entries);
    for (const [path, fileEntries] of byPath) {
      const file = this.app.vault.getAbstractFileByPath(path);
      if (!(file instanceof import_obsidian4.TFile)) {
        throw new Error(`Source note no longer exists: ${path}. Nothing was billed \u2014 rescan and try again.`);
      }
      const lines = (await this.app.vault.cachedRead(file)).split(/\r?\n/);
      for (const entry of fileEntries) {
        if (entry.line >= lines.length || !lineMatchesEntry(lines[entry.line], entry.raw)) {
          throw new Error(`A billable line changed in ${path}. Nothing was billed \u2014 rescan and create the invoice again.`);
        }
      }
    }
    const written = [];
    try {
      for (const [path, fileEntries] of byPath) {
        const file = this.app.vault.getAbstractFileByPath(path);
        if (!(file instanceof import_obsidian4.TFile)) throw new Error(`Source note no longer exists: ${path}`);
        await this.app.vault.process(file, (content) => {
          const lines = content.split(/\r?\n/);
          for (const entry of fileEntries) {
            if (entry.line >= lines.length || !lineMatchesEntry(lines[entry.line], entry.raw)) {
              throw new Error(`A billable line changed in ${path} during billing.`);
            }
            lines[entry.line] = markLineBilled(lines[entry.line], invoiceNumber);
          }
          return lines.join("\n");
        });
        written.push(path);
      }
    } catch (error) {
      const failedRollback = await this.unmarkPaths(written, invoiceNumber);
      if (failedRollback.length) {
        throw new Error(
          `${error instanceof Error ? error.message : String(error)} (could not fully undo markers in: ${failedRollback.join(", ")} \u2014 check these notes).`
        );
      }
      throw error;
    }
  }
  // Remove an invoice's markers from the given source notes (rollback / undo).
  // Returns the paths that could NOT be cleaned so the caller can surface them.
  async unmarkBilled(entries, invoiceNumber) {
    return this.unmarkPaths([...this.groupByPath(entries).keys()], invoiceNumber);
  }
  async unmarkPaths(paths, invoiceNumber) {
    const failed = [];
    for (const path of paths) {
      const file = this.app.vault.getAbstractFileByPath(path);
      if (!(file instanceof import_obsidian4.TFile)) continue;
      try {
        await this.app.vault.process(
          file,
          (content) => content.split(/\r?\n/).map((line) => unmarkLineBilled(line, invoiceNumber)).join("\n")
        );
      } catch (e) {
        failed.push(path);
      }
    }
    return failed;
  }
  // Date priority: frontmatter `date` → daily-note date in filename → file mtime.
  resolveNoteDate(file, cache) {
    const fm = cache == null ? void 0 : cache.frontmatter;
    const fmDate = fm == null ? void 0 : fm.date;
    if (typeof fmDate === "string" && DAILY_NOTE_DATE_RE.test(fmDate)) {
      return DAILY_NOTE_DATE_RE.exec(fmDate)[1];
    }
    const fromName = DAILY_NOTE_DATE_RE.exec(file.basename);
    if (fromName) return fromName[1];
    return toISODate(new Date(file.stat.mtime));
  }
};

// src/invoice/InvoiceRenderer.ts
function renderInvoiceMarkdown(inv, business) {
  const lines = [];
  lines.push("---");
  lines.push(`invoice: "${inv.number}"`);
  lines.push(`client: "${escapeYaml(inv.clientName)}"`);
  lines.push(`issued: "${inv.issueDate}"`);
  lines.push(`due: "${inv.dueDate}"`);
  lines.push(`total: ${inv.total}`);
  lines.push(`currency: ${inv.currency}`);
  lines.push(`status: ${inv.status}`);
  lines.push("tags: [invoice]");
  lines.push("---");
  lines.push("");
  lines.push(`# Invoice ${inv.number}`);
  lines.push("");
  lines.push(`**From:** ${business.name || "Your business"}`);
  if (business.address) lines.push(business.address.split("\n").join(" \xB7 "));
  if (business.email) lines.push(business.email);
  lines.push("");
  lines.push(`**Bill to:** ${inv.clientName}`);
  if (inv.clientAddress) lines.push(inv.clientAddress.split("\n").join(" \xB7 "));
  if (inv.clientEmail) lines.push(inv.clientEmail);
  lines.push("");
  lines.push(`**Issue date:** ${inv.issueDate}  |  **Due date:** ${inv.dueDate}`);
  lines.push(`**Period:** ${inv.periodStart} \u2192 ${inv.periodEnd}`);
  lines.push("");
  lines.push("| Date | Description | Hours | Rate | Amount |");
  lines.push("| --- | --- | ---: | ---: | ---: |");
  for (const l of inv.lines) {
    lines.push(
      `| ${l.date} | ${escapePipe(l.description)} | ${l.hours} | ${formatMoney(l.rate, inv.currency)} | ${formatMoney(l.amount, inv.currency)} |`
    );
  }
  lines.push("");
  lines.push(`**Subtotal:** ${formatMoney(inv.subtotal, inv.currency)}`);
  if (inv.taxRate > 0) {
    lines.push(`**${inv.taxLabel} (${inv.taxRate}%):** ${formatMoney(inv.taxAmount, inv.currency)}`);
  }
  lines.push(`**Total due:** ${formatMoney(inv.total, inv.currency)}`);
  if (inv.notes) {
    lines.push("");
    lines.push("---");
    lines.push(inv.notes);
  }
  lines.push("");
  return lines.join("\n");
}
function renderInvoiceHtml(inv, business) {
  const rows = inv.lines.map(
    (l) => `<tr><td>${esc(l.date)}</td><td>${esc(l.description)}</td><td class="num">${l.hours}</td><td class="num">${esc(
      formatMoney(l.rate, inv.currency)
    )}</td><td class="num">${esc(formatMoney(l.amount, inv.currency))}</td></tr>`
  ).join("\n");
  const taxRow = inv.taxRate > 0 ? `<tr><td class="label">${esc(inv.taxLabel)} (${inv.taxRate}%)</td><td class="num">${esc(
    formatMoney(inv.taxAmount, inv.currency)
  )}</td></tr>` : "";
  const logo = business.logoUrl ? `<img class="logo" src="${esc(business.logoUrl)}" alt="logo" />` : "";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Invoice ${esc(inv.number)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color: #1a1a1a; margin: 0; padding: 48px; }
  .head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
  .logo { max-height: 64px; max-width: 220px; }
  h1 { font-size: 28px; margin: 0 0 4px; }
  .muted { color: #666; }
  .parties { display: flex; justify-content: space-between; gap: 32px; margin-bottom: 24px; }
  .parties h3 { margin: 0 0 4px; font-size: 12px; text-transform: uppercase; letter-spacing: .06em; color: #888; }
  .meta { text-align: right; }
  table.items { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
  table.items th { text-align: left; border-bottom: 2px solid #222; padding: 8px 6px; font-size: 12px; text-transform: uppercase; letter-spacing: .04em; }
  table.items td { padding: 8px 6px; border-bottom: 1px solid #eee; }
  .num { text-align: right; white-space: nowrap; }
  table.totals { margin-left: auto; border-collapse: collapse; min-width: 260px; }
  table.totals td { padding: 6px 8px; }
  table.totals td.label { color: #555; }
  table.totals tr.grand td { font-size: 18px; font-weight: 700; border-top: 2px solid #222; }
  .notes { margin-top: 40px; padding-top: 16px; border-top: 1px solid #eee; color: #555; white-space: pre-wrap; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
  <div class="head">
    <div>
      ${logo}
      <h1>Invoice</h1>
      <div class="muted">${esc(inv.number)}</div>
    </div>
    <div class="meta">
      <div><strong>${esc(business.name || "Your business")}</strong></div>
      <div class="muted">${nl2br(business.address)}</div>
      <div class="muted">${esc(business.email)}</div>
    </div>
  </div>

  <div class="parties">
    <div>
      <h3>Bill to</h3>
      <div><strong>${esc(inv.clientName)}</strong></div>
      <div class="muted">${nl2br(inv.clientAddress)}</div>
      <div class="muted">${esc(inv.clientEmail)}</div>
    </div>
    <div class="meta">
      <h3>Details</h3>
      <div>Issue date: ${esc(inv.issueDate)}</div>
      <div>Due date: ${esc(inv.dueDate)}</div>
      <div>Period: ${esc(inv.periodStart)} \u2192 ${esc(inv.periodEnd)}</div>
    </div>
  </div>

  <table class="items">
    <thead>
      <tr><th>Date</th><th>Description</th><th class="num">Hours</th><th class="num">Rate</th><th class="num">Amount</th></tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <table class="totals">
    <tr><td class="label">Subtotal</td><td class="num">${esc(formatMoney(inv.subtotal, inv.currency))}</td></tr>
    ${taxRow}
    <tr class="grand"><td>Total due</td><td class="num">${esc(formatMoney(inv.total, inv.currency))}</td></tr>
  </table>

  ${inv.notes ? `<div class="notes">${esc(inv.notes)}</div>` : ""}
</body>
</html>`;
}
function esc(s) {
  return (s != null ? s : "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function nl2br(s) {
  return esc(s != null ? s : "").replace(/\n/g, "<br/>");
}
function escapePipe(s) {
  return (s != null ? s : "").replace(/\|/g, "\\|");
}
function escapeYaml(s) {
  return (s != null ? s : "").replace(/"/g, '\\"');
}

// src/invoice/numbering.ts
function formatInvoiceNumber(template, seq, date) {
  const yyyy = String(date.getFullYear());
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return template.replace(/\{YYYY\}/g, yyyy).replace(/\{YY\}/g, yyyy.slice(-2)).replace(/\{MM\}/g, mm).replace(/\{DD\}/g, dd).replace(/\{seq:(\d+)\}/g, (_, n) => String(seq).padStart(Number(n), "0")).replace(/\{seq\}/g, String(seq));
}

// src/reminders/ReminderManager.ts
var import_obsidian5 = require("obsidian");
var ReminderManager = class {
  constructor(plugin) {
    this.plugin = plugin;
    this.intervalId = null;
  }
  start() {
    this.stop();
    if (!this.plugin.settings.isPro || !this.plugin.settings.reminderEnabled) return;
    void this.check();
    this.intervalId = window.setInterval(() => void this.check(), 12 * 60 * 60 * 1e3);
    this.plugin.registerInterval(this.intervalId);
  }
  stop() {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  async check() {
    var _a;
    if (!this.plugin.settings.isPro || !this.plugin.settings.reminderEnabled) return;
    const today = toISODate(/* @__PURE__ */ new Date());
    const soon = toISODate(addDays2(/* @__PURE__ */ new Date(), this.plugin.settings.reminderDaysBefore));
    const folder = this.plugin.settings.invoiceFolder;
    const files = this.plugin.app.vault.getMarkdownFiles().filter((f) => !folder || f.path.startsWith(folder + "/"));
    const due = [];
    const overdue = [];
    for (const file of files) {
      const fm = (_a = this.plugin.app.metadataCache.getFileCache(file)) == null ? void 0 : _a.frontmatter;
      if (!fm || fm.invoice === void 0) continue;
      const status = typeof fm.status === "string" ? fm.status : "unpaid";
      if (status === "paid") continue;
      const dueDate = typeof fm.due === "string" ? fm.due : "";
      if (!dueDate) continue;
      const invoiceLabel = fmString(fm.invoice);
      const clientLabel = fmString(fm.client) || "?";
      const label = `${invoiceLabel} (${clientLabel}) due ${dueDate}`;
      if (dueDate < today) overdue.push(label);
      else if (dueDate <= soon) due.push(label);
    }
    if (overdue.length > 0) {
      new import_obsidian5.Notice(`\u26A0 ${overdue.length} overdue invoice(s):
${overdue.join("\n")}`, 1e4);
    }
    if (due.length > 0) {
      new import_obsidian5.Notice(`Invoices due soon:
${due.join("\n")}`, 8e3);
    }
  }
};
function fmString(value) {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
}
function addDays2(d, days) {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + days);
  return copy;
}

// src/main.ts
var InvoiceForgePlugin = class extends import_obsidian6.Plugin {
  constructor() {
    super(...arguments);
    this.settings = DEFAULT_SETTINGS;
    this.creating = false;
  }
  async onload() {
    await this.loadSettings();
    await this.refreshLicense();
    this.scanner = new VaultScanner(this.app);
    this.reminders = new ReminderManager(this);
    this.addRibbonIcon("receipt", "Invoice Forge", () => this.openInvoiceModal());
    this.addCommand({
      id: "create-invoice",
      name: "Create invoice",
      callback: () => this.openInvoiceModal()
    });
    this.addCommand({
      id: "insert-billable-entry",
      name: "Insert billable entry",
      editorCallback: (editor) => this.insertBillableEntry(editor)
    });
    this.addCommand({
      id: "preview-billable-hours",
      name: "Preview unbilled hours by client",
      callback: () => void this.previewHours()
    });
    this.addSettingTab(new InvoiceForgeSettingTab(this.app, this));
    this.app.workspace.onLayoutReady(() => {
      void this.recoverPendingInvoice();
      this.reminders.start();
    });
  }
  onunload() {
    var _a;
    (_a = this.reminders) == null ? void 0 : _a.stop();
  }
  openInvoiceModal() {
    new InvoiceModal(this.app, this).open();
  }
  insertBillableEntry(editor) {
    editor.replaceSelection(this.exampleBillableLine());
  }
  exampleBillableLine() {
    var _a, _b;
    const slug = (_b = (_a = this.settings.clients[0]) == null ? void 0 : _a.id) != null ? _b : "acme";
    const today = toISODate(/* @__PURE__ */ new Date());
    return `- #billable #client/${slug} 1h [date:: ${today}] Describe the work
`;
  }
  // Onboarding on-ramp: drop a working example #billable line where the user can
  // see it — into the active note if one is open, otherwise a fresh log note.
  async insertExampleNote() {
    var _a;
    const line = this.exampleBillableLine();
    const editor = (_a = this.app.workspace.activeEditor) == null ? void 0 : _a.editor;
    if (editor) {
      editor.replaceSelection(line);
      new import_obsidian6.Notice("Inserted an example #billable line \u2014 edit it, then run Create invoice.");
      return;
    }
    const path = (0, import_obsidian6.normalizePath)("Billable log.md");
    const existing = this.app.vault.getAbstractFileByPath(path);
    let file;
    if (existing instanceof import_obsidian6.TFile) {
      file = existing;
      await this.app.vault.process(file, (content) => `${content.replace(/\s*$/, "")}
${line}`);
    } else {
      file = await this.app.vault.create(path, `# Billable log

${line}`);
    }
    await this.app.workspace.getLeaf(true).openFile(file);
    new import_obsidian6.Notice("Added an example #billable line in \u201CBillable log\u201D \u2014 edit it, then run Create invoice.");
  }
  getClient(id) {
    var _a;
    if (!id) return null;
    return (_a = this.settings.clients.find((c) => c.id === id)) != null ? _a : null;
  }
  async previewHours() {
    var _a;
    const entries = await this.scanner.scan(this.settings.clients);
    if (entries.length === 0) {
      new import_obsidian6.Notice("No #billable entries found in the vault.");
      return;
    }
    const totals = /* @__PURE__ */ new Map();
    for (const e of entries) totals.set(e.clientName, ((_a = totals.get(e.clientName)) != null ? _a : 0) + e.hours);
    const summary = [...totals.entries()].sort((a, b) => b[1] - a[1]).map(([name, hours]) => `${name}: ${round2(hours)}h`).join("\n");
    const skipped = this.scanner.lastUnparsed.length;
    const warn = skipped > 0 ? `
\u26A0 ${skipped} #billable line(s) skipped (fix their time).` : "";
    new import_obsidian6.Notice(`Unbilled hours:
${summary}${warn}`, 8e3);
  }
  // Core: scan → build → mark source entries → write invoice note. The order and
  // locking make double-billing impossible: we reserve a unique number, then
  // mark entries (validated + atomic + rolled back on failure), and create the
  // note LAST so a failure falls toward "nothing billed" (retryable) rather than
  // "billed but re-billable" (double charge).
  async createInvoice(client, clientName, periodStart, periodEnd) {
    if (this.creating) {
      throw new Error("An invoice is already being created \u2014 please wait for it to finish.");
    }
    this.creating = true;
    try {
      const all = await this.scanner.scan(this.settings.clients);
      const entries = filterEntries(all, client, clientName, periodStart, periodEnd);
      if (entries.length === 0) {
        throw new Error("No billable entries match that client and date range.");
      }
      const issueDate = toISODate(/* @__PURE__ */ new Date());
      const { number, path, folder } = this.reserveInvoicePath(issueDate);
      await this.saveSettings();
      const opts = {
        number,
        issueDate,
        periodStart,
        periodEnd,
        dueInDays: this.settings.dueInDays,
        isPro: this.settings.isPro
      };
      const invoice = buildInvoice(entries, client, this.settings.business, opts);
      const markdown = renderInvoiceMarkdown(invoice, this.settings.business);
      this.settings.pendingInvoice = {
        number,
        path,
        markdown,
        entries: entries.map((e) => ({ sourcePath: e.sourcePath, line: e.line, raw: e.raw }))
      };
      await this.saveSettings();
      await this.scanner.markBilled(entries, number);
      await this.ensureFolder(folder);
      let file;
      try {
        file = await this.app.vault.create(path, markdown);
      } catch (error) {
        const failed = await this.scanner.unmarkBilled(entries, number);
        this.settings.pendingInvoice = null;
        await this.saveSettings();
        if (failed.length) {
          throw new Error(
            `${error instanceof Error ? error.message : String(error)} (and could not undo markers in: ${failed.join(", ")} \u2014 check these notes).`
          );
        }
        throw error;
      }
      this.settings.pendingInvoice = null;
      await this.saveSettings();
      return { file, invoice };
    } finally {
      this.creating = false;
    }
  }
  // Replay a journaled invoice left behind by a crash: create the note if it's
  // missing and mark any entries that weren't marked, then clear the journal.
  async recoverPendingInvoice() {
    const pending = this.settings.pendingInvoice;
    if (!pending) return;
    if (typeof pending.path !== "string" || typeof pending.markdown !== "string" || !Array.isArray(pending.entries)) {
      this.settings.pendingInvoice = null;
      await this.saveSettings();
      return;
    }
    try {
      const existing = this.app.vault.getAbstractFileByPath(pending.path);
      if (!(existing instanceof import_obsidian6.TFile)) {
        const slash = pending.path.lastIndexOf("/");
        if (slash > 0) await this.ensureFolder(pending.path.slice(0, slash));
        await this.app.vault.create(pending.path, pending.markdown);
      }
      for (const entry of pending.entries) {
        const file = this.app.vault.getAbstractFileByPath(entry.sourcePath);
        if (!(file instanceof import_obsidian6.TFile)) continue;
        await this.app.vault.process(file, (content) => {
          const lines = content.split(/\r?\n/);
          if (entry.line < lines.length && lineMatchesEntry(lines[entry.line], entry.raw)) {
            lines[entry.line] = markLineBilled(lines[entry.line], pending.number);
          }
          return lines.join("\n");
        });
      }
      new import_obsidian6.Notice(`Recovered an interrupted invoice: ${pending.number}.`);
    } catch (e) {
      return;
    }
    this.settings.pendingInvoice = null;
    await this.saveSettings();
  }
  // Reserve the next invoice number and a non-colliding file path. Increments
  // nextSeq once; if that number's file already exists, the FILE name is
  // suffixed (the number is preserved) so we never overwrite an existing note.
  reserveInvoicePath(issueDate) {
    const folder = (0, import_obsidian6.normalizePath)(this.settings.invoiceFolder || "Invoices");
    const number = formatInvoiceNumber(
      this.settings.numberTemplate,
      this.settings.nextSeq,
      /* @__PURE__ */ new Date(issueDate + "T00:00:00")
    );
    this.settings.nextSeq += 1;
    let path = (0, import_obsidian6.normalizePath)(`${folder}/${safeFileName(number)}.md`);
    let suffix = 2;
    while (this.app.vault.getAbstractFileByPath(path)) {
      path = (0, import_obsidian6.normalizePath)(`${folder}/${safeFileName(number)} ${suffix}.md`);
      suffix += 1;
    }
    return { number, path, folder };
  }
  // Pro: open a printable HTML invoice in a new window (Print → Save as PDF).
  exportInvoiceHtml(invoice) {
    if (!this.settings.isPro) {
      new import_obsidian6.Notice("PDF / print export is a Pro feature.");
      return;
    }
    if (import_obsidian6.Platform.isMobile) {
      new import_obsidian6.Notice("PDF / print export is available on desktop only. Open this invoice on desktop to print or save as PDF.");
      return;
    }
    const html = renderInvoiceHtml(invoice, this.settings.business);
    const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    const win = window.open(url, "_blank");
    if (!win) {
      URL.revokeObjectURL(url);
      new import_obsidian6.Notice("Could not open a print window (popup blocked). Use Ctrl/Cmd+P to print to PDF.");
      return;
    }
    window.setTimeout(() => URL.revokeObjectURL(url), 6e4);
  }
  async ensureFolder(path) {
    const existing = this.app.vault.getAbstractFileByPath(path);
    if (existing) return;
    await this.app.vault.createFolder(path).catch(() => void 0);
  }
  async refreshLicense() {
    var _a;
    if (!this.settings.licenseKey) {
      this.settings.isPro = false;
      this.settings.licenseEmail = "";
      await this.saveSettings();
      return;
    }
    const result = LicenseManager.verify(this.settings.licenseKey);
    this.settings.isPro = result.valid;
    this.settings.licenseEmail = (_a = result.email) != null ? _a : "";
    await this.saveSettings();
  }
  async loadSettings() {
    const data = await this.loadData();
    const loaded = data !== null && typeof data === "object" ? data : {};
    for (const key of ["__proto__", "constructor", "prototype"]) {
      delete loaded[key];
    }
    this.settings = Object.assign({}, DEFAULT_SETTINGS, loaded);
    const business = loaded.business;
    this.settings.business = Object.assign(
      {},
      DEFAULT_SETTINGS.business,
      business && typeof business === "object" ? business : {}
    );
    this.settings.clients = Array.isArray(loaded.clients) ? loaded.clients.filter((c) => !!c && typeof c === "object").map(normalizeClient) : [];
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
};
function safeFileName(name) {
  return name.replace(/[\\/:*?"<>|]/g, "-");
}
function normalizeClient(raw) {
  const str = (v) => typeof v === "string" ? v : "";
  const numOrNull = (v) => typeof v === "number" && Number.isFinite(v) ? v : null;
  return {
    id: str(raw.id),
    name: str(raw.name),
    email: str(raw.email),
    address: str(raw.address),
    defaultRate: numOrNull(raw.defaultRate),
    currency: typeof raw.currency === "string" ? raw.currency : null,
    taxRate: numOrNull(raw.taxRate)
  };
}
