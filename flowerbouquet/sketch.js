let images = [];       
let placedImages = []; 
let bows = [];

function preload() {
  for(let i=1; i<=6; i++) images.push(loadImage('flower' + i + '.png'));
  bows.push(loadImage('bow.png'));
}

function setup() {
  canvas = createCanvas(600, 420).id('canvas');

  let image = createButton('Add Random Flower').mousePressed(addNewImage);
  image.id("add")
  
  let bow = createButton('Add Bow').mousePressed(addNewBow);
  bow.id('bow')

    let clear = createButton('Clear Canvas')
  clear.mousePressed(clearCanvas);
  clear.id('clear');
  
  let save = createButton('Save Bouquet');
  save.mousePressed(saveArea);
  save.id('save')
  
}

function draw() {
  background('rgb(250,239,241)');

  for (let imgObj of placedImages) {
    // Continuous rotation if the center is held
    if (imgObj.isRotating) {
      imgObj.rotation += 0.03; // Change this number to adjust speed
    }
    
    // Dragging logic
    if (imgObj.isDragging) {
      imgObj.x = mouseX + imgObj.offsetX;
      imgObj.y = mouseY + imgObj.offsetY;
    }

    push();
    translate(imgObj.x + imgObj.w / 2, imgObj.y + imgObj.h / 2);
    rotate(imgObj.rotation);
    imageMode(CENTER);
    image(imgObj.img, 0, 0, imgObj.w, imgObj.h);
    pop();
  }
}

function addNewImage() {
  placedImages.push(createImageData(random(images)));
}

function addNewBow() {
  placedImages.push(createImageData(random(bows)));
}

function createImageData(imgAsset) {
  return {
    img: imgAsset,
    x: random(width - 150),
    y: random(height - 150),
    w: 150,
    h: 150,
    rotation: 0,
    isDragging: false,
    isRotating: false, // New state
    offsetX: 0,
    offsetY: 0
  };
}

function clearCanvas() {
  placedImages = [];
}

function mousePressed() {
  // Loop backwards to grab the top-most image first
  for (let i = placedImages.length - 1; i >= 0; i--) {
    let img = placedImages[i];
    
    if (mouseX > img.x && mouseX < img.x + img.w &&
        mouseY > img.y && mouseY < img.y + img.h) {
      
      let centerX = img.x + img.w / 2;
      let centerY = img.y + img.h / 2;
      
      // If holding the center, start rotating
      if (dist(mouseX, mouseY, centerX, centerY) < 20) {
        img.isRotating = true;
      } else {
        // Otherwise, start dragging
        img.isDragging = true;
        img.offsetX = img.x - mouseX;
        img.offsetY = img.y - mouseY;
      }
      
      // Move clicked image to front
      let clickedImg = placedImages.splice(i, 1)[0];
      placedImages.push(clickedImg);
      break; 
    }
  }
}

function mouseReleased() {
  for (let img of placedImages) {
    img.isDragging = false;
    img.isRotating = false; // Stop rotating when mouse is let go
  }
}

function saveArea() {
  let x = 0, y = 0, w = 600, h = 350;
  
  // Create an offscreen buffer
  let pg = createGraphics(w, h);
  
  // Copy region from main canvas to buffer
  pg.copy(canvas, x, y, w, h, 0, 0, w, h);
  
  // Save the buffer
  pg.save('bouquet.png');
}

function doubleClicked() {
  // Loop backwards to find the top-most image under the mouse
  for (let i = placedImages.length - 1; i >= 0; i--) {
    let img = placedImages[i];
    
    // Check if the mouse is within the image bounds
    if (mouseX > img.x && mouseX < img.x + img.w &&
        mouseY > img.y && mouseY < img.y + img.h) {
      
      // Remove the image from the array
      placedImages.splice(i, 1);
      
      // Stop after deleting one image
      break; 
    }
  }
}

