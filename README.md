 # 🎛 Microsound – The Audio Game

## 🎥 Video Demo
👉 https://youtu.be/FxQiP6Kh7Rc

---

## Overview

Microsound is a browser-based interactive audio system where recorded sound is fragmented into short grains and attached to simulated particles.

Users inject sound into the environment, spawn particles, and influence their motion.  
When particles collide, their associated audio grains are triggered, producing evolving generative soundscapes.

The project explores real-time interaction between:

- physics simulation  
- event detection  
- dynamic audio playback  
- user input  

---

## What I Built

- Real-time particle simulation in the browser  
- Object-oriented modelling of moving bodies  
- Collision detection with audio triggering  
- Micro-sample slicing from recorded input  
- Force systems (gravity, projection, attraction)  
- Interactive controls for spawning and directing particles  
- Continuous render + update loop  

The emphasis was deterministic rules producing emergent behaviour.

---

## System Design

Each particle is represented as an object maintaining:

- position  
- velocity  
- acceleration  
- audio buffer reference  

The engine runs a frame loop that:

1. updates forces  
2. advances motion  
3. checks collisions  
4. dispatches playback events  

Audio grains are short buffers (10–100ms) derived from user recordings and replayed when interactions occur.

---

## Technical Challenges

- Keeping audio responsive inside a browser event loop  
- Preventing runaway feedback when many collisions occur  
- Managing object lifecycles as particle counts increase  
- Mapping physical interactions to meaningful sonic output  
- Maintaining performance while running simulation + audio  

---

## Responsibilities & Engineering Work

- Designed particle and physics model  
- Implemented collision system  
- Built grain slicing and assignment pipeline  
- Integrated Web Audio through p5.sound  
- Developed rendering and UI interaction  
- Performed live testing and tuning  
- Adjusted simulation parameters to maintain stable runtime behaviour.

---

## Technologies

- JavaScript  
- p5.js  
- p5.sound / Web Audio  
- HTML / CSS  

---

## Notes

This is a university project and represents earlier work in my development.  
It remains here to show progression toward my current focus on large-scale and production-oriented systems.

---

## Play Online

👉 https://users.sussex.ac.uk/~gsl23/Microsound_-_The_Audio_Game_Final/

Built and tested against browser versions available at the time of development.  
Changes to modern audio or security policies may affect runtime behaviour.
