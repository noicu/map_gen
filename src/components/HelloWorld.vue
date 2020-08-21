<template>
  <div class="hello">
    <canvas id="cas" width="700" height="600">您的浏览器不支持canvas</canvas>
  </div>
</template>

<script>

// https://www.redblobgames.com/maps/terrain-from-noise/
import { tick } from "../app_tick.js";
import Cube from "../core/cube";
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data: () => ({
    canvas: null,
    ctx: null,
    fallLength: null,
    centerX: null,
    centerY: null,
    cubeWidth: null,
    cubeList: [],
    cubeFace: [],
    distance: 50,
    level: 1.5,
    cube_w: 100,
  }),
  mounted() {
    this.canvas = document.getElementById("cas");
    this.ctx = this.canvas.getContext("2d");
    this.fallLength = 1000;
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
    this.cubeWidth = 100;

    window.onmousewheel = function (e) {
      this.cubeList.forEach(function (cube) {
        var nx = cube.xpos / 10;
        var ny = cube.ypos / 10;
        var nz = cube.zpos / 10;

        nx = e.wheelDelta > 0 ? nx : -nx;
        ny = e.wheelDelta > 0 ? ny : -ny;
        nz = e.wheelDelta > 0 ? nz : -nz;

        cube.move(nx, ny, nz);
      });
    };

    //鼠标事件绑定
    this.canvas.onmousedown = (e) => {
      var angleY, angleX;

      e = e || window.event;
      var x1 = e.clientX - this.canvas.offsetLeft - this.centerX;
      var y1 = e.clientY - this.canvas.offsetTop - this.centerY;

      var xc = 0,
        yc = 0;
      var date = new Date();
      // var dc = 10000;

      this.cubeList.forEach(function (cube) {
        cube.inertia = false;
      });

      window.onmousemove =  (e)=> {
        e = e || window.event;
        var x2 = e.clientX - this.canvas.offsetLeft - this.centerX;
        var y2 = e.clientY - this.canvas.offsetTop - this.centerY;
        var date2 = new Date();

        xc = x2 - x1;
        yc = y2 - y1;

        angleY = xc * 0.005;
        angleX = yc * 0.005;

        this.cubeList.forEach(function (cube) {
          cube.rotate(angleX, angleY);
        });

        x1 = x2;
        y1 = y2;
        date = date2;
      };

      window.mouseleave = window.onmouseup =  ()=> {
        window.onmousemove = null;
        var date2 = new Date();
        var dc = date2 - date || 1;

        this.cubeList.forEach(function (cube) {
          cube.inertia = true;
          cube.toAngle = {
            x: yc / dc,
            y: xc / dc,
          };
        });
      };
    };

    this.initAnimate();
  },
  methods: {
    get2d(dot) {
      var scale = this.fallLength / (this.fallLength + dot.z);
      var x = this.centerX + dot.x * scale;
      var y = this.centerY + dot.y * scale;
      return { x: x, y: y };
    },
    drawFace(face) {
      if (!face.color) {
        face.color =
          "rgba(" +
          parseInt(this.getRandom(128, 255)) +
          "," +
          parseInt(this.getRandom(128, 255)) +
          "," +
          parseInt(this.getRandom(128, 255)) +
          ",1)";
      }

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(this.get2d(face[0]).x, this.get2d(face[0]).y);
      this.ctx.lineTo(this.get2d(face[1]).x, this.get2d(face[1]).y);
      this.ctx.lineTo(this.get2d(face[2]).x, this.get2d(face[2]).y);
      this.ctx.lineTo(this.get2d(face[3]).x, this.get2d(face[3]).y);
      this.ctx.closePath();
      //
      //        ctx.strokeStyle = "#fff";
      //        ctx.stroke();

      this.ctx.fillStyle = face.color;
      this.ctx.fill();
    },
    initAnimate() {
      var cw = this.cube_w / this.level;
      var dis = cw + this.distance;
      var minmax = (this.level - 1) * dis;

      var cube;

      //三层正方体
      for (var l1 = -minmax; l1 <= minmax; l1 += dis) {
        for (var l2 = -minmax; l2 <= minmax; l2 += dis) {
          for (var l3 = -minmax; l3 <= minmax; l3 += dis) {
            cube = new Cube({ x: l1, y: l2, z: l3, w: cw });
            this.cubeFace = this.cubeFace.concat(cube.faces);
            this.cubeList.push(cube);

            cube.inertia = true;
            cube.toAngle = {
              x: 2,
              y: 10,
            };
          }
        }
      }

      // animate();
      tick.add(() => {
        this.animate();
      });
    },
    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.cubeFace.sort(function (a, b) {
        var indexa = (a[0].z + a[1].z + a[2].z + a[3].z) / 4;
        var indexb = (b[0].z + b[1].z + b[2].z + b[3].z) / 4;

        return indexb - indexa;
      });

      //遍历cube判断是否需要旋转
      // this.cubeList.forEach(function (cube) {
      //   if (cube.inertia) {
      //     var ax = cube.toAngle.x * 0.02;
      //     var ay = cube.toAngle.y * 0.02;

      //     cube.toAngle.x -= ax;
      //     cube.toAngle.y -= ay;

      //     cube.rotate(ax, ay);
      //   }
      // });

      this.cubeFace.forEach((face) => {
        this.drawFace(face);
      });

      // stats.update();
    },
    getRandom(a, b) {
      return Math.random() * (b - a) + a;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
