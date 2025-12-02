let camera, scene, renderer;
let controls;
let objects = [];
let targets = { table: [], sphere: [], helix: [], grid: [], pyramid: [] };
let currentLayout = 'table';

// Initialize the 3D scene
function init(data) {
    // Hide loading message
    document.getElementById('loading').style.display = 'none';

    // Create camera
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 3000;

    // Create scene
    scene = new THREE.Scene();

    // Create elements from data
    createElements(data);

    // Create layouts
    createTableLayout();
    createSphereLayout();
    createHelixLayout();
    createGridLayout();
    createTetrahedronLayout();

    // Create renderer
    renderer = new THREE.CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);

    // Add event listeners - INCREASED DURATION to 5000ms (5 seconds)
    document.getElementById('table').addEventListener('click', () => transform(targets.table, 5000, 'table'));
    document.getElementById('sphere').addEventListener('click', () => transform(targets.sphere, 5000, 'sphere'));
    document.getElementById('helix').addEventListener('click', () => transform(targets.helix, 5000, 'helix'));
    document.getElementById('grid').addEventListener('click', () => transform(targets.grid, 5000, 'grid'));
    document.getElementById('pyramid').addEventListener('click', () => transform(targets.pyramid, 5000, 'pyramid'));

    // Initial layout
    transform(targets.table, 5000, 'table');

    // Add mouse controls
    addMouseControls();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Start animation
    animate();
}

// Create 3D elements from data
function createElements(data) {
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        
        // Create element div
        const element = document.createElement('div');
        element.className = 'element ' + getNetWorthColor(item['Net Worth']);
        
        // Photo
        const photo = document.createElement('div');
        photo.className = 'photo';
        const img = document.createElement('img');
        img.src = item.Photo;
        img.alt = item.Name;
        photo.appendChild(img);
        
        // Name
        const name = document.createElement('div');
        name.className = 'name';
        name.textContent = item.Name;
        
        // Details
        const details = document.createElement('div');
        details.className = 'details';
        details.innerHTML = `
            Age: ${item.Age} | ${item.Country}<br>
            Interest: ${item.Interest}
        `;
        
        // Net Worth
        const networth = document.createElement('div');
        networth.className = 'networth';
        networth.textContent = item['Net Worth'];
        
        // Append all elements
        element.appendChild(photo);
        element.appendChild(name);
        element.appendChild(details);
        element.appendChild(networth);
        
        // Create CSS3D object
        const objectCSS = new THREE.CSS3DObject(element);
        objectCSS.position.x = Math.random() * 4000 - 2000;
        objectCSS.position.y = Math.random() * 4000 - 2000;
        objectCSS.position.z = Math.random() * 4000 - 2000;
        scene.add(objectCSS);
        
        objects.push(objectCSS);
    }
}

// Create table layout (20x11 for 201 items)
function createTableLayout() {
    const total = objects.length;
    const cols = 20;
    const rows = Math.ceil(total / cols);
    
    console.log(`Table layout: ${cols} cols x ${rows} rows for ${total} items`);
    
    for (let i = 0; i < total; i++) {
        const object = new THREE.Object3D();
        
        const col = i % cols;
        const row = Math.floor(i / cols);
        
        object.position.x = col * 140 - (cols * 140) / 2;
        object.position.y = -(row * 180) + (rows * 180) / 2;
        object.position.z = 0;
        
        // Reset rotation for table - all cards face forward
        object.rotation.x = 0;
        object.rotation.y = 0;
        object.rotation.z = 0;
        
        targets.table.push(object);
    }
}

// Create sphere layout
function createSphereLayout() {
    const total = objects.length;
    
    for (let i = 0; i < total; i++) {
        const phi = Math.acos(-1 + (2 * i) / total);
        const theta = Math.sqrt(total * Math.PI) * phi;
        
        const object = new THREE.Object3D();
        
        object.position.setFromSphericalCoords(800, phi, theta);

        // Calculate rotation to face outward from center
        object.lookAt(object.position.clone().multiplyScalar(2));
        
        targets.sphere.push(object);
    }
}

// Create double helix layout
function createHelixLayout() {
    const total = objects.length;
    const helixHeight = total * 10;
    
    for (let i = 0; i < total; i++) {
        const object = new THREE.Object3D();
        
        // Determine which helix (0 or 1)
        const helixIndex = i % 2;
        const positionInHelix = Math.floor(i / 2);
        
        const phi = positionInHelix * 0.35 + (helixIndex * Math.PI);
        const radius = 400 + (helixIndex * 200);
        
        object.position.x = radius * Math.sin(phi);
        object.position.y = -(positionInHelix * 12) + helixHeight / 2;
        object.position.z = radius * Math.cos(phi);
        
        // Calculate rotation to face outward from helix center
        const vector = new THREE.Vector3();
        vector.x = object.position.x * 2;
        vector.y = object.position.y;
        vector.z = object.position.z * 2;
        object.lookAt(vector);
        
        targets.helix.push(object);
    }
}

// Create grid layout (10x4x6 for 201 items) - CORRECTED
function createGridLayout() {
    const total = objects.length;
    const cols = 10;  // x-axis (width)
    const rows = 4;   // y-axis (height)
    const depth = Math.ceil(total / (cols * rows)); // z-axis (depth)

    console.log(`Grid layout: ${cols} x ${rows} x ${depth} = ${cols * rows * depth} positions for ${total} items`);

    for (let i = 0; i < total; i++) {
        const object = new THREE.Object3D();

        // CORRECTED: Calculate grid position properly
        const z = Math.floor(i / (cols * rows));  // Which depth layer
        const remainder = i % (cols * rows);       // Position within that layer
        const y = Math.floor(remainder / cols);    // Which row in the layer
        const x = remainder % cols;                 // Which column in the row

        // Set position in 3D space
        object.position.x = x * 160 - (cols * 160) / 2;
        object.position.y = -(y * 200) + (rows * 200) / 2;  // Negative for top-to-bottom
        object.position.z = z * 200 - (depth * 200) / 2;

        // Reset rotation for grid - all cards face forward
        object.rotation.x = 0;
        object.rotation.y = 0;
        object.rotation.z = 0;

        targets.grid.push(object);
    }
}

// Create tetrahedron (4-face pyramid) layout
function createTetrahedronLayout() {
    const total = objects.length;
    const itemsPerFace = Math.ceil(total / 4);

    // Define 4 face normals (direction each face points)
    const faceNormals = [
        new THREE.Vector3(0, 1, 0).normalize(),                    // Face 0: Top
        new THREE.Vector3(0.816, -0.408, 0.408).normalize(),       // Face 1: Bottom-right
        new THREE.Vector3(-0.408, -0.408, 0.816).normalize(),      // Face 2: Bottom-back-right
        new THREE.Vector3(-0.408, -0.408, -0.816).normalize()      // Face 3: Bottom-back-left
    ];

    // For each face, we need two orthogonal vectors to create a 2D grid
    const faceVectors = [];
    for (let i = 0; i < 4; i++) {
        const normal = faceNormals[i];

        // Find two orthogonal vectors in the plane perpendicular to normal
        const right = new THREE.Vector3();
        const up = new THREE.Vector3();

        if (Math.abs(normal.y) < 0.9) {
            right.crossVectors(new THREE.Vector3(0, 1, 0), normal).normalize();
        } else {
            right.crossVectors(new THREE.Vector3(1, 0, 0), normal).normalize();
        }
        up.crossVectors(normal, right).normalize();

        faceVectors.push({ normal, right, up });
    }

    console.log(`Tetrahedron layout: ${total} items distributed across 4 pyramid faces (${itemsPerFace} per face)`);

    const faceRadius = 700;
    const spacing = 180;
    const gridSize = Math.ceil(Math.sqrt(itemsPerFace * 1.5));

    for (let i = 0; i < total; i++) {
        const object = new THREE.Object3D();

        // Assign to face
        const faceIdx = Math.floor(i / itemsPerFace);
        const posInFace = i % itemsPerFace;

        // Convert linear position to triangular grid
        let gridPos = 0;
        let row = 0;
        let col = 0;

        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c <= r; c++) {
                if (gridPos === posInFace) {
                    row = r;
                    col = c;
                    break;
                }
                gridPos++;
            }
            if (gridPos > posInFace) break;
        }

        // Get face vectors
        const { normal, right, up } = faceVectors[faceIdx];

        // Calculate position in triangular grid
        const x = (col - row / 2) * spacing;
        const y = row * spacing * 0.866; // 0.866 = sqrt(3)/2 for triangular spacing

        // Position on face plane
        const facePos = new THREE.Vector3()
            .addScaledVector(right, x)
            .addScaledVector(up, y);

        // Move to face position (push outward from center)
        object.position.copy(normal.clone().multiplyScalar(faceRadius)).add(facePos);

        // Orient to face outward
        object.lookAt(normal.clone().multiplyScalar(faceRadius * 2));

        targets.pyramid.push(object);
    }
}

// Normalize rotation to prevent flipping
function normalizeRotation(rotation) {
    // Keep rotation values between -PI and PI
    rotation.x = ((rotation.x + Math.PI) % (2 * Math.PI)) - Math.PI;
    rotation.y = ((rotation.y + Math.PI) % (2 * Math.PI)) - Math.PI;
    rotation.z = ((rotation.z + Math.PI) % (2 * Math.PI)) - Math.PI;
}

// Transform to target layout with improved rotation handling
function transform(targets, duration, layoutName) {
    TWEEN.removeAll();
    
    // Update button states
    document.querySelectorAll('.controls button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(layoutName).classList.add('active');
    
    currentLayout = layoutName;
    
    for (let i = 0; i < objects.length; i++) {
        const object = objects[i];
        const target = targets[i];
        
        // Calculate shortest rotation path
        const startRotation = {
            x: object.rotation.x,
            y: object.rotation.y,
            z: object.rotation.z
        };
        
        const endRotation = {
            x: target.rotation.x,
            y: target.rotation.y,
            z: target.rotation.z
        };
        
        // Find shortest rotation path for each axis
        ['x', 'y', 'z'].forEach(axis => {
            let diff = endRotation[axis] - startRotation[axis];
            
            // Normalize to shortest path
            while (diff > Math.PI) diff -= 2 * Math.PI;
            while (diff < -Math.PI) diff += 2 * Math.PI;
            
            endRotation[axis] = startRotation[axis] + diff;
        });
        
        // Animate position - FIXED: consistent duration for all cards
        new TWEEN.Tween(object.position)
            .to({
                x: target.position.x,
                y: target.position.y,
                z: target.position.z
            }, duration)  // All cards take the same time
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
        
        // Animate rotation with normalized values - FIXED: consistent duration
        new TWEEN.Tween(object.rotation)
            .to({
                x: endRotation.x,
                y: endRotation.y,
                z: endRotation.z
            }, duration)  // All cards take the same time
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
    }
    
    new TWEEN.Tween(this)
        .to({}, duration * 1.2)  // Keep rendering a bit longer
        .onUpdate(render)
        .start();
}

// Add mouse controls for rotation
function addMouseControls() {
    let mouseDown = false;
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousedown', (event) => {
        mouseDown = true;
        mouseX = event.clientX;
        mouseY = event.clientY;
    });
    
    document.addEventListener('mouseup', () => {
        mouseDown = false;
    });
    
    document.addEventListener('mousemove', (event) => {
        if (mouseDown) {
            const deltaX = event.clientX - mouseX;
            const deltaY = event.clientY - mouseY;
            
            camera.position.x += deltaX * 2;
            camera.position.y -= deltaY * 2;
            
            mouseX = event.clientX;
            mouseY = event.clientY;
        }
    });
    
    // Mouse wheel for zoom
    document.addEventListener('wheel', (event) => {
        camera.position.z += event.deltaY * 2;
        camera.position.z = Math.max(500, Math.min(5000, camera.position.z));
    });
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

// Render scene
function render() {
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    render();
}

// Include Tween.js library inline (minimal version)
var TWEEN = TWEEN || (function() {
    var tweens = [];
    return {
        getAll: function() { return tweens; },
        removeAll: function() { tweens = []; },
        add: function(tween) { tweens.push(tween); },
        remove: function(tween) {
            var i = tweens.indexOf(tween);
            if (i !== -1) tweens.splice(i, 1);
        },
        update: function(time) {
            if (tweens.length === 0) return false;
            var i = 0;
            time = time !== undefined ? time : performance.now();
            while (i < tweens.length) {
                if (tweens[i].update(time)) {
                    i++;
                } else {
                    tweens.splice(i, 1);
                }
            }
            return true;
        }
    };
})();

TWEEN.Tween = function(object) {
    var _object = object;
    var _valuesStart = {};
    var _valuesEnd = {};
    var _duration = 1000;
    var _easingFunction = TWEEN.Easing.Linear.None;
    var _startTime = null;
    var _onUpdateCallback = null;
    
    this.to = function(properties, duration) {
        _valuesEnd = properties;
        if (duration !== undefined) _duration = duration;
        return this;
    };
    
    this.easing = function(easing) {
        _easingFunction = easing;
        return this;
    };
    
    this.onUpdate = function(callback) {
        _onUpdateCallback = callback;
        return this;
    };
    
    this.start = function(time) {
        TWEEN.add(this);
        _startTime = time !== undefined ? time : performance.now();
        for (var property in _valuesEnd) {
            _valuesStart[property] = _object[property];
        }
        return this;
    };
    
    this.update = function(time) {
        if (time < _startTime) return true;
        
        var elapsed = (time - _startTime) / _duration;
        elapsed = elapsed > 1 ? 1 : elapsed;
        
        var value = _easingFunction(elapsed);
        
        for (var property in _valuesEnd) {
            var start = _valuesStart[property];
            var end = _valuesEnd[property];
            _object[property] = start + (end - start) * value;
        }
        
        if (_onUpdateCallback !== null) {
            _onUpdateCallback.call(_object, value);
        }
        
        if (elapsed === 1) {
            TWEEN.remove(this);
            return false;
        }
        return true;
    };
};

TWEEN.Easing = {
    Linear: {
        None: function(k) { return k; }
    },
    Exponential: {
        InOut: function(k) {
            if (k === 0) return 0;
            if (k === 1) return 1;
            if ((k *= 2) < 1) return 0.5 * Math.pow(1024, k - 1);
            return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
        }
    }
};

// Start the application
window.addEventListener('load', async function() {
    try {
        const data = await fetchSheetData();
        init(data);
    } catch (error) {
        console.error('Failed to initialize:', error);
    }
});