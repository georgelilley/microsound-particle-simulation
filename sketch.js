/**
 * Legacy academic project (2023).
 *
 * Focus: experimentation with real-time audio + physics interaction in the browser.
 * Structure reflects rapid prototyping rather than production architecture.
 *
 * Left largely in original form to show development progression.
 */

p5.disableFriendlyErrors = true;

//In this section of code(Lines 5-56) global variables are being initialised. Some are initialised with a value e.g. 'let directionx = 0' and some are empty e.g. 'var calx'. Also here I'm initialising global arrays for use later in the code indicated by '[]' e.g. 'let particles = []'    

let particles = []; //This initialises the array 'particles'. Each element in 'particles' contains an instance of the 'Mover' class which contains objects relating to information of that specific particle e.g. current positon, velocity etc,   

let check_Collision_array = []; // Initialises the array 'check_Collision_array'. This is used as a binary switch in the 'CollideSearch' function. It is used in an if statement within the function to ensure that the sound combination is only played once upon collision. It is an array form as it stores values for each element in particles independently.   

let Looper = []; //Initialises the array 'Looper'. Elements in this array are also used as binary switches within the 'CollideSearch' function in combination with IF ELSE Statements to make particles stop looping after a second collision when in looping mode.  

let rampvar = []; // Initialises the array 'rampvar'. This array is used in the 'myCallback' function to store the scaled value of the particle length slider 'ParticleTimeValScal' at the moment of audio recording. Elements in this array then contain the length of audio files for their respective audio files in the 'soundFile' array and I use 'rampvar' to create specific envelopes for these audio files.


var limiter, gainer, limiter2, limiter3; // Initialises these four variables. 'limiter''s are used as limiter and 'gainer' controls a gain object. These were some of the last additions to my code with the purpose of keeping volume levels undercontrol to try to avoid extreme distortion as there may be many audio files playing simultaneously. 

// Lines 17-21 initialise variables used in caculating the 'gravity' force for a particular particle.
let directionx = 0; // 'directionx' variable is assigned a value of either '1' or '-1' depending on the x coordinate of a particle (if it is on the left or right half of the game space) 

let directiony = 1; // 'directiony' variable is the same as for 'directionx' applied to the y-axis
var calx; // 'calx' is assigned the distance of a given particle's x coordinate to the centre
var caly; // 'caly' is the same as 'calx' for y axis.
let coefficient = 0; // The variable 'coefficient' is used to in applying velocity to each particle. The variable is assigned a value related to the proportional difference of the distance of a particle's x and y positions to the game center. It's used to create natural 'orbitting' movement as the value of coefficient changes with a particles position.

let mic; // Initialises the variable 'mic.'
let soundFile = []; //Initialises the 'soundFile' and 'soundFileL' arrays. These arrays store the individual sound particles/grains in individual indexes of the arrays. 
let soundFileL = []; // The 'soundFileL' array is separate as I've used separate arrays for when the particles just going to be played or looped. They contain the same audio files.
let env = []; // Initialises the 'env' array this is used to store individual envelopes for respective sound files in the 'soundFile' and 'soundFileL' arrays.
let recorder = []; // Initialises the 'recorder' and 'recorderL' array's each element in the arrays will contain a individual recorder object relating to an individual audio file being recorded for the same index in the 'soundFile' or 'soundFileL' arrays.  
let recorderL = [];
let state = 0; // Initialises the 'state' variable as '0'. This variable is used in 'mousePressed' function and is used in if statements to define the logic flow of the function. 
let state2 = 0; // Initialises the 'state2' variable as '0'. The variable is used in the 'buttonPressed()' and 'draw' functions. It indicates if the button has been pressed and is used to trigger audio recording.
var d; // Initialises variable 'd' used as a binary switch within the draw function ensuring that a section of code setting an interval for calling the 'Recording' function is only executed once.
let e = 0;
let q=0; // Initialised the variable 'q' as '0'. This variable simply keeps an index of the number of individual audio files that have been recorded (the same value as for 'soundFile' and 'soundFileL' not there value combined).
let releaseb=0; //Initialised the variable 'releaseb' as '0'. This variable is used to determine if the player has clicked on/near a particle and again (a different value is assigned) if they have released the mouse. 

var Mode; // Initialised variable 'Mode'. 
var userClickInput; // Initialised variable 'Mode'. 

var tanercumu;
let localbuttonval = 0;
let localbuttonvalender = 0;
let localbuttonleft = 0;

let slider;
let reverb;
let reverbL;

let isOn2 = 0;
let starterscene = 0; // Initialises variable 'starterscene' as '0'.
let buttoncontrol = 0;
let delayer;
let delayerL;

// {Reference 'Toggle Button' code by turtlefingers00@gmail.com. Available at: https://editor.p5js.org/turtlefingers00@gmail.com/sketches/0SzmcMEB3 (Accessed: 5 May 2023). 
let isOn = true;
let btnX, btnY;
//}

function setup() { // Function executed once when the program starts. 
  
  userStartAudio(); //This asks the user to enable audio and then 'starts the AudioContext on a user gesture' (https://p5js.org/reference/#/p5/userStartAudio (Accessed: 8 May 2023)). 
  createCanvas(windowWidth, windowHeight); // This creates a canvas for the game space 
  mic = new p5.AudioIn(); //Initialise 'mic' variable as 'p5.AudioIn()' object.
  
  mic.start(); // Starts audio input from the microphone.
  amp = new p5.Amplitude(); //Initalises 'amp' as an 'Amplitude' object 
  
  reverb = new p5.Reverb(); // Initialises new 'reverb' object.
  reverbL = new p5.Reverb(); // Initialises new 'reverb' object.
  delayer = new p5.Delay(); // Initialises new 'delay' object.
  delayerL = new p5.Delay(); // Initialises new 'delay' object.
  
  limiter = new p5.Compressor(); // Initialises 'limiter' as a new 'p5 Compressor' object.
  limiter.set(0.003, 30, 20, -8, 0.25); // Sets the parameters of 'limiter' (compressor object). There is no hard limiter object in p5.js so I've applied the maximum ratio to the compressor. I then copied this as the same for 'limiter2' and 'limiter3' which I will combine to create a hard limiter. 
  
  limiter.disconnect(); // I also disconnected all 'limiter' and 'limiter2' from the main audio output as the audio will be routed through them sequentially.

  limiter2 = new p5.Compressor();
  limiter2.set(0.003, 30, 20, -8, 0.25);
  
  limiter2.disconnect();  
  
  limiter3 = new p5.Compressor();
  limiter3.set(0.003, 30, 20, -8, 0.25);
  
  limiter3.connect(); // 'limiter3' is connected to Main Web Audio Output.   
  gainer = new p5.Gain(4); // Initialises 'gainer' as a new p5 'Gain' object with a parameter of '4' this increase the amplitude of the audio that is routed through it by 4x. 
  gainer.connect(limiter); // Connects the 'gainer' variable audio output to the input of 'limiter' variable (p5 Compressor object).
  limiter.connect(limiter2); // Connects the audio output of the 'limiter' variable to the  input of 'limiter2' variable (p5 Compressor object).
  limiter2.connect(limiter3); // Connects the audio output of the 'limiter2' variable to the  input of 'limiter3' variable (p5 Compressor object).
  
    for (let i = 0; i < 100; i++){ // For  
        console.log(rampvar[i])
        soundFile[i] = new p5.SoundFile(); // Initialises new empty soundFile objects for index (0-99) in the 'soundFile' array.
        soundFile[i].disconnect(); // This disconnects all elements in the 'soundFile' array from the main audio output.
        soundFile[i].connect(gainer); // Connects all elements in the 'soundFile' array to the 'gainer' p5 Gain object.

        soundFileL[i] = new p5.SoundFile(); // Initialises new empty soundFile objects for index (0-99) in the 'soundFileL' array. This is the same as for the 'soundFile' array as is the next two lines of code. 
        soundFileL[i].disconnect();
        soundFileL[i].connect(gainer); 
       
        recorder[i] = new p5.SoundRecorder(); // Next four lines of code inspired by p5.SoundRecorder reference page. Available: https://p5js.org/reference/#/p5.SoundRecorder (Accessed: 24 March 2023). Creates new P5 SoundRecorder objects and sets there Inputs as 'mic' (player microphone) for 'soundFile' and 'soundFileL' arrays separately.
        recorderL[i] = new p5.SoundRecorder();   
        recorder[i].setInput(mic);   
        recorderL[i].setInput(mic);  
      
        Looper[i] = 0; // Intialises all elements in 'Looper' array as '0'.

        env[i] = new p5.Envelope(); // Initialises elements in 'env' array as new p5 'Envelope' objects.
        env[i].setADSR(0.003, 0.001, 1, 0.002); // Sets the ADSR values for each element 'env'. The important ones are '0.003' second attack time and '0.002' second release time.   
      
        reverb.process(soundFile[i], 1, 2); // Applies reverb object to all elements in 'soundFile'. '1' second reverb time and 2% decay rate. Adapted from 'p5.Reverb' reference page. Available at: https://p5js.org/reference/#/p5.Reverb (Accessed: 28 March 2023). Below the same is applied to 'soundFileL' using 'reverbL'.  
        reverbL.process(soundFileL[i], 1, 2); 
         
        //'delay.process()'' accepts 4 parameters: source, delayTime (in seconds), feedback, filter frequency' (p5.Delay reference page) (Available at: https://p5js.org/reference/#/p5.Delay) (Accessed: 28 March 2023). 
        delayer.process(soundFile[i], 0.12, 0.4, 2300); //Applies a delay object to all elements in the 'soundFile' array. Adapted from the reference page referenced in the line of code above.
  }

  textSize(16); // Sets current text font size.

  // {Reference TF
  btnX = width-160; // These variables are used for sizing my 'Looper Mode' button. Available at: https://editor.p5js.org/turtlefingers00@gmail.com/sketches/0SzmcMEB3 (Accessed: 5 May 2023). 
  btnY = height-100;
  sWidth = 70;
  //}
  
  slider = createSlider(0, 1, 0); //Creates my Mode slider (only two positions). 
  slider.position(windowWidth-200, 0); //Positions 'slider' top right
    
  slider2 = createSlider(1, 10, 10); //Creates my grain length slider values from 1-10. Default value is 10. 
  slider2.position(55, 0); //Positions 'slider' top left
  
}

function draw() { // 'draw' funciton is continually looped through as the the patch is run.
  if (starterscene == 0){ // The variable 'starterscene' has two possible values '0' and '1' if it's value is '0' the game is in 'Title' screen mode and the capsulated code runs.
    slider.hide(); // ''.hide' objects hides the sliders from the player. 
    slider2.hide();
    background(0); // Sets the background colour to black
    fill(255); // Sets the fill colour to white this is used for text colour.
    
    // The code below relates to the text displayed in title screen. I've used a variety of objects to create text of different size, styling(bold/normal), colour and alignment and position to hopeful create an engaging title screen. 
    textSize(50);
    textAlign(CENTER,CENTER) // 'Sets the current alignment for drawing text' (https://p5js.org/reference/#/p5/textAlign Accessed: 9 May 2023). In this case the centre of the screen.
    textStyle(BOLD);
    fill(102, 178, 255);
    text('WELCOME TO: MICROSOUND - THE AUDIO GAME', width/2, height/8)
    textSize(20);

    
    textAlign(CENTER, CENTER)
    fill(255)
    

    text('"All sonic phenomena can be decomposed into collections of sound particles on a timescale of 1 to 100 ms" (Curtis Roads, 2003, p. 272).',width/2, 5*height/16)
    
    textStyle(NORMAL);
    textAlign(LEFT, CENTER)
    
    textSize(20);
    
    text('INSTRUCTIONS:', 0, 7*height/16)
    fill(255,204,204); //Sets the current colour (using RGB values) used in this case to colour text.
    text('CLICK THE CENTRAL BUTTON TO RECORD AUDIO.', width/16, 8*height/16)
     fill(255,153,153);
    text('THIS AUDIO IS SPLIT UP INTO FRAGMENTS/PARTICLES CLICK TO SPAWN THEM IN.', width/8, 9*height/16);
     fill(255,102,102);
    text('A PARTICLE’S SOUND IS TRIGGERED ON COLLISION WITH OTHER PARTICLES.', 3*width/16, 10*height/16)
    fill(255,75,75);
    text('CONTROL THE LENGTH THAT AUDIO PARTICLES WILL BE UPON RECORDING WITH THE SLIDER (TOP LEFT).', width/4, 11*height/16) 
    fill(255,50,50);
    text('PRESS THE LOOP BUTTON TO MAKE SONIC PARTICLES LOOP UPON COLLISION.', 5*width/16, 12*height/16)
    fill(255,25,25);
    text('ENABLE "FIRE MODE" THEN CLICK AND DRAG TO PROJECT PARTICLES THROUGH SPACE!', 6*width/16, 13*height/16)   
    fill(255,0,0);
    text('CLICK TO START', width/2, height-80)
      if (mouseIsPressed){ // If the mouse is pressed 'starterscene' is assigned a value of '1'. Therefore 'starterscene == 0' is false and else statement runs.
        starterscene = 1;
      }  
  }
  else{ // This is the main game mode section. 

  if (buttoncontrol == 0){ // This conditional IF statement creates the 'click me' button in the centre of the game space. 'buttoncontrol' is set to '1' when 'buttonPressed' function is initially called therefore as 'buttoncontrol == 0' is false it removes the button. This is important as the 'Recording' button is generated in this instance.             
  button = createButton('click me');
  button.position(width/2-32, height/2-11);
  button.mousePressed(buttonPressed); // This links the 'button' to the 'buttonPressed()' function. If the user presses the button then the 'buttonPresed()' function is called.     
  }
      
  slider.show(); // '.show()' object is used to displays the sliders. This is important to make them visable as they were previously hidden.
  slider2.show();
    
  textAlign(CENTER,CENTER);
  Mode = slider.value(); // Assigns the value of 'slider' (top right, firing mode/generate mode) to 'Mode'. This is either '0' generate mode or '1' firing mode.
  ParticleTimeVal = slider2.value();  // Assigns the value of 'slider2' (top left, sound grain/particle length) to 'ParticleTimeVal'. This is a value between 1-10.
  ParticleTimeValScal = ParticleTimeVal/100 // The variable 'ParticleTimeVal' is mapped as required as a value between 0.01 - 0.1 this value is assigned to 'ParticleTimeValScal'.
  
  background(0); // Sets the background of the gamespace to the colour black.
  fill(255, 255, 255); // Sets the fill colour to white
  textSize(16); // Sets the size of text
  // Code below generates text for the UI of my system indicating to the player what certain sliders do for instance. 
  text('Generate Mode', width-200, 30)
  text('Fire Mode', width-70, 30)
  text('0.01s', 52, 30)  
  text('0.1s', 195, 30)
  textStyle(BOLD);  
  text('Particle/Sound Grain Length on Record: '+ParticleTimeValScal+' seconds', 210, 50) // draws text to the game space. The variable 'ParticleTimeValScal' is included within the text to show the user what the values on the slider represent and how long idividual sound particles will be if record mode is engaged. 
  textStyle(NORMAL);   
    
  fill(255,255,0);
  circle(windowWidth/2, windowHeight/2, 80)   
  
  for (let i = 0; i < particles.length; i++) { // for loop cycles through index. Each index of the for loop represents an element of the 'particles' array and therefore a physical particle.
    
    // This section of the code is used to create an individual force of gravity for each particle
    if (particles[i].position.x < windowWidth/2){ //if a particle is on the left side of the game space then 'directionx' =1
      directionx = 1;
    }
    else{ //if a particle is on the right side of the game space then 'directionx' = -1
      directionx = -1; 
    }
     if (particles[i].position.y < windowHeight/2){ // if a particle is in the top half of the game space 'directiony = 1;'
      directiony = 1;
    }
    else{ // if a particle is in the bottom half of the game space 'directiony = -1;'
      directiony = -1;
    }   
    //The combination of 'directionx' and 'directiony' give me the general direction of gravity for a given particle
    
    let gravity = createVector(directionx/5, directiony/5); // 'gravity' is assigned a vector using 'directionx' and 'directiony' as parameters. 
    
    particles[i].applyForce(gravity); // 'gravity' vector is used as a parameter in calling the'Movers.prototype.applyForce' function for a 'Mover' class in the 'particles' array. This function essentially add the 'gravity' vector to that given particles acceleration. This lightly accelerates it towards the centre of the game space (If this was very large acceleration no orbit would occur all particles would simply fly straight to the centre). This use of '.applyForce' and 'gravity' was adapted from the 'Forces' p5.js example. Available at: https://p5js.org/examples/simulate-forces.html (Accessed: 27 February 2023).  
 
//This next section of the code relates to the 'Firing Mode' which allows the functionality for particles to be projected through the game space.
    // Values are assigned to 'firingx' and 'firingy' using the x,y positions of a particle and the x,y positions of the mouse. The values of these two variables constitutes a direction vector mirroring the position of the mouse compared to a particle. I've done this because I wanted the user to project particles through the space by clicking on them and then pulling back the mouse.
    let firingx = (particles[i].position.x - mouseX)/10;  
    let firingy = (particles[i].position.y - mouseY)/10;
    
    // To create a magnitude element to this I applied pythagoras' theorum for a right angled triangle, a (the longest side) squared = b squared + c squared.   
    let firingcosquared = (firingx*firingx)+(firingy*firingy) // 'firingcosquared' is assigned the value of 'a squared'.
    let firingco = Math.sqrt(firingcosquared); // 'firingco' is assigned the square root of 'firingcosquared' and is 'a' in our equation. This is the magnitude value. 
    
    if (firingco > 30){ // This if statement is a limiter on 'firingco' so the maximum it can be is '30'. This important to limit how far the particles might travel.  
        firingco = 30;
    }
    firingcoscaled= firingco/10; // 'firingcoscaled is assigned the value of 'firingco' divided by 10. This gives it a useable scaled value between 0 and 3.
        
    let firing = createVector(firingcoscaled*firingx, firingcoscaled*firingy); // Initialised variable 'firing' which is a vector combining the magnitude 'firingcoscaled' and direction 'firingx'/'firingy' variables.  
       
      if (userClickInput === i){ //See 'mousePressed()' function. However essentially 'userClickInput === i' when the top right slider is in 'Firing Mode' and therefore 'Mode' variable = 1 and the user has pressed the mouse on or near a particle. 

         if (releaseb == 1){ // This statement is true when the mouse has been pressed and held down on/near a particle.  
           particles[i].applyForce2(gravity); // calls 'Mover.prototype.applyForce2' function for specific (for loop) index defined particle with 'gravity' as the parameter. Essentially the 'Mover.prototype.applyForce2' function combines elements from the 'Mover.prototype.applyForce' and the 'Mover.prototype.update' function to apply the opposite to the force of 'gravity' and the impact of this on velocity and acceleration etc. to a particle. This makes the particle stationary.
          
           stroke(255); //Sets the colour used to draw lines as white.
           line(mouseX,mouseY, particles[i].position.x,particles[i].position.y) // This draws a line from the mouse to the particle. As this is within the previous IF statements, this line will be drawn then the mouse is pressed down on a particle. 
           
           let posxclear = (particles[i].position.x - mouseX)+particles[i].position.x  
           let posyclear = (particles[i].position.y - mouseY)+particles[i].position.y
           
           line(posxclear, posyclear, particles[i].position.x,particles[i].position.y) // This mirrors the line from the mouse to the particle and has the arrowhead on it.  
           
           // For the arrowhead head shape to rotate with the lines as required trigonometry was necessary.
           let ytaner = (posyclear-particles[i].position.y) // 'ytaner' is assigned the distance on the y axis from 'posyclear' to the particle
           let xtaner = (posxclear-particles[i].position.x) // 'xtaner' is assigned the distance on the x axis from 'posxclear' to the particle
           
           // 'ytaner' and 'xtaner' are important as they are two lengths which I use as if they were from a triangle to calculate part of the angle of rotation. 
           // However using trigonmetric equations by there nature only allows solutions for up to 90° and there are four different quartiles.
          // The next series of IF AND statements are used to determine which quartile the arrowhead is in. Depending on the quartile 0,90,180 or 270° are assigned to 'tanercumu'. 
           if (ytaner < 0 && xtaner >= 0){
             tanercumu = 0;
           }
           if (ytaner >= 0 && xtaner >= 0){
             tanercumu = 90;
           }
           if (ytaner >= 0 && xtaner < 0){
             tanercumu = 180;
           }           
           if (ytaner < 0 && xtaner < 0){
             tanercumu = 270;
           }          
           
           // These next to IF statements ensure 'ytaner' and 'xtaner' are positive.
           if (ytaner < 0){ 
             ytaner = ytaner*-1;
           }
           if (xtaner < 0){
             xtaner = xtaner*-1;
           }

           push(); // Here I've used a 'push()' 'pop()' pairing because I want rotation between these objects to be isolated. 'The push() function saves the current drawing style settings and transformations, while pop() restores these settings.' (p5.js 'pop Reference'. Available at: https://p5js.org/reference/#/p5/pop (Accessed: 8 May 2023)).
           
           
       translate(posxclear,posyclear); // Used 'translate' object to translate to the required center of rotation. This source helped by understanding of this: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rotate (Accessed: 20 April 2023).  
           
          let rotar = Math.atan(ytaner/xtaner); // 'rotar' variable is assigned a value of Inverse tan('ytaner'/'xtaner'). This is a mathamatical equation using 'ytaner' and 'xtaner' as the hypothetical lengths of a right angled triangle and equates one of the remaining angles in this hypothetical triangle.'rotar' is therefore assigned an angle. 
           
           // Depending on what quadrant the angle of rotation is situated in due to the fact that 'rotar' is calculated from different axis the equation for total rotation needs to be different.  
           if (tanercumu == 90 || tanercumu == 270){ //If 'tanercumu' is '90' OR '270'
             rotate(rotar+(tanercumu*PI/180)); //Total angle of rotation is created by adding 'rotar' to ('tanercumu*PI/180') - this is 'tanercumu' in radians
           }
           if (tanercumu == 0 || tanercumu == 180){ // If 'tanercumu' is '0' OR '180'.
             rotate(((tanercumu+90)*PI/180)-rotar); // Total angle of rotation is created by subtracting 'rotar' from ('tanercumu*PI/180') - this is 'tanercumu' in radians.
           }           
          
           translate(-posxclear,-posyclear); // Opposite of previous 'translate' object to translate back to the center.
 
           line(posxclear, posyclear, posxclear-(20*firingcoscaled), posyclear+(20*firingcoscaled)); // These lines create the arrowhead and 'firingcoscaled' has been used within the parameters to scale the arrowhead depending on the power/magnitude of a potential 'shot'.         
           line(posxclear, posyclear, posxclear+(20*firingcoscaled), posyclear+(20*firingcoscaled));
           pop(); //End of the 'push()' 'pop()' pairing.
                   
         } 
        
        if (releaseb == 2){ // This condition is true when the mouse is released, it is set to '2' in 'mouseReleased()' function.
          particles[i].applyForce(firing); //calls 'Mover.prototype.applyForce' function using 'firing' as a parameter. Essentially this accelerates a given particle in the direction and magnitude specified by the 'firing' vector. 
          releaseb+=1; // 'releaseb' increased by '1'. 'releaseb == 2' is now false and 'firing' stops being applied to the particle. This means that the 'firing' vector upon the immediate  release of the mouse but after this it stops so the particle will be drawn back into orbit. 
          
        }        
         
    }
    particles[i].update(); // Calls the 'Mover.prototype.update' function for each particle. This function is vital for the physics simulation of my audio game. The function acts to continually update a particles position by adding velocity and updating a particles velocity by adding acceleration amongst other things. This function was taken from the 'Forces' p5.js example. Available at: https://p5js.org/examples/simulate-forces.html (Accessed: 27 February 2023).       
    particles[i].display(); // Calls the 'Mover.prototype.display' function for each particle. This function draws the continually updating particles in the game space. The use of this function was inspired by the 'Forces' p5.js example. Available at: https://p5js.org/examples/simulate-forces.html (Accessed: 27 February 2023).         
    
    calx = particles[i].position.x - windowWidth/2 
    caly = particles[i].position.y - windowHeight/2
    coefficient = calx/caly;
    
    if (Looper[i] == 1){ // Elements in 'Looper' array determine if the particle of same index is looping. IF an element has a value of '1' than the particle is looping. 
       fill(51, 255, 255) // IF particle is looping turquoise circle is overlaid on the particle circle.
       circle(particles[i].position.x, particles[i].position.y, 20, 20) 
    }
}

  for (let i = 0; i < particles.length; i++){ // For Loop in draw function continually calls the 'CollideSearch' function for each particle(index of the loop). This acts to continously check if particles have collided. 
    CollideSearch(i);
  }
  
    if (state2 === 1){ // Variable 'state2' is assigned a value in the 'buttonPressed()' function. This Statement is true when the central button is displaying 'Recording'. 
    if (d == 0) { // Variable 'd' is assigned a value of '0' in the 'buttonPressed()' function when the central button is 'Recording'. This variable is assigned a value of '1' later within the if statement giving the funcionality of running the enclosed code once. 
      
      intervalID = setInterval(Recording, ParticleTimeValScal*1000); // Calls the 'Recording' function at set intervals defined by the user controlled slider (ParticleTimeValScal).//https://developer.mozilla.org/en-US/docs/Web/API/setInterval (Accessed: 16 April 2023).
      } 
      d = 1; // Variable 'd' is assigned value of '1'. Condition of 'd == 0' is now false. Encapsulate code only runs once, when the button is 'Recording'.
    }
  if (state2 === 2){
    if (e == 0) {
      e = 1;
    }
}    

  textSize(20); // Sets current text size.
  text('Particles Remaining from Last Recording: '+localbuttonleft, 200, windowHeight-20); // This is a user interface component and displays the amount of particles that a user has remaining to 'spawn' in (the variable 'localbuttonleft'). 
    
    
  //This next section of code relates to the user control looping functionality in my audio game.
  if(isOn){ // Conditional statement if 'isOn' is true (when 'Looping Mode: OFF'). 
    fill(255, 51, 255); // Then fill colour (of rectangle/button) is magenta.
  }
  else{ // If 'isOn' is false (when 'Looping Mode: ON')   
    fill(51,255,255); // // Then fill colour (of rectangle/button) is turquoise.
  }
  noStroke(); // This object means there will be no outline for shapes impacted. 
  rect(btnX, btnY, sWidth*2, sWidth-5); // Draws in the rectangle shape (used as a button for the looping capabilities), its colour is dependent on which IF ELSE condtion is true. 
  
    if(isOn){ // Conditional statement if 'isOn' is true (when 'Looping Mode: OFF'). 
    fill("white"); // Setting colour to white (this will impact the text draw by the 'text' object below).
    text("Looping: OFF",btnX+sWidth,btnY+((sWidth-5)/2)); // 'Text' objects displays text indicating the button is in 'Looping: OFF' Mode in a white font.
  }
  else{ // // Conditional statement if 'isOn' is false (when 'Looping Mode: ON'). 
    fill("black"); // Setting colour to white (this will impact the text draw by the 'text' object below).
    text("Looping: ON",btnX+sWidth,btnY+((sWidth-5)/2)); //'Text' objects displays text indicating the button is in 'Looping: ON' Mode in a black font.
  }

if(isOn == true){ // Conditional statement if 'isOn' is true (when 'Looping Mode: OFF'). 
  for (let i = 0; i < particles.length; i++) { // For loop iteratively executes code stopping all elements in the 'soundFileL' array from playing audio. 'soundFileL' array is the looping dedicated array. Therefore when the button is pressed and 'Looping Mode: OFF' all the looping audio files stop. 
    soundFileL[i].stop();
  }
  if (isOn2 == 1){ // The variable 'isOn2' is used a binary switch ensuring that the encapsulated code is only run once. 'isOn2' is assigned a value of '1' in 'buttonPressed()' when 'Looping Mode' is switched to 'OFF', as the condition is true encapsulate code runs, in encapsulated code 'isOn2' is assigned '0' therefore condition (isOn2 == 1) is false.
    for (let i = 0; i < particles.length; i++) { // For loop assigns every element in the 'Looper' array to '0'. This is done as a reset prepreation for if 'Looping Mode' is changed back to 'ON'. This is important as if particles collide and the respective 'Looper[i] == 1' then the soundFile will not play.  
    Looper[i] = 0;

  }
isOn2 = 0; // 'isOn2' is assigned a value of '0'. As explained above this is done so the encapsulated code doesn't run continuously. 
    }
  }
 }
} //Closes the draw function

function mouseClicked (){ // 'mouseClicked' function is used to 'spawn' in particles. However it is important that in certain areas of the game space particles are not generate upon a mouse click.
  if(mouseX > 217 || mouseY > 40){ //IF OR statement (particle will not be generate if user clicks in the top left slider area).
     if (mouseX < 1150 || mouseY > 40){ //IF OR statement (particle will not be generate if user clicks in the right left slider area).
     
    if (mouseY > 315 || mouseY < 288 || mouseX > 390 || mouseX < 300){ //IF OR statement (particle will not be generate if user clicks on the central record enable button(s)).
        
        if (mouseX > btnX+2*sWidth || mouseX < btnX || mouseY > btnY+sWidth-5 || (mouseY < btnY)){ // IF OR statement (particle will not be generate if user clicks on the 'Looping' button).
                
                if (localbuttonleft > 0){ // Conditional IF statement checks there are more unique particles to be 'spawned'. The variable 'localbuttonleft' holds this number. 
                if (Mode == 0){ // Conditional IF statement checks the user control slider is in 'Generate Mode', therefore 'Mode == 0' is true.
                // Only after all these conditions relating to mouse click positions and other variable are met are particles 'spawned' in.    
                particles.push(new Mover(3, mouseX , mouseY)); //If conditions are met a new element in the 'particles' array is generated using a new instance of the 'Mover' class. The x and y position of the particle are defined by the mouse position on click. Also the value '3' here assigns the 'mass' of the particle. I have hardcoded the mass value for every particle to '3'. The use of 'mass' doesn't have a large functionality in my game but in the future this may be introduced as a more variable element. This code was adapted/inspired from the 'Forces' p5.js example. Available at: https://p5js.org/examples/simulate-forces.html (Accessed: 27 February 2023). 
                  
                let r = random(-0.7, 0.7); // The variables 'r' and 'r2' are both assigned random number between -0.7 and 0.7. 
                let r2 = random(-0.7, 0.7);  
                this.velocity = createVector(r, r2); // Variables 'r' and 'r2' are used to create an intial velocity for the particle. The vector has an intial velocity which is random within defined limits.  
      
                localbuttonleft+=-1; // As a new particle has been 'spawned' in 'localbuttonleft' or the remaining particles must be incrementally decreased by '1'.
                }
                }                        
             }         
          }
     }
  }
}

// The functions 'Mover', 'Mover.prototype.update', 'Mover.prototype.display' and 'Mover.prototype.applyForce' have been adapted from the the 'Forces' p5.js example with some adaption. Available at: https://p5js.org/examples/simulate-forces.html (Accessed: 27 February 2023).   

function Mover(m, x, y) { // The 'Mover' function defines a class, a unique instance of which is store in elements of the 'particles' array. This function defines the properties of a particle at any instance. 'Mass' is hardcoded to '3' and 'mouseX' and 'mouseY' are passed as parameters for x and y when a new instance of the function is called in the 'mouseClicked()' function  
  this.mass = m;
  this.position = createVector(x, y);
  this.velocity = createVector(1*coefficient, 1*coefficient);
  this.acceleration = createVector(0, 0);
}

Mover.prototype.update = function() { //The function 'Mover.prototype.update' acts to continually update all instances of the 'Mover' class using the properties of a given particle such as velocity to movement and simulate physics. The function adds vectors.
  
  this.velocity.add(this.acceleration); // For each particle, z new velocity vector is calculated by adding the acceleration vector to the current velocity vector.
  this.position.add(this.velocity); // A new position is calculated by adding the velocity vector to the current position vector.
  this.acceleration.mult(0); // Acceleration is reset to 0. 
};

Mover.prototype.display = function(a) { //This function draws each instance of the continually updating 'Mover' class in the game space.
    stroke(0); // Sets the shape border colour to black.
    strokeWeight(2); // Sets the thickness of the outline of the particles.
    fill(255); // Sets the colour of particles as white.
    ellipse(this.position.x, this.position.y, 20, 20); // Draws the particles, positions defined by Mover class properties e.g. this.position.x.  
};

Mover.prototype.applyForce = function(force) { // This function is used to apply forces (vectors) such as 'gravity' to particles. The equation in physics states Force = Mass * Acceleration. Or Acceleration = Force/Mass.
    let f = p5.Vector.div(force, this.mass); // This vector equation therefore calculates acceleration and assigns it to 'f'. 
    this.acceleration.add(f); // Variable 'f' or the acceleration of a force for a given particle is then added to the current accleration vector for that particle. 
};

Mover.prototype.applyForce2 = function(force) { // Mover.prototype.applyForce2 is a function combining elements from the 'Mover.prototype.applyForce' and 'Mover.prototype.update' functions. 
  let Uf = p5.Vector.div(force, this.mass); // The function calculates the acceleration vector for a given force 'Uf' in the same way that 'Mover.prototype.applyForce' calculates 'f'.
   
     // Then it applies this acceleration and also updates velocity and position in the opposite way.
     this.acceleration.sub(Uf); // A new acceleration vector is calculated by subtracting 'Uf'
     this.velocity.sub(this.acceleration); // A new velocity vector is calculated by subtracting the acceleration vector from the current velocity vector
     this.position.sub(this.velocity) // A new position is calculated by subtracting the velocity vector from the current position vector.
     this.acceleration.mult(0); // Acceleration is reset to 0. 
     
     // This cumulatively acts to create the opposite of how 'Mover.prototype.applyForce' and 'Mover.prototype.update' where changing the particles Mover class characteristics. Therefore when 'Mover.prototype.applyForce2' is called the particle stops moving. 
}


function CollideSearch (a) { // The 'CollideSearch' function is an extremely important part of the Audio Game. It acts to link the physic based visual particles with there relative sound (fragments/grains/particles). In the draw loop a for loop calls 'CollideSearch' using the index of the for loop as the parameter or 'a'.

   for (let i = 0+a; i < particles.length; i++){ // For loop excutes code for each element in the 'particles' array. This is important combined with the for loop calling 'CollideSearch' to check each particle position against all others in the array. The of the expression 'let i = 0+a' reduces redunancy as it won't be evaluating particle pairs if they would have already been checked. For example if 'a = 3' on this calling of the function 'i' will start at '3' because if for instance particles '3' and '1' collided then this will be signaled when a=1 and i=3. This keeps the code efficient and stops duplicated signals.    
     
      if (a == i){ // IF statements checks that 'a' and 'i' are not equal because if they are (as they are the same particle) of course the positions would be the same and signals triggered.      
      }
      else { // The code below assigns the coordinates of 'particles[a]' to two variables. Then these variables are used to create bounds around the 'particles' position. This is important because as for example 'particles[a].position.x' is a number to a large amount of decimal places it would almost be impossible for two 'particles' to have an exactly the same position value.  
        let aexact = particles[a].position.x
        let alowbound = aexact - 10;
        let ahighbound = aexact + 10;
        let aexacty = particles[a].position.y
        let alowboundy = aexacty - 10;
        let ahighboundy = aexacty + 10;
        if (particles[i].position.x > alowbound && particles[i].position.x < ahighbound && particles[i].position.y > alowboundy && particles[i].position.y < ahighboundy){ // IF AND statement using the && operator evaluates if the particles have collided. 
          
          if (check_Collision_array[a*particles.length+(i-a)] == 0){ // Each element in the check_Collision_array is used as a binary switch so that for each collision only one pair of sounds is played (thus avoiding repeated triggering of sounds). Each possible 'a' and 'i' combination has a unique index in the 'check_Collision_array' indicated by 'a*particles.length+(i-a)' this is important to ensure that different instances of the loop don't unwantedly re-assign values in the array. 
              check_Collision_array[a*particles.length+(i-a)] = 1; // Sets the unique element in check_Collision_array to '1' therefore condition for if statement above is false (encapsulated code runs once on each collision). 
                if (isOn == true){ // If button shows 'Looping Mode = OFF' this condition is true.             
                  
                    soundFile[a].play(); //Sound file relating to 'particles[a]' is triggered.
                    soundFile[i].play(); //Sound file relating to 'particles[i]' is triggered.
                  
                     //Each element in the 'soundFile' array has a unique respective envelope in an element in the 'env' array                    
                    env[a].ramp(soundFile[a], 0.005, 1); // Applies envelope env[a] to 'soundFile[a]' (Creating the attack/ramping up).   
                    env[a].ramp(soundFile[a], rampvar[a]-0.022, 0); // Expoentially decreases the volume after set time 'rampvar[a]' in which is stored the length of the audio file (this is the release of the envelope). 
                    reverb.drywet(0.02); // Applies reverb to audio files triggered.      
                    // Same as above for applying envelopes to 'soundFile[i]'.
                    env[i].ramp(soundFile[i], 0.005, 1);  
                    env[i].ramp(soundFile[i], rampvar[i]-0.022, 0);                   
                    
                    reverb.drywet(0.02);                  
                  
                }
                if (isOn == false){ // If button shows 'Looping Mode = ON' this condition is true. 

                  if (Looper[a] == 0){ // 'Looper' array is used to determine if a particle is currently looping. (If Looper[a] = 1 then particles[a] is looping) Therefore this condition is true if a given particle is not looping. This is important because if a particle is looping upon collision it will stop.
                    
                    soundFileL[a].loop(); // Loops element stored in index 'a' of 'soundFileL'.  
                    
                    for (let b = 0; b < 100; b++) { // For loop is used to create envelopes for the looping sound file. Essentially here I have used the index of the for loop to create many increasing and decreasing ramps which envelope the looping sound file on each loop. To envelope the audio file loops at the right time intervals I have used both 'soundFile[a].duration' and 'rampvar[a]'.
                      
                      env[a].ramp(soundFileL[a], b*soundFile[a].duration(), 1);                      
                      env[a].ramp(soundFileL[a], b*soundFile[a].duration()+(rampvar[a]-0.04), 0);                                                
}
                     reverbL.drywet(0.01); // Applies reverb to this looping audio file.                              
                     Looper[a] = 1; // Looper[a] now equals '1' this indicates the particle of that same index is currently looping. 
                    }
                  
                  else{ // This runs upon collision when 'Looper[a] = 1' the particle was already looping.
                    
                    env[a].ramp(soundFileL[a], 0, 0); // 'soundFileL' ramps down to '0' triggered immediately
                    soundFileL[a].stop(); // 'soundFileL' stops playing.
     
                    Looper[a] = 0; // Looper[a] once again assigned a value of '0' as it is no longer looping.
                  }

                  // The following code is exactly the same for 'soundFileL[i]' and shown above for 'soundFileL[a]'. 
                  if (Looper[i] == 0){
                     soundFileL[i].loop(); 
                    
                    for (let b = 0; b < 100; b++) {
                      
                    env[i].ramp(soundFileL[i], b*soundFile[i].duration(), 1);                   
                    env[i].ramp(soundFileL[i], b*soundFile[i].duration()+(rampvar[i]-0.04), 0);                                                   
}                    
                    reverbL.drywet(0.01);  
                                                
                     Looper[i] = 1;
                  } 
                  else{
                    env[i].ramp(soundFileL[i], 0, 0);   
                    soundFileL[i].stop();
                    Looper[i] = 0;
                  }
                }
          }              
                    stroke(0); 
                    strokeWeight(2);
                    fill('red'); // Colours impacted shapes red. 
                    ellipse(particles[i].position.x, particles[i].position.y, 20, 20); // This draws red circles on the particles upon collision. This is important to indicate to the user that a collision and therefore sound event has occured.
                            
               }
              else{ // Collision is no longer occuring so specific check_Collision_array element is set back to '0'. Element in array is reset so collision is ready to be signalled once again. 
                check_Collision_array[a*particles.length+(i-a)] = 0;
              } 
        }
        }
}

function buttonPressed() { // Function is called when button 'Click me button' or 'Recording' button is pressed.

  if (state === 0) { // 'state' variable is used to control the flow of how the 'buttonPressed' function operates.
    
     if (localbuttonleft != 0){ // This IF statement was a late addition but is vital. Essentially it ensures that by removing 'localbuttonleft' from 'q' any soundFile's recorded but not linked to a generated particle in the game space will be overwritten. This is vital because 'CollideSearch' uses the indexes of the 'soundFile''s arrays to play the correct audio file. Therefore if this is not done the indexes of 'particles' and sound file arrays dont match as there are invisible sound files not 'spawned' in the game space. This means that the wrong audio files may be played upon particle collisions.
       q = q -localbuttonleft;
     }
      
      state2 = 1; // Variable 'state2' is assigned a value of '1' 
      d = 0; // Variable 'd' is assigned a value of '0'. The combination of 'state2 = 1' and 'd=0' trigger 'Recording' function to be called at set intervals in the draw function.
    
      localbuttonval = q; // 'localbuttonval' is assigned the value of 'q'. This identifies at what point in the soundFile array's a new recording has taken place from.   
      button2 = createButton('Recording'); // A new button is created indicating to the user recording is ongoing 
      buttoncontrol += 1; // 'buttoncontrol' is increased by one this causes the original 'button' to no longer be drawn. IF statement requiring 'buttoncontrol == 0' for that button to be draw. 
      button2.position((width/2)-38.5, (height/2)-11); //Specifies the position of the button in the centre of the game space.
      button2.mousePressed(buttonPressed); // Links the pressing of this new button to trigger the 'buttonPressed()' function.

    state++; //Increase 'state' by '1' on a button press. Therefore on next button press 'else if' statement is true and encapsulated code runs. 
  }
  else if (state === 1) { // This is true after the 'Recording' button has been clicked.
     button2.remove(); // 'Recording' button is removed. 
     localbuttonvalender = q; // Variable 'localbuttonvalender' is assigned value of 'q' upon the end of the recording session. 
     localbuttonleft = localbuttonvalender - localbuttonval; // localbuttonleft represents the difference from the 'q' value at the beginning and end of the recording session. This value represents the amount of unique sound particles a user generated in a recording session this value will be different for a given time depending on the 'ParticleTimeValScal' during the recording.   
     state2 = 2; // Variable 'state2' assigned a value of '2'. This indicates to draw function recording has stopped.
     clearInterval(intervalID);// Stops the 'Recording' function continually being called at set interval //https://developer.mozilla.org/en-US/docs/Web/API/clearInterval (Accessed: 16 April 2023).
     state = 0; // Variable 'state' used in 'buttonPressed()' function is reassigned it's inital value '0'. Therefore if 'buttonPressed' is called again the code will execute from the top of the function.
  }
}

function Recording() { // 'Recording' function is called at set intervals recording into elements of the 'soundFile' and 'soundFileL' arrays incrementally increasing the elements being recorded into 'q' as 'q' is increased by '1' on each calling of the function //https://developer.mozilla.org/en-US/docs/Web/API/setInterval(Accessed: 16 April 2023). 
  recorder[q].record(soundFile[q], [ParticleTimeValScal]); // 'ParticleTimeValScal' is used as a parameter to define the length of the recordings.
  recorderL[q].record(soundFileL[q], [ParticleTimeValScal]);
  rampvar[q] = ParticleTimeValScal; // 'ParticleTimeValScal' is assigned to elements in the 'rampvar' array  thus independently storing the 'ParticleTimeValScal' for all elements of the sound file arrays. This is important as the values are used for creating the right sized envelopes for each sound file being played as different sound files will have different lengths.   
  q=q+1; // 'q' is incrementally increased by '1' on each calling of the function.
}

function mousePressed(){ //This function is called when the mouse is pressed
  if (Mode == 1){ // This section of the code only runs if the 'Firing Mode' is selected by the top right slider and therefore 'Mode == 1'.
    
     for (let i = 0; i < particles.length; i++){ // For loop is used to loop through the position of every particle and check if the mouse has been pressed on or near it. 
        let mexact = particles[i].position.x
        let mlowbound = mexact - 30; // It was important to create bounds for this because the particles are fairly small so it is frustrating from a user perspective to try and click on them and miss. 
        let mhighbound = mexact + 30;
        let mexacty = particles[i].position.y
        let mlowboundy = mexacty - 30;
        let mhighboundy = mexacty + 30;
        if (mouseX > mlowbound && mouseX < mhighbound && mouseY > mlowboundy && mouseY < mhighboundy){ //IF AND statement using the && operator. This checks that the x and y coordinate are in the boundaries I've defined surrounding a particle. If this statement is true the particle will stop moving and be projected through the game space upon release of the mouse (depending on the position of the mouse from the particle). 
          
          releaseb = 1; // 'assigns '1' to variable 'releaseb'. 'releaseb' variable is used in the draw loop to apply the 'firing' vector to a given particle only upon the release of the mouse. The force will not be applied until 'releaseb == 2' which it is assigned in the 'mouseReleased()' function. 
          
          userClickInput = i; // 'userClickInput' is used as variable to indicate back to the draw function that a particle has been clicked on.
          // return i;
               }
        }   
  }
  
  if(dist(btnX+sWidth,btnY+((sWidth-5)/2),mouseX,mouseY)<sWidth){ // This conditional statement is within the 'mousePressed()' function. The condition relates to the area(position) of the 'Looping' button. Therefore encapsulated code runs if the mouse is clicked on the 'Looping button' 
    if (isOn == true){ // The button is in 'Looping Mode: OFF' then...
         isOn = false; // 'Looping Mode: ON' 
         isOn2 = 1; // 'isOn2' is used as a binary switch to ensure related code in draw loop only runs once. This is because related code is encapsulated in IF statement condition of 'isOn2 == 1' then at the end of the encapsulated code 'isOn2' is assigned a value of 0.
    }
      else { // If 'Looping Mode: ON' and the mouse clicks on the button then 'isOn = true' the button shows 'Looping Mode: OFF'
         isOn = true
    }
    }
  }

function mouseReleased() { //function is called when mouse is released.
  releaseb = 2; // Variable 'releaseb' is assigned a value of '2'. This variable is used the draw function for determining the application of 'firing' vector to a specific particle.
}
