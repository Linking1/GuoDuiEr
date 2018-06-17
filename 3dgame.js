import './three/weapp-adapter'
let THREE = require('./three/three')
// var myCanvas = wx.createCanvas()
// var context = myCanvas.getContext('2d')
// context.fillStyle = 'red'
// context.fillRect(0, 0, 100, 100)


export default class game3d {
	//创建屏幕，相机，渲染，灯光
	constructor() {
    this.scoreLists = [];
    this.scoreList = [];
    this.isJieShu = 2;
    this.baoShiList = [];
    this.baoShiIndex = {
      x: 3,
      y: 3
    };
    this.index1 = 0;
    this.index2 = 0;
    this.score = 0;
    //变红的状态，0表示未红，1表示第一次红提示，2表示第一次脱离红，3表示第二次变红，4表示第二次脱离红，5表示缺失状态
    this.hongState = 0;
    this.hongTime = 0;
    //储存草地的存在情况
    this.caodiList = [];
    //存储立方体的位置
    this.cubeIndex = {
      x1: 3,
      y1: 3,
      x2: 0,
      y2: 0
    };
    //储存当前长方体的状态，1表示竖立，2表示左右横置，3表示前后横置
    this.cubeState = 0;
    //储存当前长方体的坐标
    this.cubeCoor = {
      x: 0.5,
      y: 0,
      z: 0.5
    };
    this.caodis = [];
    this.caodisHong = []
    this.cubeEdges = [];
		this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000); //OrthographicCamera(-2, 2, 1.5, -1.5, 1, 10) 
		this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    
		this.light = new THREE.AmbientLight(0xffffff);
		this.scene.add(this.light);
		this.start()
		this.initEvent()
	}

	//启动游戏
	start() {
    this.shootAudio = new Audio()
    this.shootAudio.src = 'music/bullet.mp3'

    this.boomAudio = new Audio()
    this.boomAudio.src = 'music/boom.mp3'

    let caodiList1 = [];
    let baoShiList1 = [];
    for (var i = 0; i < 6; i++) {
      caodiList1 = [];
      baoShiList1 = [];
      for (var j = 0; j < 6; j++) {
        caodiList1.push(1);
        baoShiList1.push(1);
      }
      this.caodiList.push(caodiList1);
      this.baoShiList.push(baoShiList1);      
    }
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		//console.log(window.innerWidth);
		this.renderer.setClearColor(0xffffff, 1.0);

    let geometryScore = new THREE.CubeGeometry(0.2, 0.01, 0.25);
    for(var j=0;j<4;j++) {
      let scoreList = [];
      for(var i=0;i<10;i++) {
        let textureScore = new THREE.TextureLoader().load('images/'+i+'.png');
        let cubeScore = new THREE.Mesh(geometryScore, new THREE.MeshBasicMaterial({ map: textureScore }));
        cubeScore.rotation.x = 0.9;
        cubeScore.position.x = -1.2;
        cubeScore.position.z = 1.6;
        cubeScore.position.y = 3.8;
        scoreList.push(cubeScore);
      }
      this.scoreLists.push(scoreList)
    }
    console.log(this.scoreLists);

    let geometryJieShu = new THREE.CubeGeometry(2.6, 0.2, 3.4);
    let textureJieShu = new THREE.TextureLoader().load("images/jieshu1.png");
    this.cubeJieShu = new THREE.Mesh(geometryJieShu, new THREE.MeshBasicMaterial({ map: textureJieShu, transparent: true }));
    this.cubeJieShu.rotation.x = 0.9;
    this.cubeJieShu.position.z = 3.2;
    this.cubeJieShu.position.y = 2.2;

    let geometryJieShu1 = new THREE.CubeGeometry(2.6, 0.2, 2.6);
    let textureJieShu1 = new THREE.TextureLoader().load("images/jieshu.png");
    this.cubeJieShu1 = new THREE.Mesh(geometryJieShu1, new THREE.MeshBasicMaterial({ map: textureJieShu1, transparent: true }));
    this.cubeJieShu1.rotation.x = 0.9;
    this.cubeJieShu1.position.z = 3.2;
    this.cubeJieShu1.position.y = 2.2;

    let geometryQiu = new THREE.SphereGeometry(0.2, 40, 40);
		let geometryShu = new THREE.CubeGeometry(1, 2, 1);
    let geometryHeng1 = new THREE.CubeGeometry(2, 1, 1);
    let geometryHeng2 = new THREE.CubeGeometry(1, 1, 2);
		let textureShu = new THREE.TextureLoader().load("images/guodong4.jpg");
    let textureHeng1 = new THREE.TextureLoader().load("images/guodong1.jpg");
    
		//console.log(texture);
		//创建立方体模型 { map: textureShu }
    this.qiu = new THREE.Mesh(geometryQiu, new THREE.MeshBasicMaterial({ map: textureShu }));
    this.cubeShu = new THREE.Mesh(geometryShu, new THREE.MeshBasicMaterial({ color: 0xFF0099}));
    this.cubeShu.position.x = this.cubeCoor.x;
    this.cubeShu.position.y = this.cubeCoor.y;
    this.cubeShu.position.z = this.cubeCoor.z;     
    this.cubeHeng1 = new THREE.Mesh(geometryHeng1, new THREE.MeshBasicMaterial({ color: 0xFF0099 }));
    this.cubeHeng2 = new THREE.Mesh(geometryHeng2, new THREE.MeshBasicMaterial({ color: 0xFF0099 }));    
    this.scene.add(this.cubeShu);
    this.scene.add(this.qiu);    
    this.qiu.position.x = 1.5;
    this.qiu.position.y = -0.8;    
    this.qiu.position.z = 1.5;    
    //this.scene.add(this.cubeHeng1);
    //this.scene.add(this.cubeHeng2);    
		this.camera.position.z = 5;
		this.camera.position.x = 0;
		this.camera.position.y = 4;
		this.camera.lookAt(new THREE.Vector3(0, 0, 0));
		//引入坐标系
		//this.zuobiao();
    //插入草地
    this.caodi();
    this.baoShi();
    this.showScore();
    this.begin();
    //this.gameScore();
		//this.renderer.render(this.scene, this.camera);
		//引入动画，不引入动画，无法进行渲染
		//window.requestAnimationFrame(this.loop.bind(this), canvas);
    window.requestAnimationFrame(this.toHong.bind(this), canvas);    
	}

  restart() {
    for(var i=0;i<6;i++) {
      for(var j=0;j<6;j++) {
        this.scene.remove(this.caodis[i][j])
        this.scene.remove(this.caodisHong[i][j])     
        this.scene.add(this.caodis[i][j])  
      }
    }
    this.scene.remove(this.cubeJieShu);
    this.scene.remove(this.cubeJieShu1);    
    this.scene.remove(this.cubeShu);
    this.scene.remove(this.cubeHeng1);
    this.scene.remove(this.cubeHeng2);
    this.isJieShu = 0;
    let myscoreStr = this.score.toString();
    let myscoreStrList = myscoreStr.split("");
    for (var i = 0; i < myscoreStrList.length; i++) {
      this.scene.remove(this.scoreLists[i][myscoreStrList[i]])
    }
    this.score = 0;
    this.hongState = 0;
    this.hongTime = 0;
    this.cubeIndex = {
      x1: 3,
      y1: 3,
      x2: 0,
      y2: 0
    };
    this.cubeState = 0;
    //储存当前长方体的坐标
    this.cubeCoor = {
      x: 0.5,
      y: 0,
      z: 0.5
    };
    this.caodiList = [];
    this.baoShiList = [];
    let caodiList1 = [];
    let baoShiList1 = [];
    for (var i = 0; i < 6; i++) {
      caodiList1 = [];
      baoShiList1 = [];
      for (var j = 0; j < 6; j++) {
        caodiList1.push(1);
        baoShiList1.push(1);
      }
      this.caodiList.push(caodiList1);
      this.baoShiList.push(baoShiList1);
    }
    this.cubeShu.position.x = this.cubeCoor.x;
    this.cubeShu.position.y = this.cubeCoor.y;
    this.cubeShu.position.z = this.cubeCoor.z;
    this.scene.add(this.cubeShu);   
    this.cubeHeng1.position.x = 0;
    this.cubeHeng1.position.y = 0;
    this.cubeHeng1.position.z = 0;   
    this.cubeHeng2.position.x = 0;
    this.cubeHeng2.position.y = 0;
    this.cubeHeng2.position.z = 0;   
    this.baoShi();
    this.showScore();
    console.log("分数")
    console.log(this.score)
    this.renderer.render(this.scene, this.camera);
  }

  //开始游戏
  begin() {
    let geometry = new THREE.CubeGeometry(2.7, 0.2, 4.4);
    let texture = new THREE.TextureLoader().load("images/begin.png");
    this.cubeBegin = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({map: texture}));
    this.cubeBegin.rotation.x = 0.9;
    this.cubeBegin.position.z = 3.2;
    this.cubeBegin.position.y = 2.57;
    this.scene.add(this.cubeBegin);
    this.renderer.render(this.scene, this.camera);
  }

  playShoot() {
    this.shootAudio.currentTime = 0
    this.shootAudio.play()
  }

  playExplosion() {
    this.boomAudio.currentTime = 0
    this.boomAudio.play()
  }

  //显示分数
  showScore() {
    if(this.score>0){
      let myscore = this.score-1;
      let myscoreStr = myscore.toString();
      let myscoreStrList = myscoreStr.split("");
      for (var i = 0; i < myscoreStrList.length; i++) {
        this.scene.remove(this.scoreLists[i][myscoreStrList[i]])
      }
    }
    let scoreStr = this.score.toString();
    let scoreStrList = scoreStr.split("");
    for (var i = 0; i < scoreStrList.length;i++) {
      this.scoreLists[i][scoreStrList[i]].position.x = 0.24 * i - 1.2;
      this.scene.add(this.scoreLists[i][scoreStrList[i]])
    }
    // let geometry = new THREE.CubeGeometry(0.24, 0.01, 0.3);
    // let texture = new THREE.TextureLoader().load('images/' + 1 + '.png');
    // let cube = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: texture, transparent: true }));
    // cube.rotation.x = 0.9;
    // cube.position.x = -1.2;    
    // cube.position.z = 1.6;
    // cube.position.y = 3.8;
    // this.scene.add(cube);
  }

  //宝石模型
  baoShi() {
    console.log("重新生成");
    this.baoShiIndex.x = Math.floor(Math.random() * 6);
    this.baoShiIndex.y = Math.floor(Math.random() * 6); 
    this.baoShiList[this.baoShiIndex.x][this.baoShiIndex.y] = 2;
    this.qiu.position.x = this.baoShiIndex.y - 2.5;
    this.qiu.position.z = this.baoShiIndex.x - 2.5;
    console.log("**********************************");
    console.log(this.baoShiIndex.x);
    console.log(this.baoShiIndex.y); 
    console.log(this.baoShiList)   
    console.log("**********************************");    
    //this.renderer.render(this.scene, this.camera);  
  }

  //结束画面
  jieShu() {
    let that = this;
    wx.request({
      url: 'http://192.168.1.101:3000', //仅为示例，并非真实的接口地址
      data: {
        op_id: 1,
        MAX: that.score
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        let theScore = res.data.result;
        if(theScore == '1') {
          that.isJieShu = 3;
          that.scene.add(that.cubeJieShu);
          that.renderer.render(that.scene, that.camera);
        }
        else {
          that.isJieShu = 1;
          that.scene.add(that.cubeJieShu1);
          that.renderer.render(that.scene, that.camera);
        }
      }
    })
  }

  //草地模型
  caodi() {
    let geometry = new THREE.CubeGeometry(1, 0.2, 1);
    // 加载纹理贴图
    let texture = new THREE.TextureLoader().load("images/caodi.jpg");
    let material = new THREE.MeshBasicMaterial({ map: texture });
    let materialHong = new THREE.MeshBasicMaterial({ color: 0xCC3300 });
    //let cube = new THREE.Mesh(geometry, material);
    let caodiList = [];
    let caodiListHong = [];
    let edgeList = [];
    for (var i = 0; i < 6; i++) {
      caodiList = [];
      caodiListHong = [];
      edgeList = [];
      for(var j=0;j<6;j++){
        let cube = new THREE.Mesh(geometry, material);
        cube.position.x = j - 2.5;
        cube.position.y = -1.1;
        cube.position.z = i - 2.5;
        caodiList.push(cube);
        this.scene.add(cube);
        let edge = new THREE.EdgesHelper(cube, 0x1535f7);//设置边框，可以旋转
        edge.position.x = j - 2.5;
        edge.position.y = -1.1;
        edge.position.z = i - 2.5;
        edgeList.push(edge)
        this.scene.add(edge);
        let cubeHong = new THREE.Mesh(geometry, materialHong);
        cubeHong.position.x = j - 2.5;
        cubeHong.position.y = -1.1;
        cubeHong.position.z = i - 2.5;
        caodiListHong.push(cubeHong);    
      }
      this.caodis.push(caodiList);
      this.caodisHong.push(caodiListHong);
      this.cubeEdges.push(edgeList);
    }
    //this.scene.add(cube);
  }

  //生成带有三个坐标轴的坐标系
  zuobiao() {
    let geometryx = new THREE.Geometry();
    geometryx.vertices.push(new THREE.Vector3(-4, 0, 0));
    geometryx.vertices.push(new THREE.Vector3(4, 0, 0));
    var linex = new THREE.Line(geometryx, new THREE.LineBasicMaterial({ color: 0x000000, opacity: 0.2 }));
    this.scene.add(linex);
    let geometryy = new THREE.Geometry();
    geometryy.vertices.push(new THREE.Vector3(0, -4, 0));
    geometryy.vertices.push(new THREE.Vector3(0, 8, 0));
    var liney = new THREE.Line(geometryy, new THREE.LineBasicMaterial({ color: 0x000000, opacity: 0.2 }));
    this.scene.add(liney);
    let geometryz = new THREE.Geometry();
    geometryz.vertices.push(new THREE.Vector3(0, 0, -4));
    geometryz.vertices.push(new THREE.Vector3(0, 0, 4));
    var linez = new THREE.Line(geometryz, new THREE.LineBasicMaterial({ color: 0x000000, opacity: 0.2 }));
    this.scene.add(linez);
  }

	//变红状态
  toHong() {
    if(this.isJieShu == 0) {
      if(this.hongState == 0) {
        if(this.hongTime < 60) {
          this.hongTime += 1;
        }
        else {
          this.index1 = Math.floor(Math.random() * 10);
          this.index2 = Math.floor(Math.random() * 6);
          if (this.index1 < 5) {
            for (var i = 0; i < 6; i++) {
              this.scene.remove(this.caodis[this.index2][i]);
              this.scene.add(this.caodisHong[this.index2][i]);
            }
          }
          else {
            for (var i = 0; i < 6; i++) {
              this.scene.remove(this.caodis[i][this.index2]);
              this.scene.add(this.caodisHong[i][this.index2]);
            }
          }
          this.hongState = 1;
          this.hongTime = 0;
        }
      }
      else if (this.hongState == 1) {
        if(this.hongTime < 30) {
          this.hongTime += 1;
        }
        else {
          if (this.index1 < 5) {
            for (var i = 0; i < 6; i++) {
              this.scene.remove(this.caodisHong[this.index2][i]);
              this.scene.add(this.caodis[this.index2][i]);
            }
          }
          else {
            for (var i = 0; i < 6; i++) {
              this.scene.remove(this.caodisHong[i][this.index2]);
              this.scene.add(this.caodis[i][this.index2]);
            }
          }
          this.hongState = 2;
          this.hongTime = 0;
        }
      }
      else if(this.hongState == 2) {
        if (this.hongTime < 30) {
          this.hongTime += 1;
        }
        else {
          if (this.index1 < 5) {
            for (var i = 0; i < 6; i++) {
              this.scene.remove(this.caodis[this.index2][i]);
              this.scene.add(this.caodisHong[this.index2][i]);
            }
          }
          else {
            for (var i = 0; i < 6; i++) {
              this.scene.remove(this.caodis[i][this.index2]);
              this.scene.add(this.caodisHong[i][this.index2]);
            }
          }
          this.hongState = 3;
          this.hongTime = 0;
        }
      }
      else if (this.hongState == 3) {
        if (this.hongTime < 30) {
          this.hongTime += 1;
        }
        else {
          if (this.index1 < 5) {
            for (var i = 0; i < 6; i++) {
              this.scene.remove(this.caodisHong[this.index2][i]);
              this.scene.add(this.caodis[this.index2][i]);
            }
          }
          else {
            for (var i = 0; i < 6; i++) {
              this.scene.remove(this.caodisHong[i][this.index2]);
              this.scene.add(this.caodis[i][this.index2]);
            }
          }
          this.hongState = 4;
          this.hongTime = 0;
        }
      }
      else if (this.hongState == 4) {
        if (this.hongTime < 30) {
          this.hongTime += 1;
        }
        else {
          if (this.index1 < 5) {
            for (var i = 0; i < 6; i++) {
              this.scene.remove(this.caodis[this.index2][i]);
              this.caodiList[this.index2][i] = 0;
            }
          }
          else {
            for (var i = 0; i < 6; i++) {
              this.scene.remove(this.caodis[i][this.index2]);
              this.caodiList[i][this.index2] = 0;            
            }
          }
          if(this.cubeState == 0) {
            if (this.caodiList[this.cubeIndex.x1][this.cubeIndex.y1] == 0) {
              console.log("game over");
              this.jieShu();
            }
          }
          else {
            if (this.caodiList[this.cubeIndex.x1][this.cubeIndex.y1] == 0 || this.caodiList[this.cubeIndex.x2][this.cubeIndex.y2] == 0) {
              console.log("game over");
              this.jieShu();
            }
          }
          this.hongState = 5;
          this.hongTime = 0;
        }
      }
      else if (this.hongState == 5) {
        if (this.hongTime < 120) {
          this.hongTime += 1;
        }
        else {
          if (this.index1 < 5) {
            for (var i = 0; i < 6; i++) {
              this.scene.add(this.caodis[this.index2][i]);
              this.caodiList[this.index2][i] = 1;
            }
          }
          else {
            for (var i = 0; i < 6; i++) {
              this.scene.add(this.caodis[i][this.index2]);
              this.caodiList[i][this.index2] = 1;                        
            }
          }
          this.hongState = 0;
          this.hongTime = 0;
        }
      }
    }
    this.renderer.render(this.scene, this.camera);
    this.donghuaId = window.requestAnimationFrame(this.toHong.bind(this), canvas);
  }
  
  //立方体竖立状态向右翻滚的动画
	shuRight() {
    if (this.cubeShu.rotation.z > -Math.PI / 2) {
			this.cubeShu.rotation.z -= 0.08;
      this.cubeShu.position.x = this.cubeCoor.x - 1 / 2 * Math.cos(this.cubeShu.rotation.z) - 1 * Math.sin(this.cubeShu.rotation.z) + 1 / 2;
      this.cubeShu.position.y = this.cubeCoor.y - 1 / 2 * Math.sin(this.cubeShu.rotation.z) + 1 * Math.cos(this.cubeShu.rotation.z) - 1;
			this.renderer.render(this.scene, this.camera);
      this.animationx = window.requestAnimationFrame(this.shuRight.bind(this), canvas);
		}
		else {
			//取消向右倒下的动画
			//window.cancelAnimationFrame(this.animationx);
      this.playShoot();
      this.cubeShu.rotation.z = 0;
      this.cubeShu.position.x = 0;
      this.cubeShu.position.y = 0;
      this.scene.remove(this.cubeShu);
      this.cubeHeng1.position.x = this.cubeCoor.x + 1.5;
      this.cubeHeng1.position.y = this.cubeCoor.y - 0.5;
      this.cubeHeng1.position.z = this.cubeCoor.z;
      this.cubeCoor.x = this.cubeHeng1.position.x;
      this.cubeCoor.y = this.cubeHeng1.position.y;
      this.cubeCoor.z = this.cubeHeng1.position.z;      
      this.cubeState = 1;

      this.cubeIndex.x2 = this.cubeIndex.x1;
      this.cubeIndex.y2 = this.cubeIndex.y1+2;
      this.cubeIndex.x1 = this.cubeIndex.x1;
      this.cubeIndex.y1 = this.cubeIndex.y1+1;
      console.log("===============================");
      console.log(this.cubeIndex.x1);
      console.log(this.cubeIndex.y1);
      console.log(this.cubeIndex.x2);
      console.log(this.cubeIndex.y2);
      console.log("===============================");
      if (this.cubeIndex.x1 < 0 || this.cubeIndex.x1 > 5 || this.cubeIndex.x2 < 0 || this.cubeIndex.x2 > 5 || this.cubeIndex.y1 < 0 || this.cubeIndex.y1 > 5 || this.cubeIndex.y2 < 0 || this.cubeIndex.y2 > 5) {
        console.log("game over");
        this.jieShu();
      }
      else if (this.caodiList[this.cubeIndex.x1][this.cubeIndex.y1] == 0 || this.caodiList[this.cubeIndex.x2][this.cubeIndex.y2] == 0) {
        console.log("game over");
        this.jieShu();
      }
      else if (this.baoShiList[this.cubeIndex.x1][this.cubeIndex.y1] == 2 || this.baoShiList[this.cubeIndex.x2][this.cubeIndex.y2] == 2) {
        this.score += 1;
        this.playExplosion();
        this.baoShiList[this.cubeIndex.x1][this.cubeIndex.y1] = 1;
        this.baoShiList[this.cubeIndex.x2][this.cubeIndex.y2] = 1;
        this.baoShi();
        this.showScore();
        console.log(this.score);
      }

      this.scene.add(this.cubeHeng1);
      this.renderer.render(this.scene, this.camera);
		}
		//console.log(123);
	}

	//立方体竖立状态向左翻滚的动画
  shuLeft() {
    if (this.cubeShu.rotation.z < Math.PI / 2) {
      this.cubeShu.rotation.z += 0.08;
      this.cubeShu.position.x = this.cubeCoor.x + 1 / 2 * Math.cos(this.cubeShu.rotation.z) - 1 * Math.sin(this.cubeShu.rotation.z) - 1 / 2;
      this.cubeShu.position.y = this.cubeCoor.y + 1 / 2 * Math.sin(this.cubeShu.rotation.z) + 1 * Math.cos(this.cubeShu.rotation.z) - 1;
      this.renderer.render(this.scene, this.camera);
      this.animationx = window.requestAnimationFrame(this.shuLeft.bind(this), canvas);
    }
    else {
      //取消向右倒下的动画
      //window.cancelAnimationFrame(this.animationx);
      this.playShoot();
      this.cubeShu.rotation.z = 0;
      this.cubeShu.position.x = 0;
      this.cubeShu.position.y = 0;
      this.scene.remove(this.cubeShu);
      this.cubeHeng1.position.x = this.cubeCoor.x - 1.5;
      this.cubeHeng1.position.y = this.cubeCoor.y - 0.5;
      this.cubeHeng1.position.z = this.cubeCoor.z;      
      this.cubeCoor.x = this.cubeHeng1.position.x;
      this.cubeCoor.y = this.cubeHeng1.position.y;
      this.cubeCoor.z = this.cubeHeng1.position.z;  
      this.cubeState = 1;

      this.cubeIndex.x2 = this.cubeIndex.x1;
      this.cubeIndex.y2 = this.cubeIndex.y1 - 1;
      this.cubeIndex.x1 = this.cubeIndex.x1;
      this.cubeIndex.y1 = this.cubeIndex.y1 - 2;
      console.log("===============================");
      console.log(this.cubeIndex.x1);
      console.log(this.cubeIndex.y1);
      console.log(this.cubeIndex.x2);
      console.log(this.cubeIndex.y2);
      console.log("===============================");
      if (this.cubeIndex.x1 < 0 || this.cubeIndex.x1 > 5 || this.cubeIndex.x2 < 0 || this.cubeIndex.x2 > 5 || this.cubeIndex.y1 < 0 || this.cubeIndex.y1 > 5 || this.cubeIndex.y2 < 0 || this.cubeIndex.y2 > 5) {
        console.log("game over");
        this.jieShu();
      }
      else if (this.caodiList[this.cubeIndex.x1][this.cubeIndex.y1] == 0 || this.caodiList[this.cubeIndex.x2][this.cubeIndex.y2] == 0) {
        console.log("game over");
        this.jieShu();
      }
      else if (this.baoShiList[this.cubeIndex.x1][this.cubeIndex.y1] == 2 || this.baoShiList[this.cubeIndex.x2][this.cubeIndex.y2] == 2) {
        this.score += 1;
        this.playExplosion();
        this.baoShiList[this.cubeIndex.x1][this.cubeIndex.y1] = 1;
        this.baoShiList[this.cubeIndex.x2][this.cubeIndex.y2] = 1;
        this.baoShi();
        console.log(this.score);
        this.showScore();
      }

      this.scene.add(this.cubeHeng1);
      this.renderer.render(this.scene, this.camera);
    }
    ////console.log(1);
  }

	//立方体竖立状态向前翻滚的动画
  shuFront() {
    if (this.cubeShu.rotation.x < Math.PI / 2) {
      this.cubeShu.rotation.x += 0.08;
      this.cubeShu.position.z = this.cubeCoor.z - 1 / 2 * Math.cos(-this.cubeShu.rotation.x) - 1 * Math.sin(-this.cubeShu.rotation.x) + 1 / 2;
      this.cubeShu.position.y = this.cubeCoor.y - 1 / 2 * Math.sin(-this.cubeShu.rotation.x) + 1 * Math.cos(-this.cubeShu.rotation.x) - 1;
      this.renderer.render(this.scene, this.camera);
      this.animationx = window.requestAnimationFrame(this.shuFront.bind(this), canvas);
    }
    else {
      //取消向右倒下的动画
      //window.cancelAnimationFrame(this.animationx);
      this.playShoot();
      this.cubeShu.rotation.x = 0;
      this.cubeShu.position.z = 0;
      this.cubeShu.position.y = 0;
      this.scene.remove(this.cubeShu);
      this.cubeHeng2.position.z = this.cubeCoor.z + 1.5;
      this.cubeHeng2.position.y = this.cubeCoor.y - 0.5;
      this.cubeHeng2.position.x = this.cubeCoor.x;  
      this.cubeCoor.x = this.cubeHeng2.position.x;
      this.cubeCoor.y = this.cubeHeng2.position.y;
      this.cubeCoor.z = this.cubeHeng2.position.z;  
      this.cubeState = 2;

      this.cubeIndex.x2 = this.cubeIndex.x1 + 2;
      this.cubeIndex.y2 = this.cubeIndex.y1;
      this.cubeIndex.x1 = this.cubeIndex.x1 + 1;
      this.cubeIndex.y1 = this.cubeIndex.y1;
      console.log("===============================");
      console.log(this.cubeIndex.x1);
      console.log(this.cubeIndex.y1);
      console.log(this.cubeIndex.x2);
      console.log(this.cubeIndex.y2);
      console.log("===============================");
      if (this.cubeIndex.x1 < 0 || this.cubeIndex.x1 > 5 || this.cubeIndex.x2 < 0 || this.cubeIndex.x2 > 5 || this.cubeIndex.y1 < 0 || this.cubeIndex.y1 > 5 || this.cubeIndex.y2 < 0 || this.cubeIndex.y2 > 5) {
        console.log("game over");
        this.jieShu();
      }
      else if (this.caodiList[this.cubeIndex.x1][this.cubeIndex.y1] == 0 || this.caodiList[this.cubeIndex.x2][this.cubeIndex.y2] == 0) {
        console.log("game over");
        this.jieShu();
      }
      else if (this.baoShiList[this.cubeIndex.x1][this.cubeIndex.y1] == 2 || this.baoShiList[this.cubeIndex.x2][this.cubeIndex.y2] == 2) {
        this.score += 1;
        this.playExplosion();
        this.baoShiList[this.cubeIndex.x1][this.cubeIndex.y1] = 1;
        this.baoShiList[this.cubeIndex.x2][this.cubeIndex.y2] = 1;
        this.baoShi();
        console.log(this.score);
        this.showScore();
      }

      this.scene.add(this.cubeHeng2);
      this.renderer.render(this.scene, this.camera);
    }
    ////console.log(1);
  }

	//立方体竖立状态向后翻滚的动画
  shuBehind() {
    if (this.cubeShu.rotation.x > -Math.PI / 2) {
      this.cubeShu.rotation.x -= 0.08;
      this.cubeShu.position.z = this.cubeCoor.z + 1 / 2 * Math.cos(-this.cubeShu.rotation.x) - 1 * Math.sin(-this.cubeShu.rotation.x) - 1 / 2;
      this.cubeShu.position.y = this.cubeCoor.y + 1 / 2 * Math.sin(-this.cubeShu.rotation.x) + 1 * Math.cos(-this.cubeShu.rotation.x) - 1;
      this.renderer.render(this.scene, this.camera);
      this.animationx = window.requestAnimationFrame(this.shuBehind.bind(this), canvas);
    }
    else {
      //取消向右倒下的动画
      //window.cancelAnimationFrame(this.animationx);
      this.playShoot();
      this.cubeShu.rotation.x = 0;
      this.cubeShu.position.z = 0;
      this.cubeShu.position.y = 0;
      this.scene.remove(this.cubeShu);
      this.cubeHeng2.position.z = this.cubeCoor.z - 1.5;
      this.cubeHeng2.position.y = this.cubeCoor.y - 0.5;
      this.cubeHeng2.position.x = this.cubeCoor.x;  
      this.cubeCoor.x = this.cubeHeng2.position.x;
      this.cubeCoor.y = this.cubeHeng2.position.y;
      this.cubeCoor.z = this.cubeHeng2.position.z;  
      this.cubeState = 2;

      this.cubeIndex.x2 = this.cubeIndex.x1 - 1;
      this.cubeIndex.y2 = this.cubeIndex.y1;
      this.cubeIndex.x1 = this.cubeIndex.x1 - 2;
      this.cubeIndex.y1 = this.cubeIndex.y1;
      console.log("===============================");
      console.log(this.cubeIndex.x1);
      console.log(this.cubeIndex.y1);
      console.log(this.cubeIndex.x2);
      console.log(this.cubeIndex.y2);
      console.log("===============================");
      if (this.cubeIndex.x1 < 0 || this.cubeIndex.x1 > 5 || this.cubeIndex.x2 < 0 || this.cubeIndex.x2 > 5 || this.cubeIndex.y1 < 0 || this.cubeIndex.y1 > 5 || this.cubeIndex.y2 < 0 || this.cubeIndex.y2 > 5) {
        console.log("game over");
        this.jieShu();
      }
      else if (this.caodiList[this.cubeIndex.x1][this.cubeIndex.y1] == 0 || this.caodiList[this.cubeIndex.x2][this.cubeIndex.y2] == 0) {
        console.log("game over");
        this.jieShu();
      }
      else if (this.baoShiList[this.cubeIndex.x1][this.cubeIndex.y1] == 2 || this.baoShiList[this.cubeIndex.x2][this.cubeIndex.y2] == 2) {
        this.score += 1;
        this.playExplosion();
        this.baoShiList[this.cubeIndex.x1][this.cubeIndex.y1] = 1;
        this.baoShiList[this.cubeIndex.x2][this.cubeIndex.y2] = 1;
        this.baoShi();
        console.log(this.score);
        this.showScore();
      }

      this.scene.add(this.cubeHeng2);
      this.renderer.render(this.scene, this.camera);
    }
    ////console.log(1);
  }

	//立方体左右横置状态向右翻滚的动画
  heng1Right() {
    if (this.cubeHeng1.rotation.z > -Math.PI / 2) {
      this.cubeHeng1.rotation.z -= 0.08;
      this.cubeHeng1.position.x = this.cubeCoor.x - 1 * Math.cos(this.cubeHeng1.rotation.z) - 1 / 2 * Math.sin(this.cubeHeng1.rotation.z) + 1;
      this.cubeHeng1.position.y = this.cubeCoor.y - 1 * Math.sin(this.cubeHeng1.rotation.z) + 1 / 2 * Math.cos(this.cubeHeng1.rotation.z) - 1 / 2;
      this.renderer.render(this.scene, this.camera);
      this.animationx = window.requestAnimationFrame(this.heng1Right.bind(this), canvas);
    }
    else {
      //取消向右倒下的动画
      //window.cancelAnimationFrame(this.animationx);
      this.playShoot();
      this.cubeHeng1.rotation.z = 0;
      this.cubeHeng1.position.x = 0;
      this.cubeHeng1.position.y = 0;
      this.scene.remove(this.cubeHeng1);
      this.cubeShu.position.x = this.cubeCoor.x + 1.5;
      this.cubeShu.position.y = this.cubeCoor.y + 0.5;
      this.cubeShu.position.z = this.cubeCoor.z;  
      this.cubeCoor.x = this.cubeShu.position.x;
      this.cubeCoor.y = this.cubeShu.position.y;
      this.cubeCoor.z = this.cubeShu.position.z;  
      this.cubeState = 0;

      this.cubeIndex.x1 = this.cubeIndex.x1;
      this.cubeIndex.y1 = this.cubeIndex.y1 + 2;
      console.log("===============================");
      console.log(this.cubeIndex.x1);
      console.log(this.cubeIndex.y1);
      console.log(this.cubeIndex.x2);
      console.log(this.cubeIndex.y2);
      console.log("===============================");
      if (this.cubeIndex.x1 < 0 || this.cubeIndex.x1 > 5 || this.cubeIndex.y1 < 0 || this.cubeIndex.y1 > 5) {
        console.log("game over");
        this.jieShu();
      }
      else if (this.caodiList[this.cubeIndex.x1][this.cubeIndex.y1] == 0) {
        console.log("game over");
        this.jieShu();
      }
      else if (this.baoShiList[this.cubeIndex.x1][this.cubeIndex.y1] == 2) {
        this.score += 1;
        this.playExplosion();
        this.baoShiList[this.cubeIndex.x1][this.cubeIndex.y1] = 1;
        this.baoShi();
        console.log(this.score);
        this.showScore();
      }

      this.scene.add(this.cubeShu);
      this.renderer.render(this.scene, this.camera);
    }
    //console.log(1);
  }

	//立方体左右横置状态向左翻滚的动画
  heng1Left() {
    if (this.cubeHeng1.rotation.z < Math.PI / 2) {
      this.cubeHeng1.rotation.z += 0.08;
      this.cubeHeng1.position.x = this.cubeCoor.x + 1 * Math.cos(this.cubeHeng1.rotation.z) - 1 / 2 * Math.sin(this.cubeHeng1.rotation.z) - 1;
      this.cubeHeng1.position.y = this.cubeCoor.y + 1 * Math.sin(this.cubeHeng1.rotation.z) + 1 / 2 * Math.cos(this.cubeHeng1.rotation.z) - 1 / 2;
      this.renderer.render(this.scene, this.camera);
      this.animationx = window.requestAnimationFrame(this.heng1Left.bind(this), canvas);
    }
    else {
      //取消向右倒下的动画
      //window.cancelAnimationFrame(this.animationx);
      this.playShoot();
      this.cubeHeng1.rotation.z = 0;
      this.cubeHeng1.position.x = 0;
      this.cubeHeng1.position.y = 0;
      this.scene.remove(this.cubeHeng1);
      this.cubeShu.position.x = this.cubeCoor.x - 1.5;
      this.cubeShu.position.y = this.cubeCoor.y + 0.5;
      this.cubeShu.position.z = this.cubeCoor.z;  
      this.cubeCoor.x = this.cubeShu.position.x;
      this.cubeCoor.y = this.cubeShu.position.y;
      this.cubeCoor.z = this.cubeShu.position.z;  
      this.cubeState = 0;

      this.cubeIndex.x1 = this.cubeIndex.x1;
      this.cubeIndex.y1 = this.cubeIndex.y1 - 1;
      console.log("===============================");
      console.log(this.cubeIndex.x1);
      console.log(this.cubeIndex.y1);
      console.log(this.cubeIndex.x2);
      console.log(this.cubeIndex.y2);
      console.log("===============================");
      if (this.cubeIndex.x1 < 0 || this.cubeIndex.x1 > 5 || this.cubeIndex.y1 < 0 || this.cubeIndex.y1 > 5) {
        console.log("game over");
        this.jieShu();
      }
      else if (this.caodiList[this.cubeIndex.x1][this.cubeIndex.y1] == 0) {
        console.log("game over");
        this.jieShu();
      }
      else if (this.baoShiList[this.cubeIndex.x1][this.cubeIndex.y1] == 2) {
        this.score += 1;
        this.playExplosion();
        this.baoShiList[this.cubeIndex.x1][this.cubeIndex.y1] = 1;
        this.baoShi();
        console.log(this.score);
        this.showScore();
      }

      this.scene.add(this.cubeShu);
      this.renderer.render(this.scene, this.camera);
    }
    //console.log(1);
  }

	//立方体左右横置状态向前翻滚的动画
  heng1Front() {
    if (this.cubeHeng1.rotation.x < Math.PI / 2) {
      this.cubeHeng1.rotation.x += 0.08;
      this.cubeHeng1.position.z = this.cubeCoor.z - 1 / 2 * Math.cos(-this.cubeHeng1.rotation.x) - 1 / 2 * Math.sin(-this.cubeHeng1.rotation.x) + 1 / 2;
      this.cubeHeng1.position.y = this.cubeCoor.y - 1 / 2 * Math.sin(-this.cubeHeng1.rotation.x) + 1 / 2 * Math.cos(-this.cubeHeng1.rotation.x) - 1 / 2;
      this.renderer.render(this.scene, this.camera);
      this.animationx = window.requestAnimationFrame(this.heng1Front.bind(this), canvas);
    }
    else {
      this.playShoot();
      this.cubeHeng1.rotation.x = 0;
      this.cubeHeng1.position.z = this.cubeCoor.z + 1;
      this.cubeHeng1.position.y = this.cubeCoor.y + 0;
      this.cubeHeng1.position.x = this.cubeCoor.x;  
      this.cubeCoor.x = this.cubeHeng1.position.x;
      this.cubeCoor.y = this.cubeHeng1.position.y;
      this.cubeCoor.z = this.cubeHeng1.position.z;  
      this.cubeState = 1;
      
      this.cubeIndex.x2 = this.cubeIndex.x2 + 1;
      this.cubeIndex.y2 = this.cubeIndex.y2;
      this.cubeIndex.x1 = this.cubeIndex.x1 + 1;
      this.cubeIndex.y1 = this.cubeIndex.y1;
      console.log("===============================");
      console.log(this.cubeIndex.x1);
      console.log(this.cubeIndex.y1);
      console.log(this.cubeIndex.x2);
      console.log(this.cubeIndex.y2);
      console.log("===============================");
      if (this.cubeIndex.x1 < 0 || this.cubeIndex.x1 > 5 || this.cubeIndex.x2 < 0 || this.cubeIndex.x2 > 5 || this.cubeIndex.y1 < 0 || this.cubeIndex.y1 > 5 || this.cubeIndex.y2 < 0 || this.cubeIndex.y2 > 5) {
        console.log("game over");
        this.jieShu();
      }
      else if (this.caodiList[this.cubeIndex.x1][this.cubeIndex.y1] == 0 || this.caodiList[this.cubeIndex.x2][this.cubeIndex.y2] == 0) {
        console.log("game over");
        this.jieShu();
      }
      else if (this.baoShiList[this.cubeIndex.x1][this.cubeIndex.y1] == 2 || this.baoShiList[this.cubeIndex.x2][this.cubeIndex.y2] == 2) {
        this.score += 1;
        this.playExplosion();
        this.baoShiList[this.cubeIndex.x1][this.cubeIndex.y1] = 1;
        this.baoShiList[this.cubeIndex.x2][this.cubeIndex.y2] = 1;
        this.baoShi();
        console.log(this.score);
        this.showScore();
      }

      this.renderer.render(this.scene, this.camera);
      //取消向右倒下的动画
      //window.cancelAnimationFrame(this.animationx);
    }
    //console.log(1);
  }

	//立方体左右横置状态向后翻滚的动画
  heng1Behind() {
    if (this.cubeHeng1.rotation.x > -Math.PI / 2) {
      this.cubeHeng1.rotation.x -= 0.08;
      this.cubeHeng1.position.z = this.cubeCoor.z + 1 / 2 * Math.cos(-this.cubeHeng1.rotation.x) - 1 / 2 * Math.sin(-this.cubeHeng1.rotation.x) - 1 / 2;
      this.cubeHeng1.position.y = this.cubeCoor.y + 1 / 2 * Math.sin(-this.cubeHeng1.rotation.x) + 1 / 2 * Math.cos(-this.cubeHeng1.rotation.x) - 1 / 2;
      this.renderer.render(this.scene, this.camera);
      this.animationx = window.requestAnimationFrame(this.heng1Behind.bind(this), canvas);
    }
    else {
      this.playShoot();
      this.cubeHeng1.rotation.x = 0;
      this.cubeHeng1.position.z = this.cubeCoor.z - 1;
      this.cubeHeng1.position.y = this.cubeCoor.y + 0;
      this.cubeHeng1.position.x = this.cubeCoor.x;  
      this.cubeCoor.x = this.cubeHeng1.position.x;
      this.cubeCoor.y = this.cubeHeng1.position.y;
      this.cubeCoor.z = this.cubeHeng1.position.z; 
      this.cubeState = 1;

      this.cubeIndex.x2 = this.cubeIndex.x2 - 1;
      this.cubeIndex.y2 = this.cubeIndex.y2;
      this.cubeIndex.x1 = this.cubeIndex.x1 - 1;
      this.cubeIndex.y1 = this.cubeIndex.y1;
      console.log("===============================");
      console.log(this.cubeIndex.x1);
      console.log(this.cubeIndex.y1);
      console.log(this.cubeIndex.x2);
      console.log(this.cubeIndex.y2);
      console.log("===============================");
      if (this.cubeIndex.x1 < 0 || this.cubeIndex.x1 > 5 || this.cubeIndex.x2 < 0 || this.cubeIndex.x2 > 5 || this.cubeIndex.y1 < 0 || this.cubeIndex.y1 > 5 || this.cubeIndex.y2 < 0 || this.cubeIndex.y2 > 5) {
        console.log("game over");
        this.jieShu();
      }
      else if (this.caodiList[this.cubeIndex.x1][this.cubeIndex.y1] == 0 || this.caodiList[this.cubeIndex.x2][this.cubeIndex.y2] == 0) {
        console.log("game over");
        this.jieShu();
      }
      else if (this.baoShiList[this.cubeIndex.x1][this.cubeIndex.y1] == 2 || this.baoShiList[this.cubeIndex.x2][this.cubeIndex.y2] == 2) {
        this.score += 1;
        this.playExplosion();
        this.baoShiList[this.cubeIndex.x1][this.cubeIndex.y1] = 1;
        this.baoShiList[this.cubeIndex.x2][this.cubeIndex.y2] = 1;
        this.baoShi();
        console.log(this.score);
        this.showScore();
      }

      this.renderer.render(this.scene, this.camera);
      //取消向右倒下的动画
      //window.cancelAnimationFrame(this.animationx);
    }
    //console.log(1);
  }

	//立方体前后横置状态向右翻滚的动画
  heng2Right() {
    if (this.cubeHeng2.rotation.z > -Math.PI / 2) {
      this.cubeHeng2.rotation.z -= 0.08;
      this.cubeHeng2.position.x = this.cubeCoor.x - 1 / 2 * Math.cos(this.cubeHeng2.rotation.z) - 1 / 2 * Math.sin(this.cubeHeng2.rotation.z) + 1 / 2;
      this.cubeHeng2.position.y = this.cubeCoor.y - 1 / 2 * Math.sin(this.cubeHeng2.rotation.z) + 1 / 2 * Math.cos(this.cubeHeng2.rotation.z) - 1 / 2;
      this.renderer.render(this.scene, this.camera);
      this.animationx = window.requestAnimationFrame(this.heng2Right.bind(this), canvas);
    }
    else {
      this.playShoot();
      this.cubeHeng2.rotation.z = 0;
      this.cubeHeng2.position.x = this.cubeCoor.x + 1;
      this.cubeHeng2.position.y = this.cubeCoor.y + 0;
      this.cubeHeng2.position.z = this.cubeCoor.z;  
      this.cubeCoor.x = this.cubeHeng2.position.x;
      this.cubeCoor.y = this.cubeHeng2.position.y;
      this.cubeCoor.z = this.cubeHeng2.position.z; 
      this.cubeState = 2;

      this.cubeIndex.x2 = this.cubeIndex.x2;
      this.cubeIndex.y2 = this.cubeIndex.y2 + 1;
      this.cubeIndex.x1 = this.cubeIndex.x1;
      this.cubeIndex.y1 = this.cubeIndex.y1 + 1;
      console.log("===============================");
      console.log(this.cubeIndex.x1);
      console.log(this.cubeIndex.y1);
      console.log(this.cubeIndex.x2);
      console.log(this.cubeIndex.y2);
      console.log("===============================");
      if (this.cubeIndex.x1 < 0 || this.cubeIndex.x1 > 5 || this.cubeIndex.x2 < 0 || this.cubeIndex.x2 > 5 || this.cubeIndex.y1 < 0 || this.cubeIndex.y1 > 5 || this.cubeIndex.y2 < 0 || this.cubeIndex.y2 > 5) {
        console.log("game over");
        this.jieShu();
      }
      else if (this.caodiList[this.cubeIndex.x1][this.cubeIndex.y1] == 0 || this.caodiList[this.cubeIndex.x2][this.cubeIndex.y2] == 0) {
        console.log("game over");
        this.jieShu();
      }
      else if (this.baoShiList[this.cubeIndex.x1][this.cubeIndex.y1] == 2 || this.baoShiList[this.cubeIndex.x2][this.cubeIndex.y2] == 2) {
        this.score += 1;
        this.playExplosion();
        this.baoShiList[this.cubeIndex.x1][this.cubeIndex.y1] = 1;
        this.baoShiList[this.cubeIndex.x2][this.cubeIndex.y2] = 1;
        this.baoShi();
        console.log(this.score);
        this.showScore();
      }

      this.renderer.render(this.scene, this.camera);
      //取消向右倒下的动画
      //window.cancelAnimationFrame(this.animationx);
    }
    //console.log(1);
  }

	//立方体前后横置状态向左翻滚的动画
  heng2Left() {
    if (this.cubeHeng2.rotation.z < Math.PI / 2) {
      this.cubeHeng2.rotation.z += 0.08;
      this.cubeHeng2.position.x = this.cubeCoor.x + 1 / 2 * Math.cos(this.cubeHeng2.rotation.z) - 1 / 2 * Math.sin(this.cubeHeng2.rotation.z) - 1 / 2;
      this.cubeHeng2.position.y = this.cubeCoor.y + 1 / 2 * Math.sin(this.cubeHeng2.rotation.z) + 1 / 2 * Math.cos(this.cubeHeng2.rotation.z) - 1 / 2;
      this.renderer.render(this.scene, this.camera);
      this.animationx = window.requestAnimationFrame(this.heng2Left.bind(this), canvas);
    }
    else {
      this.playShoot();
      this.cubeHeng2.rotation.z = 0;
      this.cubeHeng2.position.x = this.cubeCoor.x - 1;
      this.cubeHeng2.position.y = this.cubeCoor.y + 0;
      this.cubeHeng2.position.z = this.cubeCoor.z;  
      this.cubeCoor.x = this.cubeHeng2.position.x;
      this.cubeCoor.y = this.cubeHeng2.position.y;
      this.cubeCoor.z = this.cubeHeng2.position.z; 
      this.cubeState = 2;

      this.cubeIndex.x2 = this.cubeIndex.x2;
      this.cubeIndex.y2 = this.cubeIndex.y2 - 1;
      this.cubeIndex.x1 = this.cubeIndex.x1;
      this.cubeIndex.y1 = this.cubeIndex.y1 - 1;
      console.log("===============================");
      console.log(this.cubeIndex.x1);
      console.log(this.cubeIndex.y1);
      console.log(this.cubeIndex.x2);
      console.log(this.cubeIndex.y2);
      console.log("===============================");
      if (this.cubeIndex.x1 < 0 || this.cubeIndex.x1 > 5 || this.cubeIndex.x2 < 0 || this.cubeIndex.x2 > 5 || this.cubeIndex.y1 < 0 || this.cubeIndex.y1 > 5 || this.cubeIndex.y2 < 0 || this.cubeIndex.y2 > 5) {
        console.log("game over");
        this.jieShu();
      }
      else if (this.caodiList[this.cubeIndex.x1][this.cubeIndex.y1] == 0 || this.caodiList[this.cubeIndex.x2][this.cubeIndex.y2] == 0) {
        console.log("game over");
        this.jieShu();
      }
      else if (this.baoShiList[this.cubeIndex.x1][this.cubeIndex.y1] == 2 || this.baoShiList[this.cubeIndex.x2][this.cubeIndex.y2] == 2) {
        this.score += 1;
        this.playExplosion();
        this.baoShiList[this.cubeIndex.x1][this.cubeIndex.y1] = 1;
        this.baoShiList[this.cubeIndex.x2][this.cubeIndex.y2] = 1;
        this.baoShi();
        console.log(this.score);
        this.showScore();
      }

      this.renderer.render(this.scene, this.camera);
      //取消向右倒下的动画
      //window.cancelAnimationFrame(this.animationx);
    }
    //console.log(1);
  }

	//立方体前后横置状态向前翻滚的动画
  heng2Front() {
    if (this.cubeHeng2.rotation.x < Math.PI / 2) {
      this.cubeHeng2.rotation.x += 0.08;
      this.cubeHeng2.position.z = this.cubeCoor.z - 1 * Math.cos(-this.cubeHeng2.rotation.x) - 1 / 2 * Math.sin(-this.cubeHeng2.rotation.x) + 1;
      this.cubeHeng2.position.y = this.cubeCoor.y - 1 * Math.sin(-this.cubeHeng2.rotation.x) + 1 / 2 * Math.cos(-this.cubeHeng2.rotation.x) - 1 / 2;
      this.renderer.render(this.scene, this.camera);
      this.animationx = window.requestAnimationFrame(this.heng2Front.bind(this), canvas);
    }
    else {
      //取消向右倒下的动画
      //window.cancelAnimationFrame(this.animationx);
      this.playShoot();
      this.cubeHeng2.rotation.x = 0;
      this.cubeHeng2.position.z = 0;
      this.cubeHeng2.position.y = 0;
      this.scene.remove(this.cubeHeng2);
      this.cubeShu.position.z = this.cubeCoor.z + 1.5;
      this.cubeShu.position.y = this.cubeCoor.y + 0.5;
      this.cubeShu.position.x = this.cubeCoor.x;  
      this.cubeCoor.x = this.cubeShu.position.x;
      this.cubeCoor.y = this.cubeShu.position.y;
      this.cubeCoor.z = this.cubeShu.position.z; 
      this.cubeState = 0;

      this.cubeIndex.x1 = this.cubeIndex.x1 + 2;
      this.cubeIndex.y1 = this.cubeIndex.y1;
      console.log("===============================");
      console.log(this.cubeIndex.x1);
      console.log(this.cubeIndex.y1);
      console.log(this.cubeIndex.x2);
      console.log(this.cubeIndex.y2);
      console.log("===============================");
      if (this.cubeIndex.x1 < 0 || this.cubeIndex.x1 > 5 || this.cubeIndex.y1 < 0 || this.cubeIndex.y1 > 5) {
        console.log("game over");
        this.jieShu();
      }
      else if (this.caodiList[this.cubeIndex.x1][this.cubeIndex.y1] == 0) {
        console.log("game over");
        this.jieShu();
      }
      else if (this.baoShiList[this.cubeIndex.x1][this.cubeIndex.y1] == 2) {
        this.score += 1;
        this.playExplosion();
        this.baoShiList[this.cubeIndex.x1][this.cubeIndex.y1] = 1;
        this.baoShi();
        console.log(this.score);
        this.showScore();
      }

      this.scene.add(this.cubeShu);
      this.renderer.render(this.scene, this.camera);
    }
    //console.log(1);
  }

	//立方体前后横置状态向后翻滚的动画
  heng2Behind() {
    if (this.cubeHeng2.rotation.x > -Math.PI / 2) {
      this.cubeHeng2.rotation.x -= 0.08;
      this.cubeHeng2.position.z = this.cubeCoor.z + 1 * Math.cos(-this.cubeHeng2.rotation.x) - 1 / 2 * Math.sin(-this.cubeHeng2.rotation.x) - 1;
      this.cubeHeng2.position.y = this.cubeCoor.y + 1 * Math.sin(-this.cubeHeng2.rotation.x) + 1 / 2 * Math.cos(-this.cubeHeng2.rotation.x) - 1 / 2;
      this.renderer.render(this.scene, this.camera);
      this.animationx = window.requestAnimationFrame(this.heng2Behind.bind(this), canvas);
    }
    else {
      //取消向右倒下的动画
      //window.cancelAnimationFrame(this.animationx);
      this.playShoot();
      this.cubeHeng2.rotation.x = 0;
      this.cubeHeng2.position.z = 0;
      this.cubeHeng2.position.y = 0;
      this.scene.remove(this.cubeHeng2);
      this.cubeShu.position.z = this.cubeCoor.z - 1.5;
      this.cubeShu.position.y = this.cubeCoor.y + 0.5;
      this.cubeShu.position.x = this.cubeCoor.x;  
      this.cubeCoor.x = this.cubeShu.position.x;
      this.cubeCoor.y = this.cubeShu.position.y;
      this.cubeCoor.z = this.cubeShu.position.z; 
      this.cubeState = 0;

      this.cubeIndex.x1 = this.cubeIndex.x1 - 1;
      this.cubeIndex.y1 = this.cubeIndex.y1;
      console.log("===============================");
      console.log(this.cubeIndex.x1);
      console.log(this.cubeIndex.y1);
      console.log(this.cubeIndex.x2);
      console.log(this.cubeIndex.y2);
      console.log("===============================");
      if (this.cubeIndex.x1 < 0 || this.cubeIndex.x1 > 5 || this.cubeIndex.y1 < 0 || this.cubeIndex.y1 > 5) {
        console.log("game over");
        this.jieShu();
      }
      else if (this.caodiList[this.cubeIndex.x1][this.cubeIndex.y1] == 0) {
        console.log("game over");
        this.jieShu();
      }
      else if (this.baoShiList[this.cubeIndex.x1][this.cubeIndex.y1] == 2) {
        this.score += 1;
        this.playExplosion();
        this.baoShiList[this.cubeIndex.x1][this.cubeIndex.y1] = 1;
        this.baoShi();
        console.log(this.score);
        this.showScore();
      }

      this.scene.add(this.cubeShu);
      this.renderer.render(this.scene, this.camera);
    }
    //console.log(1);
  }

	//空动画，仅仅为了立方体材质的渲染
	// loop() {
	// 	//this.cubeHeng1.rotation.z += 0.03;
  //   //this.cubeShu.rotation.x += 0.08;
  //   // console.log(this.cube.rotation.x)
  //   // console.log(this.cube.rotation.y)    
	// 	this.renderer.render(this.scene, this.camera);
	// 	this.animationx = window.requestAnimationFrame(this.loop.bind(this), canvas);
	// 	//window.cancelAnimationFrame(this.animationx);
	// 	console.log(0);
	// }

	//响应事件，
	initEvent() {
		//手指按下屏幕
		canvas.addEventListener('touchstart', ((e) => {
			e.preventDefault()
			// console.log(e.touches[0].clientX)
			// console.log(e.touches[0].clientY)
			this.x = e.touches[0].clientX;
			this.y = e.touches[0].clientY;
		}).bind(this))

		//手指在屏幕移动
		canvas.addEventListener('touchmove', ((e) => {
			e.preventDefault()
			// console.log(e.touches[0].clientX)
			// console.log(e.touches[0].clientY)
			this.x1 = e.touches[0].clientX;
			this.y1 = e.touches[0].clientY;
		}).bind(this))

		//手指离开屏幕
		canvas.addEventListener('touchend', ((e) => {
			e.preventDefault()  
      if (this.isJieShu == 0) {
        if (this.x1 - this.x > 0 && Math.abs(this.x1 - this.x) > Math.abs(this.y1 - this.y)) {
          if(this.cubeState == 0) {
            //window.cancelAnimationFrame(window.requestAnimationFrame(this.shuRight.bind(this), canvas) - 1); 
            window.requestAnimationFrame(this.shuRight.bind(this), canvas);
          }
          else if(this.cubeState == 1) {
            //window.cancelAnimationFrame(window.requestAnimationFrame(this.heng1Right.bind(this), canvas) - 1);
            window.requestAnimationFrame(this.heng1Right.bind(this), canvas);
          }
          else if(this.cubeState == 2) {
            //window.cancelAnimationFrame(window.requestAnimationFrame(this.heng2Right.bind(this), canvas) - 1);
            window.requestAnimationFrame(this.heng2Right.bind(this), canvas);
          }
        }
        else if (this.x1 - this.x < 0 && Math.abs(this.x1 - this.x) > Math.abs(this.y1 - this.y)) {
          if (this.cubeState == 0) {
            //window.cancelAnimationFrame(window.requestAnimationFrame(this.shuLeft.bind(this), canvas) - 1);
            window.requestAnimationFrame(this.shuLeft.bind(this), canvas);
          }
          else if (this.cubeState == 1) {
            //window.cancelAnimationFrame(window.requestAnimationFrame(this.heng1Left.bind(this), canvas) - 1);
            window.requestAnimationFrame(this.heng1Left.bind(this), canvas);
          }
          else if (this.cubeState == 2) {
            //window.cancelAnimationFrame(window.requestAnimationFrame(this.heng2Left.bind(this), canvas) - 1);
            window.requestAnimationFrame(this.heng2Left.bind(this), canvas);
          }
        } 
        else if (this.y1 - this.y > 0 && Math.abs(this.x1 - this.x) < Math.abs(this.y1 - this.y)) {
          if (this.cubeState == 0) {
            //window.cancelAnimationFrame(window.requestAnimationFrame(this.shuFront.bind(this), canvas) - 1);
            window.requestAnimationFrame(this.shuFront.bind(this), canvas);
          }
          else if (this.cubeState == 1) {
            //window.cancelAnimationFrame(window.requestAnimationFrame(this.heng1Front.bind(this), canvas) - 1);
            window.requestAnimationFrame(this.heng1Front.bind(this), canvas);
          }
          else if (this.cubeState == 2) {
            //window.cancelAnimationFrame(window.requestAnimationFrame(this.heng2Front.bind(this), canvas) - 1);
            window.requestAnimationFrame(this.heng2Front.bind(this), canvas);
          }
        } 
        else if (this.y1 - this.y < 0 && Math.abs(this.x1 - this.x) < Math.abs(this.y1 - this.y)) {
          if (this.cubeState == 0) {
            //window.cancelAnimationFrame(window.requestAnimationFrame(this.shuBehind.bind(this), canvas) - 1);
            window.requestAnimationFrame(this.shuBehind.bind(this), canvas)
          }
          else if (this.cubeState == 1) {
            //window.cancelAnimationFrame(window.requestAnimationFrame(this.heng1Behind.bind(this), canvas) - 1);
            window.requestAnimationFrame(this.heng1Behind.bind(this), canvas)
          }
          else if (this.cubeState == 2) {
            //window.cancelAnimationFrame(window.requestAnimationFrame(this.heng2Behind.bind(this), canvas) - 1);
            window.requestAnimationFrame(this.heng2Behind.bind(this), canvas)
          }
        }
      }
      else if (this.isJieShu == 1) {
        console.log(this.x)
        console.log(this.y)     
        if(this.x>100 && this.x<220 && this.y>352 && this.y<396) {
          console.log("重新开始")
          this.restart();
        }
      }
      else if (this.isJieShu == 3) {
        console.log(this.x)
        console.log(this.y)
        if (this.x > 100 && this.x < 227 && this.y > 422 && this.y < 466) {
          console.log("重新开始")
          this.restart();
        }
      }
      else if (this.isJieShu == 2) {
        console.log(this.x)
        console.log(this.y)  
        if (this.x > 100 && this.x < 222 && this.y > 388 && this.y < 436) {
          console.log("开始")
          this.scene.remove(this.cubeBegin);
          this.isJieShu = 0
        }      
      }
		}).bind(this))
	}
}