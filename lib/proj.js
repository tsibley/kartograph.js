(function() {

  /*
      svgmap - a simple toolset that helps creating interactive thematic maps
      Copyright (C) 2011  Gregor Aisch
  
      This program is free software: you can redistribute it and/or modify
      it under the terms of the GNU General Public License as published by
      the Free Software Foundation, either version 3 of the License, or
      (at your option) any later version.
  
      This program is distributed in the hope that it will be useful,
      but WITHOUT ANY WARRANTY; without even the implied warranty of
      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
      GNU General Public License for more details.
  
      You should have received a copy of the GNU General Public License
      along with this program.  If not, see <http://www.gnu.org/licenses/>.
  */

  var Balthasart, Behrmann, CEA, Cylindrical, EckertIV, Equirectangular, GallPeters, HoboDyer, Mollweide, NaturalEarth, Proj, PseudoCylindrical, Robinson, Sinusoidal, Vis4, WagnerIV, WagnerV, root, __proj, _ref;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  if ((_ref = root.svgmap) == null) root.svgmap = {};

  __proj = root.svgmap.proj = {};

  Proj = (function() {

    function Proj(lon0, lat0) {
      this.lon0 = lon0 != null ? lon0 : 0;
      this.lat0 = lat0 != null ? lat0 : 0;
      this.HALFPI = Math.PI * .5;
      this.QUARTERPI = Math.PI * .25;
      this.RAD = Math.PI / 180;
      this.DEG = 180 / Math.PI;
      this.lam0 = this.rad(this.lon0);
      this.phi0 = this.rad(this.lat0);
    }

    Proj.prototype.rad = function(a) {
      return a * this.RAD;
    };

    Proj.prototype.deg = function(a) {
      return a * this.RAD;
    };

    Proj.projections = {};

    Proj.prototype.plot = function(polygon, truncate) {
      var ignore, lat, lon, points, vis, x, y, _i, _len, _ref2, _ref3;
      if (truncate == null) truncate = true;
      points = [];
      ignore = true;
      for (_i = 0, _len = polygon.length; _i < _len; _i++) {
        _ref2 = polygon[_i], lon = _ref2[0], lat = _ref2[1];
        vis = this._visible(lon, lat);
        if (vis) ignore = false;
        _ref3 = this.project(lon, lat), x = _ref3[0], y = _ref3[1];
        if (!vis && truncate) {
          points.push(this._truncate(x, y));
        } else {
          points.push([x, y]);
        }
      }
      if (ignore) {
        return null;
      } else {
        return [points];
      }
    };

    return Proj;

  })();

  Cylindrical = (function() {

    __extends(Cylindrical, Proj);

    function Cylindrical() {
      Cylindrical.__super__.constructor.apply(this, arguments);
    }

    /*
    	Base class for cylindrical projections
    */

    Cylindrical.prototype._visible = function(lon, lat) {
      return true;
    };

    return Cylindrical;

  })();

  Equirectangular = (function() {

    __extends(Equirectangular, Cylindrical);

    function Equirectangular() {
      Equirectangular.__super__.constructor.apply(this, arguments);
    }

    /*
    	Equirectangular Projection aka Lonlat aka Plate Carree
    */

    Equirectangular.prototype.project = function(lon, lat) {
      return [(lon + 180) * Math.cos(this.phi0) * 2.777, (lat * -1 + 90) * 2.7777];
    };

    return Equirectangular;

  })();

  __proj['lonlat'] = Equirectangular;

  CEA = (function() {

    __extends(CEA, Cylindrical);

    function CEA() {
      CEA.__super__.constructor.apply(this, arguments);
    }

    /*
    	Cylindrical Equal Area Projection
    */

    CEA.prototype.project = function(lon, lat) {
      var lam, phi, x, y;
      lam = this.rad(lon);
      phi = this.rad(lat * -1);
      x = (lam - this.lam0) * Math.cos(this.phi0);
      y = Math.sin(phi) / Math.cos(this.phi0);
      return [x * 1000, y * 1000];
    };

    return CEA;

  })();

  __proj['cea'] = CEA;

  GallPeters = (function() {

    __extends(GallPeters, CEA);

    /*
    	Gall-Peters Projection
    */

    function GallPeters(lon0, lat0) {
      GallPeters.__super__.constructor.call(this, lon0, 45);
    }

    return GallPeters;

  })();

  __proj['gallpeters'] = GallPeters;

  HoboDyer = (function() {

    __extends(HoboDyer, CEA);

    /*
    	Hobo-Dyer Projection
    */

    function HoboDyer(lon0, lat0) {
      HoboDyer.__super__.constructor.call(this, lon0, 37.7);
    }

    return HoboDyer;

  })();

  __proj['hobodyer'] = HoboDyer;

  Behrmann = (function() {

    __extends(Behrmann, CEA);

    /*
    	Behrmann Projection
    */

    function Behrmann(lon0, lat0) {
      Behrmann.__super__.constructor.call(this, lon0, 30);
    }

    return Behrmann;

  })();

  __proj['behrmann'] = Behrmann;

  Balthasart = (function() {

    __extends(Balthasart, CEA);

    /*
    	Balthasart Projection
    */

    function Balthasart(lon0, lat0) {
      Balthasart.__super__.constructor.call(this, lon0, 50);
    }

    return Balthasart;

  })();

  __proj['balthasart'] = Balthasart;

  PseudoCylindrical = (function() {

    __extends(PseudoCylindrical, Cylindrical);

    function PseudoCylindrical() {
      PseudoCylindrical.__super__.constructor.apply(this, arguments);
    }

    /*
    	Base class for pseudo cylindrical projections
    */

    return PseudoCylindrical;

  })();

  NaturalEarth = (function() {

    __extends(NaturalEarth, PseudoCylindrical);

    /*
    	Natural Earth Projection
    	see here http://www.shadedrelief.com/NE_proj/
    */

    function NaturalEarth(lon0, lat0) {
      var s;
      NaturalEarth.__super__.constructor.call(this, lon0, lat0);
      s = this;
      s.A0 = 0.8707;
      s.A1 = -0.131979;
      s.A2 = -0.013791;
      s.A3 = 0.003971;
      s.A4 = -0.001529;
      s.B0 = 1.007226;
      s.B1 = 0.015085;
      s.B2 = -0.044475;
      s.B3 = 0.028874;
      s.B4 = -0.005916;
      s.C0 = s.B0;
      s.C1 = 3 * s.B1;
      s.C2 = 7 * s.B2;
      s.C3 = 9 * s.B3;
      s.C4 = 11 * s.B4;
      s.EPS = 1e-11;
      s.MAX_Y = 0.8707 * 0.52 * Math.PI;
      return;
    }

    NaturalEarth.prototype.project = function(lon, lat) {
      var lplam, lpphi, phi2, phi4, s, x, y;
      s = this;
      lplam = s.rad(lon);
      lpphi = s.rad(lat * -1);
      phi2 = lpphi * lpphi;
      phi4 = phi2 * phi2;
      x = lplam * (s.A0 + phi2 * (s.A1 + phi2 * (s.A2 + phi4 * phi2 * (s.A3 + phi2 * s.A4)))) * 180 + 500;
      y = lpphi * (s.B0 + phi2 * (s.B1 + phi4 * (s.B2 + s.B3 * phi2 + s.B4 * phi4))) * 180 + 270;
      return [x, y];
    };

    return NaturalEarth;

  })();

  __proj['naturalearth'] = NaturalEarth;

  Robinson = (function() {

    __extends(Robinson, PseudoCylindrical);

    /*
    	Robinson Projection
    */

    function Robinson(lon0, lat0) {
      var s;
      Robinson.__super__.constructor.call(this, lon0, lat0);
      s = this;
      s.X = [1, -5.67239e-12, -7.15511e-05, 3.11028e-06, 0.9986, -0.000482241, -2.4897e-05, -1.33094e-06, 0.9954, -0.000831031, -4.4861e-05, -9.86588e-07, 0.99, -0.00135363, -5.96598e-05, 3.67749e-06, 0.9822, -0.00167442, -4.4975e-06, -5.72394e-06, 0.973, -0.00214869, -9.03565e-05, 1.88767e-08, 0.96, -0.00305084, -9.00732e-05, 1.64869e-06, 0.9427, -0.00382792, -6.53428e-05, -2.61493e-06, 0.9216, -0.00467747, -0.000104566, 4.8122e-06, 0.8962, -0.00536222, -3.23834e-05, -5.43445e-06, 0.8679, -0.00609364, -0.0001139, 3.32521e-06, 0.835, -0.00698325, -6.40219e-05, 9.34582e-07, 0.7986, -0.00755337, -5.00038e-05, 9.35532e-07, 0.7597, -0.00798325, -3.59716e-05, -2.27604e-06, 0.7186, -0.00851366, -7.0112e-05, -8.63072e-06, 0.6732, -0.00986209, -0.000199572, 1.91978e-05, 0.6213, -0.010418, 8.83948e-05, 6.24031e-06, 0.5722, -0.00906601, 0.000181999, 6.24033e-06, 0.5322, 0, 0, 0];
      s.Y = [0, 0.0124, 3.72529e-10, 1.15484e-09, 0.062, 0.0124001, 1.76951e-08, -5.92321e-09, 0.124, 0.0123998, -7.09668e-08, 2.25753e-08, 0.186, 0.0124008, 2.66917e-07, -8.44523e-08, 0.248, 0.0123971, -9.99682e-07, 3.15569e-07, 0.31, 0.0124108, 3.73349e-06, -1.1779e-06, 0.372, 0.0123598, -1.3935e-05, 4.39588e-06, 0.434, 0.0125501, 5.20034e-05, -1.00051e-05, 0.4968, 0.0123198, -9.80735e-05, 9.22397e-06, 0.5571, 0.0120308, 4.02857e-05, -5.2901e-06, 0.6176, 0.0120369, -3.90662e-05, 7.36117e-07, 0.6769, 0.0117015, -2.80246e-05, -8.54283e-07, 0.7346, 0.0113572, -4.08389e-05, -5.18524e-07, 0.7903, 0.0109099, -4.86169e-05, -1.0718e-06, 0.8435, 0.0103433, -6.46934e-05, 5.36384e-09, 0.8936, 0.00969679, -6.46129e-05, -8.54894e-06, 0.9394, 0.00840949, -0.000192847, -4.21023e-06, 0.9761, 0.00616525, -0.000256001, -4.21021e-06, 1, 0, 0, 0];
      s.NODES = 18;
      s.FXC = 0.8487;
      s.FYC = 1.3523;
      s.C1 = 11.45915590261646417544;
      s.RC1 = 0.08726646259971647884;
      s.ONEEPS = 1.000001;
      s.EPS = 1e-8;
      return;
    }

    Robinson.prototype._poly = function(arr, offs, z) {
      return arr[offs] + z * (arr[offs + 1] + z * (arr[offs + 2] + z * arr[offs + 3]));
    };

    Robinson.prototype.project = function(lon, lat) {
      var i, lplam, lpphi, phi, s, x, y;
      s = this;
      lplam = s.rad(lon);
      lpphi = s.rad(lat * -1);
      phi = Math.abs(lpphi);
      i = Math.floor(phi * s.C1);
      if (i >= s.NODES) i = s.NODES - 1;
      phi = s.deg(phi - s.RC1 * i);
      i *= 4;
      x = s._poly(s.X, i, phi) * s.FXC * lplam;
      y = s._poly(s.Y, i, phi) * s.FYC;
      if (lpphi < 0.0) y = -y;
      return [x * 180 + 500, y * 180 + 270];
    };

    return Robinson;

  })();

  __proj['robinson'] = Robinson;

  EckertIV = (function() {

    __extends(EckertIV, PseudoCylindrical);

    /*
    	Eckert IV Projection
    */

    function EckertIV(lon0, lat0) {
      var me;
      if (lon0 == null) lon0 = 0.0;
      if (lat0 == null) lat0 = 0;
      EckertIV.__super__.constructor.call(this, lon0, lat0);
      me = this;
      me.C_x = .42223820031577120149;
      me.C_y = 1.32650042817700232218;
      me.RC_y = .75386330736002178205;
      me.C_p = 3.57079632679489661922;
      me.RC_p = .28004957675577868795;
      me.EPS = 1e-7;
      me.NITER = 6;
    }

    EckertIV.prototype.project = function(lon, lat) {
      var V, c, i, lplam, lpphi, me, p, s, x, y;
      me = this;
      lplam = me.rad(lon);
      lpphi = me.rad(lat * -1);
      p = me.C_p * Math.sin(lpphi);
      V = lpphi * lpphi;
      lpphi *= 0.895168 + V * (0.0218849 + V * 0.00826809);
      i = me.NITER;
      while (i > 0) {
        c = Math.cos(lpphi);
        s = Math.sin(lpphi);
        V = (lpphi + s * (c + 2) - p) / (1 + c * (c + 2) - s * s);
        lpphi -= V;
        if (Math.abs(V) < me.EPS) break;
        i -= 1;
      }
      if (i === 0) {
        x = me.C_x * lplam;
        y = lpphi < 0 ? -me.C_y : me.C_y;
      } else {
        x = me.C_x * lplam * (1 + Math.cos(lpphi));
        y = me.C_y * Math.sin(lpphi);
      }
      return [x, y];
    };

    return EckertIV;

  })();

  __proj['eckert4'] = EckertIV;

  Sinusoidal = (function() {

    __extends(Sinusoidal, PseudoCylindrical);

    function Sinusoidal() {
      Sinusoidal.__super__.constructor.apply(this, arguments);
    }

    /*
    	Sinusoidal Projection
    */

    Sinusoidal.prototype.project = function(lon, lat) {
      var lam, me, phi, x, y;
      me = this;
      lam = me.rad(lon);
      phi = me.rad(lat * -1);
      x = lam * Math.cos(phi);
      y = phi;
      return [x, y];
    };

    return Sinusoidal;

  })();

  __proj['sinusoidal'] = Sinusoidal;

  Mollweide = (function() {

    __extends(Mollweide, PseudoCylindrical);

    /*
    	Mollweide Projection
    */

    function Mollweide(lon0, lat0, p, cx, cy, cp) {
      var me, p2, r, sp;
      if (lon0 == null) lon0 = 0;
      if (lat0 == null) lat0 = 0;
      if (p == null) p = 1.5707963267948966;
      if (cx == null) cx = null;
      if (cy == null) cy = null;
      if (cp == null) cp = null;
      Mollweide.__super__.constructor.call(this, lon0, lat0);
      me = this;
      me.MAX_ITER = 10;
      me.TOLERANCE = 1e-7;
      if (p != null) {
        p2 = p + p;
        sp = Math.sin(p);
        r = Math.sqrt(Math.PI * 2.0 * sp / (p2 + Math.sin(p2)));
        me.cx = 2 * r / Math.PI;
        me.cy = r / sp;
        me.cp = p2 + Math.sin(p2);
      } else if ((cx != null) && (cy != null) && (typeof cz !== "undefined" && cz !== null)) {
        me.cx = cx;
        me.cy = cy;
        me.cp = cp;
      } else {
        console.error('svgmap.proj.Mollweide: either p or cx,cy,cp must be defined');
      }
    }

    Mollweide.prototype.project = function(lon, lat) {
      var abs, i, k, lam, math, me, phi, v, x, y;
      me = this;
      math = Math;
      abs = math.abs;
      lam = me.rad(lon);
      phi = me.rad(lat);
      k = me.cp * math.sin(phi);
      i = me.MAX_ITER;
      while (i !== 0) {
        v = (phi + math.sin(phi) - k) / (1 + math.cos(phi));
        phi -= v;
        if (abs(v) < me.TOLERANCE) break;
        i -= 1;
      }
      if (i === 0) {
        phi = phi >= 0 ? me.HALFPI : -me.HALFPI;
      } else {
        phi *= 0.5;
      }
      x = me.cx * lam * math.cos(phi);
      y = me.cy * math.sin(phi);
      return [x, y * -1];
    };

    return Mollweide;

  })();

  __proj['mollweide'] = Mollweide;

  WagnerIV = (function() {

    __extends(WagnerIV, Mollweide);

    /*
    	Wagner IV Projection
    */

    function WagnerIV(lon0, lat0) {
      if (lon0 == null) lon0 = 0;
      if (lat0 == null) lat0 = 0;
      WagnerIV.__super__.constructor.call(this, lon0, lat0, 1.0471975511965976);
    }

    return WagnerIV;

  })();

  __proj['wagner4'] = WagnerIV;

  WagnerV = (function() {

    __extends(WagnerV, Mollweide);

    /*
    	Wagner V Projection
    */

    function WagnerV(lon0, lat0) {
      if (lon0 == null) lon0 = 0;
      if (lat0 == null) lat0 = 0;
      WagnerV.__super__.constructor.call(this, lon0, lat0, null, 0.90977, 1.65014, 3.00896);
    }

    return WagnerV;

  })();

  __proj['wagner5'] = WagnerV;

  Vis4 = (function() {

    __extends(Vis4, Mollweide);

    function Vis4(lon0, lat0) {
      if (lon0 == null) lon0 = 0;
      if (lat0 == null) lat0 = 0;
      Vis4.__super__.constructor.call(this, lon0, lat0, Math.PI / 2.5);
    }

    return Vis4;

  })();

  /*
  */

}).call(this);