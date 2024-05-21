import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';


export default class Ball {
    _segments = 50;

    constructor(x, y, radius, color, scene) {
        this._x = x;
        this._y = y;
        this._radius = radius;
        this._color = color;
        this._scene = scene;


        const circleGeometry = new THREE.CircleGeometry(this._radius, this._segments)
        const material = new THREE.MeshBasicMaterial( { color: color } );

        this._circle = new THREE.Mesh( circleGeometry, material );

    };
    
    updateState(x, y, radius = this._radius, color = this._color) {
        this._x = x;
        this._y = y;
        this._radius = radius;
        this._color = color;
    }
    
    draw() {
        if (this._scene.isScene) {
            this._circle.position.x = this._x + this._radius;
            this._circle.position.y = -(this._y + this._radius);
            this._circle.radius = this._radius;
            this._circle.color = this.color;
            this._scene.add(this._circle);
        }
        // context.beginPath();
        // context.arc(this._x, this._y, this.radius, 0, 2 * Math.PI);
        // // context.arc(100, 75, 5, 0, 2 * Math.PI);
        // // context.fillStyle = this._style;
        // console.log(this);
        // context.fill();
        // context.fillRect(50, 50, 20, 20);
        // context.fill();
    }
}

class Paddle {
    _segments = 50;

    constructor(x, y, width, heght, color, scene) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._heght = heght;
        this._color = color;
        this._scene = scene;


        const boxGeometry = new THREE.BoxGeometry(20, 100, 1)
        const material = new THREE.MeshBasicMaterial( { color: color } );

        this._box = new THREE.Mesh( boxGeometry, material );
        this._scene.add(this._box);


    };
    
    updateState(x, y, width = this._width, heght = this._heght, color = this._color) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._heght = heght;
        this._color = color;
        this._scene = scene;
    }
    
    draw() {
        if (this._scene.isScene) {
            this._box.position.x = this._x;
            this._box.position.set(this._x, -this._y, 1)
            // this._box.position.y = -(this._y);
            // this._box.width = this._width;
            // this._box.heght = this._heght;
            // console.log(this);
            // this._box.scale.set( this._width, 1, this._heght)
            this._box.color = this.color;
            // console.log(this._box);
            this._scene.add(this._box);
        }
        // context.beginPath();
        // context.arc(this._x, this._y, this.radius, 0, 2 * Math.PI);
        // // context.arc(100, 75, 5, 0, 2 * Math.PI);
        // // context.fillStyle = this._style;
        // console.log(this);
        // context.fill();
        // context.fillRect(50, 50, 20, 20);
        // context.fill();
    }
}



class PongGame
{

    w = 700;
    h = 500;
    viewSize = this.h;
    aspectRatio = this.w / this.THREE;

    _viewport = {
        viewSize: this.viewSize,
        aspectRatio: this.aspectRatio,
        left: 0,
        right: this.w,
        top: 0,
        bottom: -this.h,
        near: -100,
        far: 100
    }

    _ballInitialState = {
        x: 0,
        y: 0,
        radius: 10,
        color: 0xff0000
    }

    _paddleInitialState = {
        x: 10,
        y: 250,
        width: 100,
        heght: 110,
        color: 0xff0000
    }
    

    _background = 0x80f2d2
    
    
    
    constructor() {
        this._camera = new THREE.OrthographicCamera ( 
            this._viewport.left, 
            this._viewport.right, 
            this._viewport.top, 
            this._viewport.bottom, 
            this._viewport.near, 
            this._viewport.far 
        );
        this._scene = new THREE.Scene();
        this._scene.background = new THREE.Color(this._background);
        
        // this._camera.position.z = -10

        this._renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        this._renderer.setSize(this.w, this.h);
        console.log(this._renderer);
        document.body.appendChild( this._renderer.domElement );

        this._ball = new Ball(this._ballInitialState.x,
            this._ballInitialState.y,
            this._ballInitialState.radius,
            this._ballInitialState.color,
            this._scene);
        
        this._paddle1 = new Paddle(this._paddleInitialState.x,
            this._paddleInitialState.y,
            this._paddleInitialState.width,
            this._paddleInitialState.heght,
            this._paddleInitialState.color,
            this._scene);

        this._paddle2 = new Paddle(this._viewport.right,
            this._paddleInitialState.y,
            this._paddleInitialState.width,
            this._paddleInitialState.heght,
            this._paddleInitialState.color,
            this._scene);
        // this.animate();
    }

    draw() {
        this._ball.draw();
        this._paddle1.draw();
        this._paddle2.draw();
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this))
        this._renderer.render( this._scene, this._camera );
        // console.log("A");
    }
}
