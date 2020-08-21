class Cube {
  constructor(opt) {
    //存放所有点坐标
    this.dots = [];

    //存放面
    this.faces = [];

    this.init(opt);
  }

  init(opt) {
    this.xpos = opt.x;
    this.ypos = opt.y;
    this.zpos = opt.z;
    this.w = opt.w;

    for (var i = 0; i < 8; i++) {
      this.dots.push({ x: 0, y: 0, z: 0 })
    }

    this.setVector();

    this.faces.push([this.dots[0], this.dots[1], this.dots[3], this.dots[2]]);
    this.faces.push([this.dots[2], this.dots[3], this.dots[5], this.dots[4]]);
    this.faces.push([this.dots[4], this.dots[5], this.dots[7], this.dots[6]]);
    this.faces.push([this.dots[6], this.dots[7], this.dots[1], this.dots[0]]);
    this.faces.push([this.dots[1], this.dots[3], this.dots[5], this.dots[7]]);
    this.faces.push([this.dots[0], this.dots[2], this.dots[4], this.dots[6]]);
  }

  setVector() {
    var x = this.xpos,
      y = this.ypos,
      z = this.zpos,
      dis = this.w / 2;

    this.dots[0].x = x - dis;
    this.dots[0].y = y - dis;
    this.dots[0].z = z + dis;

    this.dots[1].x = x - dis;
    this.dots[1].y = y + dis;
    this.dots[1].z = z + dis;

    this.dots[2].x = x + dis;
    this.dots[2].y = y - dis;
    this.dots[2].z = z + dis;

    this.dots[3].x = x + dis;
    this.dots[3].y = y + dis;
    this.dots[3].z = z + dis;

    this.dots[4].x = x + dis;
    this.dots[4].y = y - dis;
    this.dots[4].z = z - dis;

    this.dots[5].x = x + dis;
    this.dots[5].y = y + dis;
    this.dots[5].z = z - dis;

    this.dots[6].x = x - dis;
    this.dots[6].y = y - dis;
    this.dots[6].z = z - dis;

    this.dots[7].x = x - dis;
    this.dots[7].y = y + dis;
    this.dots[7].z = z - dis;
  }

  move(xc, yc, zc) {
    this.xpos += xc;
    this.ypos += yc;
    this.zpos += zc;

    this.dots.forEach(function (dot) {
      dot.x += xc;
      dot.y += yc;
      dot.z += zc;
    })
  }

  rotate(angleX, angleY) {
    var xcos = Math.cos(angleX);
    var xsin = Math.sin(angleX);
    var ycos = Math.cos(angleY);
    var ysin = Math.sin(angleY);

    var x, y, z;
    var nx, ny, nz;
    var xa = 0, ya = 0, za = 0;

    //计算旋转后的所有点坐标位置
    this.dots.forEach(function (dot) {
      x = dot.x;
      y = dot.y;
      z = dot.z;

      //绕X轴旋转
      ny = y * xcos - z * xsin;
      nz = z * xcos + y * xsin;

      //绕Y轴旋转
      nx = x * ycos - nz * ysin;
      nz = nz * ycos + x * ysin;

      dot.x = nx;
      dot.y = ny;
      dot.z = nz;

      xa += nx;
      ya += ny;
      za += nz;
    });

    //更新中心点坐标
    this.xpos = xa / this.dots.length;
    this.ypos = ya / this.dots.length;
    this.zpos = za / this.dots.length;
  }
}

export default Cube;