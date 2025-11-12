# Space Marine Maze Game

A futuristic maze game featuring a space marine navigating through hostile territory to reach extraction zones. Built with HTML5 Canvas and JavaScript.

## Features

- **Progressive Difficulty**: 10 levels with increasingly complex mazes
- **Space Marine Theme**: Futuristic art style with metallic walls and glowing effects
- **Smooth Controls**: Arrow key navigation with responsive movement
- **Goal System**: Reach the red pulsing extraction zone to complete each level
- **Visual Effects**: Scanning lines, glowing elements, and completion effects
- **8-bit Sci-Fi Audio**: Procedurally generated background music and sound effects

## How to Play

1. Use **Arrow Keys** (↑↓←→) or **WASD** to move your space marine
2. Navigate through the maze to reach the **red extraction zone**
3. Avoid hitting the metallic walls
4. Complete all 10 levels to finish the campaign

## Game Controls

- `↑` / `W` - Move Up
- `↓` / `S` - Move Down  
- `←` / `A` - Move Left
- `→` / `D` - Move Right

## Installation & Setup

1. Clone or download this repository
2. Open a terminal in the project directory
3. Start a local web server:
   ```bash
   python -m http.server 8000
   ```
4. Open your browser and go to `http://localhost:8000`
5. Click "Begin Mission" to start playing!

## Project Structure

```
├── index.html          # Main game page
├── styles.css          # Space marine themed styling
├── audio.js           # 8-bit sci-fi audio system
├── game.js            # Core game logic and loop
├── player.js          # Space marine character controller
├── maze.js            # Maze generation and rendering
└── README.md          # This file
```

## Audio Features

- **Dynamic 8-bit Music**: Procedurally generated sci-fi background music
- **Sound Effects**: Move sounds and level completion fanfares
- **Volume Control**: Adjustable volume slider and mute button
- **Web Audio API**: Real-time audio synthesis using oscillators

## Technical Details

- **Engine**: Vanilla JavaScript with HTML5 Canvas
- **Audio**: Web Audio API with procedural 8-bit synthesis
- **Maze Generation**: Recursive backtracking algorithm
- **Rendering**: 2D canvas with gradient effects and animations
- **Responsive**: Adapts to different screen sizes
- **Performance**: Optimized rendering with efficient collision detection

## Game Progression

- **Levels 1-2**: Small 15x15 mazes for learning
- **Levels 3-4**: Medium 19x18 mazes  
- **Levels 5-6**: Large 23x21 mazes
- **Levels 7-8**: Extra large 27x24 mazes
- **Levels 9-10**: Maximum difficulty 31x27 mazes

## Customization

The game can be easily modified:

- **Maze Size**: Edit the `baseSize` and `levelMultiplier` in `game.js`
- **Colors**: Modify the CSS variables and canvas gradients
- **Player Speed**: Adjust `this.speed` in `player.js`
- **Level Count**: Change `this.maxLevel` in `game.js`

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

This project is open source. Feel free to modify and distribute!

---

**For the Emperor!** 🚀⚔️